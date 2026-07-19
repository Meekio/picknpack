"""
auth.py
-------
JWT creation and verification utilities for the PickNPack admin system.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.config import JWT_SECRET_KEY, JWT_ALGORITHM, JWT_EXPIRE_HOURS

# ---------------------------------------------------------------------------
# Bearer token extractor
# FastAPI will pull the Authorization: Bearer <token> header automatically.
# ---------------------------------------------------------------------------
bearer_scheme = HTTPBearer()


def create_access_token(subject: str = "admin") -> str:
    """
    Creates a signed JWT token.
    - subject: identifies who the token is for (always "admin" here)
    - expires: JWT_EXPIRE_HOURS from now (default 24h)
    """
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS)
    payload = {
        "sub": subject,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> str:
    """
    FastAPI dependency — verifies the Bearer token on protected routes.
    Raises HTTP 401 if the token is missing, invalid, or expired.
    Returns the subject claim ("admin") on success.
    """
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        subject: Optional[str] = payload.get("sub")
        if subject is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    return subject
