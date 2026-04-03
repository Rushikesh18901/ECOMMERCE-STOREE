# Authentication Routes (auth.py)

## Purpose

Handles user registration and login operations.

## What It Does

1. **Register** - Creates a new user account with hashed password
2. **Login** - Verifies user credentials and returns user info

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Create a new user account |
| POST | `/login` | Login and get user details |

## Registration Flow

```mermaid
flowchart TD
    A[User submits registration] --> B[Receive User data]
    B --> C[Hash password with bcrypt]
    C --> D[Save to users collection]
    D --> E[Return success message]
    
    style A fill:#e1f5fe
    style C fill:#fff3e0
    style D fill:#e8f5e9
```

## Login Flow

```mermaid
flowchart TD
    A[User submits login] --> B[Find user by email]
    B --> C{User found?}
    C -->|No| D[Return error]
    C -->|Yes| E[Compare password]
    E --> F{Password correct?}
    F -->|No| G[Return error]
    F -->|Yes| H[Return user role & email]
    
    style A fill:#e1f5fe
    style C fill:#fce4ec
    style E fill:#fff3e0
    style H fill:#e8f5e9
```

## Data Models Used

### User Model
```python
class User(BaseModel):
    name: str          # User's full name
    email: str         # User's email (unique)
    password: str     # User's password (will be hashed)
    role: str = "user" # Role (default: "user")
```

### LoginUser Model
```python
class LoginUser(BaseModel):
    email: str    # User's email
    password: str # User's password
```

## Security Features

- **Password Hashing**: Uses bcrypt to hash passwords before storing
- **Salt Generation**: Each password gets a unique salt for security
- **Credential Verification**: Passwords are verified using bcrypt comparison
