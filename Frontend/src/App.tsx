import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Chatbot from "./components/Chatbot";
import Login from "./pages/login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showCart, setShowCart] = useState(false);

  return (
    <Router>
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setShowCart(true)}
      />
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER PAGE - Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* PRODUCT DETAIL - Protected */}
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />

        {/* ADMIN PAGE - Protected with role */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;