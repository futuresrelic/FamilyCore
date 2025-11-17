from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class Kid(Base):
    __tablename__ = "kids"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    birthday = Column(Date, nullable=True)
    avatar_id = Column(String, default="default_1")  # Avatar identifier
    points = Column(Integer, default=0)
    streak = Column(Integer, default=0)  # Days of consecutive chore completion
    last_activity = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    parent = relationship("User", back_populates="kids")
    chores = relationship("Chore", back_populates="kid", cascade="all, delete-orphan")
