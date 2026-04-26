import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";

function ClientDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Dashboard Client</h1>

      <p>
        Bienvenue <strong>{user?.firstName}</strong>.
      </p>

      <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
        <Link to={ROUTES.SEARCH}>Rechercher un prestataire</Link>

        <Link to={ROUTES.CLIENT_QUOTE_REQUESTS}>
          Mes demandes de devis
        </Link>

        <button type="button" onClick={logout}>
          Déconnexion
        </button>
      </div>
    </main>
  );
}

export default ClientDashboardPage;