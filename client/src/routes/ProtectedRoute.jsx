import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../components/common/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

// Wait until the session check finishes before deciding where to send the user.
  if (loading) {
    return <Loader label="Checking your session..." />;
  }

// Send unauthenticated users back to signin and remember where they came from.
  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
