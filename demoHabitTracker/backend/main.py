from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import List, Optional
from datetime import date

from models import (
    HabitCreate, 
    HabitUpdate, 
    HabitResponse, 
    HabitCompletionCreate, 
    HabitCompletionResponse,
    StreakResponse
)
from services import HabitService

app = FastAPI(title="Habit Tracker API")

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you'd specify the exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a singleton instance of the HabitService
habit_service = HabitService()

# Dependency to get the HabitService
def get_habit_service():
    return habit_service

@app.get("/")
def read_root():
    return {"message": "Welcome to the Habit Tracker API"}

@app.post("/habits/", response_model=HabitResponse)
def create_habit(
    habit: HabitCreate,
    service: HabitService = Depends(get_habit_service)
):
    db_habit = service.create_habit(habit.name, habit.description)
    return HabitResponse(
        id=db_habit.id,
        name=db_habit.name,
        description=db_habit.description,
        created_at=db_habit.created_at
    )

@app.get("/habits/", response_model=List[HabitResponse])
def get_all_habits(service: HabitService = Depends(get_habit_service)):
    habits = service.get_all_habits()
    return [
        HabitResponse(
            id=habit.id,
            name=habit.name,
            description=habit.description,
            created_at=habit.created_at
        )
        for habit in habits
    ]

@app.get("/habits/{habit_id}", response_model=HabitResponse)
def get_habit(
    habit_id: str,
    service: HabitService = Depends(get_habit_service)
):
    habit = service.get_habit(habit_id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return HabitResponse(
        id=habit.id,
        name=habit.name,
        description=habit.description,
        created_at=habit.created_at
    )

@app.put("/habits/{habit_id}", response_model=HabitResponse)
def update_habit(
    habit_id: str,
    habit: HabitUpdate,
    service: HabitService = Depends(get_habit_service)
):
    updated_habit = service.update_habit(
        habit_id, 
        name=habit.name, 
        description=habit.description
    )
    if not updated_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return HabitResponse(
        id=updated_habit.id,
        name=updated_habit.name,
        description=updated_habit.description,
        created_at=updated_habit.created_at
    )

@app.delete("/habits/{habit_id}")
def delete_habit(
    habit_id: str,
    service: HabitService = Depends(get_habit_service)
):
    success = service.delete_habit(habit_id)
    if not success:
        raise HTTPException(status_code=404, detail="Habit not found")
    return {"message": "Habit deleted successfully"}

@app.post("/habits/{habit_id}/complete", response_model=HabitCompletionResponse)
def complete_habit(
    habit_id: str,
    completion: HabitCompletionCreate,
    service: HabitService = Depends(get_habit_service)
):
    habit = service.get_habit(habit_id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
        
    db_completion = service.complete_habit(habit_id, completion.completion_date)
    return HabitCompletionResponse(
        id=db_completion.id,
        habit_id=db_completion.habit_id,
        completion_date=db_completion.completion_date
    )

@app.get("/habits/{habit_id}/completions", response_model=List[HabitCompletionResponse])
def get_habit_completions(
    habit_id: str,
    service: HabitService = Depends(get_habit_service)
):
    habit = service.get_habit(habit_id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
        
    completions = service.get_habit_completions(habit_id)
    return [
        HabitCompletionResponse(
            id=completion.id,
            habit_id=completion.habit_id,
            completion_date=completion.completion_date
        )
        for completion in completions
    ]

@app.get("/habits/{habit_id}/streak", response_model=StreakResponse)
def get_habit_streak(
    habit_id: str,
    service: HabitService = Depends(get_habit_service)
):
    habit = service.get_habit(habit_id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
        
    streak = service.get_current_streak(habit_id)
    return StreakResponse(habit_id=habit_id, streak=streak)

if __name__ == "__main__":
    # Add some sample data
    habit_service.create_habit("Morning Exercise", "Do 20 minutes of exercise every morning")
    habit_service.create_habit("Read Book", "Read at least 30 pages of a book")
    habit_service.create_habit("Drink Water", "Drink at least 8 glasses of water")
    
    # Run the server
    uvicorn.run(app, host="0.0.0.0", port=8000)
