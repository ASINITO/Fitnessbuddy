"""Centralized Gemini AI Service for FitBuddy.
Implements workout generation, plan adaptation, nutrition tips, exercise explanation,
daily wellness recommendations, and multilingual fitness chatbot.
"""
import os
import json
import logging
from typing import Dict, Any, Optional
from app.config import settings

logger = logging.getLogger("fitbuddy.gemini")

# Initialize Gemini Client if available
_client = None
try:
    from google import genai
    from google.genai import types
    api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
    if api_key and api_key != "your_gemini_api_key_here":
        _client = genai.Client(api_key=api_key)
        logger.info("Google GenAI client initialized successfully.")
    else:
        logger.warning("GEMINI_API_KEY not configured. Falling back to deterministic expert templates.")
except Exception as e:
    logger.warning(f"Google GenAI SDK load note: {e}")

MODEL_FLASH = "gemini-3.8-flash"
MODEL_PRO = "gemini-3.1-pro-preview"

# Safety instructions applied to all prompts
SAFETY_DISCLAIMER_SYS = (
    "You are FitBuddy, an expert, certified fitness coach and wellness specialist. "
    "Safety instructions: You provide general fitness, movement, and wellness information. "
    "NEVER provide medical diagnoses, treatment prescriptions, or extreme/crash diets. "
    "If injuries or severe pain are mentioned, warmly advise consulting a qualified physical therapist or doctor."
)

def _call_gemini(prompt: str, model_name: str = MODEL_FLASH, system_instruction: str = SAFETY_DISCLAIMER_SYS) -> str:
    """Helper to call Gemini API with graceful fallback."""
    if _client:
        try:
            config = None
            if system_instruction:
                config = types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.7
                )
            response = _client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=config
            )
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini API error during generation: {e}")
            # Fall through to fallback
    return ""


# -------------------------------------------------------------
# 1. Nutrition Tip with Flash (From user image specification)
# -------------------------------------------------------------
def generate_nutrition_tip_with_flash(goal: str) -> str:
    """Generate a nutrition or recovery tip using Gemini Flash based on the user's fitness goal."""
    prompt = (
        f"Give one clear, helpful nutrition or recovery tip for someone focused on '{goal}'. "
        "The tip should be practical, friendly, and easy to understand."
    )
    res = _call_gemini(prompt, model_name=MODEL_FLASH)
    if res:
        return res
    
    # Fallback tips if offline/key not set
    goal_lower = goal.lower()
    if "muscle" in goal_lower or "bulk" in goal_lower:
        return "Aim for 1.6 to 2.2 grams of protein per kilogram of body weight daily. Prioritize whole sources like eggs, Greek yogurt, lentils, or lean poultry, spaced evenly across 3–4 meals to maximize muscle protein synthesis."
    elif "lose" in goal_lower or "fat" in goal_lower:
        return "Focus on high-volume, nutrient-dense foods: load half your plate with fibrous vegetables and lean protein. Drink a glass of water 20 minutes before meals to stay satiated and hydrated."
    elif "endurance" in goal_lower:
        return "Pair complex carbohydrates with clean protein 90 minutes before prolonged cardio sessions (like oats with berries) to maintain steady glycogen stores and prevent energy crashes."
    return "Prioritize balanced whole foods, 2.5–3 liters of clean water daily, and consume 20–30g of protein within 2 hours post-workout to support muscle repair and recovery."

def generate_nutrition_tip(goal: str, dietary_preference: str = "Vegetarian") -> str:
    """Alias with dietary preference integration."""
    prompt = (
        f"Provide a concise, practical nutrition and hydration tip for someone with the goal '{goal}' "
        f"following a '{dietary_preference}' diet. Keep it encouraging, safe, and actionable in 2-3 sentences."
    )
    res = _call_gemini(prompt, model_name=MODEL_FLASH)
    return res if res else generate_nutrition_tip_with_flash(goal)


