from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reward_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    cost = Column(Integer, nullable=False)  # Points required
    is_active = Column(Boolean, default=True)
    icon = Column(String, nullable=True)  # Emoji or icon identifier
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_ai_suggested = Column(Boolean, default=False)

    # Relationships
    parent = relationship("User", back_populates="rewards")
