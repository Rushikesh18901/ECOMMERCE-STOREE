import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
};

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  // Fetch products from backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/products").then((res) => res.json()).then((data) => setProducts(data)).catch((err) => console.error(err));
  }, []);

  // Filter products by category
  const filteredProducts = filter === "all" ? products : products.filter((p) => p.category?.toLowerCase() === filter);

  return (
    <div className="px-10 py-10 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Our Products</h2>

      {/* Category filter buttons */}
      <div className="flex gap-3 mb-8">
        {["all", "men", "women", "kids"].map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-full border capitalize transition ${filter === cat ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} onClick={() => navigate(`/product/${product._id}`)} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
              <img src={product.image || "https://via.placeholder.com/300x200?text=Product+Image"} alt={product.name} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-500 text-sm">{product.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <p className="font-bold text-lg">₹{product.price}</p>
                  <span className="text-xs text-gray-400">{product.category}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); alert("Added to cart"); }} className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}