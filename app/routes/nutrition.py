"""Nutrition routes implementing exact endpoint #2 from screenshot and meal generator."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import NutritionTipRequest, MealPlanRequest
from app.services.gemini_service import (
    generate_nutrition_tip_with_flash,
    generate_nutrition_tip,
    generate_meal_suggestions
)
from app.services.nutrition_service import get_or_create_nutrition_plan

router = APIRouter(tags=["Nutrition"])

# ---------------------------------------------------------------------
# 2. API: Generate nutrition tip using Gemini Flash (Exact from screenshot)
# ---------------------------------------------------------------------
@router.get("/nutrition-tip")
def get_flash_tip(goal: str = Query(..., description="User fitness goal")):
    """Generates nutrition tip using Gemini Flash matching screenshot 2."""
    tip = generate_nutrition_tip_with_flash(goal)
    return {"goal": goal, "nutrition_tip": tip}


# ---------------------------------------------------------------------
# REST API Endpoints for Full Application
# ---------------------------------------------------------------------
@router.post("/api/nutrition/tip")
def api_nutrition_tip(data: NutritionTipRequest):
    """Provides personalized dietary and hydration tips."""
    tip = generate_nutrition_tip(data.goal, data.dietary_preference or "Vegetarian")
    return {
        "goal": data.goal,
        "dietary_preference": data.dietary_preference,
        "tip": tip
    }

@router.post("/api/nutrition/meal-plan")
def api_meal_plan(data: MealPlanRequest, user_id: int = 10):
    """Generates structured 1-day meal breakdown (Breakfast, Mid-morning, Lunch, Snack, Dinner)."""
    plan_info = get_or_create_nutrition_plan(user_id, data.goal, data.dietary_preference)
    return plan_info
