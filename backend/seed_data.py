"""
Seed script to populate database with sample data
Run: python seed_data.py
"""
from datetime import datetime, timedelta
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User
from app.models.kid import Kid
from app.models.chore import Chore, ChoreStatus, ChoreRecurrence, ChoreDifficulty
from app.models.reward import Reward
from app.models.calendar_event import CalendarEvent


def seed_database():
    db = SessionLocal()

    print("🌱 Seeding database...")

    try:
        # Create sample parent user
        print("Creating parent user...")
        parent = User(
            email="parent@example.com",
            password_hash=get_password_hash("password123"),
            full_name="Jane Doe",
            subscription_status="premium",
            trial_ends_at=datetime.utcnow() + timedelta(days=30)
        )
        db.add(parent)
        db.commit()
        db.refresh(parent)
        print(f"✅ Created parent: {parent.email}")

        # Create sample kids
        print("Creating kids...")
        kids_data = [
            {
                "name": "Emma",
                "age": 10,
                "avatar_id": "🦄",
                "points": 150,
                "streak": 5
            },
            {
                "name": "Noah",
                "age": 8,
                "avatar_id": "🦁",
                "points": 200,
                "streak": 7
            },
            {
                "name": "Sophia",
                "age": 6,
                "avatar_id": "🦋",
                "points": 80,
                "streak": 3
            }
        ]

        kids = []
        for kid_data in kids_data:
            kid = Kid(
                parent_id=parent.id,
                **kid_data
            )
            db.add(kid)
            kids.append(kid)

        db.commit()
        for kid in kids:
            db.refresh(kid)
            print(f"✅ Created kid: {kid.name}")

        # Create sample chores
        print("Creating chores...")
        chores_data = [
            {
                "kid_id": kids[0].id,
                "title": "Clean your room",
                "description": "Pick up toys and make your bed",
                "difficulty": ChoreDifficulty.medium,
                "points": 15,
                "recurrence": ChoreRecurrence.daily,
                "status": ChoreStatus.pending,
                "due_date": datetime.utcnow() + timedelta(hours=4)
            },
            {
                "kid_id": kids[0].id,
                "title": "Do homework",
                "description": "Complete math worksheet",
                "difficulty": ChoreDifficulty.medium,
                "points": 20,
                "recurrence": ChoreRecurrence.daily,
                "status": ChoreStatus.completed,
                "completed_at": datetime.utcnow() - timedelta(hours=2)
            },
            {
                "kid_id": kids[1].id,
                "title": "Take out the trash",
                "description": "Empty kitchen and bathroom trash",
                "difficulty": ChoreDifficulty.easy,
                "points": 10,
                "recurrence": ChoreRecurrence.weekly,
                "status": ChoreStatus.pending,
                "due_date": datetime.utcnow() + timedelta(days=2)
            },
            {
                "kid_id": kids[1].id,
                "title": "Feed the dog",
                "description": "Morning and evening",
                "difficulty": ChoreDifficulty.easy,
                "points": 10,
                "recurrence": ChoreRecurrence.daily,
                "status": ChoreStatus.approved,
                "completed_at": datetime.utcnow() - timedelta(hours=1),
                "approved_at": datetime.utcnow()
            },
            {
                "kid_id": kids[2].id,
                "title": "Set the dinner table",
                "description": "Plates, forks, napkins",
                "difficulty": ChoreDifficulty.easy,
                "points": 5,
                "recurrence": ChoreRecurrence.daily,
                "status": ChoreStatus.pending,
                "due_date": datetime.utcnow() + timedelta(hours=6)
            },
            {
                "kid_id": kids[2].id,
                "title": "Water the plants",
                "description": "All plants in living room",
                "difficulty": ChoreDifficulty.easy,
                "points": 10,
                "recurrence": ChoreRecurrence.weekly,
                "status": ChoreStatus.completed,
                "completed_at": datetime.utcnow() - timedelta(hours=3)
            }
        ]

        for chore_data in chores_data:
            chore = Chore(**chore_data)
            db.add(chore)

        db.commit()
        print(f"✅ Created {len(chores_data)} chores")

        # Create sample rewards
        print("Creating rewards...")
        rewards_data = [
            {
                "parent_id": parent.id,
                "reward_name": "Extra 30min screen time",
                "description": "Watch TV or play games",
                "cost": 50,
                "icon": "📱"
            },
            {
                "parent_id": parent.id,
                "reward_name": "Choose dinner tonight",
                "description": "Pick what we eat for dinner",
                "cost": 75,
                "icon": "🍕"
            },
            {
                "parent_id": parent.id,
                "reward_name": "Stay up 30min late",
                "description": "Extended bedtime on weekend",
                "cost": 100,
                "icon": "🌙"
            },
            {
                "parent_id": parent.id,
                "reward_name": "Ice cream trip",
                "description": "Go to ice cream shop",
                "cost": 150,
                "icon": "🍦"
            },
            {
                "parent_id": parent.id,
                "reward_name": "Movie night pick",
                "description": "Choose the family movie",
                "cost": 60,
                "icon": "🎬"
            }
        ]

        for reward_data in rewards_data:
            reward = Reward(**reward_data)
            db.add(reward)

        db.commit()
        print(f"✅ Created {len(rewards_data)} rewards")

        # Create sample calendar events
        print("Creating calendar events...")
        events_data = [
            {
                "family_id": parent.id,
                "title": "Soccer practice",
                "description": "Emma's soccer practice",
                "event_date": datetime.utcnow() + timedelta(days=1, hours=16),
                "color": "#10B981"
            },
            {
                "family_id": parent.id,
                "title": "Family game night",
                "description": "Board games after dinner",
                "event_date": datetime.utcnow() + timedelta(days=3, hours=19),
                "recurring": True,
                "color": "#8B5CF6"
            },
            {
                "family_id": parent.id,
                "title": "Piano lesson",
                "description": "Noah's piano lesson",
                "event_date": datetime.utcnow() + timedelta(days=2, hours=15),
                "color": "#F59E0B"
            }
        ]

        for event_data in events_data:
            event = CalendarEvent(**event_data)
            db.add(event)

        db.commit()
        print(f"✅ Created {len(events_data)} calendar events")

        print("\n🎉 Database seeding complete!")
        print("\n📧 Test login credentials:")
        print("   Email: parent@example.com")
        print("   Password: password123")
        print("\n✨ You can now start the app and login with these credentials!")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
