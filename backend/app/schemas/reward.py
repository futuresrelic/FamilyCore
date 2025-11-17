from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RewardCreate(BaseModel):
    reward_name: str
    description: Optional[str] = None
    cost: int
    icon: Optional[str] = None


class RewardUpdate(BaseModel):
    reward_name: Optional[str] = None
    description: Optional[str] = None
    cost: Optional[int] = None
    is_active: Optional[bool] = None
    icon: Optional[str] = None


class RewardResponse(BaseModel):
    id: int
    parent_id: int
    reward_name: str
    description: Optional[str]
    cost: int
    is_active: bool
    icon: Optional[str]
    created_at: datetime
    is_ai_suggested: bool

    class Config:
        from_attributes = True
