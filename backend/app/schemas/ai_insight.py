from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AIInsightResponse(BaseModel):
    id: int
    parent_id: int
    insight_type: str
    text: str
    extra_data: Optional[str]
    created_at: datetime
    is_read: int

    class Config:
        from_attributes = True
