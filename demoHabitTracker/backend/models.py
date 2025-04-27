from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
import uuid

class Habit:
    def __init__(self, name: str, description: str = None):
        self.id = str(uuid.uuid4())
        self.name = name
        self.description = description or ""
        self.created_at = date.today()

class HabitCompletion:
    def __init__(self, habit_id: str, completion_date: date):
        self.id = str(uuid.uuid4())
        self.habit_id = habit_id
        self.completion_date = completion_date

# Pydantic models for API request/response
class HabitCreate(BaseModel):
    name: str
    description: Optional[str] = None

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class HabitResponse(BaseModel):
    id: str
    name: str
    description: str
    created_at: date

class HabitCompletionCreate(BaseModel):
    completion_date: date

class HabitCompletionResponse(BaseModel):
    id: str
    habit_id: str
    completion_date: date

class StreakResponse(BaseModel):
    habit_id: str
    streak: int
