"""
main.py
-------
FastAPI application entry point for PickNPack.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from app.config import APP_TITLE, APP_VERSION, ALLOWED_ORIGINS
from app.database import init_db
from app.routes import router
from app.admin_routes import router as admin_router

IS_PROD = os.getenv("ENV", "development") == "production"

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title=APP_TITLE,
    version=APP_VERSION,
    description="Backend API for the PickNPack community voting app.",
    lifespan=lifespan,
    # Disable interactive docs in production
    docs_url=None if IS_PROD else "/docs",
    redoc_url=None if IS_PROD else "/redoc",
    openapi_url=None if IS_PROD else "/openapi.json",
)


# ---------------------------------------------------------------------------
# CORS — allow the React frontend running on Vite dev server
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Register routes under /api prefix
# ---------------------------------------------------------------------------

app.include_router(router, prefix="/api")

# Admin routes — all protected by JWT except /api/admin/login
app.include_router(admin_router, prefix="/api")


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return {"status": "ok", "app": APP_TITLE, "version": APP_VERSION}
