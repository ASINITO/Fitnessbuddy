"""Security, password hashing, and session/token utilities."""
import os
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional

def hash_password(password: str) -> str:
    """Hashes a password with salt using PBKDF2 HMAC SHA256 (standard library)."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return f"{salt}${key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the stored salt$key hash."""
    try:
        if not hashed_password or '$' not in hashed_password:
            return False
        salt, key_hex = hashed_password.split('$', 1)
        expected_key = hashlib.pbkdf2_hmac(
            'sha256',
            plain_password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return secrets.compare_digest(expected_key.hex(), key_hex)
    except Exception:
        return False
