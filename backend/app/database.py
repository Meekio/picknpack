"""
database.py
-----------
Provides reusable PostgreSQL connection helpers using psycopg (v3).
All queries use parameterized SQL — no string interpolation.
No ORM. No SQLAlchemy.
"""

import psycopg
from psycopg.rows import dict_row
from app.config import DATABASE_URL


def get_connection() -> psycopg.Connection:
    """
    Opens and returns a new psycopg connection.
    Uses dict_row so query results come back as dicts instead of tuples.
    Caller is responsible for closing the connection (use as context manager).
    """
    if not DATABASE_URL:
        raise RuntimeError(
            "DATABASE_URL is not set. Check your .env file."
        )
    return psycopg.connect(DATABASE_URL, row_factory=dict_row)


def init_db() -> None:
    """
    Creates the required tables if they don't already exist.
    Called once on application startup.
    """
    create_products = """
        CREATE TABLE IF NOT EXISTS products (
            id      SERIAL PRIMARY KEY,
            name    VARCHAR(100) NOT NULL,
            category VARCHAR(30) NOT NULL,
            image   TEXT,
            votes   INTEGER DEFAULT 0
        );
    """

    create_suggestions = """
        CREATE TABLE IF NOT EXISTS suggestions (
            id          SERIAL PRIMARY KEY,
            category    VARCHAR(30) NOT NULL,
            suggestion  TEXT NOT NULL,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(create_products)
            cur.execute(create_suggestions)
        conn.commit()
