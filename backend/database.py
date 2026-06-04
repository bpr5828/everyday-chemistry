import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# On Vercel, the filesystem is read-only except /tmp.
# Use DATABASE_URL env var for production (Postgres), fall back to /tmp SQLite for dev/demo.
_default_sqlite = "sqlite:////tmp/everyday_chemistry.db"
DATABASE_URL = os.environ.get("DATABASE_URL", _default_sqlite)

# Address Vercel/Heroku legacy postgres:// URL format
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
