import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/common/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <Loader label="Checking admin access..." />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/products" replace />;
  }

  return <Outlet />;
}
