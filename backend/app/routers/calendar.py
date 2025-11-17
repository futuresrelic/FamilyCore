from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..core.database import get_db
from ..core.deps import get_current_user
from ..models.user import User
from ..models.calendar_event import CalendarEvent
from ..schemas.calendar_event import CalendarEventCreate, CalendarEventUpdate, CalendarEventResponse

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.post("/", response_model=CalendarEventResponse)
def create_event(
    event_data: CalendarEventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new calendar event
    """
    new_event = CalendarEvent(
        family_id=current_user.id,
        **event_data.model_dump()
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return CalendarEventResponse.model_validate(new_event)


@router.get("/", response_model=List[CalendarEventResponse])
def get_events(
    start_date: datetime = None,
    end_date: datetime = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get calendar events (optionally filtered by date range)
    """
    query = db.query(CalendarEvent).filter(CalendarEvent.family_id == current_user.id)

    if start_date:
        query = query.filter(CalendarEvent.event_date >= start_date)

    if end_date:
        query = query.filter(CalendarEvent.event_date <= end_date)

    events = query.order_by(CalendarEvent.event_date.asc()).all()
    return [CalendarEventResponse.model_validate(event) for event in events]


@router.put("/{event_id}", response_model=CalendarEventResponse)
def update_event(
    event_id: int,
    event_data: CalendarEventUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a calendar event
    """
    event = db.query(CalendarEvent).filter(
        CalendarEvent.id == event_id,
        CalendarEvent.family_id == current_user.id
    ).first()

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )

    for key, value in event_data.model_dump(exclude_unset=True).items():
        setattr(event, key, value)

    db.commit()
    db.refresh(event)

    return CalendarEventResponse.model_validate(event)


@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a calendar event
    """
    event = db.query(CalendarEvent).filter(
        CalendarEvent.id == event_id,
        CalendarEvent.family_id == current_user.id
    ).first()

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )

    db.delete(event)
    db.commit()

    return {"message": "Event deleted successfully"}
