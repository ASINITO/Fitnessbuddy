"""Workout routes implementing the exact endpoints from the project screenshots and specifications."""
from fastapi import APIRouter, Depends, HTTPException, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from pathlib import Path

from app.database import get_db, SessionLocal
from app.models import User, WorkoutPlan, WorkoutHistory
from app.schemas import WorkoutRequest, UserInput, FeedbackRequest, WorkoutGenerateFull
from app.services.gemini_service import (
    generate_workout_gemini,
    update_workout_plan,
    generate_nutrition_tip_with_flash,
)
from app.services.workout_service import (
    save_user,
    save_plan,
    get_user,
    get_original_plan,
    update_plan,
    mark_workout_completed
)
from app.utils.helpers import check_and_award_achievements

templates_dir = Path(__file__).resolve().parent.parent.parent / "templates"
templates = Jinja2Templates(directory=str(templates_dir))

router = APIRouter(tags=["Workout"])

# ---------------------------------------------------------------------
# 1. API: Generate workout using Gemini Pro (Exact from screenshot)
# ---------------------------------------------------------------------
@router.post("/generate-workout/gemini")
async def generate_gemini_workout(request: WorkoutRequest):
    """Generates workout plan matching screenshot 1."""
    try:
        result = generate_workout_gemini({
            "goal": request.goal,
            "intensity": request.intensity
        })
        return {"model": "gemini-pro", "workout_plan": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------
# 3. API: Save user info & generate plan (Exact from screenshot)
# ---------------------------------------------------------------------
@router.post("/generate-plan")
def generate_plan(user_data: UserInput):
    """Saves user data and generates 7-day plan matching screenshot 3."""
    try:
        save_user(
            user_id=user_data.user_id,
            name=user_data.username,
            age=user_data.age,
            weight=user_data.weight,
            goal=user_data.goal,
            intensity=user_data.intensity
        )
        plan = generate_workout_gemini({
            "goal": user_data.goal,
            "intensity": user_data.intensity
        })
        save_plan(user_data.user_id, plan)
        return {
            "message": "Workout plan generated and saved successfully!",
            "workout_plan": plan
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Something went wrong: {str(e)}")


# ---------------------------------------------------------------------
# 4. API: Update workout plan based on user feedback (Exact from screenshot)
# ---------------------------------------------------------------------
@router.post("/update-plan/{user_id}", response_model=dict)
def update_user_plan(user_id: int, data: FeedbackRequest):
    """Updates workout plan based on feedback matching screenshot 4."""
    original = get_original_plan(user_id)
    if not original:
        return {"error": "Original plan not found for this user."}
    updated = update_workout_plan(original, data.feedback)
    update_plan(user_id, updated, feedback=data.feedback)
    return {"updated_plan": updated}


# ---------------------------------------------------------------------
# Web Form Handler: Submits from Form page & Renders result.html
# ---------------------------------------------------------------------
@router.post("/submit-plan-form", response_class=HTMLResponse)
def submit_plan_form(
    request: Request,
    username: str = Form(...),
    user_id: int = Form(...),
    age: int = Form(...),
    weight: float = Form(...),
    goal: str = Form(...),
    intensity: str = Form(...)
):
    """Processes form submission and renders result.html as shown in screenshots."""
    # 1. Save user
    save_user(
        user_id=user_id,
        name=username,
        age=age,
        weight=weight,
        goal=goal,
        intensity=intensity
    )
    # 2. Generate workout
    plan = generate_workout_gemini({
        "goal": goal,
        "intensity": intensity,
        "age": age,
        "weight": weight
    })
    save_plan(user_id, plan)

    # 3. Generate nutrition tip using Flash
    nutrition_tip = generate_nutrition_tip_with_flash(goal)

    return templates.TemplateResponse("result.html", {
        "request": request,
        "username": username,
        "user_id": user_id,
        "age": age,
        "weight": weight,
        "goal": goal,
        "intensity": intensity,
        "workout_plan": plan,
        "nutrition_tip": nutrition_tip
    })


# ---------------------------------------------------------------------
# Web Form Handler: Submits Feedback from result.html
# ---------------------------------------------------------------------
@router.post("/submit-feedback-form", response_class=HTMLResponse)
def submit_feedback_form(
    request: Request,
    user_id: int = Form(...),
    feedback: str = Form(...)
):
    """Processes user feedback on result.html, updates plan, and re-renders with confirmation."""
    user = get_user(user_id)
    original = get_original_plan(user_id) or "Standard workout plan."
    updated = update_workout_plan(original, feedback)
    update_plan(user_id, updated, feedback=feedback)

    username = user.name if user else "Friend"
    age = user.age if user else 20
    weight = user.weight if user else 70.0
    goal = user.goal if user else "General wellness"
    intensity = user.intensity if user else "Medium"
    nutrition_tip = generate_nutrition_tip_with_flash(goal)

    return templates.TemplateResponse("result.html", {
        "request": request,
        "username": username,
        "user_id": user_id,
        "age": age,
        "weight": weight,
        "goal": goal,
        "intensity": intensity,
        "workout_plan": updated,
        "original_plan": original,
        "nutrition_tip": nutrition_tip,
        "feedback_success": True
    })


# ---------------------------------------------------------------------
# Additional REST API endpoints from specification
# ---------------------------------------------------------------------
@router.get("/api/workout/history")
def get_workout_history(user_id: int = 10, db: Session = Depends(get_db)):
    """Fetch all generated workout plans and adaptations for a user."""
    plans = db.query(WorkoutPlan).filter_by(user_id=user_id).order_by(WorkoutPlan.id.desc()).all()
    completions = db.query(WorkoutHistory).filter_by(user_id=user_id).order_by(WorkoutHistory.completed_at.desc()).all()
    return {
        "user_id": user_id,
        "plans": [
            {
                "id": p.id,
                "goal": p.goal,
                "intensity": p.intensity,
                "original_plan": p.original_plan,
                "updated_plan": p.updated_plan,
                "feedback": p.user_feedback,
                "created_at": p.created_at.isoformat()
            } for p in plans
        ],
        "completions": [
            {
                "day_number": c.day_number,
                "title": c.workout_title,
                "calories": c.calories_burned,
                "completed_at": c.completed_at.isoformat()
            } for c in completions
        ]
    }

@router.post("/api/workout/complete")
def log_completed_workout(
    user_id: int = 10,
    day_number: int = 1,
    workout_title: str = "Daily Workout",
    duration: int = 30,
    db: Session = Depends(get_db)
):
    """Marks workout as completed, updates streak and awards achievements."""
    record = mark_workout_completed(user_id, day_number, workout_title, duration)
    new_badges = check_and_award_achievements(user_id, db)
    return {
        "message": f"Day {day_number} marked completed!",
        "record_id": record.id,
        "calories_burned": record.calories_burned,
        "new_achievements": new_badges
    }
