"""Tests for BMI and calorie calculations."""
import pytest
from app.utils.validators import calculate_bmi, estimate_calories

def test_bmi_calculation():
    # 70kg, 175cm -> BMI = 70 / (1.75^2) = 22.857... -> 22.9
    res = calculate_bmi(175.0, 70.0)
    assert res["bmi"] == 22.9
    assert res["category"] == "Normal weight"
    assert "disclaimer" in res

def test_bmi_invalid_input():
    res = calculate_bmi(-10, 70)
    assert "error" in res

def test_calorie_estimation_mifflin():
    res = estimate_calories(70, 175, 25, "Male", "Medium", "General wellness")
    assert res["bmr"] > 1000
    assert res["tdee"] > res["bmr"]
    assert "disclaimer" in res
