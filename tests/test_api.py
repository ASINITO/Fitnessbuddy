"""FastAPI endpoint testing with mocked Gemini services."""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_bmi_api():
    response = client.get("/api/bmi?height=180&weight=75")
    assert response.status_code == 200
    data = response.json()
    assert data["bmi"] == 23.1
    assert data["category"] == "Normal weight"

def test_nutrition_tip_endpoint():
    # Exact endpoint #2 from screenshot
    response = client.get("/nutrition-tip?goal=muscle%20gain")
    assert response.status_code == 200
    data = response.json()
    assert data["goal"] == "muscle gain"
    assert "nutrition_tip" in data
