"""
SQLAlchemy engine/session setup for local PostgreSQL.
Replaces the Supabase client used previously.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def get_session():
    """Use as a context manager: `with get_session() as session:`"""
    return SessionLocal()
