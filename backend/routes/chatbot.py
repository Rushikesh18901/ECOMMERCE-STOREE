from fastapi import APIRouter, Body
from backend.database import products_collection
from groq import Groq
import os
from dotenv import load_dotenv

# Load API key from environment
load_dotenv()

router = APIRouter(prefix="/chat", tags=["Chatbot"])

# Initialize Groq client for AI responses
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Product search keywords
PRODUCT_KEYWORDS = ["men", "women", "kids", "shirt", "dress", "shoe", "watch", "jacket", "tshirt", "jeans", "kurta", "saree", "kurti", "kurties", "top", "salwar", "lehenga"]
CATEGORY_TERMS = {
    "women": ["women", "woman", "girl", "ladies", "female", "kurti", "kurties", "saree", "salwar"],
    "men": ["men", "man", "boy", "male", "gentleman"],
    "kids": ["kids", "kid", "child", "children", "baby", "infant"]
}
PRODUCT_NAMES = {
    "women": {"kurta": "kurta", "saree": "saree", "dress": "dress", "shirt": "shirt", "top": "top", "jean": "jean"},
    "men": {"shirt": "shirt", "jeans": "jean", "jacket": "jacket"}
}
PRICE_FILTERS = {
    "under 1000": {"$lte": 1000},
    "under 2000": {"$lte": 2000},
    "under 500": {"$lte": 500},
    "under 3000": {"$lte": 3000}
}

@router.post("")
async def chat_bot(data: dict = Body(...)):
    user_message = data.get("message", "").lower()

    # Check if user is asking for products
    is_product_request = any(keyword in user_message for keyword in PRODUCT_KEYWORDS)

    if is_product_request:
        results, query_category = search_products(user_message)
        
        # Convert MongoDB ObjectId to string
        for r in results:
            r["_id"] = str(r["_id"])
            r["id"] = r["_id"]

        if results:
            return {
                "type": "products",
                "data": results,
                "message": f"Here are some {query_category if query_category else 'best'} products I found for you:"
            }
        else:
            return {
                "type": "text",
                "data": None,
                "message": "Sorry, no matching products found. Try different keywords like 'men shirt', 'women kurti', or 'kids wear'."
            }

    # Use Groq AI for non-product queries
    try:
        sample_products = list(products_collection.find({}, {"name": 1, "category": 1, "price": 1}).limit(10))
        product_info = "\n".join([f"- {p.get('name', 'Unknown')} ({p.get('category', 'N/A')}) - ₹{p.get('price', 0)}" for p in sample_products])

        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": f"You are a helpful e-commerce shopping assistant. You help users find products. Our store has categories: men, women, kids. Available products:\n{product_info}\n\nIf user asks about products, recommend from available items. Be friendly and concise."
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            model="llama-3.1-8b-instant",
            max_tokens=200,
            temperature=0.7
        )

        return {
            "type": "text",
            "data": None,
            "message": chat_completion.choices[0].message.content
        }

    except Exception as e:
        print(f"Groq API error: {e}")
        fallback_results = list(products_collection.find().limit(6))
        for r in fallback_results:
            r["_id"] = str(r["_id"])
            r["id"] = r["_id"]
        return {
            "type": "products",
            "data": fallback_results,
            "message": "Here are some popular products you might like!"
        }

def search_products(user_message: str):
    """Search products based on user message keywords and filters."""
    query_category = None
    query_name = None
    query_price = None
    
    # Determine category
    for category, terms in CATEGORY_TERMS.items():
        if any(term in user_message for term in terms):
            query_category = category
            break
    
    # Determine specific product name
    if query_category and query_category in PRODUCT_NAMES:
        for key, value in PRODUCT_NAMES[query_category].items():
            if key in user_message:
                query_name = value
                break
    
    # Determine price filter
    for price_key, price_value in PRICE_FILTERS.items():
        if price_key in user_message:
            query_price = price_value
            break
    
    # Build MongoDB query
    query = {}
    if query_category:
        query["category"] = query_category
    if query_name:
        query["name"] = {"$regex": query_name, "$options": "i"}
    if query_price:
        query["price"] = query_price
    
    results = list(products_collection.find(query).limit(6))
    
    # Fallback search if no results
    if not results and not query_price:
        search_terms = ["shirt", "dress", "shoe", "watch", "jeans", "jacket", "kurta", "saree", "kurti"]
        for term in search_terms:
            if term in user_message:
                results = list(products_collection.find({"name": {"$regex": term, "$options": "i"}}).limit(6))
                break
        if not results:
            results = list(products_collection.find().limit(6))
    
    return results, query_category
