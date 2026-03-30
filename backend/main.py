from fastapi import FastAPI
from .config import setup_cors
from .routes import auth, products, orders, cart, chatbot
import os

app = FastAPI()

# ✅ UPLOADS FOLDER
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# ✅ CORS (Frontend connect)
setup_cors(app)

# Include routers from modules
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(cart.router)
app.include_router(chatbot.router)

# ==========================
# ✅ SERVE IMAGES
# ==========================
from fastapi.staticfiles import StaticFiles
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# ==========================
# ✅ ROOT
# ==========================
@app.get("/")
def root():
    return {"message": "E-commerce Backend Running 🚀"}
