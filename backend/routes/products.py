from fastapi import APIRouter, UploadFile, File, Form
from ..models import Product
from ..database import products_collection
import shutil
import os

router = APIRouter(prefix="/products", tags=["Products"])

# Upload folder
UPLOAD_FOLDER = "uploads"


# ==========================
# ✅ ADD PRODUCT (with file upload)
# ==========================
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
    # Save file
    file_path = f"{UPLOAD_FOLDER}/{image.filename}"
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

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


# ==========================
# ✅ GET PRODUCTS
# ==========================
@router.get("")
def get_products(category: str = ""):
    products = []
    query = {}
    if category:
        query["category"] = {"$regex": f"^{category}$", "$options": "i"}  # exact match, case-insensitive
    
    for product in products_collection.find(query):
        product["id"] = str(product["_id"])  # convert ObjectId → string and rename to id
        product.pop("_id", None)  # remove the original _id
        
        # Add default fields expected by frontend
        if "inStock" not in product:
            product["inStock"] = True
        if "rating" not in product:
            product["rating"] = 4.5
        if "reviews" not in product:
            product["reviews"] = 0
            
        products.append(product)
    return products


# ==========================
# ✅ DELETE ALL PRODUCTS
# ==========================
@router.delete("")
def delete_all_products():
    result = products_collection.delete_many({})
    return {"message": f"{result.deleted_count} products deleted"}


# ==========================
# ✅ ADD MULTIPLE PRODUCTS (BULK)
# ==========================
@router.post("/bulk")
def add_multiple_products(products_list: list[Product]):
    product_list = [product.dict() for product in products_list]
    products_collection.insert_many(product_list)
    return {"message": "Multiple products added successfully"}


# ==========================
# ✅ DELETE SINGLE PRODUCT BY ID
# ==========================
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


# ==========================
# ✅ UPDATE PRODUCT BY ID (with optional file upload)
# ==========================
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
        # Build update fields
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
        
        # Handle image upload
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
