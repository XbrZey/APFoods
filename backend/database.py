import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# --- Supabase Postgres connection ---
# Fill these in your .env (see .env.example). SUPABASE_DB_HOST comes from:
# Supabase Dashboard -> Project Settings -> Database -> Connection string -> URI
# It looks like: db.<your-project-ref>.supabase.co
SUPABASE_DB_HOST = os.getenv("SUPABASE_DB_HOST")
SUPABASE_DB_PORT = os.getenv("SUPABASE_DB_PORT", "5432")
SUPABASE_DB_NAME = os.getenv("SUPABASE_DB_NAME", "postgres")
SUPABASE_DB_USER = os.getenv("SUPABASE_DB_USER", "postgres")
SUPABASE_PASSWORD = os.getenv("SUPABASE_PASSWORD")

# Allow a single full connection string to override the pieces above, if preferred
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    missing = [
        name for name, val in [
            ("SUPABASE_DB_HOST", SUPABASE_DB_HOST),
            ("SUPABASE_PASSWORD", SUPABASE_PASSWORD),
        ] if not val
    ]
    if missing:
        raise RuntimeError(
            f"Missing required env vars: {', '.join(missing)}. "
            "Check your .env file (see .env.example)."
        )
    DATABASE_URL = (
        f"postgresql+psycopg://{SUPABASE_DB_USER}:{SUPABASE_PASSWORD}"
        f"@{SUPABASE_DB_HOST}:{SUPABASE_DB_PORT}/{SUPABASE_DB_NAME}"
    )

# pool_pre_ping avoids "server closed the connection unexpectedly" errors,
# which Supabase's pooled connections are prone to after idling.
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency: yields a DB session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()