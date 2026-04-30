import { Link, Outlet } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";
import "../../styles/admin.css";

function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-brand">
            <span className="admin-brand-title">Event Platform Admin</span>
            <span className="admin-brand-subtitle">
              Connecté : {user?.firstName || user?.email}
            </span>
          </div>

          <nav className="admin-nav">
            <Link to={ROUTES.ADMIN_DASHBOARD}>Dashboard</Link>
            <Link to={ROUTES.ADMIN_PROVIDERS}>Prestataires</Link>
            <Link to={ROUTES.ADMIN_USERS}>Utilisateurs</Link>
            <Link to={ROUTES.NOTIFICATIONS}>Notifications</Link>
            <Link to={ROUTES.ADMIN_REPORTS}>Reporting</Link>
            <button type="button" onClick={logout}>
              Déconnexion
            </button>
          </nav>
        </div>
      </header>

      <Outlet />
    </div>
  );
}

export default AdminLayout;