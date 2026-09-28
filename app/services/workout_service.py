"""Workout and user plan data service implementing exact image workflows."""
from typing import Optional, List, Dict, Any
from app.database import SessionLocal
from app.models import User, WorkoutPlan, WorkoutHistory
from app.services.gemini_service import generate_workout_gemini, update_workout_plan

def save_user(user_id: int, name: str, age: int, weight: float, goal: str, intensity: str):
    """Save or update user profile info matching screenshot code."""
    db = SessionLocal()
    try:
        existing = db.query(User).filter_by(id=user_id).first()
        if existing:
            # Update existing user info
            existing.name = name
            existing.age = age
            existing.weight = weight
            existing.goal = goal
            existing.intensity = intensity
        else:
            # Create a new user
            user = User(
                id=user_id,
                name=name,
                age=age,
                weight=weight,
                goal=goal,
                intensity=intensity,
                schedule=7  # default schedule or logic
            )
            db.add(user)
        db.commit()
    finally:
        db.close()

def save_plan(user_id: int, plan: str):
    """Stores the plan in the database matching screenshot code."""
    db = SessionLocal()
    try:
        workout = WorkoutPlan(user_id=user_id, original_plan=plan)
        db.add(workout)
        db.commit()
    finally:
        db.close()

def get_user(user_id: int) -> Optional[User]:
    """Retrieves user by id matching screenshot code."""
    db = SessionLocal()
    try:
        return db.query(User).filter(User.id == user_id).first()
    finally:
        db.close()

def get_original_plan(user_id: int) -> Optional[str]:
    """Retrieves the latest original workout plan for a user."""
    db = SessionLocal()
    try:
        plan = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user_id).order_by(WorkoutPlan.id.desc()).first()
        return plan.original_plan if plan else None
    finally:
        db.close()

def update_plan(user_id: int, updated: str, feedback: Optional[str] = None):
    """Updates the workout plan with feedback."""
    db = SessionLocal()
    try:
        plan = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user_id).order_by(WorkoutPlan.id.desc()).first()
        if plan:
            plan.updated_plan = updated
            if feedback:
                plan.user_feedback = feedback
            db.commit()
    finally:
        db.close()

def mark_workout_completed(user_id: int, day_number: int, workout_title: str, duration: int = 30) -> WorkoutHistory:
    """Marks a workout session as completed and logs to history."""
    db = SessionLocal()
    try:
        history = WorkoutHistory(
            user_id=user_id,
            day_number=day_number,
            workout_title=workout_title,
            duration_minutes=duration,
            calories_burned=round(duration * 7.5)  # approximate moderate expenditure
        )
        db.add(history)
        db.commit()
        db.refresh(history)
        return history
    finally:
        db.close()
