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

PRODUCTS_CATALOG = [
    {"id": 1, "name": "Apple", "category": "fruit", "image": "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=200&h=200&fit=crop&auto=format"},
    {"id": 2, "name": "Banana", "category": "fruit", "image": "https://images.pexels.com/photos/30873714/pexels-photo-30873714.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 3, "name": "Mango", "category": "fruit", "image": "https://images.unsplash.com/photo-1669207334420-66d0e3450283?w=200&h=200&fit=crop&auto=format"},
    {"id": 4, "name": "Orange", "category": "fruit", "image": "https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop&auto=format"},
    {"id": 5, "name": "Sweet Lime", "category": "fruit", "image": "https://plus.unsplash.com/premium_photo-1664391947940-d7ddacad129d?w=200&h=200&fit=crop&auto=format"},
    {"id": 6, "name": "Pomegranate", "category": "fruit", "image": "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=200&h=200&fit=crop&auto=format"},
    {"id": 7, "name": "Papaya", "category": "fruit", "image": "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=200&h=200&fit=crop&auto=format"},
    {"id": 8, "name": "Watermelon", "category": "fruit", "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop&auto=format"},
    {"id": 9, "name": "Pineapple", "category": "fruit", "image": "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200&h=200&fit=crop&auto=format"},
    {"id": 10, "name": "Guava", "category": "fruit", "image": "https://images.unsplash.com/photo-1706734745352-c1de3bdc78e0?w=200&h=200&fit=crop&auto=format"},
    {"id": 11, "name": "Green Grapes", "category": "fruit", "image": "https://images.unsplash.com/photo-1625499940894-8796928bf9c4?w=200&h=200&fit=crop&auto=format"},
    {"id": 12, "name": "Black Grapes", "category": "fruit", "image": "https://images.unsplash.com/photo-1601275868399-45bec4f4cd9d?w=200&h=200&fit=crop&auto=format"},
    {"id": 13, "name": "Sapota", "category": "fruit", "image": "https://images.pexels.com/photos/3942502/pexels-photo-3942502.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 15, "name": "Jackfruit", "category": "fruit", "image": "https://images.unsplash.com/photo-1651565919334-bf81165cd0a3?w=200&h=200&fit=crop&auto=format"},
    {"id": 16, "name": "Coconut", "category": "fruit", "image": "https://images.unsplash.com/photo-1660642670524-5ccd63ac1adf?w=200&h=200&fit=crop&auto=format"},
    {"id": 18, "name": "Strawberry", "category": "fruit", "image": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop&auto=format"},
    {"id": 19, "name": "Kiwi", "category": "fruit", "image": "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=200&h=200&fit=crop&auto=format"},
    {"id": 20, "name": "Dragon Fruit", "category": "fruit", "image": "https://images.unsplash.com/photo-1527325678964-54921661f888?w=200&h=200&fit=crop&auto=format"},
    {"id": 75, "name": "Muskmelon", "category": "fruit", "image": "https://images.pexels.com/photos/26950731/pexels-photo-26950731.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 77, "name": "Avocado", "category": "fruit", "image": "https://images.unsplash.com/photo-1671624749229-7d37826013b5?w=200&h=200&fit=crop&auto=format"},
    {"id": 21, "name": "Onion", "category": "vegetable", "image": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&h=200&fit=crop&auto=format"},
    {"id": 22, "name": "Tomato", "category": "vegetable", "image": "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=200&h=200&fit=crop&auto=format"},
    {"id": 23, "name": "Potato", "category": "vegetable", "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop&auto=format"},
    {"id": 24, "name": "Brinjal", "category": "vegetable", "image": "https://images.unsplash.com/photo-1605197378540-10ebaf6999e5?w=200&h=200&fit=crop&auto=format"},
    {"id": 25, "name": "Ladies Finger", "category": "vegetable", "image": "https://images.unsplash.com/photo-1664289242854-e99d345cfa92?w=200&h=200&fit=crop&auto=format"},
    {"id": 17, "name": "Lemon", "category": "fruit", "image": "https://images.pexels.com/photos/36094857/pexels-photo-36094857.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 26, "name": "Carrot", "category": "vegetable", "image": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&h=200&fit=crop&auto=format"},
    {"id": 27, "name": "Beetroot", "category": "vegetable", "image": "https://images.unsplash.com/photo-1667980970854-a74254e41521?w=200&h=200&fit=crop&auto=format"},
    {"id": 28, "name": "Radish", "category": "vegetable", "image": "https://images.pexels.com/photos/8827293/pexels-photo-8827293.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 29, "name": "Cabbage", "category": "vegetable", "image": "https://images.unsplash.com/photo-1652860213441-6622f9fec77f?w=200&h=200&fit=crop&auto=format"},
    {"id": 30, "name": "Cauliflower", "category": "vegetable", "image": "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=200&h=200&fit=crop&auto=format"},
    {"id": 31, "name": "Green Chilli", "category": "vegetable", "image": "https://images.unsplash.com/photo-1524593410820-38510f580a77?w=200&h=200&fit=crop&auto=format"},
    {"id": 32, "name": "Capsicum (Green, Red, Yellow)", "category": "vegetable", "image": "https://images.unsplash.com/photo-1592548868664-f8b4e4b1cfb7?w=200&h=200&fit=crop&auto=format"},
    {"id": 33, "name": "Garlic", "category": "vegetable", "image": "https://plus.unsplash.com/premium_photo-1666270423754-5b66a5184cc3?w=200&h=200&fit=crop&auto=format"},
    {"id": 34, "name": "Ginger", "category": "vegetable", "image": "https://images.pexels.com/photos/33930747/pexels-photo-33930747.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 35, "name": "Bottle Gourd", "category": "vegetable", "image": "https://images.pexels.com/photos/17050967/pexels-photo-17050967.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 36, "name": "Ridge Gourd", "category": "vegetable", "image": "https://images.pexels.com/photos/33778443/pexels-photo-33778443.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 38, "name": "Bitter Gourd", "category": "vegetable", "image": "https://images.unsplash.com/photo-1739903760973-4731a8e79a03?w=200&h=200&fit=crop&auto=format"},
    {"id": 39, "name": "Pumpkin", "category": "vegetable", "image": "https://images.unsplash.com/photo-1509622905150-fa66d3906e09?w=200&h=200&fit=crop&auto=format"},
    {"id": 40, "name": "Drumstick", "category": "vegetable", "image": "https://images.pexels.com/photos/20466259/pexels-photo-20466259.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 41, "name": "Raw Banana", "category": "vegetable", "image": "https://images.pexels.com/photos/34778810/pexels-photo-34778810.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 42, "name": "Sweet Potato", "category": "vegetable", "image": "https://images.pexels.com/photos/30893354/pexels-photo-30893354.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 43, "name": "Mushroom", "category": "vegetable", "image": "https://images.unsplash.com/photo-1552825898-07e419204683?w=200&h=200&fit=crop&auto=format"},
    {"id": 44, "name": "Corn", "category": "vegetable", "image": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200&h=200&fit=crop&auto=format"},
    {"id": 45, "name": "Cucumber", "category": "vegetable", "image": "https://images.pexels.com/photos/5006635/pexels-photo-5006635.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 47, "name": "Green Beans", "category": "vegetable", "image": "https://images.pexels.com/photos/30893268/pexels-photo-30893268.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 48, "name": "Double Beans", "category": "vegetable", "image": "https://images.pexels.com/photos/33211278/pexels-photo-33211278.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 49, "name": "Chayote Squash (Chow Chow)", "category": "vegetable", "image": "https://images.pexels.com/photos/36939001/pexels-photo-36939001.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 50, "name": "Ash Gourd (White Pumpkin)", "category": "vegetable", "image": "https://images.unsplash.com/photo-1695555801863-8b1a577d5124?w=200&h=200&fit=crop&auto=format"},
    {"id": 51, "name": "Banana Flower", "category": "vegetable", "image": "https://images.pexels.com/photos/11521850/pexels-photo-11521850.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 52, "name": "Green Mango", "category": "vegetable", "image": "https://images.unsplash.com/photo-1680008702821-e1b598db30f3?w=200&h=200&fit=crop&auto=format"},
    {"id": 53, "name": "Small Onion (Shallots)", "category": "vegetable", "image": "https://images.pexels.com/photos/12353768/pexels-photo-12353768.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 54, "name": "Spring Onion", "category": "vegetable", "image": "https://images.unsplash.com/photo-1602769515559-e15133a7e992?w=200&h=200&fit=crop&auto=format"},
    {"id": 55, "name": "Broccoli", "category": "vegetable", "image": "https://images.unsplash.com/photo-1614336215203-05a588f74627?w=200&h=200&fit=crop&auto=format"},
    {"id": 56, "name": "Baby Potato", "category": "vegetable", "image": "https://images.pexels.com/photos/33351055/pexels-photo-33351055.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 57, "name": "Banana Stem", "category": "vegetable", "image": "https://images.pexels.com/photos/28214204/pexels-photo-28214204.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 58, "name": "Taro Root", "category": "vegetable", "image": "https://images.pexels.com/photos/7543152/pexels-photo-7543152.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 59, "name": "Yam", "category": "vegetable", "image": "https://images.unsplash.com/photo-1665913478570-f9511a93a6a5?w=200&h=200&fit=crop&auto=format"},
    {"id": 60, "name": "Peas", "category": "vegetable", "image": "https://plus.unsplash.com/premium_photo-1663844169236-ff32474d1dc8?w=200&h=200&fit=crop&auto=format"},
    {"id": 61, "name": "Tapioca", "category": "vegetable", "image": "https://images.unsplash.com/photo-1757283961570-682154747d9c?w=200&h=200&fit=crop&auto=format"},
    {"id": 76, "name": "Snake Gourd", "category": "vegetable", "image": "https://images.pexels.com/photos/33211277/pexels-photo-33211277.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 46, "name": "Gooseberry", "category": "vegetable", "image": "https://images.unsplash.com/photo-1676043966983-f5bd22435e64?w=200&h=200&fit=crop&auto=format"},
    {"id": 78, "name": "Zucchini", "category": "vegetable", "image": "https://images.unsplash.com/photo-1580294672675-91afc00ee7b3?w=200&h=200&fit=crop&auto=format"},
    {"id": 62, "name": "Spinach (Keerai)", "category": "green", "image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop&auto=format"},
    {"id": 68, "name": "Drumstick leaves (Murungai Keerai)", "category": "green", "image": "https://images.unsplash.com/photo-1595118612285-a12a837ed80f?w=200&h=200&fit=crop&auto=format"},
    {"id": 71, "name": "Coriander", "category": "green", "image": "https://images.unsplash.com/photo-1535189487909-a262ad10c165?w=200&h=200&fit=crop&auto=format"},
    {"id": 72, "name": "Mint", "category": "green", "image": "https://images.pexels.com/photos/12717629/pexels-photo-12717629.jpeg?w=200&h=200&fit=crop&auto=compress"},
    {"id": 73, "name": "Curry Leaves", "category": "green", "image": "https://images.unsplash.com/photo-1758649094570-9dc3b30ce80d?w=200&h=200&fit=crop&auto=format"},
]


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
    Creates the required tables if they don't already exist and seeds
    the products catalog from the final frontend item list.
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

            active_ids = [item["id"] for item in PRODUCTS_CATALOG]
            if active_ids:
                placeholders = ",".join(["%s"] * len(active_ids))
                cur.execute(
                    f"DELETE FROM products WHERE id NOT IN ({placeholders})",
                    active_ids,
                )

            for item in PRODUCTS_CATALOG:
                cur.execute(
                    """
                    INSERT INTO products (id, name, category, image, votes)
                    VALUES (%s, %s, %s, %s, 0)
                    ON CONFLICT (id) DO UPDATE SET
                        name = EXCLUDED.name,
                        category = EXCLUDED.category,
                        image = EXCLUDED.image;
                    """,
                    (item["id"], item["name"], item["category"], item["image"]),
                )

        conn.commit()
