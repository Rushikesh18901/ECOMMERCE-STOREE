import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import { useNavigate } from "react-router-dom";

function Home() {
    const [products, setProducts] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState("");
    const navigate = useNavigate();

    // Fetch products from backend with optional category filter
    const fetchProducts = async (category = "") => {
        let url = "http://127.0.0.1:8000/products";
        if (category) {
            url += `?category=${category}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
    };

    // Load products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            {/* Hero section with banner */}
            <Hero />

            {/* Product listing section */}
            <div className="px-10 py-10">
                <h2 className="text-2xl font-bold mb-6">Our Products</h2>

                {/* Category filter buttons */}
                <div className="flex gap-4 mb-8">
                    {["", "men", "women", "kids"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                fetchProducts(cat);
                            }}
                            className={`px-5 py-2 rounded-full border transition 
                ${activeCategory === cat
                                    ? "bg-black text-white"
                                    : "bg-white text-black hover:bg-gray-100"
                                }`}
                        >
                            {cat === "" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Product grid display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => navigate(`/product/${p.id}`)}
                            className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 bg-white cursor-pointer"
                        >
                            {/* Product image */}
                            <div className="h-60 bg-gray-100 flex items-center justify-center overflow-hidden">
                                {p.image ? (
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400">Product Image</span>
                                )}
                            </div>

                            {/* Product details */}
                            <div className="p-4">
                                <h3 className="font-semibold text-lg">{p.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {p.description}
                                </p>

                                <div className="flex justify-between items-center mt-3">
                                    <span className="font-bold text-lg">₹{p.price}</span>
                                    <span className="text-xs text-gray-400 capitalize">
                                        {p.category}
                                    </span>
                                </div>

                                {/* Add to cart button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        alert("Added to cart");
                                    }}
                                    className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;