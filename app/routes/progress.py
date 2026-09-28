"""Progress tracking, hydration, sleep, check-ins, BMI, and calorie estimation routes."""
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Progress, WaterLog, SleepLog, DailyCheckIn, UserAchievement, Achievement, User
from app.schemas import (
    WaterLogCreate, SleepLogCreate, DailyCheckInCreate
)
from app.utils.validators import calculate_bmi, estimate_calories
from app.utils.helpers import calculate_streak, check_and_award_achievements
from app.services.recommendation_service import generate_user_smart_recommendation

router = APIRouter(prefix="/api", tags=["Progress & Wellness Tracking"])

# -------------------------------------------------------------
# 7. BMI Calculator API (Section 7)
# -------------------------------------------------------------
@router.get("/bmi")
def get_bmi(
    height: float = Query(..., description="Height in centimeters", gt=0),
    weight: float = Query(..., description="Weight in kilograms", gt=0)
):
    """Calculates BMI and health category with disclaimer."""
    return calculate_bmi(height, weight)

# -------------------------------------------------------------
# 8. Calorie Estimation API (Section 8)
# -------------------------------------------------------------
@router.get("/calorie-estimate")
def get_calorie_estimate(
    weight: float = Query(..., description="Weight in kg", gt=0),
    height: float = Query(..., description="Height in cm", gt=0),
    age: int = Query(..., description="Age in years", gt=0),
    gender: str = Query("Male", description="Gender (Male/Female)"),
    activity_level: str = Query("Medium", description="Low, Medium, High"),
    goal: str = Query("General wellness", description="Fitness goal")
):
    """Calculates Mifflin-St Jeor daily estimated caloric expenditure."""
    return estimate_calories(weight, height, age, gender, activity_level, goal)

