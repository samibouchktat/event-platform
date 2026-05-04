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
import useAuth from "../../hooks/useAuth";
import { getProviderDashboardStats } from "../../services/api/providerDashboardApi";

function ProviderDashboardPage() {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsErrorMessage, setStatsErrorMessage] = useState("");

  const isValidated = user?.providerValidated === true;
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  const loadProviderStats = async () => {
    setLoadingStats(true);
    setStatsErrorMessage("");

    try {
      const data = await getProviderDashboardStats();
      setStats(data);
    } catch (error) {
      console.error(
        "Provider dashboard stats error:",
        error.response?.data || error
      );

      setStatsErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger les statistiques prestataire."
      );
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadProviderStats();
  }, []);

  const overviewChartData = buildProviderOverviewChartData(stats);
  const packsChartData = buildProviderPacksChartData(stats);
  const quoteRequestsChartData = buildProviderQuoteRequestsChartData(stats);
  const bookingsChartData = buildProviderBookingsChartData(stats);

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

      {statsErrorMessage && (
        <div className="alert alert-danger">{statsErrorMessage}</div>
      )}

      {loadingStats ? (
        <section className="card">
          <p className="loading-text">Chargement des statistiques...</p>
        </section>
      ) : (
        <section className="provider-dashboard-charts">
          <article className="provider-chart-card provider-chart-card-large">
            <div className="provider-chart-header">
              <div>
                <span className="badge badge-info">Vue globale</span>
                <h2 className="card-title mt-1">Activité prestataire</h2>
                <p className="text-muted">
                  Comparaison de vos packs, demandes de devis et réservations.
                </p>
              </div>
            </div>

            <div className="provider-chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={overviewChartData}>
                  <defs>
                    <linearGradient
                      id="providerOverviewGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#f97316"
                    fill="url(#providerOverviewGradient)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="provider-chart-card">
            <div className="provider-chart-header">
              <div>
                <span className="badge badge-success">Packs</span>
                <h2 className="card-title mt-1">Packs par statut</h2>
                <p className="text-muted">
                  Répartition entre packs actifs et inactifs.
                </p>
              </div>
            </div>

            <div className="provider-chart-container">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={packsChartData}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {packsChartData.map((entry, index) => (
                      <Cell
                        key={entry.label}
                        fill={getProviderChartColor(index)}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ChartLegend data={packsChartData} />
          </article>

          <article className="provider-chart-card">
            <div className="provider-chart-header">
              <div>
                <span className="badge badge-warning">Devis</span>
                <h2 className="card-title mt-1">Demandes de devis</h2>
                <p className="text-muted">
                  Suivi des demandes selon leur statut.
                </p>
              </div>
            </div>

            <div className="provider-chart-container">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={quoteRequestsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {quoteRequestsChartData.map((entry, index) => (
                      <Cell
                        key={entry.label}
                        fill={getProviderChartColor(index)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <ChartLegend data={quoteRequestsChartData} />
          </article>

          <article className="provider-chart-card provider-chart-card-large">
            <div className="provider-chart-header">
              <div>
                <span className="badge badge-info">Réservations</span>
                <h2 className="card-title mt-1">Réservations par statut</h2>
                <p className="text-muted">
                  Suivi des réservations confirmées, terminées, annulées ou en
                  attente d’acompte.
                </p>
              </div>
            </div>

            <div className="provider-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {bookingsChartData.map((entry, index) => (
                      <Cell
                        key={entry.label}
                        fill={getProviderChartColor(index)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <ChartLegend data={bookingsChartData} />
          </article>
        </section>
      )}

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

function ChartLegend({ data }) {
  return (
    <div className="provider-chart-legend">
      {data.map((item, index) => (
        <div className="provider-chart-legend-item" key={item.label}>
          <span style={{ background: getProviderChartColor(index) }} />
          <strong>{item.label}</strong>
          <small>{item.value}</small>
        </div>
      ))}
    </div>
  );
}

function buildProviderOverviewChartData(stats) {
  if (!stats) {
    return [];
  }

  return [
    {
      label: "Packs",
      value: Number(stats.totalPacks || 0),
    },
    {
      label: "Actifs",
      value: Number(stats.activePacks || 0),
    },
    {
      label: "Devis",
      value: Number(stats.totalQuoteRequests || 0),
    },
    {
      label: "Acceptés",
      value: Number(stats.acceptedQuoteRequests || 0),
    },
    {
      label: "Bookings",
      value: Number(stats.totalBookings || 0),
    },
    {
      label: "Confirmés",
      value: Number(stats.confirmedBookings || 0),
    },
  ];
}

function buildProviderPacksChartData(stats) {
  if (!stats) {
    return [];
  }

  return [
    {
      label: "Actifs",
      value: Number(stats.activePacks || 0),
    },
    {
      label: "Inactifs",
      value: Number(stats.inactivePacks || 0),
    },
  ];
}

function buildProviderQuoteRequestsChartData(stats) {
  if (!stats) {
    return [];
  }

  return [
    {
      label: "En attente",
      value: Number(stats.pendingQuoteRequests || 0),
    },
    {
      label: "Discussion",
      value: Number(stats.inDiscussionQuoteRequests || 0),
    },
    {
      label: "Acceptées",
      value: Number(stats.acceptedQuoteRequests || 0),
    },
    {
      label: "Rejetées",
      value: Number(stats.rejectedQuoteRequests || 0),
    },
    {
      label: "Annulées",
      value: Number(stats.cancelledQuoteRequests || 0),
    },
  ];
}

function buildProviderBookingsChartData(stats) {
  if (!stats) {
    return [];
  }

  return [
    {
      label: "Acompte",
      value: Number(stats.pendingDepositBookings || 0),
    },
    {
      label: "Confirmées",
      value: Number(stats.confirmedBookings || 0),
    },
    {
      label: "Terminées",
      value: Number(stats.completedBookings || 0),
    },
    {
      label: "Annulées",
      value: Number(stats.cancelledBookings || 0),
    },
  ];
}

function getProviderChartColor(index) {
  const colors = [
    "#f97316",
    "#111827",
    "#2563eb",
    "#16a34a",
    "#7c3aed",
    "#dc2626",
  ];

  return colors[index % colors.length];
}

export default ProviderDashboardPage;