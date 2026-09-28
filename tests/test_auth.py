"""Tests for authentication and password security."""
import pytest
from app.utils.security import hash_password, verify_password

def test_password_hashing_and_verification():
    raw_pass = "SecurePass123!"
    hashed = hash_password(raw_pass)
    assert hashed != raw_pass
    assert "$" in hashed
    assert verify_password(raw_pass, hashed) is True
    assert verify_password("WrongPassword", hashed) is False
