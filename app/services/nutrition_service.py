"""Nutrition guidance, meal plan caching, and dietary recommendation service."""
import json
from typing import Dict, Any, Optional
from app.database import SessionLocal
from app.models import NutritionPlan
from app.services.gemini_service import generate_nutrition_tip, generate_meal_suggestions

def get_or_create_nutrition_plan(user_id: int, goal: str, dietary_pref: str = "Vegetarian") -> Dict[str, Any]:
    """Retrieves existing nutrition plan or generates a fresh one."""
    db = SessionLocal()
    try:
        existing = db.query(NutritionPlan).filter_by(user_id=user_id).order_by(NutritionPlan.id.desc()).first()
        if existing and existing.goal == goal and existing.dietary_preference == dietary_pref:
            meal_data = json.loads(existing.meal_plan_json) if existing.meal_plan_json else {}
            return {
                "tip": existing.nutrition_tip,
                "meal_plan": meal_data,
                "goal": existing.goal,
                "dietary_preference": existing.dietary_preference
            }
        
        # Generate new
        tip = generate_nutrition_tip(goal, dietary_pref)
        meal_plan = generate_meal_suggestions(goal, dietary_pref)
        
        plan = NutritionPlan(
            user_id=user_id,
            goal=goal,
            dietary_preference=dietary_pref,
            nutrition_tip=tip,
            meal_plan_json=json.dumps(meal_plan)
        )
        db.add(plan)
        db.commit()
        return {
            "tip": tip,
            "meal_plan": meal_plan,
            "goal": goal,
            "dietary_preference": dietary_pref
        }
    finally:
        db.close()
