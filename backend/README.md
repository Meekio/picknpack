# PickNPack Backend

FastAPI backend for the PickNPack community voting app.

## Stack
- **FastAPI** — web framework
- **psycopg v3** — PostgreSQL driver (raw SQL, no ORM)
- **Pydantic v2** — request/response validation
- **Neon** (or any PostgreSQL) — database

## Setup

### 1. Create a virtual environment
```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure environment variables
```bash
copy .env.example .env
```
Edit `.env` and paste your Neon connection string:
```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

### 4. Seed the database
Run the seed SQL against your Neon database using the Neon SQL editor or psql:
```bash
psql $DATABASE_URL -f app/seed.sql
```

### 5. Start the server
```bash
uvicorn app.main:app --reload --port 8000
```

API will be available at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | All products |
| POST | `/api/vote` | Submit a vote |
| GET | `/api/results` | Products sorted by votes |
| GET | `/api/suggestions` | All suggestions (newest first) |

## Vote Payload
```json
{
  "items": [1, 4, 7],
  "fruitSuggestion": "Dragon Fruit",
  "vegetableSuggestion": "Broccoli",
  "greenSuggestion": "Thandu Keerai"
}
```
