import { NavLink, Outlet } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";

function ClientLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-topbar-inner">
          <div className="app-brand">
            <span className="app-brand-title">Espace Client</span>
            <span className="app-brand-subtitle">
              {user?.firstName || user?.email}
            </span>
          </div>

          <nav className="app-nav">
            <NavLink
              className={({ isActive }) =>
                isActive ? "app-nav-link active" : "app-nav-link"
              }
              to={ROUTES.CLIENT_DASHBOARD}
            >
              Dashboard
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? "app-nav-link active" : "app-nav-link"
              }
              to={ROUTES.PUBLIC_PACKS}
            >
              Rechercher
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? "app-nav-link active" : "app-nav-link"
              }
              to={ROUTES.CLIENT_QUOTE_REQUESTS}
            >
              Mes devis
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? "app-nav-link active" : "app-nav-link"
              }
              to={ROUTES.CLIENT_BOOKINGS}
            >
              Réservations
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? "app-nav-link active" : "app-nav-link"
              }
              to={ROUTES.NOTIFICATIONS}
            >
              Notifications
            </NavLink>

            <button className="app-nav-button" type="button" onClick={logout}>
              Déconnexion
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default ClientLayout;