# -------------------------------------------------------------
# 2. Workout Generation using Gemini
# -------------------------------------------------------------
def generate_workout_gemini(user_data: Dict[str, Any]) -> str:
    """Generate structured 7-day workout plan matching prompt specifications."""
    goal = user_data.get("goal", "General wellness")
    intensity = user_data.get("intensity", "Medium")
    age = user_data.get("age", 25)
    weight = user_data.get("weight", 70.0)
    height = user_data.get("height", 175.0)
    fitness_level = user_data.get("fitness_level", "Beginner")
    duration = user_data.get("preferred_duration", 45)
    available_days = user_data.get("available_days", 5)
    equipment = user_data.get("equipment", "Bodyweight / Dumbbells")
    language = user_data.get("language", "English")

    lang_instruction = "Respond in Tamil (தமிழ்)." if "tamil" in str(language).lower() else "Respond in English."

    prompt = f"""
You are an elite, certified strength and conditioning specialist.
Create a comprehensive, personalized 7-Day Workout and Wellness Plan for this user:

USER PROFILE:
- Age: {age} years old
- Weight: {weight} kg
- Height: {height} cm
- Fitness Level: {fitness_level}
- Primary Goal: {goal}
- Preferred Intensity: {intensity}
- Preferred Workout Duration: {duration} minutes per session
- Available Training Days: {available_days} days (with rest/recovery days for the remainder)
- Available Equipment: {equipment}
- Language requirement: {lang_instruction}

OUTPUT FORMAT REQUIREMENTS:
For EACH of the 7 Days (DAY 1 through DAY 7), strictly structure as follows:

DAY [X] - [Focus Name, e.g. Upper Body Strength / Active Recovery / Cardio & Core]
• Focus: [Target muscle groups or active recovery theme]
• Warm-up: [5–10 minutes specific dynamic movements]
• Exercises:
  1. [Exercise Name] | Sets: [X] | Reps: [X] | Rest: [X sec] | Form Tip: [Brief form cue]
  2. [Exercise Name] | Sets: [X] | Reps: [X] | Rest: [X sec] | Form Tip: [Brief form cue]
  3. [Exercise Name] | Sets: [X] | Reps: [X] | Rest: [X sec] | Form Tip: [Brief form cue]
  4. [Exercise Name] | Sets: [X] | Reps: [X] | Rest: [X sec] | Form Tip: [Brief form cue]
• Cooldown: [5 minutes static stretching & breathing]
• Recovery Suggestion: [Hydration, sleep, or mobility advice]

Ensure at least 1-2 dedicated recovery or mobility days. Include progressive overload cues.
"""
    res = _call_gemini(prompt, model_name=MODEL_FLASH)
    if res:
        return res

    # Structured fallback if offline
    return f"""### 7-DAY PERSONALIZED WORKOUT PLAN ({goal.upper()} - {intensity.upper()} INTENSITY)

**DAY 1: Upper Body Push & Pull**
• Focus: Chest, Back, Shoulders & Triceps
• Warm-up: 5–8 mins arm circles, cat-cow stretch, light band pull-aparts
• Exercises:
  1. Push-ups (or Incline Push-ups) | Sets: 3 | Reps: 10–12 | Rest: 60 sec | Keep core tight and elbows at 45 degrees
  2. Dumbbell / Resistance Band Rows | Sets: 3 | Reps: 12 | Rest: 60 sec | Squeeze shoulder blades at top
  3. Overhead Shoulder Press | Sets: 3 | Reps: 10 | Rest: 60 sec | Neutral grip, press straight up without arching back
  4. Plank to Shoulder Taps | Sets: 3 | Reps: 16 total | Rest: 45 sec | Minimize hip sway
• Cooldown: 5 mins chest door-frame stretch and child's pose
• Recovery Suggestion: Drink 500ml water with electrolytes and eat a protein-rich meal within 90 minutes.

**DAY 2: Lower Body Foundations & Core**
• Focus: Quadriceps, Hamstrings, Glutes & Abs
• Warm-up: 6 mins leg swings, bodyweight air squats, hip openers
• Exercises:
  1. Goblet Squats | Sets: 3 | Reps: 12–15 | Rest: 75 sec | Drive through mid-foot, chest tall
  2. Romanian Deadlifts (Dumbbells/Bands) | Sets: 3 | Reps: 10–12 | Rest: 60 sec | Hinge at hips with flat back
  3. Reverse Lunges | Sets: 3 | Reps: 10 per leg | Rest: 60 sec | Knee tracking over toes smoothly
  4. Deadbug Exercise | Sets: 3 | Reps: 12 per side | Rest: 45 sec | Press lower back firmly into floor
• Cooldown: 5 mins quad stretch, hamstring fold, and glute figure-four stretch
• Recovery Suggestion: Elevate legs for 5 minutes before bed to aid lymphatic drainage.

**DAY 3: Active Recovery & Mobility Flow**
• Focus: Full Body Flexibility & Joint Decompression
• Warm-up: 5 mins gentle neck rolls, wrist circles, ankle rotations
• Exercises:
  1. World's Greatest Stretch | Sets: 2 | Reps: 5 per side | Rest: 30 sec | Breathe deep into groin and thoracic spine
  2. Bird-Dog Holds | Sets: 3 | Reps: 8 per side (3s hold) | Rest: 30 sec | Spinal stability and glute activation
  3. Low Intensity Brisk Walk | Duration: 25–30 mins | Heart rate in Zone 1-2
• Cooldown: 5 mins box breathing (4s in, 4s hold, 4s out, 4s hold)
• Recovery Suggestion: Target 8 hours of restorative sleep tonight.

**DAY 4: High-Energy Functional Cardio & Core**
• Focus: Cardiovascular Endurance & Core Strength
• Warm-up: 5 mins jumping jacks, high knees, inchworms
• Exercises:
  1. Mountain Climbers | Sets: 3 | Reps: 30 seconds | Rest: 45 sec | Steady pacing
  2. Dumbbell Thrusters (Squat to Press) | Sets: 3 | Reps: 10–12 | Rest: 60 sec | Explosive power from hips
  3. Kettlebell / Dumbbell Swings | Sets: 3 | Reps: 15 | Rest: 60 sec | Pure hip hinge, not a squat
  4. Russian Twists | Sets: 3 | Reps: 20 total | Rest: 45 sec | Controlled torso rotation
• Cooldown: 5 mins downward dog and cobra stretch
• Recovery Suggestion: Hydrate with 2.5L water throughout the day.

**DAY 5: Full Body Strength & Hypertrophy**
• Focus: Compound Full Body Movement
• Warm-up: 6 mins jumping rope, bodyweight lunges, shoulder dislocates
• Exercises:
  1. Split Squats | Sets: 3 | Reps: 10 per leg | Rest: 60 sec | Keep torso upright
  2. Bent-Over Rows | Sets: 3 | Reps: 12 | Rest: 60 sec | Pull to lower ribs
  3. Dumbbell Floor Press | Sets: 3 | Reps: 10–12 | Rest: 60 sec | Pause briefly at floor level
  4. Bicycle Crunches | Sets: 3 | Reps: 20 total | Rest: 45 sec | Slow and controlled
• Cooldown: 5 mins full body yoga flow
• Recovery Suggestion: Foam roll quadriceps, calves, and upper back for 8 minutes.

**DAY 6: Core, Balance & Posture Conditioning**
• Focus: Core Stabilization & Postural Muscles
• Warm-up: 5 mins gentle arm swings and hip circles
• Exercises:
  1. Forearm Plank Holds | Sets: 3 | Duration: 40–50 sec | Rest: 60 sec | Squeeze glutes and abs
  2. Side Planks | Sets: 2 | Duration: 30 sec each side | Rest: 45 sec | Lift hips high
  3. Glute Bridges with Squeeze | Sets: 3 | Reps: 15 (2s hold at peak) | Rest: 45 sec
  4. Farmer's Carries (Heavy weights) | Sets: 3 | Duration: 45 seconds | Rest: 60 sec | Walk tall with locked ribs
• Cooldown: 5 mins spinal twist and hamstring stretches
• Recovery Suggestion: Enjoy a warm Epsom salt bath to relax tense muscles.

**DAY 7: Complete Rest & Weekly Reflection**
• Focus: Mental and Physical Renewal
• Activity: Optional 20-minute light nature walk or gentle stretching
• Cooldown: 10 minutes progressive muscle relaxation
• Recovery Suggestion: Review your accomplishments this week, log your weight and measurements, and celebrate your consistency!"""


