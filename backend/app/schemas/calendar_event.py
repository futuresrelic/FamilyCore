from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CalendarEventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_date: datetime
    recurring: bool = False
    linked_chore_id: Optional[int] = None
    color: str = "#3B82F6"


class CalendarEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    recurring: Optional[bool] = None
    linked_chore_id: Optional[int] = None
    color: Optional[str] = None


class CalendarEventResponse(BaseModel):
    id: int
    family_id: int
    title: str
    description: Optional[str]
    event_date: datetime
    recurring: bool
    linked_chore_id: Optional[int]
    color: str
    created_at: datetime

    class Config:
        from_attributes = True
