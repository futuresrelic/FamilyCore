from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.chore import ChoreStatus, ChoreRecurrence, ChoreDifficulty


class ChoreCreate(BaseModel):
    kid_id: int
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    recurrence: ChoreRecurrence = ChoreRecurrence.once
    difficulty: ChoreDifficulty = ChoreDifficulty.easy
    points: int = 10


class ChoreUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    recurrence: Optional[ChoreRecurrence] = None
    difficulty: Optional[ChoreDifficulty] = None
    points: Optional[int] = None
    status: Optional[ChoreStatus] = None
    parent_note: Optional[str] = None


class ChoreResponse(BaseModel):
    id: int
    kid_id: int
    title: str
    description: Optional[str]
    due_date: Optional[datetime]
    recurrence: ChoreRecurrence
    difficulty: ChoreDifficulty
    points: int
    status: ChoreStatus
    completed_at: Optional[datetime]
    approved_at: Optional[datetime]
    created_at: datetime
    is_ai_generated: bool
    parent_note: Optional[str]

    class Config:
        from_attributes = True
