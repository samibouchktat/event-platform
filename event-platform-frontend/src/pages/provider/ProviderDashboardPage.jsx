import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";

function ProviderDashboardPage() {
  const { user, logout } = useAuth();

  const isValidated = user?.providerValidated === true;

  return (
    <main className="app-container">
      <h1>Dashboard Prestataire</h1>

      <p>
        Bienvenue <strong>{user?.firstName}</strong>.
      </p>

      <section
        style={{
          marginTop: "1rem",
          padding: "1rem",
          border: isValidated ? "1px solid green" : "1px solid orange",
          borderRadius: "8px",
          backgroundColor: isValidated ? "#f1fff1" : "#fff8e6",
        }}
      >
        <h2>Statut de validation</h2>

        {isValidated ? (
          <p style={{ color: "green" }}>
            Votre compte prestataire est validé par l’admin. Vos packs actifs
            peuvent apparaître dans la recherche publique.
          </p>
        ) : (
          <p style={{ color: "orange" }}>
            Votre compte prestataire n’est pas encore validé par l’admin. Vous
            pouvez préparer votre profil et vos packs, mais ils ne seront pas
            visibles publiquement tant que l’admin ne valide pas votre compte.
          </p>
        )}
      </section>

      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Link to={ROUTES.PROVIDER_PROFILE}>Voir mon profil</Link>

        <Link to={ROUTES.PROVIDER_PACKS}>Mes packs</Link>

        <Link to={ROUTES.PROVIDER_QUOTE_REQUESTS}>Demandes de devis</Link>

        <Link to={ROUTES.PROVIDER_BOOKINGS}>Réservations</Link>

        <Link to={ROUTES.PROVIDER_PLANNING}>Planning</Link>

        <Link to={ROUTES.NOTIFICATIONS}>Notifications</Link>

        <Link to={ROUTES.PROVIDER_ONBOARDING}>Compléter mon profil</Link>

        <button type="button" onClick={logout}>
          Déconnexion
        </button>
      </div>
    </main>
  );
}

export default ProviderDashboardPage;