"""
schemas.py
----------
Pydantic models for request validation and response serialization.
FastAPI uses these to auto-validate incoming JSON and generate docs.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------

class VoteRequest(BaseModel):
    """
    Payload sent by the frontend when the user submits their vote.
    - items: list of product IDs the user selected
    - fruitSuggestion: free-text fruit suggestion (optional)
    - vegetableSuggestion: free-text vegetable suggestion (optional)
    - greenSuggestion: free-text greens / keerai suggestion (optional)
    """
    items: list[int] = Field(default_factory=list)
    fruitSuggestion: Optional[str] = None
    vegetableSuggestion: Optional[str] = None
    greenSuggestion: Optional[str] = None


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

class ProductOut(BaseModel):
    """Represents a single product row returned from the database."""
    id: int
    name: str
    category: str
    image: Optional[str] = None
    votes: int

    class Config:
        from_attributes = True


class SuggestionOut(BaseModel):
    """Represents a single suggestion row returned from the database."""
    id: int
    category: str
    suggestion: str
    created_at: datetime

    class Config:
        from_attributes = True


class VoteResponse(BaseModel):
    """Response returned after a successful vote submission."""
    success: bool
    message: str
    votes_recorded: int
    suggestions_recorded: int
