# FITBUDDY – AI-Powered Personalized Fitness, Nutrition & Wellness Platform

FitBuddy is an intelligent, full-stack fitness and wellness web application built with **Python 3.11+, FastAPI, SQLite, SQLAlchemy ORM, Google Gemini AI, and modern web interfaces**. It creates personalized 7-day workout plans, adapts them dynamically based on user feedback, delivers science-grounded nutrition guidance, tracks hydration, sleep, streaks, and milestones, and offers a bilingual AI coach in English and Tamil (தமிழ்).

---

## 🏛️ System Architecture

Based on the system flow diagram:
```
                ┌────────────────┐
                │ User (Browser) │
                └───────┬────────┘
                        │
                        ▼
            ┌────────────────────────┐
            │    FastAPI Backend     │
            │     (app/main.py)      │
            └───────────┬────────────┘
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
┌────────────────┐┌───────────┐┌──────────────┐
│HTML Templating ││  Workout  ││ Admin Panel  │
│  (Jinja2+CSS)  ││   Logic   ││/view-all-user│
│   index.html   ││ (routes)  ││all_users.html│
└────────────────┘└─────┬─────┘└──────────────┘
                        │
                        ▼
         ┌─────────────────────────────┐
         │ Gemini 3.8 Flash / Pro API  │
         │   (Google Generative AI)    │
         └──────────────┬──────────────┘
                        │
                        ▼
         ┌─────────────────────────────┐
         │  AI Plan/Nutrition Engine   │
         │      (gemini_service)       │
         └──────────────┬──────────────┘
                        │
                        ▼
         ┌─────────────────────────────┐
         │  SQLite + SQLAlchemy ORM    │
         │         (fitbuddy.db)       │
         │ ┌─────────────────────────┐ │
         │ │ User Table (users)      │ │
         │ │ WorkoutPlan Table(plans)│ │
         │ └─────────────────────────┘ │
         └─────────────────────────────┘
```

---

## 🚀 Key Features

1. **AI Workout Plan Generator (Gemini Flash & Pro)**
   - Synthesizes personalized 7-day routines structured by Focus, Warm-up, Exercises, Sets, Reps, Rest, and Recovery.
2. **AI Plan Adaptation with Feedback Memory**
   - Modifies plans on user feedback ("make it easier", "add cardio", "30-min cap") without deleting original plans.
3. **Exact User Flow & Result View**
   - User Information display with name, ID, age, weight, goal, and intensity.
   - Dedicated feedback form with unique user ID and update confirmation banner: `✅ Your plan has been updated based on your feedback!`.
4. **Admin Panel & All Users View**
   - Route `/view-all-users` rendering `all_users.html` with tabular breakdown of user stats, original plans, and updated plans.
5. **Nutrition & Meal Suggestion Generator**
   - Supports Vegetarian, Non-vegetarian, Vegan, and Eggetarian dietary protocols with macro breakdowns.
6. **Health Metrics & Formulas**
   - Scientific BMI calculation and classification.
   - Mifflin-St Jeor Total Daily Energy Expenditure (TDEE) and BMR estimation.
7. **Hydration, Sleep & Daily Check-Ins**
   - Visual progress bars for 2.5L daily water goal.
   - Daily wellness check-in (mood, soreness, energy) that triggers Gemini wellness advice.
8. **Gamified Achievement Badges & Streaks**
   - Automatic awards for streaks, hydration consistency, and completed workouts.
9. **Multilingual AI Fitness Chatbot**
   - Bilingual conversational support in **English** and **Tamil (தமிழ்)**.
10. **Interactive API Documentation**
    - Interactive Swagger docs at `/docs` and ReDoc at `/redoc`.

---

## 📁 Project Structure

