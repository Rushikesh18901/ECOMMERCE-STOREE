import { useEffect, useState } from "react";

type Product = {
    _id?: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    size?: string[];
    color?: string[] | string;
};

const SIZES = ["S", "M", "L", "XL", "XXL"];
const CATEGORIES = ["men", "women", "kids", "accessories"];

export default function Admin() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [form, setForm] = useState<Product>({
        name: "",
        description: "",
        price: 0,
        category: "men",
        image: "",
        size: [],
        color: []
    });

    // 🔹 Fetch products
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        fetch("http://127.0.0.1:8000/products")
            .then(res => res.json())
            .then(data => setProducts(data));
    };

    // 🔹 Handle size toggle
    const toggleSize = (size: string) => {
        const currentSizes = form.size || [];
        if (currentSizes.includes(size)) {
            setForm({ ...form, size: currentSizes.filter(s => s !== size) });
        } else {
            setForm({ ...form, size: [...currentSizes, size] });
        }
    };

    // 🔹 Add product
    const addProduct = async () => {
        if (!form.name || !form.description || !form.price || !form.category) {
            alert("Please fill in all fields");
            return;
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", String(form.price));
        formData.append("category", form.category);
        formData.append("size", form.size?.join(",") || "M,L");
        formData.append("color", getColorDisplay() || "Black");

        if (imageFile) {
            formData.append("image", imageFile);
        }

        await fetch("http://127.0.0.1:8000/products", {
            method: "POST",
            body: formData
        });

        alert("Product Added ✅");
        resetForm();
        fetchProducts();
    };

    // 🔹 Update product
    const updateProduct = async () => {
        if (!form.name || !form.description || !form.price || !form.category) {
            alert("Please fill in all fields");
            return;
        }

        // If there's a new image file, use file upload; otherwise use JSON
        if (imageFile) {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("price", String(form.price));
            formData.append("category", form.category);
            formData.append("size", form.size?.join(",") || "M,L");
            formData.append("color", getColorDisplay() || "Black");
            formData.append("image", imageFile);

            await fetch(`http://127.0.0.1:8000/products/${editId}`, {
                method: "PUT",
                body: formData
            });
        } else {
            await fetch(`http://127.0.0.1:8000/products/${editId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...form,
                    size: form.size || ["M", "L"],
                    color: form.color || ["Black"]
                })
            });
        }

        alert("Product Updated ✅");
        resetForm();
        fetchProducts();
    };

    // 🔹 Delete product
    const deleteProduct = async (id: string) => {
        await fetch(`http://127.0.0.1:8000/products/${id}`, {
            method: "DELETE"
        });

        setProducts(products.filter(p => p._id !== id));
    };

    // 🔹 Edit product - populate form
    const editProduct = (product: Product) => {
        setIsEditing(true);
        setEditId(product._id!);
        setImageFile(null); // Reset file input when editing

        // Handle color - convert string to array if needed
        const colorValue = product.color
            ? (typeof product.color === 'string'
                ? product.color.split(',').map(c => c.trim())
                : product.color)
            : [];

        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
            size: product.size || [],
            color: colorValue
        });
    };

    // 🔹 Reset form
    const resetForm = () => {
        setIsEditing(false);
        setEditId(null);
        setImageFile(null);
        setForm({
            name: "",
            description: "",
            price: 0,
            category: "men",
            image: "",
            size: [],
            color: []
        });
    };

    // Helper to get color string for display in input
    const getColorDisplay = () => {
        if (!form.color) return "";
        if (Array.isArray(form.color)) return form.color.join(", ");
        return form.color;
    };

    // Helper to handle color input change
    const handleColorChange = (value: string) => {
        const colors = value.split(",").map(c => c.trim()).filter(c => c);
        setForm({ ...form, color: colors });
    };

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            {/* ADD/EDIT PRODUCT FORM */}
            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">
                    {isEditing ? "Edit Product" : "Add New Product"}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        placeholder="Name"
                        className="border p-2 rounded"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        placeholder="Description"
                        className="border p-2 rounded"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    <input
                        placeholder="Price"
                        type="number"
                        className="border p-2 rounded"
                        value={form.price || ""}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    />
                    {/* CATEGORY SELECTION */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">Category:</label>
                        <div className="flex gap-4">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setForm({ ...form, category: cat })}
                                    className={`px-4 py-2 rounded border ${form.category === cat
                                        ? "bg-black text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* IMAGE UPLOAD */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">
                            {isEditing ? "Change Image (optional):" : "Product Image:"}
                        </label>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            className="border p-2 rounded w-full"
                        />
                        {form.image && !imageFile && (
                            <p className="text-sm text-gray-500 mt-2">Current image: {form.image}</p>
                        )}
                    </div>

                    {/* SIZE SELECTION */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">Select Sizes:</label>
                        <div className="flex gap-4">
                            {SIZES.map((size) => (
                                <label key={size} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.size?.includes(size) || false}
                                        onChange={() => toggleSize(size)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">{size}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* COLOR INPUT */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">Color:</label>
                        <input
                            placeholder="Enter color (e.g., Black, Blue, Red)"
                            className="border p-2 rounded w-full"
                            value={getColorDisplay()}
                            onChange={(e) => handleColorChange(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-4 mt-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={updateProduct}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Update Product
                            </button>
                            <button
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={addProduct}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Add Product
                        </button>
                    )}
                </div>
            </div>

            {/* PRODUCT LIST */}
            <h2 className="text-xl font-semibold mb-4">Product List</h2>
            <div className="grid grid-cols-3 gap-4">
                {products.map((p) => (
                    <div key={p._id} className="border p-4 rounded hover:shadow-lg">
                        <img src={p.image} alt={p.name} className="h-32 w-full object-cover rounded" />
                        <h3 className="font-bold mt-2">{p.name}</h3>
                        <p className="text-gray-600 text-sm">{p.description}</p>
                        <p className="font-bold text-lg">₹{p.price}</p>
                        <p className="text-sm text-gray-500">Category: {p.category}</p>
                        <p className="text-sm text-gray-500">Sizes: {p.size?.join(", ") || "N/A"}</p>

                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => editProduct(p)}
                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteProduct(p._id!)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}