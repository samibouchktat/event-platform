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
      <main className="admin-container">
        <p>Chargement du dashboard admin...</p>
      </main>
    );
  }

  return (
    <main className="admin-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Admin</h1>
          <p className="admin-page-subtitle">
            Vue globale de la plateforme événementielle.
          </p>
        </div>

        <button className="admin-btn secondary" type="button" onClick={loadStats}>
          Rafraîchir
        </button>
      </div>

      {errorMessage && <div className="admin-message error">{errorMessage}</div>}

      {stats && (
        <>
          <section className="admin-grid stats">
            <StatCard label="Utilisateurs" value={stats.totalUsers} />
            <StatCard label="Clients" value={stats.totalClients} />
            <StatCard label="Prestataires" value={stats.totalProviders} />
            <StatCard label="Prestataires validés" value={stats.validatedProviders} />
            <StatCard label="Prestataires en attente" value={stats.pendingProviders} />
            <StatCard label="Packs" value={stats.totalPacks} />
            <StatCard label="Packs actifs" value={stats.activePacks} />
            <StatCard label="Demandes de devis" value={stats.totalQuoteRequests} />
            <StatCard label="Réservations" value={stats.totalBookings} />
          </section>

          <section className="admin-card" style={{ marginTop: "1.5rem" }}>
            <h2 className="admin-card-title">Gestion rapide</h2>

            <div className="admin-actions">
              <Link className="admin-link-btn" to={ROUTES.ADMIN_PROVIDERS}>
                Gérer les prestataires
              </Link>
              <Link className="admin-link-btn secondary" to={ROUTES.ADMIN_REPORTS}>
                Voir le reporting
              </Link>
              <Link className="admin-link-btn secondary" to={ROUTES.ADMIN_USERS}>
                Gérer les utilisateurs
              </Link>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <article className="admin-card">
      <p className="admin-stat-label">{label}</p>
      <h2 className="admin-stat-value">{value}</h2>
    </article>
  );
}

export default AdminDashboardPage;