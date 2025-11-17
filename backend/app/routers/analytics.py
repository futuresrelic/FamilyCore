from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from ..core.database import get_db
from ..core.deps import get_current_user
from ..models.user import User
from ..models.kid import Kid
from ..models.chore import Chore, ChoreStatus

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard")
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get dashboard statistics for parent
    """
    # Get all kids
    kids = db.query(Kid).filter(Kid.parent_id == current_user.id).all()
    kid_ids = [kid.id for kid in kids]

    # Total chores this week
    week_ago = datetime.utcnow() - timedelta(days=7)
    total_chores = db.query(Chore).filter(
        Chore.kid_id.in_(kid_ids),
        Chore.created_at >= week_ago
    ).count()

    # Completed chores
    completed_chores = db.query(Chore).filter(
        Chore.kid_id.in_(kid_ids),
        Chore.status.in_([ChoreStatus.completed, ChoreStatus.approved]),
        Chore.completed_at >= week_ago
    ).count()

    # Completion rate
    completion_rate = (completed_chores / total_chores * 100) if total_chores > 0 else 0

    # Points earned this week
    points_earned = db.query(func.sum(Chore.points)).filter(
        Chore.kid_id.in_(kid_ids),
        Chore.status == ChoreStatus.approved,
        Chore.approved_at >= week_ago
    ).scalar() or 0

    # Kid statistics
    kid_stats = []
    for kid in kids:
        kid_chores = db.query(Chore).filter(
            Chore.kid_id == kid.id,
            Chore.created_at >= week_ago
        ).count()

        kid_completed = db.query(Chore).filter(
            Chore.kid_id == kid.id,
            Chore.status.in_([ChoreStatus.completed, ChoreStatus.approved]),
            Chore.completed_at >= week_ago
        ).count()

        kid_stats.append({
            "kid_id": kid.id,
            "name": kid.name,
            "total_chores": kid_chores,
            "completed_chores": kid_completed,
            "completion_rate": (kid_completed / kid_chores * 100) if kid_chores > 0 else 0,
            "points": kid.points,
            "streak": kid.streak
        })

    return {
        "total_chores": total_chores,
        "completed_chores": completed_chores,
        "completion_rate": round(completion_rate, 1),
        "points_earned": points_earned,
        "kid_stats": kid_stats
    }


@router.get("/kid/{kid_id}/history")
def get_kid_history(
    kid_id: int,
    days: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get chore history for a specific kid
    """
    # Verify kid belongs to parent
    kid = db.query(Kid).filter(
        Kid.id == kid_id,
        Kid.parent_id == current_user.id
    ).first()

    if not kid:
        return {"error": "Kid not found"}

    # Get chores from the last N days
    start_date = datetime.utcnow() - timedelta(days=days)
    chores = db.query(Chore).filter(
        Chore.kid_id == kid_id,
        Chore.created_at >= start_date
    ).order_by(Chore.created_at.desc()).all()

    # Group by status
    status_counts = {
        "pending": 0,
        "completed": 0,
        "approved": 0,
        "rejected": 0
    }

    for chore in chores:
        status_counts[chore.status.value] = status_counts.get(chore.status.value, 0) + 1

    return {
        "kid_name": kid.name,
        "period_days": days,
        "total_chores": len(chores),
        "status_breakdown": status_counts,
        "current_points": kid.points,
        "current_streak": kid.streak
    }
