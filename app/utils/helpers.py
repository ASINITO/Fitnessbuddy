"""Helper utilities for streaks, completions, and achievement evaluations."""
from datetime import datetime, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import WorkoutHistory, WaterLog, SleepLog, Achievement, UserAchievement, User

def calculate_streak(user_id: int, db: Session) -> Dict[str, Any]:
    """Calculates current and longest workout streak for a user."""
    histories = db.query(WorkoutHistory).filter(
        WorkoutHistory.user_id == user_id
    ).order_by(WorkoutHistory.completed_at.desc()).all()

    if not histories:
        return {"current_streak": 0, "longest_streak": 0, "total_workouts": 0}

    dates = sorted(list({h.completed_at.date() for h in histories}), reverse=True)
    today = datetime.utcnow().date()
    yesterday = today - timedelta(days=1)

    # Current streak calculation
    current_streak = 0
    check_date = today

    if dates and (dates[0] == today or dates[0] == yesterday):
        check_date = dates[0]
        for d in dates:
            if d == check_date:
                current_streak += 1
                check_date -= timedelta(days=1)
            elif d < check_date:
                break

    # Longest streak calculation
    longest_streak = 1 if dates else 0
    temp_streak = 1
    for i in range(len(dates) - 1):
        if dates[i] - dates[i + 1] == timedelta(days=1):
            temp_streak += 1
            if temp_streak > longest_streak:
                longest_streak = temp_streak
        else:
            temp_streak = 1

    return {
        "current_streak": current_streak,
        "longest_streak": max(current_streak, longest_streak),
        "total_workouts": len(histories)
    }

def check_and_award_achievements(user_id: int, db: Session) -> List[str]:
    """Evaluates user milestones and awards badges."""
    awarded_names = []
    
    # Existing unlocked achievement IDs
    unlocked_ids = {
        ua.achievement_id for ua in db.query(UserAchievement).filter_by(user_id=user_id).all()
    }
    
    total_workouts = db.query(WorkoutHistory).filter_by(user_id=user_id).count()
    water_logs_count = db.query(WaterLog).filter_by(user_id=user_id).count()
    sleep_logs_count = db.query(SleepLog).filter_by(user_id=user_id).count()
    streaks = calculate_streak(user_id, db)

    achievements = db.query(Achievement).all()
    for ach in achievements:
        if ach.id in unlocked_ids:
            continue

        unlock = False
        if ach.code == "FIRST_WORKOUT" and total_workouts >= 1:
            unlock = True
        elif ach.code == "STREAK_3" and streaks["current_streak"] >= 3:
            unlock = True
        elif ach.code == "STREAK_7" and streaks["current_streak"] >= 7:
            unlock = True
        elif ach.code == "HYDRATION_HERO" and water_logs_count >= 5:
            unlock = True
        elif ach.code == "WORKOUT_WARRIOR" and total_workouts >= 10:
            unlock = True
        elif ach.code == "CONSISTENCY_CHAMPION" and total_workouts >= 25:
            unlock = True
        elif ach.code == "RECOVERY_PRO" and sleep_logs_count >= 7:
            unlock = True

        if unlock:
            ua = UserAchievement(user_id=user_id, achievement_id=ach.id)
            db.add(ua)
            awarded_names.append(ach.title)

    if awarded_names:
        db.commit()

    return awarded_names