# -------------------------------------------------------------
# 16. Hydration Tracker (Section 16)
# -------------------------------------------------------------
@router.post("/water")
def log_water(data: WaterLogCreate, user_id: int = 10, db: Session = Depends(get_db)):
    """Logs water intake in glasses or milliliters."""
    log = WaterLog(
        user_id=user_id,
        glasses=data.glasses,
        amount_ml=data.amount_ml
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    check_and_award_achievements(user_id, db)

    # Return today's total
    today = datetime.utcnow().date()
    total_today = (
        db.query(func.sum(WaterLog.amount_ml))
        .filter(WaterLog.user_id == user_id, func.date(WaterLog.logged_date) == today)
        .scalar() or 0.0
    )
    return {
        "message": f"Added {data.amount_ml}ml water successfully!",
        "today_total_ml": total_today,
        "daily_target_ml": 2500.0,
        "progress_percentage": min(round((total_today / 2500.0) * 100), 100)
    }

@router.get("/water")
def get_water_history(user_id: int = 10, db: Session = Depends(get_db)):
    """Fetches daily hydration records for the past 7 days."""
    today = datetime.utcnow().date()
    week_ago = today - timedelta(days=6)
    
    logs = (
        db.query(
            func.date(WaterLog.logged_date).label("date"),
            func.sum(WaterLog.amount_ml).label("total_ml")
        )
        .filter(WaterLog.user_id == user_id, func.date(WaterLog.logged_date) >= week_ago)
        .group_by(func.date(WaterLog.logged_date))
        .all()
    )
    return {
        "user_id": user_id,
        "target_ml": 2500.0,
        "history": [{"date": str(l.date), "total_ml": float(l.total_ml)} for l in logs]
    }

# -------------------------------------------------------------
# 17. Sleep Tracker (Section 17)
# -------------------------------------------------------------
@router.post("/sleep")
def log_sleep(data: SleepLogCreate, user_id: int = 10, db: Session = Depends(get_db)):
    """Logs sleep time, wake time, and quality."""
    log = SleepLog(
        user_id=user_id,
        sleep_time=data.sleep_time,
        wake_time=data.wake_time,
        duration_hours=data.duration_hours,
        quality=data.quality,
        recovery_note=data.notes
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    check_and_award_achievements(user_id, db)
    return {"message": "Sleep record logged successfully", "id": log.id}

@router.get("/sleep")
def get_sleep_history(user_id: int = 10, db: Session = Depends(get_db)):
    """Retrieves weekly sleep history."""
    week_ago = datetime.utcnow() - timedelta(days=7)
    logs = (
        db.query(SleepLog)
        .filter(SleepLog.user_id == user_id, SleepLog.logged_date >= week_ago)
        .order_by(SleepLog.logged_date.desc())
        .all()
    )
    return {
        "user_id": user_id,
        "records": [
            {
                "date": l.logged_date.strftime("%Y-%m-%d"),
                "duration_hours": l.duration_hours,
                "quality": l.quality,
                "sleep_time": l.sleep_time,
                "wake_time": l.wake_time
            } for l in logs
        ]
    }

# -------------------------------------------------------------
# 18 & 19. Daily Check-in & AI Wellness Recommendation
# -------------------------------------------------------------
@router.post("/checkin")
def submit_checkin(data: DailyCheckInCreate, user_id: int = 10, db: Session = Depends(get_db)):
    """Saves daily check-in and triggers personalized AI recommendation."""
    checkin = DailyCheckIn(
        user_id=user_id,
        energy_level=data.energy_level,
        mood=data.mood,
        sleep_quality=data.sleep_quality,
        muscle_soreness=data.muscle_soreness,
        stress_level=data.stress_level,
        workout_completed=data.workout_completed,
        water_intake_ml=data.water_intake_ml
    )
    db.add(checkin)
    db.commit()
    db.refresh(checkin)

    rec_data = generate_user_smart_recommendation(user_id)
    checkin.ai_recommendation = rec_data["recommendation"]
    db.commit()

    return {
        "message": "Daily check-in completed!",
        "recommendation": rec_data["recommendation"]
    }

@router.get("/recommendations")
def get_recommendation(user_id: int = 10):
    """Fetches real-time AI wellness and workout recommendations."""
    return generate_user_smart_recommendation(user_id)

# -------------------------------------------------------------
# 20. Fitness Progress Records & Weight Tracker
# -------------------------------------------------------------
@router.post("/progress")
def log_progress(
    weight: Optional[float] = None,
    distance_km: Optional[float] = 0.0,
    steps: Optional[int] = 0,
    user_id: int = 10,
    db: Session = Depends(get_db)
):
    """Records bodyweight, running distance, or steps."""
    prog = Progress(
        user_id=user_id,
        weight=weight,
        running_distance_km=distance_km or 0.0,
        steps=steps or 0
    )
    db.add(prog)
    # Also update user table current weight if provided
    if weight:
        user = db.query(User).filter_by(id=user_id).first()
        if user:
            user.weight = weight
    db.commit()
    return {"message": "Progress recorded successfully"}

@router.get("/progress")
def get_progress_data(user_id: int = 10, db: Session = Depends(get_db)):
    """Returns dated metrics for Chart.js visualization."""
    records = db.query(Progress).filter_by(user_id=user_id).order_by(Progress.recorded_at.asc()).all()
    return {
        "weights": [{"date": r.recorded_at.strftime("%b %d"), "weight": r.weight} for r in records if r.weight],
        "runs": [{"date": r.recorded_at.strftime("%b %d"), "distance": r.running_distance_km} for r in records if r.running_distance_km],
        "steps": [{"date": r.recorded_at.strftime("%b %d"), "steps": r.steps} for r in records if r.steps]
    }

# -------------------------------------------------------------
# 22 & 23. Streak and Achievements
# -------------------------------------------------------------
@router.get("/streak")
def get_user_streak(user_id: int = 10, db: Session = Depends(get_db)):
    """Returns current and longest workout streak."""
    return calculate_streak(user_id, db)

@router.get("/achievements")
def get_user_achievements(user_id: int = 10, db: Session = Depends(get_db)):
    """Fetches all badges with unlock status."""
    all_achievements = db.query(Achievement).all()
    unlocked = {ua.achievement_id: ua.unlocked_at for ua in db.query(UserAchievement).filter_by(user_id=user_id).all()}

    return [
        {
            "id": a.id,
            "code": a.code,
            "title": a.title,
            "description": a.description,
            "badge_icon": a.badge_icon,
            "unlocked": a.id in unlocked,
            "unlocked_at": unlocked[a.id].strftime("%Y-%m-%d") if a.id in unlocked else None
        }
        for a in all_achievements
    ]
