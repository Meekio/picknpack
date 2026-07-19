"""
routes.py
---------
Public API route handlers for FreshPick.
Uses raw parameterized SQL queries only — no ORM.
"""

from fastapi import APIRouter, HTTPException, status
from app.database import get_connection
from app.schemas import VoteRequest, VoteResponse, ProductOut

router = APIRouter()


# ---------------------------------------------------------------------------
# GET /products
# Public — returns all products for the voting UI to display.
# ---------------------------------------------------------------------------

@router.get("/products", response_model=list[ProductOut])
def get_products():
    """Fetches all products ordered by category then name."""
    sql = "SELECT id, name, category, image, votes FROM products ORDER BY category, name;"
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()
    return rows


# ---------------------------------------------------------------------------
# POST /vote
# Public — validates IDs, increments votes, stores suggestions.
# Runs inside a single transaction.
# ---------------------------------------------------------------------------

@router.post("/vote", response_model=VoteResponse, status_code=status.HTTP_200_OK)
def submit_vote(payload: VoteRequest):
    """
    Processes a vote submission:
    1. Validates that all submitted product IDs exist.
    2. Increments the vote count for each product.
    3. Stores fruit / vegetable / green suggestions if provided.
    All steps run in a single transaction — rolls back on any error.
    """
    suggestions_recorded = 0

    with get_connection() as conn:
        try:
            with conn.cursor() as cur:

                # Step 1: Validate product IDs
                if payload.items:
                    cur.execute(
                        "SELECT id FROM products WHERE id = ANY(%s);",
                        (payload.items,)
                    )
                    found_ids = {row["id"] for row in cur.fetchall()}
                    invalid_ids = set(payload.items) - found_ids
                    if invalid_ids:
                        raise HTTPException(
                            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail=f"Invalid product IDs: {sorted(invalid_ids)}"
                        )

                # Step 2: Increment vote counts
                for product_id in payload.items:
                    cur.execute(
                        "UPDATE products SET votes = votes + 1 WHERE id = %s;",
                        (product_id,)
                    )

                # Step 3: Store suggestions
                for category, text in [
                    ("fruit",     payload.fruitSuggestion),
                    ("vegetable", payload.vegetableSuggestion),
                    ("green",     payload.greenSuggestion),
                ]:
                    if text and text.strip():
                        cur.execute(
                            "INSERT INTO suggestions (category, suggestion) VALUES (%s, %s);",
                            (category, text.strip())
                        )
                        suggestions_recorded += 1

            conn.commit()

        except HTTPException:
            conn.rollback()
            raise
        except Exception as e:
            conn.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Vote submission failed: {str(e)}"
            )

    return VoteResponse(
        success=True,
        message="Vote recorded successfully!",
        votes_recorded=len(payload.items),
        suggestions_recorded=suggestions_recorded,
    )
