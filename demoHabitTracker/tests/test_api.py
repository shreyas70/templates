import pytest
from fastapi.testclient import TestClient
import sys
import os
import json
from datetime import date, timedelta

# Add the parent directory to the path so we can import the backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.main import app

client = TestClient(app)

class TestHabitAPI:
    def setup_method(self):
        # Create a test habit
        response = client.post(
            "/habits/",
            json={"name": "Test Habit", "description": "Test Description"}
        )
        self.test_habit = response.json()
        
    def test_create_habit(self):
        response = client.post(
            "/habits/",
            json={"name": "New Habit", "description": "New Description"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "New Habit"
        assert data["description"] == "New Description"
        assert "id" in data
        
    def test_get_all_habits(self):
        response = client.get("/habits/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1  # At least our test habit should be there
        
    def test_get_habit(self):
        response = client.get(f"/habits/{self.test_habit['id']}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == self.test_habit["id"]
        assert data["name"] == "Test Habit"
        
    def test_get_nonexistent_habit(self):
        response = client.get("/habits/999")
        assert response.status_code == 404
        
    def test_update_habit(self):
        response = client.put(
            f"/habits/{self.test_habit['id']}",
            json={"name": "Updated Habit", "description": "Updated Description"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Habit"
        assert data["description"] == "Updated Description"
        
    def test_delete_habit(self):
        response = client.delete(f"/habits/{self.test_habit['id']}")
        assert response.status_code == 200
        
        # Verify it's deleted
        response = client.get(f"/habits/{self.test_habit['id']}")
        assert response.status_code == 404
        
    def test_complete_habit(self):
        today = date.today().isoformat()
        response = client.post(
            f"/habits/{self.test_habit['id']}/complete",
            json={"completion_date": today}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["habit_id"] == self.test_habit["id"]
        assert data["completion_date"] == today
        
    def test_get_habit_completions(self):
        # First, complete the habit for today
        today = date.today().isoformat()
        client.post(
            f"/habits/{self.test_habit['id']}/complete",
            json={"completion_date": today}
        )
        
        # Get completions
        response = client.get(f"/habits/{self.test_habit['id']}/completions")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert any(c["completion_date"] == today for c in data)
        
    def test_get_streak(self):
        # Complete habit for 3 consecutive days
        today = date.today()
        for i in range(3):
            completion_date = (today - timedelta(days=i)).isoformat()
            client.post(
                f"/habits/{self.test_habit['id']}/complete",
                json={"completion_date": completion_date}
            )
            
        response = client.get(f"/habits/{self.test_habit['id']}/streak")
        assert response.status_code == 200
        data = response.json()
        assert data["streak"] == 3
