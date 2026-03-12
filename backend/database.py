"""
Database Configuration - PostgreSQL via SQLAlchemy (async)
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Float, DateTime, Boolean, Enum as SAEnum
from datetime import datetime
from typing import Optional
import os
import enum

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://suvidha:suvidha_pass@localhost:5432/suvidha_db"
)

engine        = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


# ─── Enums ───────────────────────────────────────────────────────────────────

class ServiceType(str, enum.Enum):
    ELECTRICITY = "ELECTRICITY"
    GAS         = "GAS"
    WATER       = "WATER"
    MUNICIPAL   = "MUNICIPAL"

class TxStatus(str, enum.Enum):
    SUCCESS    = "SUCCESS"
    PENDING    = "PENDING"
    FAILED     = "FAILED"
    PROCESSING = "PROCESSING"


# ─── Models ──────────────────────────────────────────────────────────────────

class Citizen(Base):
    __tablename__ = "citizens"
    id:         Mapped[str]           = mapped_column(String(50), primary_key=True)
    mobile:     Mapped[str]           = mapped_column(String(10), unique=True, index=True)
    name:       Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    city:       Mapped[Optional[str]] = mapped_column(String(50),  nullable=True)
    created_at: Mapped[datetime]      = mapped_column(DateTime, default=datetime.utcnow)


class Transaction(Base):
    __tablename__ = "transactions"
    id:           Mapped[str]   = mapped_column(String(50), primary_key=True)
    citizen_id:   Mapped[str]   = mapped_column(String(50), index=True)
    service:      Mapped[str]   = mapped_column(SAEnum(ServiceType))
    task:         Mapped[str]   = mapped_column(String(100))
    amount:       Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    status:       Mapped[str]   = mapped_column(SAEnum(TxStatus), default=TxStatus.PENDING)
    reference_no: Mapped[str]   = mapped_column(String(50), unique=True)
    metadata_:    Mapped[Optional[str]]   = mapped_column("metadata", String(2000), nullable=True)
    created_at:   Mapped[datetime]        = mapped_column(DateTime, default=datetime.utcnow)
    updated_at:   Mapped[datetime]        = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class KioskLog(Base):
    __tablename__ = "kiosk_logs"
    id:         Mapped[int]      = mapped_column(primary_key=True, autoincrement=True)
    kiosk_id:   Mapped[str]      = mapped_column(String(50))
    event_type: Mapped[str]      = mapped_column(String(50))
    details:    Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    timestamp:  Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


# ─── Init ─────────────────────────────────────────────────────────────────────

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
