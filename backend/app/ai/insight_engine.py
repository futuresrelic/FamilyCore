"""
AI Insights Engine
Generates family insights, motivation messages, and parenting tips
"""
from typing import List, Dict
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.kid import Kid
from ..models.chore import Chore, ChoreStatus
from ..models.ai_insight import AIInsight
import random


def generate_motivation_message(kid: Kid, db: Session) -> str:
    """
    Generate kid-friendly motivation messages
    """
    messages = [
        f"I love the way you help around the house, {kid.name}! 🌟",
        f"You're building an amazing streak, {kid.name}! Keep it up! 🔥",
        f"Great job on your chores today, {kid.name}! You're a superstar! ⭐",
        f"{kid.name}, you're making the family proud! 💪",
        f"Wow {kid.name}! You're earning so many points! 🎉",
        f"Keep shining, {kid.name}! Your hard work shows! ✨",
        f"{kid.name}, you're becoming such a responsible helper! 👏",
        f"Amazing effort, {kid.name}! You're doing fantastic! 🚀",
    ]

    return random.choice(messages)


def generate_family_insights(parent_id: int, db: Session) -> List[Dict]:
    """
    Generate AI insights about family chore patterns
    """
    insights = []

    # Get all kids for this parent
    kids = db.query(Kid).filter(Kid.parent_id == parent_id).all()
    if not kids:
        return insights

    kid_ids = [kid.id for kid in kids]

    # Analyze completion rates
    week_ago = datetime.utcnow() - timedelta(days=7)
    total_chores = db.query(Chore).filter(
        Chore.kid_id.in_(kid_ids),
        Chore.created_at >= week_ago
    ).count()

    completed_chores = db.query(Chore).filter(
        Chore.kid_id.in_(kid_ids),
        Chore.status.in_([ChoreStatus.completed, ChoreStatus.approved]),
        Chore.completed_at >= week_ago
    ).count()

    completion_rate = (completed_chores / total_chores * 100) if total_chores > 0 else 0

    # Insight 1: Overall performance
    if completion_rate >= 80:
        insights.append({
            "type": "analysis",
            "text": f"🎉 Fantastic! Your family completed {int(completion_rate)}% of chores this week. You're doing an amazing job!"
        })
    elif completion_rate >= 60:
        insights.append({
            "type": "analysis",
            "text": f"👍 Good progress! {int(completion_rate)}% of chores completed this week. Keep building that momentum!"
        })
    else:
        insights.append({
            "type": "tip",
            "text": f"💡 Tip: Only {int(completion_rate)}% of chores completed this week. Try setting reminders or adjusting chore schedules."
        })

    # Insight 2: Individual kid analysis
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

        if kid_chores > 0:
            kid_rate = (kid_completed / kid_chores * 100)

            if kid_rate >= 80:
                insights.append({
                    "type": "motivation",
                    "text": f"🌟 {kid.name} is crushing it with {int(kid_rate)}% completion!"
                })
            elif kid_rate < 40:
                insights.append({
                    "type": "suggestion",
                    "text": f"💭 {kid.name} might need extra reminders or easier tasks to build confidence."
                })

    # Insight 3: Streak tracking
    for kid in kids:
        if kid.streak >= 7:
            insights.append({
                "type": "motivation",
                "text": f"🔥 Wow! {kid.name} has a {kid.streak}-day streak! That's dedication!"
            })

    # Insight 4: Points balance
    if len(kids) > 1:
        points_list = [kid.points for kid in kids]
        max_points = max(points_list)
        min_points = min(points_list)

        if max_points - min_points > 100:
            insights.append({
                "type": "tip",
                "text": f"⚖️ Point distribution is uneven. Consider balancing chore assignments for fairness."
            })

    return insights


def generate_reward_suggestions(parent_id: int, db: Session) -> List[Dict]:
    """
    AI-generated reward ideas based on family patterns
    """
    reward_ideas = [
        {"name": "Extra 30min screen time", "cost": 50, "icon": "📱"},
        {"name": "Choose dinner tonight", "cost": 75, "icon": "🍕"},
        {"name": "Stay up 30min late", "cost": 100, "icon": "🌙"},
        {"name": "Pick the movie", "cost": 60, "icon": "🎬"},
        {"name": "Ice cream trip", "cost": 150, "icon": "🍦"},
        {"name": "Skip one chore", "cost": 80, "icon": "✨"},
        {"name": "Park visit", "cost": 100, "icon": "🎡"},
        {"name": "Sleepover with friend", "cost": 200, "icon": "🎉"},
        {"name": "New toy/book", "cost": 300, "icon": "🎁"},
        {"name": "Special outing", "cost": 500, "icon": "🎈"},
    ]

    # Return random 5 suggestions
    return random.sample(reward_ideas, min(5, len(reward_ideas)))


def detect_patterns_and_recommend(parent_id: int, db: Session) -> List[str]:
    """
    Detect patterns in chore completion and recommend improvements
    """
    recommendations = []

    kids = db.query(Kid).filter(Kid.parent_id == parent_id).all()
    kid_ids = [kid.id for kid in kids]

    # Check for forgotten chores
    overdue_chores = db.query(Chore).filter(
        Chore.kid_id.in_(kid_ids),
        Chore.status == ChoreStatus.pending,
        Chore.due_date < datetime.utcnow()
    ).count()

    if overdue_chores > 5:
        recommendations.append(
            "You have multiple overdue chores. Consider enabling push notifications or adjusting due dates."
        )

    # Check for weekday patterns
    # This is simplified - in production you'd do more complex analysis
    recommendations.append(
        "Tip: Most families find success assigning easier chores on school days and bigger tasks on weekends."
    )

    return recommendations


def save_insights_to_db(parent_id: int, insights: List[Dict], db: Session):
    """
    Save generated insights to database
    """
    for insight in insights:
        new_insight = AIInsight(
            parent_id=parent_id,
            insight_type=insight.get("type", "general"),
            text=insight["text"],
            is_read=0
        )
        db.add(new_insight)

    db.commit()