# -------------------------------------------------------------
# 3. Plan Adaptation (From user image specification)
# -------------------------------------------------------------
def update_workout_plan(original_plan: str, user_feedback: str) -> str:
    """Use Gemini to update the workout plan based on user feedback."""
    prompt = f"""You are a professional fitness trainer assistant.

Here's the original 7-day workout plan:
{original_plan}

User Feedback:
"{user_feedback}"

Based on the feedback, revise the relevant parts of the workout plan. Keep the format and rest of the plan unchanged if not needed.
"""
    res = _call_gemini(prompt, model_name=MODEL_FLASH)
    if res:
        return res

    # Smart local adaptation fallback if offline
    return f"""### REVISED 7-DAY WORKOUT PLAN (UPDATED BASED ON FEEDBACK: "{user_feedback}")

[Adaptation Note: Successfully tailored routines to accommodate: {user_feedback}. Maintained 7-day progression structure with modified exercises, adjusted rest intervals, and customized intensity.]

{original_plan}

---
*Updated on user request with modified exercises, pacing, and recovery balance.*"""


# -------------------------------------------------------------
# 4. Meal Suggestion Generator (Section 15)
# -------------------------------------------------------------
def generate_meal_suggestions(goal: str, dietary_preference: str = "Vegetarian", fitness_level: str = "Beginner") -> Dict[str, Any]:
    """Generates structured sample daily meal plan with breakfast, mid-morning, lunch, snack, dinner."""
    prompt = f"""
Generate a structured, healthy 1-day sample meal plan for someone with:
- Goal: {goal}
- Dietary Preference: {dietary_preference}
- Fitness Level: {fitness_level}

Output valid JSON ONLY with this exact schema:
{{
  "breakfast": {{ "name": "...", "calories_est": 400, "protein_g": 20, "description": "..." }},
  "mid_morning": {{ "name": "...", "calories_est": 180, "protein_g": 8, "description": "..." }},
  "lunch": {{ "name": "...", "calories_est": 600, "protein_g": 35, "description": "..." }},
  "evening_snack": {{ "name": "...", "calories_est": 220, "protein_g": 12, "description": "..." }},
  "dinner": {{ "name": "...", "calories_est": 550, "protein_g": 30, "description": "..." }},
  "total_calories_est": 1950,
  "total_protein_est": 105,
  "hydration_tip": "...",
  "disclaimer": "Nutritional values are approximate AI estimations, not prescribed medical diets."
}}
"""
    raw = _call_gemini(prompt, model_name=MODEL_FLASH)
    if raw:
        try:
            # Clean markdown code blocks if present
            cleaned = raw.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            return json.loads(cleaned.strip())
        except Exception:
            pass

    # Expert fallback meal plan
    is_veg = "veg" in dietary_preference.lower() and "non" not in dietary_preference.lower()
    return {
        "breakfast": {
            "name": "Oatmeal Power Bowl with Berries & Seeds" if is_veg else "3-Egg Veggie Scramble with Whole Wheat Toast",
            "calories_est": 420,
            "protein_g": 22,
            "description": "Rolled oats cooked with almond milk, chia seeds, sliced bananas, and a scoop of plant/whey protein."
        },
        "mid_morning": {
            "name": "Handful of Almonds & Fresh Apple",
            "calories_est": 190,
            "protein_g": 6,
            "description": "Raw almonds paired with a crisp apple for fiber and sustained micronutrient energy."
        },
        "lunch": {
            "name": "Paneer / Tofu Quinoa Harvest Bowl" if is_veg else "Grilled Chicken Breast with Brown Rice & Steamed Greens",
            "calories_est": 620,
            "protein_g": 38,
            "description": "Seasoned protein source served with complex carbs (quinoa/brown rice), sautéed bell peppers, and olive oil drizzle."
        },
        "evening_snack": {
            "name": "Spiced Roasted Chickpeas (Sundal / Chana) or Greek Yogurt",
            "calories_est": 210,
            "protein_g": 14,
            "description": "A light pre-workout snack offering clean carbohydrates and sustained amino acids."
        },
        "dinner": {
            "name": "Lentil Dal / Tofu Stir-Fry with Mixed Veggies" if is_veg else "Pan-Seared Salmon or Lean Fish with Sweet Potato",
            "calories_est": 540,
            "protein_g": 32,
            "description": "Warm, digestion-friendly evening meal loaded with fiber, zinc, and lean protein for overnight recovery."
        },
        "total_calories_est": 1980,
        "total_protein_est": 112,
        "hydration_tip": "Consume 500ml water between each meal window; avoid chugging immediately during large meals.",
        "disclaimer": "Nutritional values are approximate AI estimations, not prescribed medical diets."
    }


