"""Pydantic schemas for request validation and response serialization."""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# --- Schemas matching the user screenshots ---
class WorkoutRequest(BaseModel):
    goal: str
    intensity: str

class UserInput(BaseModel):
    user_id: int
    username: str
    age: int
    weight: float
    goal: str
    intensity: str

class FeedbackRequest(BaseModel):
    feedback: str

# --- Auth & User Profile Schemas ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    age: Optional[int] = Field(None, ge=10, le=120)
    gender: Optional[str] = "Other"
    height: Optional[float] = Field(None, ge=50, le=280)  # cm
    weight: Optional[float] = Field(None, ge=20, le=400)  # kg
    fitness_level: Optional[str] = "Beginner"
    goal: Optional[str] = "General wellness"
    intensity: Optional[str] = "Medium"
    preferred_duration: Optional[int] = 45
    available_days: Optional[int] = 5
    dietary_preference: Optional[str] = "Vegetarian"
    language: Optional[str] = "English"

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    fitness_level: Optional[str] = None
    goal: Optional[str] = None
    intensity: Optional[str] = None
    preferred_duration: Optional[int] = None
    available_days: Optional[int] = None
    dietary_preference: Optional[str] = None
    language: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: Optional[str]
    name: str
    email: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    height: Optional[float]
    weight: Optional[float]
    fitness_level: Optional[str]
    goal: Optional[str]
    intensity: Optional[str]
    preferred_duration: Optional[int]
    available_days: Optional[int]
    dietary_preference: Optional[str]
    language: Optional[str]
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Workout & Plan Schemas ---
class WorkoutGenerateFull(BaseModel):
    age: Optional[int] = 25
    weight: Optional[float] = 70.0
    height: Optional[float] = 175.0
    fitness_level: Optional[str] = "Beginner"
    goal: str = "General wellness"
    intensity: str = "Medium"
    workout_duration: Optional[int] = 45
    available_days: Optional[int] = 5
    equipment_available: Optional[str] = "Bodyweight / Dumbbells"
    preferences: Optional[str] = "No jumping"
    language: Optional[str] = "English"

class WorkoutPlanResponse(BaseModel):
    id: int
    user_id: int
    goal: Optional[str]
    intensity: Optional[str]
    original_plan: str
    updated_plan: Optional[str] = None
    user_feedback: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Nutrition Schemas ---
class NutritionTipRequest(BaseModel):
    goal: str
    dietary_preference: Optional[str] = "Vegetarian"
    intensity: Optional[str] = "Medium"

class MealPlanRequest(BaseModel):
    goal: str
    dietary_preference: str = "Vegetarian"
    fitness_level: str = "Beginner"
    target_calories: Optional[float] = None

# --- Water & Sleep Schemas ---
class WaterLogCreate(BaseModel):
    glasses: int = Field(1, ge=1, le=20)
    amount_ml: float = Field(250.0, ge=50, le=5000)

class SleepLogCreate(BaseModel):
    sleep_time: Optional[str] = "23:00"
    wake_time: Optional[str] = "07:00"
    duration_hours: float = Field(..., ge=1, le=24)
    quality: str = "Good"
    notes: Optional[str] = None

# --- Daily Check-In Schemas ---
class DailyCheckInCreate(BaseModel):
    energy_level: int = Field(3, ge=1, le=5)
    mood: str = "Good"
    sleep_quality: str = "Good"
    muscle_soreness: str = "None"
    stress_level: str = "Low"
    workout_completed: bool = False
    water_intake_ml: float = 0.0

# --- Chat & Exercise Schemas ---
class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en"  # "en" or "ta" (Tamil)

class ExerciseFilter(BaseModel):
    muscle_group: Optional[str] = None
    difficulty: Optional[str] = None
    equipment: Optional[str] = None
    search: Optional[str] = None

# --- Feedback Schema ---
class PlatformFeedbackCreate(BaseModel):
    rating: int = Field(5, ge=1, le=5)
    category: str = "General"
    feedback_text: str = Field(..., min_length=3)
