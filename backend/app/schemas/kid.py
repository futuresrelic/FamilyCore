from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class KidCreate(BaseModel):
    name: str
    age: Optional[int] = None
    birthday: Optional[date] = None
    avatar_id: str = "default_1"


class KidUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    birthday: Optional[date] = None
    avatar_id: Optional[str] = None
    points: Optional[int] = None
    streak: Optional[int] = None


class KidResponse(BaseModel):
    id: int
    parent_id: int
    name: str
    age: Optional[int]
    birthday: Optional[date]
    avatar_id: str
    points: int
    streak: int
    last_activity: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