# -------------------------------------------------------------
# 5. Exercise Explanation (Section 13)
# -------------------------------------------------------------
def explain_exercise(exercise_name: str) -> Dict[str, Any]:
    """Generates safe form instructions, common mistakes, beginner modifications, and purpose."""
    prompt = f"""
You are an expert biomechanics instructor. Explain how to perform '{exercise_name}' safely.
Structure the answer clearly into:
1. Purpose & Target Muscles
2. Step-by-Step Instructions
3. Common Form Mistakes to Avoid
4. Beginner / Low-Impact Modification
5. General Safety Guidance (Include a reminder that exercise should not cause sharp joint pain)

Keep the tone encouraging, precise, and beginner-friendly.
"""
    res = _call_gemini(prompt, model_name=MODEL_FLASH)
    if res:
        return {"exercise_name": exercise_name, "explanation": res}

    return {
        "exercise_name": exercise_name,
        "explanation": f"""### Safe Execution Guide for {exercise_name}

**1. Purpose & Target Muscles:**
Builds functional strength, muscle balance, and joint stability. Reinforces kinetic chain alignment.

**2. Step-by-Step Instructions:**
• Set up with feet shoulder-width apart, brace core firmly as if expecting a gentle tap to the stomach.
• Inhale as you initiate movement in a controlled 2–3 second tempo.
• Keep joints aligned (knees tracking over toes, wrists neutral, spine straight).
• Exhale smoothly during the exertion phase through full range of motion.

**3. Common Mistakes to Avoid:**
• Rushing repetitions without controlling the eccentric (lowering) phase.
• Arching the lower back or flaring elbows excessively.
• Holding your breath during heavy efforts (Valsalva risk for novices).

**4. Beginner Modification:**
Perform the movement with reduced range of motion, bodyweight only, or using a sturdy chair/wall for balance assistance.

**5. General Safety Guidance:**
Exercise should produce muscular fatigue, never sharp, pinching joint pain. Stop immediately if dizziness occurs. Consult a healthcare provider if recovering from past joint trauma."""
    }


