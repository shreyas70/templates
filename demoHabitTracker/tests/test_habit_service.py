import pytest
from datetime import date, timedelta
import sys
import os

# Add the parent directory to the path so we can import the backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.models import Habit, HabitCompletion
from backend.services import HabitService

class TestHabitService:
    def setup_method(self):
        self.service = HabitService()
        # Add some test data
        self.habit1 = self.service.create_habit("Exercise", "Daily workout routine")
        self.habit2 = self.service.create_habit("Reading", "Read for 30 minutes")
        
    def test_create_habit(self):
        habit = self.service.create_habit("Meditation", "Morning meditation")
        assert habit.id is not None
        assert habit.name == "Meditation"
        assert habit.description == "Morning meditation"
        assert len(self.service.get_all_habits()) == 3
        
    def test_get_habit(self):
        habit = self.service.get_habit(self.habit1.id)
        assert habit.id == self.habit1.id
        assert habit.name == "Exercise"
        assert habit.description == "Daily workout routine"
        
    def test_get_nonexistent_habit(self):
        habit = self.service.get_habit(999)
        assert habit is None
        
    def test_update_habit(self):
        updated = self.service.update_habit(self.habit1.id, "Morning Exercise", "Early workout")
        assert updated.name == "Morning Exercise"
        assert updated.description == "Early workout"
        
        # Verify the update persisted
        habit = self.service.get_habit(self.habit1.id)
        assert habit.name == "Morning Exercise"
        
    def test_delete_habit(self):
        result = self.service.delete_habit(self.habit1.id)
        assert result is True
        assert len(self.service.get_all_habits()) == 1
        assert self.service.get_habit(self.habit1.id) is None
        
    def test_complete_habit(self):
        today = date.today()
        completion = self.service.complete_habit(self.habit1.id, today)
        assert completion.habit_id == self.habit1.id
        assert completion.completion_date == today
        
        # Check if the habit is marked as completed
        assert self.service.is_habit_completed(self.habit1.id, today) is True
        
    def test_get_habit_completions(self):
        today = date.today()
        yesterday = today - timedelta(days=1)
        
        self.service.complete_habit(self.habit1.id, today)
        self.service.complete_habit(self.habit1.id, yesterday)
        
        completions = self.service.get_habit_completions(self.habit1.id)
        assert len(completions) == 2
        assert any(c.completion_date == today for c in completions)
        assert any(c.completion_date == yesterday for c in completions)
        
    def test_get_streak(self):
        today = date.today()
        
        # Complete habit for 3 consecutive days
        for i in range(3):
            self.service.complete_habit(self.habit1.id, today - timedelta(days=i))
            
        streak = self.service.get_current_streak(self.habit1.id)
        assert streak == 3
        
    def test_broken_streak(self):
        today = date.today()
        
        # Complete habit for today and 2 days ago (skipping yesterday)
        self.service.complete_habit(self.habit1.id, today)
        self.service.complete_habit(self.habit1.id, today - timedelta(days=2))
        
        streak = self.service.get_current_streak(self.habit1.id)
        assert streak == 1  # Only today counts since the streak was broken
