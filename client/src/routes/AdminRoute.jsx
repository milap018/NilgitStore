import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/common/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute() {
  const { user, loading, isAdmin } = useAuth();

// Admin access should wait for the auth session check to complete.
  if (loading) {
    return <Loader label="Checking admin access..." />;
  }

// Non-logged-in users must sign in first.
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

// Logged-in non-admin users are redirected away from admin screens.
  if (!isAdmin) {
    return <Navigate to="/products" replace />;
  }

  return <Outlet />;
}