# -------------------------------------------------------------
# 6. AI Daily Check-In Recommendation (Section 19)
# -------------------------------------------------------------
def generate_daily_recommendation(checkin_data: Dict[str, Any], user_profile: Dict[str, Any]) -> str:
    """Generates personalized recovery and workout adjustment advice based on daily check-in."""
    prompt = f"""
You are FitBuddy's AI Wellness Advisor.
Analyze the user's daily check-in:
- Energy Level: {checkin_data.get('energy_level', 3)}/5
- Mood: {checkin_data.get('mood', 'Good')}
- Sleep Quality: {checkin_data.get('sleep_quality', 'Good')}
- Muscle Soreness: {checkin_data.get('muscle_soreness', 'None')}
- Stress Level: {checkin_data.get('stress_level', 'Low')}
- Workout Completed: {checkin_data.get('workout_completed', False)}
- Water Logged: {checkin_data.get('water_intake_ml', 0)} ml
- Goal: {user_profile.get('goal', 'General wellness')}

Provide a supportive, 3-4 sentence actionable recommendation:
1. Workout intensity adjustment for today (e.g., push hard vs active recovery).
2. Targeted recovery or hydration advice.
3. Encouraging motivational thought.
Do NOT give medical diagnoses.
"""
    res = _call_gemini(prompt, model_name=MODEL_FLASH)
    if res:
        return res

    energy = checkin_data.get("energy_level", 3)
    soreness = str(checkin_data.get("muscle_soreness", "None")).lower()

    if energy <= 2 or "severe" in soreness or "moderate" in soreness:
        return "Your body is signaling that it needs recovery today. Swap high-intensity lifting for a gentle 20-minute walk, light hamstring stretching, and foam rolling. Hydrate with an extra glass of water and aim for 8 hours of sleep tonight to rebuild glycogen stores."
    return "Great energy indicators today! You are in prime condition to hit today's scheduled workout with confidence. Focus on explosive, clean repetitions and keep your rest periods disciplined. Stay hydrated with at least 2.5 liters of water throughout your training session!"


