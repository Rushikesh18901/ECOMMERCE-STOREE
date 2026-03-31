import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    role?: string;
}

// Protect routes requiring authentication
export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Redirect to home if user lacks required role
    if (role && user.role !== role) {
        return <Navigate to="/" />;
    }

    return children;
}