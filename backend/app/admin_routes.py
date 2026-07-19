"""
admin_routes.py
---------------
Admin-only API routes for PickNPack.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel

from app.config import ADMIN_PASSWORD
from app.auth import create_access_token, verify_token
from app.database import get_connection
from app.schemas import ProductOut, SuggestionOut

router = APIRouter(prefix="/admin", tags=["Admin"])


# ---------------------------------------------------------------------------
# Request / Response schemas specific to admin
# ---------------------------------------------------------------------------

class LoginRequest(BaseModel):
    """Body expected by POST /admin/login."""
    password: str


class TokenResponse(BaseModel):
    """Response returned on successful login."""
    access_token: str
    token_type: str = "bearer"


# ---------------------------------------------------------------------------
# POST /admin/login
# Compares supplied password with ADMIN_PASSWORD from .env.
# Returns a signed JWT on success.
# ---------------------------------------------------------------------------

@router.post("/login", response_model=TokenResponse)
def admin_login(body: LoginRequest):
    """
    Authenticates the admin user.
    - Compares the supplied password directly against ADMIN_PASSWORD env var.
    - Returns a JWT valid for 24 hours on success.
    - Returns HTTP 401 on failure.
    """
    # Constant-time comparison to prevent timing attacks
    import hmac
    password_correct = hmac.compare_digest(body.password, ADMIN_PASSWORD)

    if not password_correct:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(subject="admin")
    return TokenResponse(access_token=token)


# ---------------------------------------------------------------------------
# GET /admin/results
# Returns all products sorted by vote count descending.
# Requires valid JWT.
# ---------------------------------------------------------------------------

@router.get("/results", response_model=list[ProductOut])
def admin_results(_: str = Depends(verify_token)):
    """
    Protected endpoint.
    Returns all products with their vote counts, sorted highest first.
    """
    sql = """
        SELECT id, name, category, image, votes
        FROM products
        ORDER BY votes DESC, name ASC;
    """
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()
    return rows


# ---------------------------------------------------------------------------
# GET /admin/suggestions
# Returns all user suggestions ordered by newest first.
# Requires valid JWT.
# ---------------------------------------------------------------------------

@router.get("/suggestions", response_model=list[SuggestionOut])
def admin_suggestions(_: str = Depends(verify_token)):
    """
    Protected endpoint.
    Returns all suggestions submitted by users, newest first.
    """
    sql = """
        SELECT id, category, suggestion, created_at
        FROM suggestions
        ORDER BY created_at DESC;
    """
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()
    return rows
