from fastapi import FastAPI
from .config import setup_cors
from .routes import auth, products, orders, cart, chatbot
import os

# Initialize FastAPI app
app = FastAPI()

# Create uploads folder for product images
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Setup CORS for frontend connection
setup_cors(app)

# Include API route modules
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(cart.router)
app.include_router(chatbot.router)

# Serve uploaded files statically
from fastapi.staticfiles import StaticFiles
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Root endpoint
@app.get("/")
def root():
    return {"message": "E-commerce Backend Running 🚀"}
