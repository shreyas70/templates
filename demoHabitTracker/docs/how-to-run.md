# How to Run the Habit Tracker Application

This guide provides detailed instructions for setting up and running the Habit Tracker application.

## Prerequisites

- Python 3.9 or higher
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation

1. Clone the repository or download the source code
2. Navigate to the project directory:
   ```bash
   cd demoHabitTracker
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Backend Server

The backend server is built with FastAPI and provides the API endpoints for the habit tracker.

### Important Note About Running the Backend

When running the backend directly with Python, you need to use the `-m` flag to ensure proper module imports:

```bash
# Run from the parent directory of demoHabitTracker
python -m demoHabitTracker.backend.main
```

Alternatively, you can modify the imports in `backend/main.py` and `backend/services.py` to use absolute imports:

1. In `backend/main.py`, change:
   ```python
   from .models import (...)
   from .services import HabitService
   ```
   to:
   ```python
   from backend.models import (...)
   from backend.services import HabitService
   ```

2. In `backend/services.py`, change:
   ```python
   from .models import Habit, HabitCompletion
   ```
   to:
   ```python
   from backend.models import Habit, HabitCompletion
   ```

Then you can run the backend directly:
```bash
# Run from inside the demoHabitTracker directory
python backend/main.py
```

The server will start on `http://localhost:8000`.

## Running the Frontend

The frontend is a static HTML/CSS/JavaScript application that uses Reveal.js for the UI.

1. After starting the backend server, simply open the frontend HTML file in your web browser:
   - Navigate to the `frontend/index.html` file in your file explorer and open it
   - Or use a simple HTTP server:
     ```bash
     # Using Python's built-in HTTP server
     python -m http.server
     ```
     Then open `http://localhost:8000/frontend/index.html` in your browser

## Verifying the Setup

1. The backend server should show logs in the terminal where you started it
2. The frontend should display a welcome screen with navigation instructions
3. You should be able to create, view, and complete habits

## Troubleshooting

### Backend Server Won't Start

If you encounter an error like:
```
ImportError: attempted relative import with no known parent package
```

Follow the instructions in the "Running the Backend Server" section above to fix the import issues.

### Frontend Can't Connect to Backend

If the frontend can't connect to the backend:

1. Make sure the backend server is running
2. Check that the backend is running on port 8000
3. Verify that CORS is enabled (it should be by default)
4. Check the browser console for any error messages

### Data Persistence

Remember that all data is stored in memory. If you restart the backend server, all data will be lost. This is by design for this demo application.
