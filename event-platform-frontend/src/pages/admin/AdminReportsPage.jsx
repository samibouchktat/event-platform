import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { ROUTES } from "../../constants/routes";
import { getAdminReportOverview } from "../../services/api/adminApi";

function AdminReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadReport = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getAdminReportOverview();
      setReport(data);
    } catch (error) {
      console.error("Admin report overview error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger le reporting admin."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  if (loading) {
    return (
      <main className="app-container admin-reports-page">
        <section className="admin-dashboard-loading">
          <div className="admin-loading-spinner" />
          <p>Chargement du reporting...</p>
        </section>
      </main>
    );
  }

  const overviewChartData = buildOverviewChartData(report);

  return (
    <main className="app-container admin-reports-page">
      <section className="admin-reports-hero">
        <div>
          <span className="page-kicker">Reporting admin</span>

          <h1 className="page-title">Reporting</h1>

          <p className="page-subtitle">
            Analyse synthétique de l’activité de la plateforme : utilisateurs,
            prestataires, packs, demandes de devis et réservations.
          </p>

          <div className="admin-hero-actions">
            <button className="btn" type="button" onClick={loadReport}>
              Rafraîchir
            </button>

            <Link className="link-btn link-btn-secondary" to={ROUTES.ADMIN_DASHBOARD}>
              Retour dashboard
            </Link>
          </div>
        </div>

        <div className="admin-reports-summary-card">
          <span className="badge badge-info">Vue globale</span>
          <strong>{overviewChartData.reduce((sum, item) => sum + item.value, 0)}</strong>
          <span>éléments suivis</span>
        </div>
      </section>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {!report ? (
        <div className="empty-state">Aucune donnée de reporting disponible.</div>
      ) : (
        <>
          <section className="admin-chart-card admin-chart-card-large">
            <div className="admin-chart-header">
              <div>
                <h2 className="card-title">Vue synthétique de la plateforme</h2>
                <p className="text-muted">
                  Comparaison globale des principaux volumes du MVP.
                </p>
              </div>
            </div>

            <div className="admin-chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={overviewChartData}>
                  <defs>
                    <linearGradient id="overviewGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111827" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#111827" stopOpacity={0.02} />
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
                    fill="url(#overviewGradient)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="admin-reports-grid">
            <ChartCard
              title="Utilisateurs par rôle"
              type="pie"
              data={toChartData(report.usersByRole, getUserRoleLabel)}
            />

            <ChartCard
              title="Validation prestataires"
              type="bar"
              data={toChartData(
                report.providersByValidation,
                getProviderValidationLabel
              )}
            />

            <ChartCard
              title="Packs par statut"
              type="bar"
              data={toChartData(report.packsByStatus, getPackStatusLabel)}
            />

            <ChartCard
              title="Demandes de devis par statut"
              type="bar"
              data={toChartData(
                report.quoteRequestsByStatus,
                getQuoteStatusLabel
              )}
            />

            <ChartCard
              title="Réservations par statut"
              type="bar"
              data={toChartData(report.bookingsByStatus, getBookingStatusLabel)}
            />
          </section>
        </>
      )}
    </main>
  );
}

function ChartCard({ title, data, type }) {
  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0);

  return (
    <article className="admin-chart-card">
      <div className="admin-chart-header">
        <div>
          <h2 className="card-title">{title}</h2>
          <p className="text-muted">
            Total : <strong>{total}</strong>
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="empty-state">Aucune donnée.</div>
      ) : (
        <>
          <div className="admin-chart-container">
            <ResponsiveContainer width="100%" height={260}>
              {type === "pie" ? (
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {data.map((entry, index) => (
                      <Cell key={entry.label} fill={getChartColor(index)} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={entry.label} fill={getChartColor(index)} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="admin-chart-legend">
            {data.map((item, index) => (
              <div className="admin-chart-legend-item" key={item.label}>
                <span style={{ background: getChartColor(index) }} />
                <strong>{item.label}</strong>
                <small>{item.value}</small>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
}

function toChartData(data, labelMapper) {
  return Object.entries(data || {}).map(([key, value]) => ({
    label: labelMapper ? labelMapper(key) : key,
    value: Number(value || 0),
  }));
}

function buildOverviewChartData(report) {
  if (!report) {
    return [];
  }

  const usersTotal = sumValues(report.usersByRole);
  const providersTotal = sumValues(report.providersByValidation);
  const packsTotal = sumValues(report.packsByStatus);
  const quotesTotal = sumValues(report.quoteRequestsByStatus);
  const bookingsTotal = sumValues(report.bookingsByStatus);

  return [
    { label: "Utilisateurs", value: usersTotal },
    { label: "Prestataires", value: providersTotal },
    { label: "Packs", value: packsTotal },
    { label: "Devis", value: quotesTotal },
    { label: "Réservations", value: bookingsTotal },
  ];
}

function sumValues(data) {
  return Object.values(data || {}).reduce(
    (sum, value) => sum + Number(value || 0),
    0
  );
}

function getChartColor(index) {
  const colors = [
    "#111827",
    "#2563eb",
    "#16a34a",
    "#f97316",
    "#7c3aed",
    "#dc2626",
    "#0891b2",
  ];

  return colors[index % colors.length];
}

function getUserRoleLabel(role) {
  const labels = {
    CLIENT: "Clients",
    PROVIDER: "Prestataires",
    ADMIN: "Admins",
  };

  return labels[role] || role;
}

function getProviderValidationLabel(status) {
  const labels = {
    VALIDATED: "Validés",
    PENDING_OR_REJECTED: "En attente",
  };

  return labels[status] || status;
}

function getPackStatusLabel(status) {
  const labels = {
    ACTIVE: "Actifs",
    INACTIVE: "Inactifs",
  };

  return labels[status] || status;
}

function getQuoteStatusLabel(status) {
  const labels = {
    PENDING: "En attente",
    IN_DISCUSSION: "En discussion",
    ACCEPTED: "Acceptées",
    REJECTED: "Rejetées",
    CANCELLED: "Annulées",
  };

  return labels[status] || status;
}

function getBookingStatusLabel(status) {
  const labels = {
    PENDING_DEPOSIT: "Acompte attendu",
    CONFIRMED: "Confirmées",
    CANCELLED: "Annulées",
    COMPLETED: "Terminées",
  };

  return labels[status] || status;
}

export default AdminReportsPage;