```
fitbuddy/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI App Entry point & page routing
│   ├── config.py                # Environment configuration
│   ├── database.py              # SQLAlchemy engine & SessionLocal
│   ├── models.py                # SQLAlchemy DB models (User, WorkoutPlan, etc.)
│   ├── schemas.py               # Pydantic validation schemas
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py              # Registration, login, logout
│   │   ├── users.py             # Profile management
│   │   ├── workout.py           # Workout generation & plan adaptation
│   │   ├── nutrition.py         # Nutrition tip & meal generation
│   │   ├── progress.py          # BMI, Calories, Hydration, Sleep, Check-in
│   │   ├── chatbot.py           # AI Fitness Coach & Exercise library
│   │   └── admin.py             # Admin analytics & /view-all-users table
│   ├── services/
│   │   ├── gemini_service.py    # Centralized Gemini AI integration
│   │   ├── workout_service.py   # User and plan persistence logic
│   │   ├── nutrition_service.py # Meal plan generation and caching
│   │   ├── recommendation_service.py # Wellness check-in advisor
│   │   └── analytics_service.py # Admin platform reporting
│   └── utils/
│       ├── security.py          # PBKDF2 password hashing & verification
│       ├── validators.py        # BMI & Mifflin-St Jeor calculations
│       └── helpers.py           # Streaks & achievement milestones
├── templates/
│   ├── base.html                # Main responsive layout & navbar
│   ├── index.html               # Form page matching architecture diagram
│   ├── result.html              # Plan result page with feedback form
│   ├── all_users.html           # Admin table for all users & plans
│   ├── login.html               # User login
│   ├── register.html            # User registration
│   ├── dashboard.html           # Main fitness metrics dashboard
│   ├── workout.html             # 7-day program breakdown
│   ├── workout_history.html     # Past plan archives
│   ├── nutrition.html           # Meal plan assistant
│   ├── progress.html            # Health metrics & charts
│   ├── chatbot.html             # AI Coach in English & Tamil
│   ├── achievements.html        # Badges & streak showcase
│   ├── settings.html            # User settings & preferences
│   ├── admin_dashboard.html     # System analytics & Chart.js charts
│   ├── profile.html             # User profile editor
│   └── error.html               # Friendly error template
├── static/
│   ├── css/style.css            # Dark theme styles & glassmorphism
│   └── js/app.js                # Frontend scripting
├── tests/
│   ├── test_auth.py             # Auth & security tests
│   ├── test_workout.py          # Biometric & calculation tests
│   └── test_api.py              # FastAPI endpoints integration tests
├── .env.example
├── requirements.txt
├── run.py                       # Local Uvicorn runner
├── seed_database.py             # Sample database seeder
└── README.md
```

---

## 🛠️ Installation & Setup Instructions

### 1. Clone or Open the Repository
```bash
git clone https://github.com/your-username/fitbuddy.git
cd fitbuddy
```

### 2. Create and Activate Virtual Environment
```bash
python -m venv venv
```

- **Windows:**
  ```cmd
  venv\Scripts\activate
  ```
- **macOS / Linux:**
  ```bash
  source venv/bin/activate
  ```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` and insert your Gemini API Key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 5. Seed Initial Demo Data (Optional)
```bash
python seed_database.py
```

### 6. Run the Application
```bash
python run.py
```
Or directly with Uvicorn:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The application is now live at:
- **Web Application:** `http://127.0.0.1:8000`
- **Form Page:** `http://127.0.0.1:8000/`
- **Result Page:** Generated on form submission
- **Admin View All Users:** `http://127.0.0.1:8000/view-all-users`
- **FastAPI Interactive Docs:** `http://127.0.0.1:8000/docs`
- **ReDoc Documentation:** `http://127.0.0.1:8000/redoc`

---

## 🧪 Running Tests

Execute automated unit and integration tests using pytest:
```bash
pytest -v
```

---

## 📋 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/generate-workout/gemini` | Generates workout plan with Gemini Pro |
| `GET` | `/nutrition-tip` | Generates nutrition tip with Gemini Flash |
| `POST` | `/generate-plan` | Saves user and generates 7-day workout plan |
| `POST` | `/update-plan/{user_id}` | Updates workout plan with user feedback |
| `GET` | `/view-all-users` | Web page rendering table of all users & plans |
| `GET` | `/api/bmi` | Calculates BMI score & category |
| `GET` | `/api/calorie-estimate` | Mifflin-St Jeor TDEE & macro estimate |
| `POST` | `/api/chat` | AI Coach chat in English or Tamil |
| `POST` | `/api/water` | Logs hydration amount in ml |
| `POST` | `/api/sleep` | Logs sleep duration & quality |
| `POST` | `/api/workout/complete`| Marks workout completed & updates streak |
| `GET` | `/health` | Health probe |

---

## ⚠️ Health & Medical Disclaimer

FitBuddy is an automated wellness companion providing generalized physical fitness, training structure, and nutritional guidelines. FitBuddy **does not** diagnose medical conditions, prescribe clinical diets, or replace consultation with certified healthcare professionals, physical therapists, or dietitians. Always listen to your body and consult a physician prior to commencing any strenuous exercise program.
