"""User profile management routes."""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserUpdate, UserResponse

router = APIRouter(prefix="/api", tags=["Users"])

def get_current_user_optional(request: Request, db: Session = Depends(get_db)) -> User:
    """Helper to get user from session cookie or default to first demo user."""
    cookie_id = request.cookies.get("fitbuddy_user_id")
    if cookie_id and cookie_id.isdigit():
        user = db.query(User).filter_by(id=int(cookie_id)).first()
        if user:
            return user
    user = db.query(User).first()
    if not user:
        # Create a default user if none exists
        user = User(
            id=10,
            name="xyz",
            username="fitness_pro",
            email="user@example.com",
            age=20,
            weight=70.0,
            height=175.0,
            goal="i want to lose belly fat and gain muscles",
            intensity="High",
            fitness_level="Intermediate"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.get("/profile", response_model=UserResponse)
def get_user_profile(user: User = Depends(get_current_user_optional)):
    """Retrieve authenticated user's current profile."""
    return user

@router.put("/profile", response_model=UserResponse)
def update_user_profile(data: UserUpdate, user: User = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    """Update profile metrics, goals, and workout preferences."""
    for field, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user
