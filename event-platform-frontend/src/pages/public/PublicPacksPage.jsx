import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

function PublicPacksPage() {
  return (
    <main className="app-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Recherche de packs</h1>
          <p className="page-subtitle">
            Cette page affichera les packs publics des prestataires validés.
          </p>
        </div>

        <Link className="link-btn link-btn-secondary" to={ROUTES.HOME || "/"}>
          Accueil
        </Link>
      </div>

      <div className="empty-state">
        Page de recherche publique à connecter avec ton endpoint public packs.
      </div>
    </main>
  );
}

export default PublicPacksPage;