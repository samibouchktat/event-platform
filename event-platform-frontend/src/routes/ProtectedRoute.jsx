import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import useAuth from "../hooks/useAuth";

function ProtectedRoute() {
  const { isAuthenticated, initialLoading } = useAuth();

  if (initialLoading) {
    return <p style={{ padding: "2rem" }}>Chargement...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;