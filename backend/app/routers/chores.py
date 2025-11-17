from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..core.database import get_db
from ..core.deps import get_current_user
from ..models.user import User
from ..models.kid import Kid
from ..models.chore import Chore, ChoreStatus
from ..schemas.chore import ChoreCreate, ChoreUpdate, ChoreResponse

router = APIRouter(prefix="/chores", tags=["chores"])


@router.post("/", response_model=ChoreResponse)
def create_chore(
    chore_data: ChoreCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new chore
    """
    # Verify kid belongs to current user
    kid = db.query(Kid).filter(
        Kid.id == chore_data.kid_id,
        Kid.parent_id == current_user.id
    ).first()

    if not kid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kid not found"
        )

    # Check free tier limits
    if current_user.subscription_status == "free":
        chore_count = db.query(Chore).join(Kid).filter(
            Kid.parent_id == current_user.id
        ).count()
        if chore_count >= 20:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Free tier limited to 20 chores/month. Upgrade to premium."
            )

    new_chore = Chore(**chore_data.model_dump())

    db.add(new_chore)
    db.commit()
    db.refresh(new_chore)

    return ChoreResponse.model_validate(new_chore)


@router.get("/", response_model=List[ChoreResponse])
def get_chores(
    kid_id: int = None,
    status: ChoreStatus = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all chores for current user's kids (optionally filtered)
    """
    query = db.query(Chore).join(Kid).filter(Kid.parent_id == current_user.id)

    if kid_id:
        query = query.filter(Chore.kid_id == kid_id)

    if status:
        query = query.filter(Chore.status == status)

    chores = query.order_by(Chore.due_date.asc()).all()
    return [ChoreResponse.model_validate(chore) for chore in chores]


@router.get("/{chore_id}", response_model=ChoreResponse)
def get_chore(
    chore_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific chore
    """
    chore = db.query(Chore).join(Kid).filter(
        Chore.id == chore_id,
        Kid.parent_id == current_user.id
    ).first()

    if not chore:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chore not found"
        )

    return ChoreResponse.model_validate(chore)


@router.put("/{chore_id}", response_model=ChoreResponse)
def update_chore(
    chore_id: int,
    chore_data: ChoreUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a chore
    """
    chore = db.query(Chore).join(Kid).filter(
        Chore.id == chore_id,
        Kid.parent_id == current_user.id
    ).first()

    if not chore:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chore not found"
        )

    # Update fields
    for key, value in chore_data.model_dump(exclude_unset=True).items():
        setattr(chore, key, value)

    db.commit()
    db.refresh(chore)

    return ChoreResponse.model_validate(chore)


@router.post("/{chore_id}/complete", response_model=ChoreResponse)
def complete_chore(
    chore_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark a chore as completed (by kid)
    """
    chore = db.query(Chore).join(Kid).filter(
        Chore.id == chore_id,
        Kid.parent_id == current_user.id
    ).first()

    if not chore:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chore not found"
        )

    chore.status = ChoreStatus.completed
    chore.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(chore)

    return ChoreResponse.model_validate(chore)


@router.post("/{chore_id}/approve", response_model=ChoreResponse)
def approve_chore(
    chore_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Approve a completed chore (by parent) and award points
    """
    chore = db.query(Chore).join(Kid).filter(
        Chore.id == chore_id,
        Kid.parent_id == current_user.id
    ).first()

    if not chore:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chore not found"
        )

    if chore.status != ChoreStatus.completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chore must be completed before approval"
        )

    # Award points to kid
    kid = db.query(Kid).filter(Kid.id == chore.kid_id).first()
    kid.points += chore.points

    # Update chore
    chore.status = ChoreStatus.approved
    chore.approved_at = datetime.utcnow()

    db.commit()
    db.refresh(chore)

    return ChoreResponse.model_validate(chore)


@router.delete("/{chore_id}")
def delete_chore(
    chore_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a chore
    """
    chore = db.query(Chore).join(Kid).filter(
        Chore.id == chore_id,
        Kid.parent_id == current_user.id
    ).first()

    if not chore:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chore not found"
        )

    db.delete(chore)
    db.commit()

    return {"message": "Chore deleted successfully"}
