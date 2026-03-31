from fastapi import APIRouter, UploadFile, File, Form
from ..models import Product
from ..database import products_collection
import shutil
import os

router = APIRouter(prefix="/products", tags=["Products"])

UPLOAD_FOLDER = "uploads"

# Add new product with image upload
@router.post("")
async def add_product(
    name: str = Form(...),
    description: str = Form(...),
    price: int = Form(...),
    category: str = Form(...),
    size: str = Form("M,L"),
    color: str = Form("Black"),
    image: UploadFile = File(...)
):
    # Save uploaded image to uploads folder
    file_path = f"{UPLOAD_FOLDER}/{image.filename}"
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Create product document and insert into database
    product = {
        "name": name,
        "description": description,
        "price": price,
        "category": category,
        "size": size.split(","),
        "color": color.split(","),
        "image": f"http://127.0.0.1:8000/{file_path}"
    }
    products_collection.insert_one(product)
    return {"message": "Product added successfully"}

# Get all products with optional category filter
@router.get("")
def get_products(category: str = ""):
    products = []
    query = {"category": {"$regex": f"^{category}$", "$options": "i"}} if category else {}
    
    for product in products_collection.find(query):
        product["id"] = str(product["_id"])
        product.pop("_id", None)
        
        # Add default fields for frontend compatibility
        if "inStock" not in product:
            product["inStock"] = True
        if "rating" not in product:
            product["rating"] = 4.5
        if "reviews" not in product:
            product["reviews"] = 0
            
        products.append(product)
    return products

# Delete all products
@router.delete("")
def delete_all_products():
    result = products_collection.delete_many({})
    return {"message": f"{result.deleted_count} products deleted"}

# Add multiple products in bulk
@router.post("/bulk")
def add_multiple_products(products_list: list[Product]):
    product_list = [product.dict() for product in products_list]
    products_collection.insert_many(product_list)
    return {"message": "Multiple products added successfully"}

# Delete single product by ID
@router.delete("/{id}")
def delete_product(id: str):
    from bson import ObjectId
    from fastapi import HTTPException
    
    try:
        result = products_collection.delete_one({"_id": ObjectId(id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Deleted successfully"}

# Update product by ID with optional fields
@router.put("/{id}")
async def update_product(
    id: str,
    name: str = Form(None),
    description: str = Form(None),
    price: int = Form(None),
    category: str = Form(None),
    size: str = Form(None),
    color: str = Form(None),
    image: UploadFile = File(None)
):
    from bson import ObjectId
    from fastapi import HTTPException
    
    try:
        # Build update dictionary with provided fields
        update_data = {}
        if name is not None:
            update_data["name"] = name
        if description is not None:
            update_data["description"] = description
        if price is not None:
            update_data["price"] = price
        if category is not None:
            update_data["category"] = category
        if size is not None:
            update_data["size"] = size.split(",")
        if color is not None:
            update_data["color"] = color.split(",")
        
        # Handle optional image upload
        if image:
            file_path = f"{UPLOAD_FOLDER}/{image.filename}"
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            update_data["image"] = f"http://127.0.0.1:8000/{file_path}"
        
        result = products_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product updated successfully"}
