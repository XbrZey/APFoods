import os
import socket
from urllib.parse import urlparse, urlunparse
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

# 1. Build the database URL dynamically if not provided
if not DATABASE_URL:
    if not (SUPABASE_DB_HOST and SUPABASE_PASSWORD):
        raise RuntimeError("Missing crucial database configuration environment variables.")
    DATABASE_URL = f"postgresql+psycopg://{SUPABASE_DB_USER}:{SUPABASE_PASSWORD}@{SUPABASE_DB_HOST}:{SUPABASE_DB_PORT}/{SUPABASE_DB_NAME}"

# 2. Force IPv4 resolution to bypass Render's outbound IPv6 limitation
try:
    parsed_url = urlparse(DATABASE_URL)
    # Extract hostname and port if present
    hostname = parsed_url.hostname
    
    if hostname:
        # Force getaddrinfo to fetch only IPv4 (AF_INET) addresses
        addresses = socket.getaddrinfo(hostname, None, socket.AF_INET)
        if addresses:
            ipv4_address = addresses[0][4][0]
            
            # Reconstruct the host string with the direct IPv4 address
            if parsed_url.port:
                new_netloc = f"{parsed_url.username}:{parsed_url.password}@{ipv4_address}:{parsed_url.port}"
            else:
                new_netloc = f"{parsed_url.username}:{parsed_url.password}@{ipv4_address}"
            
            # Replace the named host with the IPv4 address
            parsed_url = parsed_url._replace(netloc=new_netloc)
            DATABASE_URL = urlunparse(parsed_url)
except Exception as e:
    print(f"Warning: Failed to force IPv4 resolution natively: {e}")

# 3. Create the SQLAlchemy engine with pool settings
engine = create_engine(
    DATABASE_URL, 
    pool_pre_ping=True, 
    pool_size=10, 
    max_overflow=20
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()