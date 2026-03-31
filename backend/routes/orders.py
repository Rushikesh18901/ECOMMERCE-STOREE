from fastapi import APIRouter
from ..models import Order
from ..database import orders_collection

router = APIRouter(prefix="/orders", tags=["Orders"])

# Place a new order
@router.post("")
def place_order(order: Order):
    orders_collection.insert_one(order.dict())
    return {"message": "Order placed successfully"}
