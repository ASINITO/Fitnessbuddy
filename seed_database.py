"""Database seeder populating sample users, exercise catalog, and milestone achievements."""
from app.database import SessionLocal, engine, Base
from app.models import User, Exercise, Achievement, WorkoutPlan, WorkoutHistory, DailyCheckIn
from app.utils.security import hash_password

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Seed Achievements
    achievements_data = [
        {"code": "FIRST_WORKOUT", "title": "First Workout", "description": "Completed your very first workout session in FitBuddy.", "badge_icon": "zap"},
        {"code": "STREAK_3", "title": "3-Day Streak", "description": "Logged workouts for 3 consecutive days.", "badge_icon": "flame"},
        {"code": "STREAK_7", "title": "7-Day Streak", "description": "Conquered a full 7-day workout streak.", "badge_icon": "target"},
        {"code": "HYDRATION_HERO", "title": "Hydration Hero", "description": "Met your 2.5L daily hydration target across 5 days.", "badge_icon": "droplet"},
        {"code": "WORKOUT_WARRIOR", "title": "Workout Warrior", "description": "Logged 10 total workout sessions.", "badge_icon": "award"},
        {"code": "CONSISTENCY_CHAMPION", "title": "Consistency Champion", "description": "Reached 25 logged workout sessions.", "badge_icon": "crown"},
        {"code": "RECOVERY_PRO", "title": "Recovery Pro", "description": "Logged 7 days of quality 8-hour sleep.", "badge_icon": "moon"}
    ]
    for ach in achievements_data:
        if not db.query(Achievement).filter_by(code=ach["code"]).first():
            db.add(Achievement(**ach))

    # 2. Seed Exercise Catalog (Categories: Chest, Back, Legs, Shoulders, Arms, Core, Cardio, Flexibility)
    exercises_data = [
        {
            "name": "Push-ups",
            "muscle_group": "Chest",
            "difficulty": "Beginner",
            "equipment": "Bodyweight",
            "description": "Fundamental upper body pushing movement targeting the pectoralis major and triceps.",
            "instructions": "Place hands slightly wider than shoulder-width, lower chest until elbows reach 90 degrees, and push back up while bracing core.",
            "safety_notes": "Avoid flaring elbows out past 45 degrees to protect the shoulder joint."
        },
        {
            "name": "Goblet Squat",
            "muscle_group": "Legs",
            "difficulty": "Beginner",
            "equipment": "Dumbbells",
            "description": "Quad and glute dominant squat holding a single weight against the chest.",
            "instructions": "Hold dumbbell vertically against upper sternum. Sit back and down between knees until thighs are parallel to ground.",
            "safety_notes": "Keep chest tall and do not let knees collapse inward."
        },
        {
            "name": "Dumbbell Bent-Over Row",
            "muscle_group": "Back",
            "difficulty": "Intermediate",
            "equipment": "Dumbbells",
            "description": "Compound pulling exercise targeting the latissimus dorsi, rhomboids, and rear deltoids.",
            "instructions": "Hinge at the hips with a flat back at a 45-degree angle. Pull elbows back towards the hips and squeeze shoulder blades.",
            "safety_notes": "Maintain a neutral spine without rounding the lumbar region."
        },
        {
            "name": "Overhead Dumbbell Shoulder Press",
            "muscle_group": "Shoulders",
            "difficulty": "Beginner",
            "equipment": "Dumbbells",
            "description": "Vertical pushing exercise developing the deltoids and triceps.",
            "instructions": "Start with dumbbells at ear height. Press weights overhead until arms are extended, keeping ribs pulled down.",
            "safety_notes": "Do not hyperextend lower back while pressing."
        },
        {
            "name": "Forearm Plank",
            "muscle_group": "Core",
            "difficulty": "Beginner",
            "equipment": "Bodyweight",
            "description": "Isometric core stabilization movement for transverse abdominis.",
            "instructions": "Rest on forearms and toes. Form a straight line from crown of head to heels, actively bracing abs and glutes.",
            "safety_notes": "Prevent hips from sagging down or piking too high."
        },
        {
            "name": "High-Intensity Mountain Climbers",
            "muscle_group": "Cardio",
            "difficulty": "Intermediate",
            "equipment": "Bodyweight",
            "description": "Dynamic movement building cardiovascular capacity and hip flexor endurance.",
            "instructions": "From a push-up position, alternate driving knees towards the chest in a rapid running motion.",
            "safety_notes": "Maintain a flat back and avoid bouncing shoulders excessively."
        },
        {
            "name": "World's Greatest Stretch",
            "muscle_group": "Flexibility",
            "difficulty": "Beginner",
            "equipment": "Bodyweight",
            "description": "Full-body mobility movement opening hips, thoracic spine, and hamstrings.",
            "instructions": "Step forward into a deep lunge, place hands inside front foot, and rotate torso while extending the outside arm to the ceiling.",
            "safety_notes": "Move smoothly without ballistic bouncing."
        }
    ]
    for ex in exercises_data:
        if not db.query(Exercise).filter_by(name=ex["name"]).first():
            db.add(Exercise(**ex))

    # 3. Seed Sample User (matching screenshot #6: user_id=10, name="xyz", age=20, weight=70.0, goal="i want to lose belly fat and gain muscles", intensity="High")
    user10 = db.query(User).filter_by(id=10).first()
    if not user10:
        user10 = User(
            id=10,
            name="xyz",
            username="xyz_user",
            email="xyz@fitbuddy.ai",
            hashed_password=hash_password("password123"),
            age=20,
            weight=70.0,
            height=175.0,
            fitness_level="Intermediate",
            goal="i want to lose belly fat and gain muscles",
            intensity="High",
            is_admin=True
        )
        db.add(user10)
        db.commit()

        # Seed plan for user 10
        plan_text = """DAY 1: Upper Body Push & Pull
• Focus: Chest & Back
• Exercises: Push-ups (3x12), Dumbbell Rows (3x12), Shoulder Press (3x10), Plank (3x45s)

DAY 2: Lower Body & Core
• Focus: Quads & Glutes
• Exercises: Goblet Squats (3x12), Romanian Deadlifts (3x10), Lunges (3x10)

DAY 3: Active Recovery & Cardio
• 30-minute brisk walk and dynamic mobility flow

DAY 4: Functional Core & HIIT
• Mountain Climbers, Russian Twists, Dumbbell Thrusters

DAY 5: Full Body Hypertrophy
• Split Squats, Bent-Over Rows, Floor Press

DAY 6: Posterior Chain & Abs
• Glute Bridges, Side Planks, Farmer's Carries

DAY 7: Rest & Systemic Recovery"""

        wp = WorkoutPlan(
            user_id=10,
            goal="i want to lose belly fat and gain muscles",
            intensity="High",
            original_plan=plan_text,
            updated_plan="[Updated for quick 30-minute sessions]: Adjusted rest periods to 45s, added supersets for upper body push/pull to maximize fat oxidation.",
            user_feedback="Make workouts shorter - around 30 minutes."
        )
        db.add(wp)

    db.commit()
    db.close()
    print("Database seeded with sample users, exercises, achievements, and plans.")

if __name__ == "__main__":
    seed()
