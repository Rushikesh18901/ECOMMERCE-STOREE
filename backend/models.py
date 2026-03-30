from pydantic import BaseModel
from typing import Optional
from typing import List

class User(BaseModel):
    name: str
    email: str
    password: str
    role: str = "user"   # ✅ ADD THIS



class Product(BaseModel):
    name: str
    description: str
    price: int
    category: str
    size: List[str]
    color: List[str]
    image: str   # ✅ ADD THIS
class Order(BaseModel):
    user_email: str
    product_name: str
    quantity: int

class CartItem(BaseModel):
    user_email: str
    product_name: str
    quantity: int

class LoginUser(BaseModel):
    email: str
    password: str

