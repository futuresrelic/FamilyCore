"""
Test kids endpoints
Run: pytest tests/test_kids.py
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


@pytest.fixture
def auth_token():
    """Create a user and return auth token"""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "parent@test.com",
            "password": "password123",
            "full_name": "Test Parent"
        }
    )
    return response.json()["access_token"]


def test_create_kid(auth_token):
    """Test creating a kid profile"""
    response = client.post(
        "/api/v1/kids/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={
            "name": "Emma",
            "age": 10,
            "avatar_id": "🦄"
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Emma"
    assert data["age"] == 10
    assert data["avatar_id"] == "🦄"
    assert data["points"] == 0
    assert data["streak"] == 0


def test_get_all_kids(auth_token):
    """Test getting all kids for a parent"""
    # Create two kids
    client.post(
        "/api/v1/kids/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"name": "Kid One", "age": 8}
    )
    client.post(
        "/api/v1/kids/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"name": "Kid Two", "age": 6}
    )

    # Get all kids
    response = client.get(
        "/api/v1/kids/",
        headers={"Authorization": f"Bearer {auth_token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2


def test_update_kid(auth_token):
    """Test updating a kid profile"""
    # Create kid
    create_response = client.post(
        "/api/v1/kids/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"name": "Noah", "age": 7}
    )
    kid_id = create_response.json()["id"]

    # Update kid
    response = client.put(
        f"/api/v1/kids/{kid_id}",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"name": "Noah Updated", "age": 8, "points": 50}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Noah Updated"
    assert data["age"] == 8
    assert data["points"] == 50


def test_delete_kid(auth_token):
    """Test deleting a kid profile"""
    # Create kid
    create_response = client.post(
        "/api/v1/kids/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"name": "Sophia", "age": 6}
    )
    kid_id = create_response.json()["id"]

    # Delete kid
    response = client.delete(
        f"/api/v1/kids/{kid_id}",
        headers={"Authorization": f"Bearer {auth_token}"}
    )

    assert response.status_code == 200
    assert "deleted" in response.json()["message"].lower()


def test_create_kid_unauthorized():
    """Test creating kid without authentication fails"""
    response = client.post(
        "/api/v1/kids/",
        json={"name": "Test", "age": 10}
    )

    assert response.status_code == 401