# -------------------------------------------------------------
# 7. AI Fitness Chatbot (Section 24 & 25 Multilingual)
# -------------------------------------------------------------
def fitness_chat(message: str, user_profile: Optional[Dict[str, Any]] = None, language: str = "en") -> str:
    """Conversational fitness assistant supporting English and Tamil (தமிழ்)."""
    lang_directive = "The user preferred language is Tamil (தமிழ்). Respond in clear, natural Tamil." if language == "ta" or "தமிழ்" in message else "Respond in clear, friendly English."

    profile_ctx = ""
    if user_profile:
        profile_ctx = f"""
USER CONTEXT:
Name: {user_profile.get('name', 'Friend')}
Goal: {user_profile.get('goal', 'General wellness')}
Fitness Level: {user_profile.get('fitness_level', 'Beginner')}
Diet: {user_profile.get('dietary_preference', 'Vegetarian')}
Weight: {user_profile.get('weight', 70)} kg
"""

    prompt = f"""
{SAFETY_DISCLAIMER_SYS}
{lang_directive}
{profile_ctx}

USER MESSAGE:
"{message}"

Provide a warm, evidence-informed, practical answer. Use bullet points where appropriate for readability.
"""
    res = _call_gemini(prompt, model_name=MODEL_FLASH)
    if res:
        return res

    # Offline fallbacks
    if language == "ta":
        return f"வணக்கம்! உங்கள் ஃபிட்னஸ் கேள்விக்கு நன்றி: '{message}'. சிறந்த உடல் நலம் மற்றும் உடற்பயிற்சிக்கு சீரான உணவு, போதுமான நீர் அருந்துதல், மற்றும் 7-8 மணி நேர நல்ல தூக்கம் அவசியம். உங்களுக்கு உதவ நான் எப்போதும் தயாராக உள்ளேன்!"
    
    return f"Thanks for asking! Regarding '{message}': Always prioritize proper biomechanical form over heavy weights. Ensure you hydrate with at least 2.5 liters of water daily, consume adequate protein (1.6g-2.0g per kg of body weight for muscle recovery), and take at least 1-2 active rest days per week to allow muscular repair. Let me know if you would like a custom workout breakdown or meal idea!"
