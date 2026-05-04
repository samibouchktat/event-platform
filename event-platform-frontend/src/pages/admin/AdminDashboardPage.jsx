import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { getAdminDashboardStats } from "../../services/api/adminApi";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
const overviewChartData = buildAdminOverviewChartData(stats);
const providerChartData = buildProviderChartData(stats);
const businessChartData = buildBusinessChartData(stats);
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
<section className="admin-dashboard-charts">
  <article className="admin-dashboard-chart-card admin-dashboard-chart-card-large">
    <div className="admin-chart-header">
      <div>
        <span className="badge badge-info">Courbe globale</span>
        <h2 className="card-title mt-1">Vue synthétique</h2>
        <p className="text-muted">
          Comparaison des principaux volumes de la plateforme.
        </p>
      </div>
    </div>

    <div className="admin-dashboard-chart-container">
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={overviewChartData}>
          <defs>
            <linearGradient id="adminOverviewGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#111827" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#111827" stopOpacity={0.03} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#111827"
            fill="url(#adminOverviewGradient)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </article>

  <article className="admin-dashboard-chart-card">
    <div className="admin-chart-header">
      <div>
        <span className="badge badge-warning">Prestataires</span>
        <h2 className="card-title mt-1">Validation prestataires</h2>
        <p className="text-muted">
          Répartition entre prestataires validés et en attente.
        </p>
      </div>
    </div>

    <div className="admin-dashboard-chart-container">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={providerChartData}
            dataKey="value"
            nameKey="label"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={4}
          >
            {providerChartData.map((entry, index) => (
              <Cell key={entry.label} fill={getAdminChartColor(index)} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

    <ChartLegend data={providerChartData} />
  </article>

  <article className="admin-dashboard-chart-card">
    <div className="admin-chart-header">
      <div>
        <span className="badge badge-success">Activité</span>
        <h2 className="card-title mt-1">Packs, devis et réservations</h2>
        <p className="text-muted">
          Aperçu rapide de l’activité commerciale.
        </p>
      </div>
    </div>

    <div className="admin-dashboard-chart-container">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={businessChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" radius={[10, 10, 0, 0]}>
            {businessChartData.map((entry, index) => (
              <Cell key={entry.label} fill={getAdminChartColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    <ChartLegend data={businessChartData} />
  </article>
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
function ChartLegend({ data }) {
  return (
    <div className="admin-dashboard-chart-legend">
      {data.map((item, index) => (
        <div className="admin-dashboard-chart-legend-item" key={item.label}>
          <span style={{ background: getAdminChartColor(index) }} />
          <strong>{item.label}</strong>
          <small>{item.value}</small>
        </div>
      ))}
    </div>
  );
}

function buildAdminOverviewChartData(stats) {
  if (!stats) {
    return [];
  }

  return [
    {
      label: "Utilisateurs",
      value: Number(stats.totalUsers || 0),
    },
    {
      label: "Clients",
      value: Number(stats.totalClients || 0),
    },
    {
      label: "Prestataires",
      value: Number(stats.totalProviders || 0),
    },
    {
      label: "Packs",
      value: Number(stats.totalPacks || 0),
    },
    {
      label: "Devis",
      value: Number(stats.totalQuoteRequests || 0),
    },
    {
      label: "Réservations",
      value: Number(stats.totalBookings || 0),
    },
  ];
}

function buildProviderChartData(stats) {
  if (!stats) {
    return [];
  }

  return [
    {
      label: "Validés",
      value: Number(stats.validatedProviders || 0),
    },
    {
      label: "En attente",
      value: Number(stats.pendingProviders || 0),
    },
  ];
}

function buildBusinessChartData(stats) {
  if (!stats) {
    return [];
  }

  return [
    {
      label: "Packs",
      value: Number(stats.totalPacks || 0),
    },
    {
      label: "Packs actifs",
      value: Number(stats.activePacks || 0),
    },
    {
      label: "Devis",
      value: Number(stats.totalQuoteRequests || 0),
    },
    {
      label: "Réservations",
      value: Number(stats.totalBookings || 0),
    },
  ];
}

function getAdminChartColor(index) {
  const colors = [
    "#111827",
    "#2563eb",
    "#16a34a",
    "#f97316",
    "#7c3aed",
    "#dc2626",
  ];

  return colors[index % colors.length];
}
export default AdminDashboardPage;