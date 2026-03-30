from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load .env from backend folder
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

MONGO_URI = os.getenv("MONGO_URI")

print("MONGO_URI =", MONGO_URI)

client = MongoClient(MONGO_URI)
db = client["ecommerce_db"]

users_collection = db["users"]
products_collection = db["products"]
orders_collection = db["orders"]
cart_collection = db["cart"]

#print("Connected Database:", db.name)
#print("Cluster client:", client)
