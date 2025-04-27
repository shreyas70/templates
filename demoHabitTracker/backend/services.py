from typing import List, Optional, Dict
from datetime import date, timedelta
from models import Habit, HabitCompletion

class HabitService:
    def __init__(self):
        self.habits: Dict[str, Habit] = {}
        self.completions: Dict[str, HabitCompletion] = {}
        
    def create_habit(self, name: str, description: str = None) -> Habit:
        habit = Habit(name, description)
        self.habits[habit.id] = habit
        return habit
        
    def get_all_habits(self) -> List[Habit]:
        return list(self.habits.values())
        
    def get_habit(self, habit_id: str) -> Optional[Habit]:
        return self.habits.get(habit_id)
        
    def update_habit(self, habit_id: str, name: str = None, description: str = None) -> Optional[Habit]:
        habit = self.get_habit(habit_id)
        if not habit:
            return None
            
        if name:
            habit.name = name
        if description:
            habit.description = description
            
        return habit
        
    def delete_habit(self, habit_id: str) -> bool:
        if habit_id not in self.habits:
            return False
            
        del self.habits[habit_id]
        
        # Delete associated completions
        self.completions = {k: v for k, v in self.completions.items() if v.habit_id != habit_id}
        
        return True
        
    def complete_habit(self, habit_id: str, completion_date: date) -> Optional[HabitCompletion]:
        habit = self.get_habit(habit_id)
        if not habit:
            return None
            
        # Check if already completed for this date
        for completion in self.completions.values():
            if completion.habit_id == habit_id and completion.completion_date == completion_date:
                return completion
                
        # Create new completion
        completion = HabitCompletion(habit_id, completion_date)
        self.completions[completion.id] = completion
        return completion
        
    def is_habit_completed(self, habit_id: str, date: date) -> bool:
        for completion in self.completions.values():
            if completion.habit_id == habit_id and completion.completion_date == date:
                return True
        return False
        
    def get_habit_completions(self, habit_id: str) -> List[HabitCompletion]:
        return [c for c in self.completions.values() if c.habit_id == habit_id]
        
    def get_current_streak(self, habit_id: str) -> int:
        habit = self.get_habit(habit_id)
        if not habit:
            return 0
            
        completions = self.get_habit_completions(habit_id)
        if not completions:
            return 0
            
        # Get all completion dates
        completion_dates = [c.completion_date for c in completions]
        completion_dates.sort(reverse=True)
        
        # Calculate streak
        streak = 1
        current_date = completion_dates[0]
        
        for i in range(1, 100):  # Limit to 100 days to avoid infinite loop
            prev_date = current_date - timedelta(days=1)
            if prev_date in completion_dates:
                streak += 1
                current_date = prev_date
            else:
                break
                
        return streak
