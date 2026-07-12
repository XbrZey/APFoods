import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool  # 💡 Import NullPool to support the Supabase pooler

load_dotenv()

# Prefer a full DATABASE_URL if provided
DATABASE_URL = os.getenv("DATABASE_URL")

# Otherwise, build it from individual environment variables
if not DATABASE_URL:
    host = os.getenv("SUPABASE_DB_HOST")
    port = os.getenv("SUPABASE_DB_PORT", "5432")  # 💡 Stays 5432 as provided!
    name = os.getenv("SUPABASE_DB_NAME", "postgres")
    user = os.getenv("SUPABASE_DB_USER", "postgres")
    password = os.getenv("SUPABASE_PASSWORD")

    if not all([host, password]):
        raise RuntimeError(
            "Missing database configuration. Set DATABASE_URL or the SUPABASE_* variables."
        )

    DATABASE_URL = (
        f"postgresql+psycopg://{user}:{password}"
        f"@{host}:{port}/{name}"
    )

# Supabase requires SSL
if "sslmode=" not in DATABASE_URL:
    separator = "&" if "?" in DATABASE_URL else "?"
    DATABASE_URL += f"{separator}sslmode=require"

# 💡 FIX: Set poolclass=NullPool so SQLAlchemy lets Supabase handle connection pooling safely
engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()