from pydantic import BaseModel
from typing import Optional, List

# User model for registration
class User(BaseModel):
    name: str
    email: str
    password: str
    role: str = "user"

# Product model for items
class Product(BaseModel):
    name: str
    description: str
    price: int
    category: str
    size: List[str]
    color: List[str]
    image: str

# Order model for purchases
class Order(BaseModel):
    user_email: str
    product_name: str
    quantity: int

# CartItem model for shopping cart
class CartItem(BaseModel):
    user_email: str
    product_name: str
    quantity: int

# LoginUser model for authentication
class LoginUser(BaseModel):
    email: str
    password: str
