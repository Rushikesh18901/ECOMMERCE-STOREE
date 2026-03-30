from fastapi import APIRouter, Body
from backend.database import products_collection
from groq import Groq
import os
from dotenv import load_dotenv

# Load .env
load_dotenv()

router = APIRouter(prefix="/chat", tags=["Chatbot"])

# Initialize Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


@router.post("")
async def chat_bot(data: dict = Body(...)):
    user_message = data.get("message", "").lower()

    # First, check if user is asking for products
    product_keywords = ["men", "women", "kids", "shirt", "dress", "shoe", "watch", "jacket", "tshirt", "jeans", "kurta", "saree", "kurti", "kurties", "top", "salwar", "lehenga"]
    is_product_request = any(keyword in user_message for keyword in product_keywords)

    if is_product_request:
        # Search products in database
        results = []
        query_category = None
        query_name = None

        # Check for women-related terms FIRST (before men)
        women_terms = ["women", "woman", "girl", "ladies", "female", "kurti", "kurties", "saree", "salwar"]
        men_terms = ["men", "man", "boy", "male", "gentleman"]
        kids_terms = ["kids", "kid", "child", "children", "baby", "infant"]

        # Determine category - check for women's terms first
        if any(term in user_message for term in women_terms):
            query_category = "women"
            # Also check for specific product name
            if "kurta" in user_message or "kurti" in user_message or "kurties" in user_message:
                query_name = "kurta"
            elif "saree" in user_message:
                query_name = "saree"
            elif "dress" in user_message:
                query_name = "dress"
            elif "shirt" in user_message:
                query_name = "shirt"
            elif "top" in user_message:
                query_name = "top"
            elif "jean" in user_message or "jeans" in user_message:
                query_name = "jean"
        elif any(term in user_message for term in men_terms):
            query_category = "men"
            if "shirt" in user_message:
                query_name = "shirt"
            elif "jeans" in user_message:
                query_name = "jean"
            elif "jacket" in user_message:
                query_name = "jacket"
        elif any(term in user_message for term in kids_terms):
            query_category = "kids"

        # Price filter
        query_price = None
        if "under 1000" in user_message:
            query_price = {"$lte": 1000}
        elif "under 2000" in user_message:
            query_price = {"$lte": 2000}
        elif "under 500" in user_message:
            query_price = {"$lte": 500}
        elif "under 3000" in user_message:
            query_price = {"$lte": 3000}

        # Build the query
        if query_category and query_name and query_price:
            results = list(products_collection.find({"category": query_category, "name": {"$regex": query_name, "$options": "i"}, "price": query_price}).limit(6))
        elif query_category and query_name:
            results = list(products_collection.find({"category": query_category, "name": {"$regex": query_name, "$options": "i"}}).limit(6))
        elif query_category and query_price:
            results = list(products_collection.find({"category": query_category, "price": query_price}).limit(6))
        elif query_category:
            results = list(products_collection.find({"category": query_category}).limit(6))
        elif query_name and query_price:
            results = list(products_collection.find({"name": {"$regex": query_name, "$options": "i"}, "price": query_price}).limit(6))
        elif query_name:
            results = list(products_collection.find({"name": {"$regex": query_name, "$options": "i"}}).limit(6))
        elif query_price:
            results = list(products_collection.find({"price": query_price}).limit(6))
        else:
            # Default: search by any product name mentioned
            search_terms = ["shirt", "dress", "shoe", "watch", "jeans", "jacket", "kurta", "saree", "kurti", "kurties"]
            for term in search_terms:
                if term in user_message:
                    results = list(products_collection.find({"name": {"$regex": term, "$options": "i"}}).limit(6))
                    break
            if not results:
                # Try searching in all products
                results = list(products_collection.find().limit(6))

        # Convert Mongo ObjectId to string
        for r in results:
            r["_id"] = str(r["_id"])
            r["id"] = r["_id"]  # Add id field for consistency

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

    # For non-product queries, use Groq LLM
    try:
        # Get product list for context (sample)
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

        ai_response = chat_completion.choices[0].message.content

        return {
            "type": "text",
            "data": None,
            "message": ai_response
        }

    except Exception as e:
        print(f"Groq API error: {e}")
        # Fallback: Show popular products
        fallback_results = list(products_collection.find().limit(6))
        for r in fallback_results:
            r["_id"] = str(r["_id"])
            r["id"] = r["_id"]
        return {
            "type": "products",
            "data": fallback_results,
            "message": "Here are some popular products you might like!"
        }
