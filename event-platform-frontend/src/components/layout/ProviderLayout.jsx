import { NavLink, Outlet } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";

function ProviderLayout() {
  const { user, logout } = useAuth();

  const isValidated = user?.providerValidated === true;

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-topbar-inner">
          <div className="app-brand">
            <span className="app-brand-title">Espace Prestataire</span>
            <span className="app-brand-subtitle">
              {user?.firstName || user?.email} ·{" "}
              {isValidated ? "Compte validé" : "En attente de validation"}
            </span>
          </div>

          <nav className="app-nav">
            <NavLink
              className={({ isActive }) =>
                isActive ? "app-nav-link active" : "app-nav-link"
              }
              to={ROUTES.PROVIDER_DASHBOARD}
            >
              Dashboard
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? "app-nav-link active" : "app-nav-link"
              }
              to={ROUTES.PROVIDER_PROFILE}
            >
              Profil
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? "app-nav-link active" : "app-nav-link"
              }
              to={ROUTES.PROVIDER_PACKS}
            >
              Packs
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? "app-nav-link active" : "app-nav-link"
              }
              to={ROUTES.PROVIDER_QUOTE_REQUESTS}
            >
              Devis
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? "app-nav-link active" : "app-nav-link"
              }
              to={ROUTES.PROVIDER_BOOKINGS}
            >
              Réservations
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? "app-nav-link active" : "app-nav-link"
              }
              to={ROUTES.PROVIDER_PLANNING}
            >
              Planning
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
        {!isValidated && (
          <div className="app-container" style={{ paddingBottom: 0 }}>
            <div className="alert alert-warning">
              Votre compte prestataire n’est pas encore validé par l’admin.
              Vous pouvez préparer votre profil et vos packs, mais ils ne seront
              pas visibles publiquement.
            </div>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
}

export default ProviderLayout;