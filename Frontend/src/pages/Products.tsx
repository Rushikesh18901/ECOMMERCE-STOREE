import { useEffect, useState } from "react";
import Filters from "../components/Filters";

function Products() {
    const [products, setProducts] = useState<any[]>([]);
    const [category, setCategory] = useState("");

    // Load products from backend
    useEffect(() => {
        fetch("http://127.0.0.1:8000/products").then(res => res.json()).then(data => setProducts(data));
    }, []);

    // Filter products by category
    const filteredProducts = category ? products.filter(p => p.category?.toLowerCase() === category?.toLowerCase()) : products;

    return (
        <div className="flex">
            <Filters setCategory={setCategory} />
            <div className="grid grid-cols-3 gap-4 p-4">
                {filteredProducts.map((p: any) => (
                    <div key={p.id} className="border p-4 rounded shadow">
                        {p.image && <img src={p.image} alt={p.name} className="w-full h-48 object-cover mb-2 rounded" />}
                        <h2 className="font-bold">{p.name}</h2>
                        <p>{p.description}</p>
                        <p className="text-blue-600">₹{p.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;