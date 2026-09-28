"""Input validation and health metric calculation helpers."""
from typing import Dict, Any

def calculate_bmi(height_cm: float, weight_kg: float) -> Dict[str, Any]:
    """Calculates BMI and classifies category according to standard WHO guidelines."""
    if height_cm <= 0 or weight_kg <= 0:
        return {
            "error": "Height and weight must be positive numbers",
            "bmi": None,
            "category": None
        }
    
    height_m = height_cm / 100.0
    bmi_val = round(weight_kg / (height_m ** 2), 1)

    if bmi_val < 18.5:
        category = "Underweight"
        color = "text-sky-400"
    elif 18.5 <= bmi_val < 25.0:
        category = "Normal weight"
        color = "text-emerald-400"
    elif 25.0 <= bmi_val < 30.0:
        category = "Overweight"
        color = "text-amber-400"
    else:
        category = "Obesity"
        color = "text-rose-400"

    return {
        "bmi": bmi_val,
        "category": category,
        "color": color,
        "disclaimer": "BMI is a general screening metric and does not constitute medical advice or account for individual muscle mass."
    }

def estimate_calories(
    weight_kg: float,
    height_cm: float,
    age: int,
    gender: str = "Male",
    activity_level: str = "Medium",
    goal: str = "General wellness"
) -> Dict[str, Any]:
    """Estimates daily caloric expenditure using the Mifflin-St Jeor equation."""
    if not (weight_kg > 0 and height_cm > 0 and age > 0):
        return {
            "bmr": 2000,
            "tdee": 2300,
            "target_calories": 2000,
            "disclaimer": "Default estimation used."
        }

    # Mifflin-St Jeor Equation
    if gender and gender.lower().startswith("f"):
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161
    else:
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5

    activity_multipliers = {
        "low": 1.2,
        "light": 1.375,
        "medium": 1.55,
        "moderate": 1.55,
        "high": 1.725,
        "very high": 1.9
    }
    multiplier = activity_multipliers.get(activity_level.lower(), 1.55)
    tdee = bmr * multiplier

    # Adjust for goals
    goal_lower = goal.lower()
    if "lose" in goal_lower or "fat" in goal_lower or "weight loss" in goal_lower:
        target_calories = round(tdee - 450)
    elif "gain" in goal_lower or "muscle" in goal_lower or "bulk" in goal_lower:
        target_calories = round(tdee + 350)
    else:
        target_calories = round(tdee)

    return {
        "bmr": round(bmr),
        "tdee": round(tdee),
        "target_calories": max(target_calories, 1200),
        "protein_grams_est": round(weight_kg * 1.8),
        "carbs_grams_est": round((target_calories * 0.5) / 4),
        "fats_grams_est": round((target_calories * 0.25) / 9),
        "disclaimer": "Caloric calculations are mathematical estimates only, not medical prescriptions. Consult a licensed dietitian for personalized medical advice."
    }
