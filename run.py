"""FitBuddy local server runner."""
import uvicorn
from app.config import settings

if __name__ == "__main__":
    print(f"Starting FitBuddy AI Platform on http://{settings.HOST}:{settings.PORT}")
    print(f"API Docs available at http://{settings.HOST}:{settings.PORT}/docs")
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
