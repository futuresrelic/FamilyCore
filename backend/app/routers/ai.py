from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..core.deps import get_current_user
from ..models.user import User
from ..models.kid import Kid
from ..models.ai_insight import AIInsight
from ..schemas.ai_insight import AIInsightResponse
from ..ai.chore_engine import generate_chore_suggestions, create_chores_from_natural_language
from ..ai.insight_engine import (
    generate_family_insights,
    generate_reward_suggestions,
    detect_patterns_and_recommend,
    save_insights_to_db,
    generate_motivation_message
)

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/chore-suggestions")
def get_chore_suggestions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get AI-generated chore suggestions for the week
    """
    kids = db.query(Kid).filter(Kid.parent_id == current_user.id).all()

    if not kids:
        raise HTTPException(
            status_code=400,
            detail="Add kids to your family first"
        )

    suggestions = generate_chore_suggestions(kids, db)

    return {
        "suggestions": suggestions,
        "count": len(suggestions)
    }


@router.post("/natural-chore")
def create_chore_from_text(
    prompt: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create chores using natural language
    Example: "Make a weekly trash chore for Emily on Tuesdays"
    """
    kids = db.query(Kid).filter(Kid.parent_id == current_user.id).all()

    if not kids:
        raise HTTPException(
            status_code=400,
            detail="Add kids to your family first"
        )

    chores = create_chores_from_natural_language(prompt, kids, db)

    return {
        "parsed_chores": chores,
        "message": "Chore suggestions generated from your request"
    }


@router.get("/insights", response_model=List[AIInsightResponse])
def get_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get AI-generated family insights
    """
    insights = db.query(AIInsight).filter(
        AIInsight.parent_id == current_user.id
    ).order_by(AIInsight.created_at.desc()).limit(20).all()

    return [AIInsightResponse.model_validate(insight) for insight in insights]


@router.post("/generate-insights")
def generate_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate fresh AI insights for the family
    """
    insights = generate_family_insights(current_user.id, db)
    recommendations = detect_patterns_and_recommend(current_user.id, db)

    # Save to database
    save_insights_to_db(current_user.id, insights, db)

    return {
        "insights": insights,
        "recommendations": recommendations,
        "generated_at": "just now"
    }


@router.get("/reward-suggestions")
def get_reward_suggestions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get AI-suggested rewards
    """
    suggestions = generate_reward_suggestions(current_user.id, db)

    return {
        "suggestions": suggestions,
        "message": "Here are some reward ideas for your family"
    }


@router.get("/motivation/{kid_id}")
def get_kid_motivation(
    kid_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a motivation message for a specific kid
    """
    kid = db.query(Kid).filter(
        Kid.id == kid_id,
        Kid.parent_id == current_user.id
    ).first()

    if not kid:
        raise HTTPException(
            status_code=404,
            detail="Kid not found"
        )

    message = generate_motivation_message(kid, db)

    return {
        "kid_name": kid.name,
        "message": message
    }
