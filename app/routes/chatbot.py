"""AI Fitness Chatbot and Exercise Library routes with multilingual support."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ChatMessage, Exercise, User
from app.schemas import ChatRequest
from app.services.gemini_service import fitness_chat, explain_exercise

router = APIRouter(prefix="/api", tags=["Chatbot & Exercise Library"])

@router.post("/chat")
def chat_with_fitbuddy(data: ChatRequest, user_id: int = 10, db: Session = Depends(get_db)):
    """Conversational endpoint for fitness inquiries with Tamil/English support."""
    user = db.query(User).filter_by(id=user_id).first()
    profile_dict = {
        "name": user.name if user else "Friend",
        "goal": user.goal if user else "General wellness",
        "fitness_level": user.fitness_level if user else "Beginner",
        "dietary_preference": user.dietary_preference if user else "Vegetarian",
        "weight": user.weight if user else 70.0
    }

    # Store user message
    user_msg = ChatMessage(user_id=user_id, sender="user", message=data.message, language=data.language or "en")
    db.add(user_msg)

    # Generate reply
    ai_text = fitness_chat(data.message, profile_dict, language=data.language or "en")

    # Store AI response
    ai_msg = ChatMessage(user_id=user_id, sender="ai", message=ai_text, language=data.language or "en")
    db.add(ai_msg)
    db.commit()

    return {
        "reply": ai_text,
        "language": data.language,
        "disclaimer": "General fitness guidance only. Consult a doctor for any medical symptoms."
    }

@router.get("/exercises")
def get_exercises(
    muscle_group: Optional[str] = None,
    difficulty: Optional[str] = None,
    equipment: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Searches and filters exercises in the library."""
    query = db.query(Exercise)
    if muscle_group and muscle_group.lower() != "all":
        query = query.filter(Exercise.muscle_group.ilike(f"%{muscle_group}%"))
    if difficulty and difficulty.lower() != "all":
        query = query.filter(Exercise.difficulty.ilike(f"%{difficulty}%"))
    if equipment and equipment.lower() != "all":
        query = query.filter(Exercise.equipment.ilike(f"%{equipment}%"))
    if search:
        query = query.filter(Exercise.name.ilike(f"%{search}%") | Exercise.description.ilike(f"%{search}%"))

    exercises = query.all()
    return exercises

@router.get("/exercises/{exercise_id}")
def get_exercise_details(exercise_id: int, db: Session = Depends(get_db)):
    """Fetch single exercise details."""
    ex = db.query(Exercise).filter_by(id=exercise_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return ex

@router.get("/exercises/{exercise_id}/explain")
def get_exercise_explanation(exercise_id: int, db: Session = Depends(get_db)):
    """Requests Gemini to explain how to perform this exercise safely."""
    ex = db.query(Exercise).filter_by(id=exercise_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return explain_exercise(ex.name)
