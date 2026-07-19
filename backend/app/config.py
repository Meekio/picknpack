"""
config.py
---------
Loads environment variables from .env file using python-dotenv.
All database credentials and app settings are managed here.
Never hardcode secrets — always read from .env.
"""

import os
from dotenv import load_dotenv

# Load variables from .env into the process environment
load_dotenv()

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
DATABASE_URL: str = os.getenv("DATABASE_URL", "")

# ---------------------------------------------------------------------------
# App settings
# ---------------------------------------------------------------------------
APP_TITLE: str = "PickNPack API"
APP_VERSION: str = "1.0.0"

# CORS — add your Vercel domain here once deployed
ALLOWED_ORIGINS: list[str] = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    os.getenv("VERCEL_DOMAIN", ""),   # e.g. https://picknpack.vercel.app
]
# Remove empty strings (in case VERCEL_DOMAIN is not set)
ALLOWED_ORIGINS = [o for o in ALLOWED_ORIGINS if o]

# ---------------------------------------------------------------------------
# Admin auth
# ---------------------------------------------------------------------------

# Plain-text admin password loaded from .env — never hardcoded
ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "")

# JWT settings
JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
JWT_ALGORITHM: str = "HS256"
JWT_EXPIRE_HOURS: int = 24

# Validate critical secrets on startup
if not ADMIN_PASSWORD:
    raise RuntimeError("ADMIN_PASSWORD is not set. Check your .env file.")

if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY is not set. Check your .env file.")
