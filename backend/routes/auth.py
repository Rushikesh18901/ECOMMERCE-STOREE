from fastapi import APIRouter
import bcrypt
from ..models import LoginUser, User
from ..database import users_collection

router = APIRouter(prefix="", tags=["Authentication"])


# ==========================
# ✅ REGISTER USER
# ==========================
@router.post("/register")
def register(user: User):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(user.password.encode("utf-8"), salt)

    user_dict = user.dict()

    # ✅ DEFAULT ROLE (important)
    # Only set default role if not provided in request
    if "role" not in user_dict or not user_dict.get("role"):
        user_dict["role"] = "user"

    user_dict["password"] = hashed_password.decode("utf-8")

    users_collection.insert_one(user_dict)

    return {"message": "User registered successfully"}


# ==========================
# ✅ LOGIN USER (UPDATED)
# ==========================
@router.post("/login")
def login(user: LoginUser):
    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        return {"error": "User not found"}

    stored_password = db_user["password"].encode("utf-8")

    if not bcrypt.checkpw(user.password.encode("utf-8"), stored_password):
        return {"error": "Invalid password"}

    return {
        "message": "Login successful",
        "role": db_user.get("role", "user"),  # ✅ NEW
        "email": db_user["email"]             # ✅ NEW
    }
