# Habit Tracker Demo Application

A simple habit tracker application with a FastAPI backend and Reveal.js frontend. This application allows users to track their daily habits and visualize their progress over time.

## Features

- Create and manage habits
- Track daily habit completion
- View habit completion history and streaks
- Simple, intuitive UI built with Reveal.js
- In-memory data storage (no database required)

## Project Structure

```
demoHabitTracker/
├── backend/              # FastAPI backend
│   ├── __init__.py
│   ├── main.py           # Main application entry point
│   ├── models.py         # Data models
│   └── services.py       # Business logic
├── docs/                 # Documentation
│   ├── architecture/     # Architecture documentation
│   ├── roadmap/          # Project roadmap
│   ├── state/            # Current state
│   ├── README.md         # Documentation overview
│   └── vision.md         # Project vision
├── frontend/             # Reveal.js frontend
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   └── index.html        # Main HTML file
├── slides/               # Presentation slides
│   ├── css/              # Slide stylesheets
│   └── index.html        # Slide deck
├── tests/                # Test files
│   ├── test_api.py       # API tests
│   └── test_habit_service.py  # Service tests
└── README.md             # Project README
```

## Getting Started

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

### Installation

1. Clone the repository
2. Install the required Python packages:

```bash
pip install fastapi uvicorn pytest httpx
```

### Running the Application

1. Start the backend server:

```bash
# Run from the parent directory of demoHabitTracker
python -m demoHabitTracker.backend.main
```

Or, if you've modified the imports to use absolute imports:

```bash
# Run from inside the demoHabitTracker directory
python backend/main.py
```

2. Open the frontend in your web browser:
   - Navigate to `demoHabitTracker/frontend/index.html` in your file explorer and open it with your browser
   - Or use a simple HTTP server: `python -m http.server` and navigate to `http://localhost:8000/frontend/index.html`

For detailed instructions and troubleshooting, see the [How to Run](docs/how-to-run.md) guide.

### Running Tests

```bash
cd demoHabitTracker
pytest tests/
```

## Documentation

For more detailed information about the project, check out the documentation in the `docs/` directory:

- [Project Vision](docs/vision.md)
- [Architecture Overview](docs/architecture/system-overview.md)
- [Tech Stack](docs/architecture/tech-stack.md)
- [Current State](docs/state/current-state.md)
- [Roadmap](docs/roadmap/milestones.md)
- [How to Run](docs/how-to-run.md)

## Presentation

To view the project presentation:

1. Open `slides/index.html` in your web browser

## License

This project is open source and available under the MIT License.
