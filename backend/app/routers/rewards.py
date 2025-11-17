from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..core.deps import get_current_user
from ..models.user import User
from ..models.kid import Kid
from ..models.reward import Reward
from ..schemas.reward import RewardCreate, RewardUpdate, RewardResponse

router = APIRouter(prefix="/rewards", tags=["rewards"])


@router.post("/", response_model=RewardResponse)
def create_reward(
    reward_data: RewardCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new reward
    """
    new_reward = Reward(
        parent_id=current_user.id,
        **reward_data.model_dump()
    )

    db.add(new_reward)
    db.commit()
    db.refresh(new_reward)

    return RewardResponse.model_validate(new_reward)


@router.get("/", response_model=List[RewardResponse])
def get_rewards(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all rewards for current user
    """
    rewards = db.query(Reward).filter(
        Reward.parent_id == current_user.id,
        Reward.is_active == True
    ).all()
    return [RewardResponse.model_validate(reward) for reward in rewards]


@router.put("/{reward_id}", response_model=RewardResponse)
def update_reward(
    reward_id: int,
    reward_data: RewardUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a reward
    """
    reward = db.query(Reward).filter(
        Reward.id == reward_id,
        Reward.parent_id == current_user.id
    ).first()

    if not reward:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reward not found"
        )

    for key, value in reward_data.model_dump(exclude_unset=True).items():
        setattr(reward, key, value)

    db.commit()
    db.refresh(reward)

    return RewardResponse.model_validate(reward)


@router.post("/{reward_id}/redeem")
def redeem_reward(
    reward_id: int,
    kid_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Redeem a reward for a kid
    """
    # Verify reward belongs to parent
    reward = db.query(Reward).filter(
        Reward.id == reward_id,
        Reward.parent_id == current_user.id
    ).first()

    if not reward:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reward not found"
        )

    # Verify kid belongs to parent
    kid = db.query(Kid).filter(
        Kid.id == kid_id,
        Kid.parent_id == current_user.id
    ).first()

    if not kid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kid not found"
        )

    # Check if kid has enough points
    if kid.points < reward.cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Not enough points. Need {reward.cost}, have {kid.points}"
        )

    # Deduct points
    kid.points -= reward.cost

    db.commit()

    return {
        "message": "Reward redeemed successfully",
        "remaining_points": kid.points
    }


@router.delete("/{reward_id}")
def delete_reward(
    reward_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a reward
    """
    reward = db.query(Reward).filter(
        Reward.id == reward_id,
        Reward.parent_id == current_user.id
    ).first()

    if not reward:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reward not found"
        )

    db.delete(reward)
    db.commit()

    return {"message": "Reward deleted successfully"}
