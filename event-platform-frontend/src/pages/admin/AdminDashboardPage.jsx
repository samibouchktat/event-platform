import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { getAdminDashboardStats } from "../../services/api/adminApi";

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getAdminDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Admin dashboard stats error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger les statistiques admin."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <main className="app-container admin-dashboard-page">
        <section className="admin-dashboard-loading">
          <div className="admin-loading-spinner" />
          <p>Chargement du dashboard admin...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-container admin-dashboard-page">
      <section className="admin-dashboard-hero">
        <div>
          <span className="page-kicker">Back-office admin</span>

          <h1 className="page-title">Dashboard Admin</h1>

          <p className="page-subtitle">
            Vue globale de la plateforme événementielle : utilisateurs,
            prestataires, packs, devis et réservations.
          </p>

          <div className="admin-hero-actions">
            <button className="btn" type="button" onClick={loadStats}>
              Rafraîchir les statistiques
            </button>

            <Link className="link-btn link-btn-secondary" to={ROUTES.ADMIN_PROVIDERS}>
              Prestataires à valider
            </Link>
          </div>
        </div>

        <div className="admin-dashboard-summary">
          <span className="badge badge-danger">Admin</span>

          <div className="admin-summary-icon">⚙️</div>

          <strong>{stats?.totalUsers ?? 0}</strong>
          <span>utilisateurs enregistrés</span>
        </div>
      </section>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {stats && (
        <>
          <section className="admin-stats-grid">
            <StatCard
              label="Utilisateurs"
              value={stats.totalUsers}
              icon="👥"
              tone="dark"
            />

            <StatCard
              label="Clients"
              value={stats.totalClients}
              icon="👤"
              tone="blue"
            />

            <StatCard
              label="Prestataires"
              value={stats.totalProviders}
              icon="🏢"
              tone="orange"
            />

            <StatCard
              label="Prestataires validés"
              value={stats.validatedProviders}
              icon="✅"
              tone="green"
            />

            <StatCard
              label="Prestataires en attente"
              value={stats.pendingProviders}
              icon="⏳"
              tone="yellow"
            />

            <StatCard
              label="Packs"
              value={stats.totalPacks}
              icon="📦"
              tone="purple"
            />

            <StatCard
              label="Packs actifs"
              value={stats.activePacks}
              icon="🟢"
              tone="green"
            />

            <StatCard
              label="Demandes de devis"
              value={stats.totalQuoteRequests}
              icon="📝"
              tone="orange"
            />

            <StatCard
              label="Réservations"
              value={stats.totalBookings}
              icon="📅"
              tone="blue"
            />
          </section>

          <section className="admin-dashboard-bottom">
            <article className="card admin-quick-actions-card">
              <div className="admin-section-header">
                <div>
                  <span className="badge badge-info">Gestion</span>
                  <h2 className="card-title mt-1">Gestion rapide</h2>
                </div>
              </div>

              <div className="admin-quick-actions">
                <QuickAction
                  title="Gérer les prestataires"
                  description="Valider, consulter ou contrôler les profils prestataires."
                  to={ROUTES.ADMIN_PROVIDERS}
                  icon="🏢"
                  badgeLabel="Validation"
                  badgeClass="badge-warning"
                />

                <QuickAction
                  title="Gérer les utilisateurs"
                  description="Consulter les comptes clients, prestataires et administrateurs."
                  to={ROUTES.ADMIN_USERS}
                  icon="👥"
                  badgeLabel="Comptes"
                  badgeClass="badge-info"
                />

                <QuickAction
                  title="Voir le reporting"
                  description="Suivre les indicateurs principaux de la plateforme."
                  to={ROUTES.ADMIN_REPORTS}
                  icon="📊"
                  badgeLabel="Reporting"
                  badgeClass="badge-success"
                />
              </div>
            </article>

            <article className="card admin-priority-card">
              <div>
                <span className="badge badge-warning">Priorité MVP</span>
                <h2 className="card-title mt-1">À surveiller</h2>
              </div>

              <div className="admin-priority-list">
                <PriorityItem
                  label="Prestataires en attente"
                  value={stats.pendingProviders}
                  helper="À traiter pour rendre leurs packs visibles."
                />

                <PriorityItem
                  label="Packs actifs"
                  value={stats.activePacks}
                  helper="Offres actuellement visibles côté marketplace."
                />

                <PriorityItem
                  label="Demandes de devis"
                  value={stats.totalQuoteRequests}
                  helper="Volume de demandes générées par les clients."
                />
              </div>
            </article>
          </section>
        </>
      )}
    </main>
  );
}

function StatCard({ label, value, icon, tone }) {
  return (
    <article className={`admin-stat-card admin-stat-card-${tone}`}>
      <div className="admin-stat-card-top">
        <span className="admin-stat-icon">{icon}</span>
      </div>

      <p>{label}</p>
      <h2>{value ?? 0}</h2>
    </article>
  );
}

function QuickAction({
  title,
  description,
  to,
  icon,
  badgeLabel,
  badgeClass,
}) {
  return (
    <Link className="admin-quick-action" to={to}>
      <div className="admin-quick-action-top">
        <span className="admin-quick-action-icon">{icon}</span>
        <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
      </div>

      <strong>{title}</strong>
      <p>{description}</p>

      <span className="admin-quick-action-link">Ouvrir →</span>
    </Link>
  );
}

function PriorityItem({ label, value, helper }) {
  return (
    <div className="admin-priority-item">
      <div>
        <strong>{label}</strong>
        <span>{helper}</span>
      </div>

      <b>{value ?? 0}</b>
    </div>
  );
}

export default AdminDashboardPage;