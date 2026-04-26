import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import useAuth from "../hooks/useAuth";

function RoleBasedRoute({ allowedRoles = [] }) {
  const { user, initialLoading } = useAuth();

  if (initialLoading) {
    return <p style={{ padding: "2rem" }}>Chargement...</p>;
  }

  const hasAllowedRole = user?.roles?.some((role) =>
    allowedRoles.includes(role)
  );

  if (!hasAllowedRole) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}

export default RoleBasedRoute;