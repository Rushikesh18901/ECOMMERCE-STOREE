import { Link } from "react-router-dom";
import { ShoppingCart, Menu, User } from 'lucide-react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export default function Header({ cartItemCount, onCartClick }: HeaderProps) {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Check for logged-in user from localStorage
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        checkUser();
      }
    };

    // Listen for custom login event (same-tab)
    const handleLoginEvent = () => {
      checkUser();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("user-login", handleLoginEvent);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-login", handleLoginEvent);
    };
  }, []);

  // Clear user session and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and navigation */}
          <div className="flex items-center gap-8">
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>

            <h1 className="text-2xl font-bold text-slate-900">LUXE</h1>

            <nav className="hidden lg:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                New Arrivals
              </a>
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Men
              </a>
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Women
              </a>
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Accessories
              </a>
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Sale
              </a>
            </nav>
          </div>

          {/* User actions and cart */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>

                {user.role === "admin" && (
                  <Link to="/admin" className="text-sm bg-blue-600 text-white px-3 py-1 rounded">
                    Admin
                  </Link>
                )}

                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-1 rounded">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm border px-3 py-1 rounded">
                  Login
                </Link>

                <Link to="/register" className="text-sm bg-black text-white px-3 py-1 rounded">
                  Register
                </Link>
              </>
            )}

            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <User className="w-5 h-5 text-gray-700" />
            </button>

            <button onClick={onCartClick} className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
