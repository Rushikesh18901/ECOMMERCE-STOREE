# Data Models (models.py)

## Purpose

Defines the data structures (models) used throughout the application. These use Pydantic for validation.

## Available Models

### 1. User Model

Used for user registration.

```python
class User(BaseModel):
    name: str           # User's full name
    email: str         # User's email (unique identifier)
    password: str      # User's password
    role: str = "user" # User role (default: "user")
```

### 2. Product Model

Represents a product in the store.

```python
class Product(BaseModel):
    name: str          # Product name
    description: str   # Product description
    price: int         # Product price in Rupees
    category: str      # Category (men, women, kids)
    size: List[str]   # Available sizes
    color: List[str]  # Available colors
    image: str        # Image filename
```

### 3. Order Model

Represents a purchase order.

```python
class Order(BaseModel):
    user_email: str    # Customer's email
    product_name: str # Product ordered
    quantity: int     # Quantity ordered
```

### 4. CartItem Model

Represents an item in the shopping cart.

```python
class CartItem(BaseModel):
    user_email: str    # User's email
    product_name: str # Product name
    quantity: int     # Number of items
```

### 5. LoginUser Model

Used for login authentication.

```python
class LoginUser(BaseModel):
    email: str    # User's email
    password: str # User's password
```

## Model Relationships

```mermaid
classDiagram
    class User {
        +string name
        +string email
        +string password
        +string role
    }
    
    class Product {
        +string name
        +string description
        +int price
        +string category
        +list size
        +list color
        +string image
    }
    
    class Order {
        +string user_email
        +string product_name
        +int quantity
    }
    
    class CartItem {
        +string user_email
        +string product_name
        +int quantity
    }
    
    User "1" -- "*" Order : places
    User "1" -- "*" CartItem : has
    Product "1" -- "*" Order : included in
    Product "1" -- "*" CartItem : included in
```

## Field Types Explained

| Type | Example | Description |
|------|---------|-------------|
| `str` | "John" | Text data |
| `int` | 1500 | Whole numbers |
| `List[str]` | ["S", "M", "L"] | Multiple text values |
| `str = "user"` | "user" | Default value if not provided |

## Validation

Pydantic validates the data:
- Required fields must be present
- Types must match (int must be a number)
- Default values are applied when not specified
