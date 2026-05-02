import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";

function ClientDashboardPage() {
  const { user } = useAuth();

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return (
    <main className="app-container client-dashboard-page">
      <section className="client-dashboard-hero">
        <div>
          <span className="page-kicker">Espace client</span>

          <h1 className="page-title">
            Bonjour{fullName ? `, ${fullName}` : ""}.
          </h1>

          <p className="page-subtitle">
            Recherchez des prestataires, suivez vos demandes de devis,
            vos réservations, vos documents et vos notifications depuis un
            espace simple.
          </p>

          <div className="client-hero-actions">
            <Link className="link-btn" to={ROUTES.PUBLIC_PACKS || "/packs"}>
              Rechercher un pack
            </Link>

            <Link
              className="link-btn link-btn-secondary"
              to={ROUTES.CLIENT_QUOTE_REQUESTS}
            >
              Voir mes devis
            </Link>
          </div>
        </div>

        <div className="client-hero-summary">
          <span className="badge badge-success">Client</span>

          <div className="client-summary-icon">👤</div>

          <strong>{fullName || "Client"}</strong>
          <span>{user?.email || "Email non disponible"}</span>
        </div>
      </section>

      <section className="client-dashboard-grid">
        <DashboardCard
          title="Rechercher un pack"
          description="Trouvez des prestataires validés selon votre ville, budget, service et type d’événement."
          linkLabel="Rechercher"
          to={ROUTES.PUBLIC_PACKS || "/packs"}
          badgeLabel="Recherche"
          badgeClass="badge-info"
          icon="🔎"
        />

        <DashboardCard
          title="Mes demandes de devis"
          description="Consultez vos demandes envoyées et suivez leur statut auprès des prestataires."
          linkLabel="Voir mes devis"
          to={ROUTES.CLIENT_QUOTE_REQUESTS}
          badgeLabel="Devis"
          badgeClass="badge-warning"
          icon="📝"
        />

        <DashboardCard
          title="Mes réservations"
          description="Suivez vos réservations, acomptes, documents et confirmations."
          linkLabel="Voir réservations"
          to={ROUTES.CLIENT_BOOKINGS}
          badgeLabel="Bookings"
          badgeClass="badge-success"
          icon="📅"
        />

        <DashboardCard
          title="Notifications"
          description="Restez informé des réponses prestataires, réservations créées et acomptes confirmés."
          linkLabel="Voir notifications"
          to={ROUTES.NOTIFICATIONS}
          badgeLabel="Alertes"
          badgeClass="badge-warning"
          icon="🔔"
        />
      </section>

      <section className="client-dashboard-bottom">
        <article className="card client-account-card">
          <div className="client-section-header">
            <div>
              <span className="badge badge-info">Compte</span>
              <h2 className="card-title mt-1">Résumé du compte</h2>
            </div>
          </div>

          <div className="info-list">
            <InfoRow label="Nom" value={fullName || "Non renseigné"} />
            <InfoRow label="Email" value={user?.email || "Non disponible"} />
            <InfoRow label="Type de compte" value="Client" />
          </div>
        </article>

        <article className="card client-steps-card">
          <div className="client-section-header">
            <div>
              <span className="badge badge-success">Parcours</span>
              <h2 className="card-title mt-1">Parcours recommandé</h2>
            </div>
          </div>

          <div className="client-steps-list">
            <StepItem
              number="1"
              title="Recherchez un pack"
              text="Utilisez les filtres pour trouver une offre adaptée à votre événement."
            />

            <StepItem
              number="2"
              title="Envoyez une demande de devis"
              text="Expliquez votre besoin, la date, la ville et le nombre d’invités."
            />

            <StepItem
              number="3"
              title="Suivez la réponse"
              text="Le prestataire peut accepter, refuser ou discuter votre demande."
            />

            <StepItem
              number="4"
              title="Confirmez la réservation"
              text="Une fois la réservation créée, suivez l’acompte et les documents."
            />
          </div>
        </article>
      </section>
    </main>
  );
}

function DashboardCard({
  title,
  description,
  linkLabel,
  to,
  badgeLabel,
  badgeClass,
  icon,
}) {
  return (
    <article className="client-dashboard-card">
      <div className="client-dashboard-card-top">
        <div className="client-dashboard-icon">{icon}</div>
        <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
      </div>

      <h2>{title}</h2>

      <p>{description}</p>

      <Link className="client-dashboard-card-link" to={to}>
        {linkLabel}
        <span>→</span>
      </Link>
    </article>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}

function StepItem({ number, title, text }) {
  return (
    <div className="client-step-item">
      <span className="client-step-number">{number}</span>

      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default ClientDashboardPage;