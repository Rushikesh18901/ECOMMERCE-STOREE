import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    size: string[];
    color: string[];
};

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);

    // Fetch product details from backend
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/products`)
            .then((res) => res.json())
            .then((data) => {
                const found = data.find((p: Product) => p.id === id);
                setProduct(found);
            });
    }, [id]);

    if (!product) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Back navigation */}
            <button onClick={() => navigate(-1)} className="col-span-full mb-4 text-gray-600 hover:text-black flex items-center gap-2 w-fit">
                ← Back to Products
            </button>

            {/* Product image */}
            <div className="rounded-xl overflow-hidden bg-gray-100">
                <img src={product.image || "https://via.placeholder.com/500x500?text=Product+Image"} alt={product.name} className="w-full h-[500px] object-cover" />
            </div>

            {/* Product details */}
            <div>
                <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-2xl font-bold mb-4">₹{product.price}</p>

                {/* Size options */}
                {product.size && product.size.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Sizes:</h3>
                        <div className="flex gap-2 flex-wrap">
                            {product.size.map((s, i) => (
                                <span key={i} className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 cursor-pointer">{s}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Color options */}
                {product.color && product.color.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Colors:</h3>
                        <div className="flex gap-2 flex-wrap">
                            {product.color.map((c, i) => (
                                <span key={i} className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 cursor-pointer">{c}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-4">
                    <button className="bg-black text-white px-6 py-3 rounded-lg">Add to Cart</button>
                    <button className="bg-green-600 text-white px-6 py-3 rounded-lg">Buy Now</button>
                </div>
            </div>
        </div>
    );
}