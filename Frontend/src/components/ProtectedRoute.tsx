import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    role?: string;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // ❌ Not logged in
    if (!user) {
        return <Navigate to="/login" />;
    }

    // ❌ Wrong role
    if (role && user.role !== role) {
        return <Navigate to="/" />;
    }

    return children;
}