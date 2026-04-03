# Configuration (config.py)

## Purpose

Sets up CORS (Cross-Origin Resource Sharing) for the FastAPI application.

## What It Does

CORS allows the frontend application to communicate with the backend API. Without CORS, browsers would block requests from the frontend to the backend.

## Implementation

```python
def setup_cors(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
```

## CORS Settings Explained

| Setting | Value | Meaning |
|---------|-------|---------|
| allow_origins | localhost:5173 | Frontend URL allowed to make requests |
| allow_credentials | true | Cookies can be sent with requests |
| allow_methods | * | All HTTP methods allowed (GET, POST, etc.) |
| allow_headers | * | All headers allowed |

## Why This Matters

```mermaid
flowchart LR
    A[Frontend<br/>http://localhost:5173] -->|Request| B[Browser]
    B -->|Check CORS| C[Backend<br/>http://127.0.0.1:8000]
    C -->|Allow| D[Process Request]
    
    style A fill:#e1f5fe
    style C fill:#fff3e0
```

The frontend runs on port 5173 and the backend on port 8000. CORS allows these two different origins to talk to each other.
