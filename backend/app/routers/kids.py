from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from passlib.context import CryptContext
from ..core.database import get_db
from ..core.deps import get_current_user
from ..models.user import User
from ..models.kid import Kid
from ..schemas.kid import KidCreate, KidUpdate, KidResponse, KidLogin

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/kids", tags=["kids"])


@router.post("/", response_model=KidResponse)
def create_kid(
    kid_data: KidCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new kid profile
    """
    # Check subscription limits for free tier
    if current_user.subscription_status == "free":
        kid_count = db.query(Kid).filter(Kid.parent_id == current_user.id).count()
        if kid_count >= 5:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Free tier limited to 5 kids. Upgrade to premium for unlimited kids."
            )

    # Check if username is unique (if provided)
    if kid_data.username:
        existing_kid = db.query(Kid).filter(Kid.username == kid_data.username).first()
        if existing_kid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists"
            )

    # Prepare kid data
    kid_dict = kid_data.model_dump(exclude={'pin'})

    # Hash PIN if provided
    if kid_data.pin:
        kid_dict['pin_hash'] = pwd_context.hash(kid_data.pin)

    new_kid = Kid(
        parent_id=current_user.id,
        **kid_dict
    )

    db.add(new_kid)
    db.commit()
    db.refresh(new_kid)

    return KidResponse.model_validate(new_kid)


@router.get("/", response_model=List[KidResponse])
def get_kids(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all kids for current user
    """
    kids = db.query(Kid).filter(Kid.parent_id == current_user.id).all()
    return [KidResponse.model_validate(kid) for kid in kids]


@router.get("/{kid_id}", response_model=KidResponse)
def get_kid(
    kid_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific kid
    """
    kid = db.query(Kid).filter(
        Kid.id == kid_id,
        Kid.parent_id == current_user.id
    ).first()

    if not kid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kid not found"
        )

    return KidResponse.model_validate(kid)


@router.put("/{kid_id}", response_model=KidResponse)
def update_kid(
    kid_id: int,
    kid_data: KidUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a kid profile
    """
    kid = db.query(Kid).filter(
        Kid.id == kid_id,
        Kid.parent_id == current_user.id
    ).first()

    if not kid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kid not found"
        )

    # Update only provided fields
    for key, value in kid_data.model_dump(exclude_unset=True).items():
        setattr(kid, key, value)

    db.commit()
    db.refresh(kid)

    return KidResponse.model_validate(kid)


@router.delete("/{kid_id}")
def delete_kid(
    kid_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a kid profile
    """
    kid = db.query(Kid).filter(
        Kid.id == kid_id,
        Kid.parent_id == current_user.id
    ).first()

    if not kid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kid not found"
        )

    db.delete(kid)
    db.commit()

    return {"message": "Kid deleted successfully"}


@router.post("/login")
def kid_login(
    credentials: KidLogin,
    db: Session = Depends(get_db)
):
    """
    Kid login with username and PIN
    """
    # Find kid by username
    kid = db.query(Kid).filter(Kid.username == credentials.username).first()

    if not kid or not kid.pin_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or PIN"
        )

    # Verify PIN
    if not pwd_context.verify(credentials.pin, kid.pin_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or PIN"
        )

    # Return kid data (no JWT token needed for kids - simpler auth)
    return {
        "kid": KidResponse.model_validate(kid),
        "message": "Login successful"
    }
