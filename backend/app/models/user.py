from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    subscription_status = Column(String, default="free")  # free, premium
    subscription_id = Column(String, nullable=True)  # Stripe subscription ID
    trial_ends_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)

    # Relationships
    kids = relationship("Kid", back_populates="parent", cascade="all, delete-orphan")
    rewards = relationship("Reward", back_populates="parent", cascade="all, delete-orphan")
    ai_insights = relationship("AIInsight", back_populates="parent", cascade="all, delete-orphan")
    calendar_events = relationship("CalendarEvent", back_populates="family", cascade="all, delete-orphan")
