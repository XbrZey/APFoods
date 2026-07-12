import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

SUPABASE_DB_HOST = os.getenv("SUPABASE_DB_HOST")
SUPABASE_DB_PORT = os.getenv("SUPABASE_DB_PORT", "5432")
SUPABASE_DB_NAME = os.getenv("SUPABASE_DB_NAME", "postgres")
SUPABASE_DB_USER = os.getenv("SUPABASE_DB_USER", "postgres")
SUPABASE_PASSWORD = os.getenv("SUPABASE_PASSWORD")

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    if not (SUPABASE_DB_HOST and SUPABASE_PASSWORD):
        raise RuntimeError("Missing crucial database configuration environment variables.")
    DATABASE_URL = f"postgresql+psycopg://{SUPABASE_DB_USER}:{SUPABASE_PASSWORD}@{SUPABASE_DB_HOST}:{SUPABASE_DB_PORT}/{SUPABASE_DB_NAME}"

# pool_pre_ping prevents disconnected idle errors typical with Supabase pools
engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_size=10, max_overflow=20)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()