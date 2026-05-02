import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";

function ProviderDashboardPage() {
  const { user, logout } = useAuth();

  const isValidated = user?.providerValidated === true;
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return (
    <main className="app-container provider-dashboard-page">
      <section className="provider-dashboard-hero">
        <div>
          <span className="page-kicker">Espace prestataire</span>

          <h1 className="page-title">
            Bonjour{fullName ? `, ${fullName}` : ""}.
          </h1>

          <p className="page-subtitle">
            Gérez votre profil, vos packs, vos demandes de devis, vos
            réservations, votre planning et vos notifications depuis un espace
            professionnel.
          </p>

          <div className="provider-hero-actions">
            <Link className="link-btn" to={ROUTES.PROVIDER_PACKS}>
              Gérer mes packs
            </Link>

            <Link
              className="link-btn link-btn-secondary"
              to={ROUTES.PROVIDER_QUOTE_REQUESTS}
            >
              Voir les demandes
            </Link>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={logout}
            >
              Déconnexion
            </button>
          </div>
        </div>

        <div
          className={`provider-validation-card ${
            isValidated
              ? "provider-validation-card-success"
              : "provider-validation-card-warning"
          }`}
        >
          <span
            className={`badge ${
              isValidated ? "badge-success" : "badge-warning"
            }`}
          >
            {isValidated ? "Validé" : "En attente"}
          </span>

          <div className="provider-validation-icon">
            {isValidated ? "✓" : "!"}
          </div>

          <h2>Statut de validation</h2>

          {isValidated ? (
            <p>
              Votre compte prestataire est validé par l’admin. Vos packs actifs
              peuvent apparaître dans la recherche publique.
            </p>
          ) : (
            <p>
              Votre compte prestataire n’est pas encore validé par l’admin.
              Vous pouvez préparer votre profil et vos packs, mais ils ne seront
              pas visibles publiquement tant que l’admin ne valide pas votre
              compte.
            </p>
          )}
        </div>
      </section>

      <section className="provider-dashboard-grid">
        <ProviderDashboardCard
          title="Mon profil"
          description="Consultez et complétez les informations de votre activité prestataire."
          linkLabel="Voir mon profil"
          to={ROUTES.PROVIDER_PROFILE}
          badgeLabel="Profil"
          badgeClass="badge-info"
          icon="🏢"
        />

        <ProviderDashboardCard
          title="Mes packs"
          description="Créez, modifiez et activez vos offres visibles sur la marketplace."
          linkLabel="Gérer mes packs"
          to={ROUTES.PROVIDER_PACKS}
          badgeLabel="Catalogue"
          badgeClass="badge-success"
          icon="📦"
        />

        <ProviderDashboardCard
          title="Demandes de devis"
          description="Consultez les demandes envoyées par les clients et répondez rapidement."
          linkLabel="Voir les devis"
          to={ROUTES.PROVIDER_QUOTE_REQUESTS}
          badgeLabel="Devis"
          badgeClass="badge-warning"
          icon="📝"
        />

        <ProviderDashboardCard
          title="Réservations"
          description="Suivez vos réservations, acomptes, documents et confirmations client."
          linkLabel="Voir réservations"
          to={ROUTES.PROVIDER_BOOKINGS}
          badgeLabel="Bookings"
          badgeClass="badge-success"
          icon="📅"
        />

        <ProviderDashboardCard
          title="Planning"
          description="Visualisez simplement les dates importantes de vos événements."
          linkLabel="Ouvrir planning"
          to={ROUTES.PROVIDER_PLANNING}
          badgeLabel="Agenda"
          badgeClass="badge-info"
          icon="🗓️"
        />

        <ProviderDashboardCard
          title="Notifications"
          description="Recevez les alertes importantes liées aux devis, réservations et acomptes."
          linkLabel="Voir notifications"
          to={ROUTES.NOTIFICATIONS}
          badgeLabel="Alertes"
          badgeClass="badge-warning"
          icon="🔔"
        />

        <ProviderDashboardCard
          title="Onboarding"
          description="Complétez votre profil prestataire pour préparer votre validation admin."
          linkLabel="Compléter profil"
          to={ROUTES.PROVIDER_ONBOARDING}
          badgeLabel="Configuration"
          badgeClass="badge-info"
          icon="⚙️"
        />
      </section>
    </main>
  );
}

function ProviderDashboardCard({
  title,
  description,
  linkLabel,
  to,
  badgeLabel,
  badgeClass,
  icon,
}) {
  return (
    <article className="provider-dashboard-card">
      <div className="provider-dashboard-card-top">
        <div className="provider-dashboard-icon">{icon}</div>
        <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
      </div>

      <h2>{title}</h2>

      <p>{description}</p>

      <Link className="provider-dashboard-card-link" to={to}>
        {linkLabel}
        <span>→</span>
      </Link>
    </article>
  );
}

export default ProviderDashboardPage;