# Database Documentation

## Overview

The application uses **MongoDB** as its database. MongoDB is a NoSQL (Not Only SQL) database that stores data in flexible, JSON-like documents.

## What is NoSQL?

| SQL (Traditional) | NoSQL (MongoDB) |
|--------------------|-----------------|
| Tables | Collections |
| Rows | Documents |
| Columns | Fields |
| Fixed Schema | Flexible Schema |

## Collections

### 1. Users Collection (`users`)

Stores user account information.

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$12$hashedpassword...",
  "role": "user"
}
```

### 2. Products Collection (`products`)

Stores product catalog.

```json
{
  "name": "Cotton Shirt",
  "description": "Comfortable cotton shirt",
  "price": 1500,
  "category": "men",
  "size": ["S", "M", "L", "XL"],
  "color": ["White", "Blue"],
  "image_data": "base64encodedstring...",
  "image_content_type": "image/jpeg"
}
```

### 3. Orders Collection (`orders`)

Records of purchases.

```json
{
  "user_email": "john@example.com",
  "product_name": "Cotton Shirt",
  "quantity": 2
}
```

### 4. Cart Collection (`cart`)

Shopping cart items.

```json
{
  "user_email": "john@example.com",
  "product_name": "Cotton Shirt",
  "quantity": 1
}
```

## Database Diagram

```mermaid
erDiagram
    users ||--o{ orders : places
    users ||--o{ cart : has
    products ||--o{ orders : in
    products ||--o{ cart : in
    
    users {
        string name
        string email PK
        string password
        string role
    }
    
    products {
        string name
        string description
        int price
        string category
        list size
        list color
        string image_data
    }
    
    orders {
        string user_email
        string product_name
        int quantity
    }
    
    cart {
        string user_email
        string product_name
        int quantity
    }
```

## Connection String

The database connection is configured in `backend/database.py`:

```python
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["ecommerce_db"]
```

## Setup Requirements

1. Install MongoDB or use MongoDB Atlas (cloud)
2. Create a `.env` file in the backend folder:
   ```
   MONGO_URI=mongodb://localhost:27017
   ```
   Or for Atlas:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce_db
   ```

## Query Examples

### Find all products
```python
products_collection.find({})
```

### Find products by category
```python
products_collection.find({"category": "men"})
```

### Find user by email
```python
users_collection.find_one({"email": "john@example.com"})
```

### Insert new product
```python
products_collection.insert_one(product_data)
```
