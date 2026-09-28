"""Analytics and reporting service for admin dashboard and user progress trends."""
from typing import Dict, Any, List
from sqlalchemy import func
from app.database import SessionLocal
from app.models import User, WorkoutPlan, WorkoutHistory, DailyCheckIn, WaterLog, SleepLog, Feedback

def get_admin_analytics() -> Dict[str, Any]:
    """Computes high-level platform analytics for administrators."""
    db = SessionLocal()
    try:
        total_users = db.query(User).count()
        total_plans = db.query(WorkoutPlan).count()
        updated_plans = db.query(WorkoutPlan).filter(WorkoutPlan.updated_plan.isnot(None)).count()
        total_completed_workouts = db.query(WorkoutHistory).count()
        feedback_count = db.query(Feedback).count()

        # Breakdown by fitness goal
        goal_counts = (
            db.query(User.goal, func.count(User.id))
            .group_by(User.goal)
            .all()
        )
        goals_data = {g[0] or "General": g[1] for g in goal_counts}

        # Breakdown by fitness level
        level_counts = (
            db.query(User.fitness_level, func.count(User.id))
            .group_by(User.fitness_level)
            .all()
        )
        levels_data = {l[0] or "Beginner": l[1] for l in level_counts}

        # Average rating
        avg_rating = db.query(func.avg(Feedback.rating)).scalar() or 4.8

        return {
            "total_users": total_users,
            "total_plans": total_plans,
            "updated_plans": updated_plans,
            "total_completed_workouts": total_completed_workouts,
            "feedback_count": feedback_count,
            "average_rating": round(float(avg_rating), 1),
            "goals_distribution": goals_data,
            "levels_distribution": levels_data,
        }
    finally:
        db.close()
