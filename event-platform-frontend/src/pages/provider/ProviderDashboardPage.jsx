import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";
import { hasProviderProfile } from "../../services/api/providerApi";

function ProviderDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const profileExists = await hasProviderProfile();

        if (!profileExists) {
          navigate(ROUTES.PROVIDER_ONBOARDING, { replace: true });
          return;
        }
      } catch (error) {
        console.error("Provider profile check failed:", error);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, [navigate]);

  if (checkingProfile) {
    return <p style={{ padding: "2rem" }}>Vérification du profil...</p>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Dashboard Prestataire</h1>

      <p>
        Bienvenue <strong>{user?.firstName}</strong>.
      </p>

      <p>
        Statut validation :{" "}
        <strong>{user?.providerValidated ? "Validé" : "En attente"}</strong>
      </p>

      <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
        <Link to={ROUTES.PROVIDER_PROFILE}>Voir mon profil</Link>
        <Link to={ROUTES.PROVIDER_PACKS}>Mes packs</Link>
        <Link to={ROUTES.PROVIDER_QUOTE_REQUESTS}>Demandes de devis</Link>
        <Link to={ROUTES.PROVIDER_ONBOARDING}>Compléter mon profil</Link>

        <button type="button" onClick={logout}>
          Déconnexion
        </button>
      </div>
    </main>
  );
}

export default ProviderDashboardPage;