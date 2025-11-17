from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    insight_type = Column(String, nullable=False)  # motivation, tip, analysis, suggestion
    text = Column(Text, nullable=False)
    metadata = Column(Text, nullable=True)  # JSON string for additional context
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Integer, default=0)  # 0 = unread, 1 = read

    # Relationships
    parent = relationship("User", back_populates="ai_insights")
