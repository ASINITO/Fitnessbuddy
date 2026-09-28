"""SQLAlchemy database models for FitBuddy."""
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, Enum
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    """User account and baseline fitness profile."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=True)
    
    # Biometrics & Profile
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    height = Column(Float, nullable=True)  # in cm
    weight = Column(Float, nullable=True)  # in kg
    
    # Fitness & Preferences
    fitness_level = Column(String(30), default="Beginner")  # Beginner, Intermediate, Advanced
    goal = Column(String(100), default="General wellness")
    intensity = Column(String(30), default="Medium")  # Low, Medium, High
    preferred_duration = Column(Integer, default=45)  # in minutes
    available_days = Column(Integer, default=5)
    dietary_preference = Column(String(50), default="Vegetarian")  # Vegetarian, Non-vegetarian, Vegan, Eggetarian
    language = Column(String(20), default="English")  # English, Tamil
    schedule = Column(Integer, default=7)
    
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    workout_plans = relationship("WorkoutPlan", back_populates="user", cascade="all, delete-orphan")
    workout_histories = relationship("WorkoutHistory", back_populates="user", cascade="all, delete-orphan")
    progress_records = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    water_logs = relationship("WaterLog", back_populates="user", cascade="all, delete-orphan")
    sleep_logs = relationship("SleepLog", back_populates="user", cascade="all, delete-orphan")
    check_ins = relationship("DailyCheckIn", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")
    nutrition_plans = relationship("NutritionPlan", back_populates="user", cascade="all, delete-orphan")


class WorkoutPlan(Base):
    """Stores AI-generated workout plans and adaptations."""
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    goal = Column(String(100), nullable=True)
    intensity = Column(String(50), nullable=True)
    original_plan = Column(Text, nullable=False)
    updated_plan = Column(Text, nullable=True)
    user_feedback = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="workout_plans")


class WorkoutHistory(Base):
    """Tracks completed workout sessions and days."""
    __tablename__ = "workout_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    day_number = Column(Integer, nullable=False)
    workout_title = Column(String(100), nullable=False)
    duration_minutes = Column(Integer, default=30)
    calories_burned = Column(Float, default=0.0)
    completed_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="workout_histories")


class Exercise(Base):
    """Exercise catalog with category, instructions and safety notes."""
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    muscle_group = Column(String(50), nullable=False)  # Chest, Back, Legs, Shoulders, Arms, Core, Cardio, Flexibility
    difficulty = Column(String(30), default="Beginner")  # Beginner, Intermediate, Advanced
    equipment = Column(String(50), default="Bodyweight")  # Bodyweight, Dumbbells, Barbell, Resistance Bands, Machine
    description = Column(Text, nullable=False)
    instructions = Column(Text, nullable=False)
    safety_notes = Column(Text, nullable=False)


class Progress(Base):
    """Tracks body weight, measurements, runs, and milestone stats."""
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    weight = Column(Float, nullable=True)
    chest_cm = Column(Float, nullable=True)
    waist_cm = Column(Float, nullable=True)
    running_distance_km = Column(Float, default=0.0)
    steps = Column(Integer, default=0)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="progress_records")


class WaterLog(Base):
    """Hydration tracking."""
    __tablename__ = "water_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    glasses = Column(Integer, default=1)
    amount_ml = Column(Float, default=250.0)
    daily_target_ml = Column(Float, default=2500.0)
    logged_date = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="water_logs")


class SleepLog(Base):
    """Sleep duration and quality tracking."""
    __tablename__ = "sleep_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sleep_time = Column(String(20), nullable=True)  # e.g., "23:00"
    wake_time = Column(String(20), nullable=True)   # e.g., "07:00"
    duration_hours = Column(Float, nullable=False)
    quality = Column(String(30), default="Good")    # Poor, Fair, Good, Excellent
    recovery_note = Column(Text, nullable=True)
    logged_date = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sleep_logs")


class DailyCheckIn(Base):
    """Daily check-in for energy, soreness, mood, and stress."""
    __tablename__ = "daily_checkins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    energy_level = Column(Integer, default=3)  # 1 to 5
    mood = Column(String(30), default="Good")
    sleep_quality = Column(String(30), default="Good")
    muscle_soreness = Column(String(30), default="None")  # None, Mild, Moderate, Severe
    stress_level = Column(String(30), default="Low")     # Low, Medium, High
    workout_completed = Column(Boolean, default=False)
    water_intake_ml = Column(Float, default=0.0)
    ai_recommendation = Column(Text, nullable=True)
    checkin_date = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="check_ins")


class Achievement(Base):
    """Milestone badges definition."""
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    badge_icon = Column(String(50), default="award")
    threshold_value = Column(Integer, default=1)

    user_achievements = relationship("UserAchievement", back_populates="achievement")


class UserAchievement(Base):
    """User unlocked achievements association."""
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    unlocked_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")


class ChatMessage(Base):
    """FitBuddy AI fitness chatbot conversation logs."""
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    sender = Column(String(20), default="user")  # 'user' or 'ai'
    message = Column(Text, nullable=False)
    language = Column(String(20), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_messages")


class Feedback(Base):
    """User platform feedback."""
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    rating = Column(Integer, default=5)
    category = Column(String(50), default="Workout Plan")
    feedback_text = Column(Text, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="feedbacks")


class NutritionPlan(Base):
    """Saved nutrition tips and meal suggestions."""
    __tablename__ = "nutrition_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    goal = Column(String(100), nullable=False)
    dietary_preference = Column(String(50), default="Vegetarian")
    nutrition_tip = Column(Text, nullable=True)
    meal_plan_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="nutrition_plans")
