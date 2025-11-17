from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base
import enum


class ChoreStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    approved = "approved"
    rejected = "rejected"


class ChoreRecurrence(str, enum.Enum):
    once = "once"
    daily = "daily"
    weekly = "weekly"
    biweekly = "biweekly"
    monthly = "monthly"


class ChoreDifficulty(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class Chore(Base):
    __tablename__ = "chores"

    id = Column(Integer, primary_key=True, index=True)
    kid_id = Column(Integer, ForeignKey("kids.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True)
    recurrence = Column(Enum(ChoreRecurrence), default=ChoreRecurrence.once)
    difficulty = Column(Enum(ChoreDifficulty), default=ChoreDifficulty.easy)
    points = Column(Integer, default=10)
    status = Column(Enum(ChoreStatus), default=ChoreStatus.pending)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_ai_generated = Column(Boolean, default=False)
    parent_note = Column(Text, nullable=True)

    # Relationships
    kid = relationship("Kid", back_populates="chores")
