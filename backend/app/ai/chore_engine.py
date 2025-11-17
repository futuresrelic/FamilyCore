"""
AI Chore Assignment Engine
Assigns chores to kids based on age, difficulty, fairness, and past patterns
"""
from typing import List, Dict
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..models.kid import Kid
from ..models.chore import Chore, ChoreDifficulty, ChoreRecurrence, ChoreStatus
import random


def calculate_kid_load(kid_id: int, db: Session) -> int:
    """
    Calculate current chore load for a kid
    """
    week_ago = datetime.utcnow() - timedelta(days=7)
    active_chores = db.query(Chore).filter(
        Chore.kid_id == kid_id,
        Chore.status.in_([ChoreStatus.pending, ChoreStatus.in_progress]),
        Chore.created_at >= week_ago
    ).count()
    return active_chores


def get_age_appropriate_difficulty(age: int) -> List[ChoreDifficulty]:
    """
    Return appropriate difficulty levels based on age
    """
    if age < 6:
        return [ChoreDifficulty.easy]
    elif age < 10:
        return [ChoreDifficulty.easy, ChoreDifficulty.medium]
    else:
        return [ChoreDifficulty.easy, ChoreDifficulty.medium, ChoreDifficulty.hard]


def assign_chore_to_kid(
    kids: List[Kid],
    chore_title: str,
    difficulty: ChoreDifficulty,
    db: Session
) -> Kid:
    """
    Intelligently assign a chore to the most appropriate kid
    Based on: age, current load, fairness
    """
    if not kids:
        return None

    # Score each kid
    kid_scores = []
    for kid in kids:
        score = 100  # Base score

        # Age appropriateness
        if kid.age:
            appropriate_difficulties = get_age_appropriate_difficulty(kid.age)
            if difficulty not in appropriate_difficulties:
                score -= 50

        # Current load (favor kids with fewer chores)
        load = calculate_kid_load(kid.id, db)
        score -= (load * 10)

        # Boost kids with lower points (fairness)
        avg_points = sum(k.points for k in kids) / len(kids) if kids else 0
        if kid.points < avg_points:
            score += 20

        kid_scores.append((kid, score))

    # Sort by score and pick the best
    kid_scores.sort(key=lambda x: x[1], reverse=True)
    return kid_scores[0][0]


def generate_chore_suggestions(
    kids: List[Kid],
    db: Session
) -> List[Dict]:
    """
    Generate AI chore suggestions for the week
    """
    chore_templates = [
        {"title": "Take out the trash", "difficulty": ChoreDifficulty.easy, "points": 10},
        {"title": "Clean your room", "difficulty": ChoreDifficulty.medium, "points": 15},
        {"title": "Do the dishes", "difficulty": ChoreDifficulty.medium, "points": 15},
        {"title": "Vacuum the living room", "difficulty": ChoreDifficulty.medium, "points": 20},
        {"title": "Make your bed", "difficulty": ChoreDifficulty.easy, "points": 5},
        {"title": "Feed the pet", "difficulty": ChoreDifficulty.easy, "points": 10},
        {"title": "Water the plants", "difficulty": ChoreDifficulty.easy, "points": 10},
        {"title": "Fold laundry", "difficulty": ChoreDifficulty.medium, "points": 15},
        {"title": "Set the table", "difficulty": ChoreDifficulty.easy, "points": 10},
        {"title": "Help with grocery bags", "difficulty": ChoreDifficulty.medium, "points": 15},
        {"title": "Clean bathroom sink", "difficulty": ChoreDifficulty.hard, "points": 25},
        {"title": "Organize toys", "difficulty": ChoreDifficulty.easy, "points": 10},
    ]

    suggestions = []

    # Generate 5-10 chore suggestions
    num_suggestions = min(len(chore_templates), random.randint(5, 10))
    selected_templates = random.sample(chore_templates, num_suggestions)

    for template in selected_templates:
        assigned_kid = assign_chore_to_kid(kids, template["title"], template["difficulty"], db)

        if assigned_kid:
            suggestions.append({
                "kid_id": assigned_kid.id,
                "kid_name": assigned_kid.name,
                "title": template["title"],
                "difficulty": template["difficulty"].value,
                "points": template["points"],
                "due_date": (datetime.utcnow() + timedelta(days=random.randint(1, 7))).isoformat()
            })

    return suggestions


def create_chores_from_natural_language(
    prompt: str,
    kids: List[Kid],
    db: Session
) -> List[Dict]:
    """
    Parse natural language chore creation
    Example: "Make a weekly trash chore for Emily on Tuesdays"

    This is a simplified version. In production, you'd use OpenAI/Anthropic API
    """
    prompt_lower = prompt.lower()

    # Extract keywords
    title = ""
    recurrence = ChoreRecurrence.once
    difficulty = ChoreDifficulty.medium
    kid = None

    # Detect recurrence
    if "daily" in prompt_lower:
        recurrence = ChoreRecurrence.daily
    elif "weekly" in prompt_lower:
        recurrence = ChoreRecurrence.weekly
    elif "monthly" in prompt_lower:
        recurrence = ChoreRecurrence.monthly

    # Detect kid name
    for k in kids:
        if k.name.lower() in prompt_lower:
            kid = k
            break

    # Detect chore type (simplified)
    if "trash" in prompt_lower:
        title = "Take out the trash"
        difficulty = ChoreDifficulty.easy
    elif "dishes" in prompt_lower:
        title = "Do the dishes"
        difficulty = ChoreDifficulty.medium
    elif "room" in prompt_lower or "clean" in prompt_lower:
        title = "Clean room"
        difficulty = ChoreDifficulty.medium

    if not kid:
        kid = kids[0] if kids else None

    if kid and title:
        return [{
            "kid_id": kid.id,
            "kid_name": kid.name,
            "title": title,
            "recurrence": recurrence.value,
            "difficulty": difficulty.value,
            "points": 15
        }]

    return []
