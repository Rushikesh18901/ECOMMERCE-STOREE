from fastapi import APIRouter
from ..models import CartItem
from ..database import cart_collection

router = APIRouter(prefix="/cart", tags=["Cart"])


# ==========================
# ✅ CART APIs
# ==========================
@router.post("/add")
def add_to_cart(item: CartItem):
    cart_collection.insert_one(item.dict())
    return {"message": "Item added to cart"}


@router.get("/{user_email}")
def get_cart(user_email: str):
    items = list(cart_collection.find({"user_email": user_email}, {"_id": 0}))
    return items
