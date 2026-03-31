import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Send message to AI chatbot and get response
    const handleSend = async () => {
        if (!input) return;

        const userMsg = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);

        setLoading(true);

        const res = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input }),
        });

        const data = await res.json();
        setLoading(false);

        const botMsg = {
            sender: "bot",
            type: data.type,
            data: data.data,
            message: data.message
        };

        setMessages((prev) => [...prev, botMsg]);
        setInput("");
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* Toggle chat button */}
            <button onClick={() => setOpen(!open)} className="bg-black text-white px-4 py-2 rounded-full shadow-lg">
                💬 Chat
            </button>

            {/* Chat window */}
            {open && (
                <div className="mt-3 w-[400px] h-[550px] bg-white shadow-2xl rounded-2xl flex flex-col border border-gray-200">
                    <div className="p-3 border-b font-bold bg-black text-white rounded-t-2xl">
                        AI Assistant
                    </div>

                    {/* Messages display */}
                    <div className="flex-1 p-3 overflow-y-auto">
                        {loading && <p className="text-sm text-gray-400 mb-2">🤖 Typing...</p>}

                        {messages.map((msg, index) => (
                            <div key={index} className="mb-3">
                                {/* User message */}
                                {msg.sender === "user" && (
                                    <div className="text-right">
                                        <p className="bg-black text-white inline-block px-3 py-2 rounded-lg">
                                            {msg.text}
                                        </p>
                                    </div>
                                )}

                                {/* Bot text message */}
                                {msg.sender === "bot" && msg.type === "text" && (
                                    <div className="text-left">
                                        <p className="bg-gray-200 inline-block px-3 py-2 rounded-lg">
                                            {msg.message}
                                        </p>
                                    </div>
                                )}

                                {/* Bot product recommendations */}
                                {msg.sender === "bot" && msg.type === "products" && (
                                    <div className="text-left">
                                        {msg.message && <p className="text-sm text-gray-600 mb-2">{msg.message}</p>}
                                        {msg.data && msg.data.length === 0 && <p className="text-sm text-gray-500">No products found 😢</p>}
                                        {msg.data && msg.data.length > 0 && (
                                            <div className="grid grid-cols-2 gap-2">
                                                {msg.data.map((p: any) => (
                                                    <div key={p._id || p.id} onClick={() => navigate(`/product/${p._id || p.id}`)} className="border rounded-lg p-2 hover:shadow-md transition-shadow cursor-pointer">
                                                        <img src={p.image} alt={p.name} className="h-20 w-full object-cover rounded" />
                                                        <p className="text-xs font-semibold mt-1">{p.name}</p>
                                                        <p className="text-xs text-gray-500">₹{p.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Input field */}
                    <div className="p-2 border-t flex gap-2">
                        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSend()} className="flex-1 border rounded px-2 py-2" placeholder="Ask about products..." />
                        <button onClick={handleSend} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}
