"""AI Wellness and Smart Workout Recommendation Engine."""
from typing import Dict, Any
from app.database import SessionLocal
from app.models import User, DailyCheckIn, WorkoutHistory, SleepLog, WaterLog
from app.services.gemini_service import generate_daily_recommendation

def generate_user_smart_recommendation(user_id: int) -> Dict[str, Any]:
    """Evaluates recent check-ins, sleep, and workouts to produce an actionable recommendation."""
    db = SessionLocal()
    try:
        user = db.query(User).filter_by(id=user_id).first()
        if not user:
            return {"recommendation": "Stay active and hydrated!", "explanation": "General wellness rule."}

        latest_checkin = db.query(DailyCheckIn).filter_by(user_id=user_id).order_by(DailyCheckIn.id.desc()).first()
        recent_sleep = db.query(SleepLog).filter_by(user_id=user_id).order_by(SleepLog.id.desc()).first()
        recent_workouts = db.query(WorkoutHistory).filter_by(user_id=user_id).count()

        checkin_dict = {
            "energy_level": latest_checkin.energy_level if latest_checkin else 4,
            "mood": latest_checkin.mood if latest_checkin else "Good",
            "sleep_quality": recent_sleep.quality if recent_sleep else "Good",
            "muscle_soreness": latest_checkin.muscle_soreness if latest_checkin else "None",
            "stress_level": latest_checkin.stress_level if latest_checkin else "Low",
            "workout_completed": latest_checkin.workout_completed if latest_checkin else False,
            "water_intake_ml": latest_checkin.water_intake_ml if latest_checkin else 2000
        }

        user_dict = {
            "name": user.name,
            "goal": user.goal,
            "fitness_level": user.fitness_level,
            "intensity": user.intensity
        }

        rec_text = generate_daily_recommendation(checkin_dict, user_dict)
        return {
            "recommendation": rec_text,
            "energy_level": checkin_dict["energy_level"],
            "muscle_soreness": checkin_dict["muscle_soreness"],
            "total_workouts_completed": recent_workouts
        }
    finally:
        db.close()
