# System Architecture Overview

## High-Level Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#f5f5f5', 'primaryTextColor': '#333', 'primaryBorderColor': '#666', 'lineColor': '#666', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#fff' }}}%%
flowchart TB
    subgraph Frontend["Frontend (Reveal.js)"]
        UI["User Interface"]
        API_Client["API Client"]
    end
    
    subgraph Backend["Backend (FastAPI)"]
        API["REST API"]
        Service["Habit Service"]
        Store["In-Memory Store"]
    end
    
    UI --> API_Client
    API_Client --> API
    API --> Service
    Service --> Store
    
    classDef frontend fill:#a8dadc80,stroke:#457b9d,stroke-width:1px,color:#1d3557,font-family:Arial
    classDef backend fill:#e9c46a80,stroke:#f4a261,stroke-width:1px,color:#264653,font-family:Arial
    
    class UI,API_Client frontend
    class API,Service,Store backend
```

## Components
1. **Frontend**: A simple UI built with HTML, CSS, and JavaScript, using Reveal.js for presentation. The frontend communicates with the backend API to retrieve and update habit data.
2. **Backend**: A FastAPI application that provides REST endpoints for managing habits. The backend stores all data in memory, eliminating the need for a database.
3. **In-Memory Store**: A simple data structure that stores habits and their completion status in memory.

## Data Flow
1. User interacts with the UI to create, update, or view habits
2. The frontend sends API requests to the backend
3. The backend processes the requests and updates the in-memory store
4. The backend returns the updated data to the frontend
5. The frontend updates the UI to reflect the changes

## Security Considerations
As this is a simple demo application with in-memory storage, there are minimal security considerations. In a production environment, we would implement:
- User authentication
- Data encryption
- Input validation
- Rate limiting

## Scalability
The current implementation is designed for single-user usage with in-memory storage. For a production application, we would:
- Implement a proper database for persistence
- Add user authentication and multi-user support
- Implement caching for improved performance
- Consider containerization for deployment scalability
