"""Main FastAPI application for FitBuddy AI Fitness & Wellness Platform."""
import logging
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routes import auth, users, workout, nutrition, progress, chatbot, admin

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("fitbuddy")

# Ensure all database tables exist on startup
Base.metadata.create_all(bind=engine)
logger.info("Database initialized and schema migrated successfully.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description=settings.DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static and Templates configuration
BASE_PATH = Path(__file__).resolve().parent.parent
static_dir = BASE_PATH / "static"
static_dir.mkdir(parents=True, exist_ok=True)
templates_dir = BASE_PATH / "templates"
templates_dir.mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")
templates = Jinja2Templates(directory=str(templates_dir))

# Include Routers
app.include_router(workout.router)
app.include_router(nutrition.router)
app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(progress.router)
app.include_router(chatbot.router)


@app.get("/", response_class=HTMLResponse)
def index_page(request: Request):
    """Renders the main input form page as demonstrated in the system flow diagram."""
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/login", response_class=HTMLResponse)
def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.get("/register", response_class=HTMLResponse)
def register_page(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})


@app.get("/dashboard", response_class=HTMLResponse)
def dashboard_page(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})


@app.get("/workout", response_class=HTMLResponse)
def workout_page(request: Request):
    return templates.TemplateResponse("workout.html", {"request": request})


@app.get("/workout/history", response_class=HTMLResponse)
def workout_history_page(request: Request):
    return templates.TemplateResponse("workout_history.html", {"request": request})


@app.get("/nutrition", response_class=HTMLResponse)
def nutrition_page(request: Request):
    return templates.TemplateResponse("nutrition.html", {"request": request})


@app.get("/progress", response_class=HTMLResponse)
def progress_page(request: Request):
    return templates.TemplateResponse("progress.html", {"request": request})


@app.get("/chatbot", response_class=HTMLResponse)
def chatbot_page(request: Request):
    return templates.TemplateResponse("chatbot.html", {"request": request})


@app.get("/achievements", response_class=HTMLResponse)
def achievements_page(request: Request):
    return templates.TemplateResponse("achievements.html", {"request": request})


@app.get("/settings", response_class=HTMLResponse)
def settings_page(request: Request):
    return templates.TemplateResponse("settings.html", {"request": request})


@app.get("/health")
def health_check():
    """Health check endpoint for container probes."""
    return {
        "status": "healthy",
        "service": "FitBuddy AI Platform",
        "version": settings.PROJECT_VERSION
    }
