# E-Commerce Store

A full-stack e-commerce application built with React, TypeScript, and Python.

## Features

- User authentication (login/register)
- Product browsing with categories and filters
- Shopping cart functionality
- Order management
- AI-powered chatbot assistant
- Admin dashboard for product management

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend
- Python
- FastAPI
- Mongodb atlas (database)

## Prerequisites

- Node.js 18+
- Python 3.8+
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the backend server:
   ```bash
   python main.py
   ```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## Project Structure

```
ECOMMERCE-STOREE/
├── Frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── data/           # Static data
│   │   └── types/          # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── routes/             # API routes
│   ├── models.py           # Database models
│   ├── main.py             # Main application
│   └── requirements.txt
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/{product_id}` - Remove item from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

## License

MIT
