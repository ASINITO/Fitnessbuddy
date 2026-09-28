"""Admin dashboard and management routes including exact /view-all-users from screenshot."""
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.database import get_db, SessionLocal
from app.models import User, WorkoutPlan, Feedback
from app.schemas import PlatformFeedbackCreate
from app.services.analytics_service import get_admin_analytics

templates_dir = Path(__file__).resolve().parent.parent.parent / "templates"
templates = Jinja2Templates(directory=str(templates_dir))

router = APIRouter(tags=["Admin"])

# ---------------------------------------------------------------------
# 8. Web: View all users & their plans (Exact from screenshot)
# ---------------------------------------------------------------------
@router.get("/view-all-users", response_class=HTMLResponse)
def view_all_users(request: Request):
    """Admin view displaying all registered users and their workout plans."""
    db = SessionLocal()
    users = db.query(User).all()
    user_data = []
    for user in users:
        plan = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user.id).first()
        user_data.append({
            "id": user.id,
            "name": user.name,
            "age": user.age,
            "weight": user.weight,
            "goal": user.goal,
            "intensity": user.intensity,
            "original_plan": plan.original_plan if plan else "N/A",
            "updated_plan": plan.updated_plan if plan and plan.updated_plan else "Not updated"
        })
    db.close()
    return templates.TemplateResponse("all_users.html", {
        "request": request,
        "users": user_data
    })


# ---------------------------------------------------------------------
# Admin Dashboard & Analytics APIs
# ---------------------------------------------------------------------
@router.get("/admin/dashboard", response_class=HTMLResponse)
def admin_dashboard_page(request: Request):
    """Renders comprehensive admin dashboard."""
    analytics = get_admin_analytics()
    return templates.TemplateResponse("admin_dashboard.html", {
        "request": request,
        "analytics": analytics
    })

@router.get("/api/admin/analytics")
def api_admin_analytics():
    """Returns analytics payload for charts and summaries."""
    return get_admin_analytics()

@router.get("/api/admin/users")
def api_admin_users(
    search: str = None,
    goal: str = None,
    level: str = None,
    db: Session = Depends(get_db)
):
    """Search and filter users without exposing passwords."""
    query = db.query(User)
    if search:
        query = query.filter(
            User.name.ilike(f"%{search}%") |
            User.username.ilike(f"%{search}%") |
            User.email.ilike(f"%{search}%")
        )
    if goal and goal.lower() != "all":
        query = query.filter(User.goal.ilike(f"%{goal}%"))
    if level and level.lower() != "all":
        query = query.filter(User.fitness_level.ilike(f"%{level}%"))

    users = query.all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "username": u.username,
            "email": u.email,
            "age": u.age,
            "weight": u.weight,
            "height": u.height,
            "goal": u.goal,
            "fitness_level": u.fitness_level,
            "intensity": u.intensity,
            "is_admin": u.is_admin,
            "created_at": u.created_at.strftime("%Y-%m-%d") if u.created_at else None
        }
        for u in users
    ]

# ---------------------------------------------------------------------
# 31. Feedback System
# ---------------------------------------------------------------------
@router.post("/api/feedback")
def submit_platform_feedback(data: PlatformFeedbackCreate, user_id: int = 10, db: Session = Depends(get_db)):
    """Receives user platform feedback and ratings (1-5)."""
    fb = Feedback(
        user_id=user_id,
        rating=data.rating,
        category=data.category,
        feedback_text=data.feedback_text
    )
    db.add(fb)
    db.commit()
    return {"message": "Thank you for your valuable feedback!"}

@router.get("/api/feedback")
def get_all_feedback(db: Session = Depends(get_db)):
    """Allows admin to view collected user feedback."""
    items = db.query(Feedback).order_by(Feedback.submitted_at.desc()).all()
    return [
        {
            "id": f.id,
            "user_id": f.user_id,
            "rating": f.rating,
            "category": f.category,
            "feedback_text": f.feedback_text,
            "submitted_at": f.submitted_at.strftime("%Y-%m-%d %H:%M")
        }
        for f in items
    ]
