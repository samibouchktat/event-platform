import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";

function ClientDashboardPage() {
  const { user } = useAuth();

  return (
    <main className="app-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard client</h1>
          <p className="page-subtitle">
            Recherchez des prestataires, suivez vos demandes de devis, vos
            réservations, vos documents et vos notifications.
          </p>
        </div>

        <span className="badge badge-success">Client</span>
      </div>

      <section className="card-grid card-grid-3">
        <DashboardCard
          title="Rechercher un pack"
          description="Trouvez des prestataires validés selon votre ville, budget, service et type d’événement."
          linkLabel="Rechercher"
          to={ROUTES.PUBLIC_PACKS || "/packs"}
          badgeLabel="Recherche"
          badgeClass="badge-info"
        />

        <DashboardCard
          title="Mes demandes de devis"
          description="Consultez vos demandes envoyées et suivez leur statut auprès des prestataires."
          linkLabel="Voir mes devis"
          to={ROUTES.CLIENT_QUOTE_REQUESTS}
          badgeLabel="Devis"
          badgeClass="badge-warning"
        />

        <DashboardCard
          title="Mes réservations"
          description="Suivez vos réservations, acomptes, documents et confirmations."
          linkLabel="Voir réservations"
          to={ROUTES.CLIENT_BOOKINGS}
          badgeLabel="Bookings"
          badgeClass="badge-success"
        />

        <DashboardCard
          title="Notifications"
          description="Restez informé des réponses prestataires, réservations créées et acomptes confirmés."
          linkLabel="Voir notifications"
          to={ROUTES.NOTIFICATIONS}
          badgeLabel="Alertes"
          badgeClass="badge-warning"
        />
      </section>

      <section className="card mt-2">
        <h2 className="card-title">Résumé du compte</h2>

        <div className="info-list">
          <InfoRow label="Nom" value={`${user?.firstName || ""} ${user?.lastName || ""}`} />
          <InfoRow label="Email" value={user?.email || "Non disponible"} />
          <InfoRow label="Type de compte" value="Client" />
        </div>
      </section>

      <section className="card mt-2">
        <h2 className="card-title">Parcours recommandé</h2>

        <div className="list-grid">
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
}) {
  return (
    <article className="card">
      <div className="actions" style={{ justifyContent: "space-between" }}>
        <h2 className="card-title">{title}</h2>
        <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
      </div>

      <p className="text-muted">{description}</p>

      <div className="actions mt-1">
        <Link className="link-btn" to={to}>
          {linkLabel}
        </Link>
      </div>
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
    <div className="card-soft">
      <div className="actions" style={{ alignItems: "flex-start" }}>
        <span className="badge badge-info">{number}</span>
        <div>
          <strong>{title}</strong>
          <p className="text-muted" style={{ margin: "0.35rem 0 0" }}>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClientDashboardPage;