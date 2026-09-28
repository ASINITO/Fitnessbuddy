"""Authentication routes handling registration, login, logout, and session state."""
from fastapi import APIRouter, Depends, HTTPException, Request, Response, Form, status
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserRegister, UserLogin
from app.utils.security import hash_password, verify_password

router = APIRouter(tags=["Authentication"])

@router.post("/api/register")
def api_register(data: UserRegister, db: Session = Depends(get_db)):
    """Registers a new user in database with password hashing."""
    if db.query(User).filter_by(username=data.username).first():
        raise HTTPException(status_code=400, detail="Username already registered.")
    if db.query(User).filter_by(email=data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered.")

    new_user = User(
        name=data.name,
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
        age=data.age,
        gender=data.gender,
        height=data.height,
        weight=data.weight,
        fitness_level=data.fitness_level,
        goal=data.goal,
        intensity=data.intensity,
        preferred_duration=data.preferred_duration,
        available_days=data.available_days,
        dietary_preference=data.dietary_preference,
        language=data.language
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.id, "username": new_user.username}

@router.post("/api/login")
def api_login(data: UserLogin, request: Request, response: Response, db: Session = Depends(get_db)):
    """Authenticates user and initiates session."""
    user = (
        db.query(User).filter(
            (User.username == data.username_or_email) | (User.email == data.username_or_email)
        ).first()
    )
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    # Set simple secure cookie
    response.set_cookie(key="fitbuddy_user_id", value=str(user.id), httponly=True, samesite="lax")
    return {
        "message": "Login successful",
        "user_id": user.id,
        "name": user.name,
        "username": user.username,
        "is_admin": user.is_admin
    }

@router.post("/api/logout")
def api_logout(response: Response):
    """Clears user session."""
    response.delete_cookie("fitbuddy_user_id")
    return {"message": "Logged out successfully"}
