"""
Authentication Router - OTP-based citizen login (OAuth2 / JWT)
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
import secrets, hashlib, jwt, os
from typing import Optional

router = APIRouter()

SECRET_KEY  = os.getenv("JWT_SECRET", "suvidha-cdac-secret-key-change-in-prod")
ALGORITHM   = "HS256"
OTP_TTL_MIN = 10

# In-memory OTP store (use Redis in production)
_otp_store: dict[str, dict] = {}


class OTPRequest(BaseModel):
    mobile: str = Field(..., min_length=10, max_length=10, pattern=r"^\d{10}$")

class OTPVerify(BaseModel):
    mobile: str = Field(..., min_length=10, max_length=10, pattern=r"^\d{10}$")
    otp:    str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")

class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    expires_in:   int = 3600
    citizen_id:   str
    name:         str


def _generate_otp(mobile: str) -> str:
    """Generate 6-digit OTP and store with TTL."""
    otp = str(secrets.randbelow(900000) + 100000)
    _otp_store[mobile] = {
        "otp":     hashlib.sha256(otp.encode()).hexdigest(),
        "expires": datetime.utcnow() + timedelta(minutes=OTP_TTL_MIN),
    }
    return otp  # Send via SMS gateway in production


def _create_token(payload: dict) -> str:
    payload["exp"] = datetime.utcnow() + timedelta(hours=1)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/send-otp", summary="Send OTP to citizen mobile")
async def send_otp(body: OTPRequest):
    otp = _generate_otp(body.mobile)
    # TODO: integrate SMS gateway (e.g. MSG91, Textlocal)
    # sms_service.send(body.mobile, f"Your SUVIDHA OTP is {otp}. Valid for {OTP_TTL_MIN} mins.")
    print(f"[DEV] OTP for {body.mobile}: {otp}")  # Remove in production
    return {"message": "OTP sent successfully", "ttl_minutes": OTP_TTL_MIN}


@router.post("/verify-otp", response_model=TokenResponse, summary="Verify OTP and issue JWT")
async def verify_otp(body: OTPVerify):
    record = _otp_store.get(body.mobile)
    if not record:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "OTP not requested or expired")

    if datetime.utcnow() > record["expires"]:
        del _otp_store[body.mobile]
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "OTP expired. Please request a new one.")

    expected = hashlib.sha256(body.otp.encode()).hexdigest()
    if record["otp"] != expected:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid OTP")

    del _otp_store[body.mobile]  # One-time use

    # Fetch or create citizen profile from DB (stub)
    citizen_id = f"CIT-{body.mobile[-4:]}-{secrets.token_hex(2).upper()}"
    token = _create_token({"sub": citizen_id, "mobile": body.mobile})

    return TokenResponse(access_token=token, citizen_id=citizen_id, name="Citizen")


@router.post("/logout", summary="Invalidate session")
async def logout():
    # In production: add JWT to denylist (Redis)
    return {"message": "Logged out successfully"}
