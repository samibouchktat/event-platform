import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      <main className="admin-container">
        <p>Chargement du reporting...</p>
      </main>
    );
  }

  return (
    <main className="admin-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Reporting</h1>
          <p className="admin-page-subtitle">
            Vue synthétique de l’activité de la plateforme.
          </p>
        </div>

        <div className="admin-actions" style={{ marginTop: 0 }}>
          <button className="admin-btn secondary" type="button" onClick={loadReport}>
            Rafraîchir
          </button>

          <Link className="admin-link-btn secondary" to={ROUTES.ADMIN_DASHBOARD}>
            Retour dashboard
          </Link>
        </div>
      </div>

      {errorMessage && <div className="admin-message error">{errorMessage}</div>}

      {!report ? (
        <div className="admin-empty">Aucune donnée de reporting disponible.</div>
      ) : (
        <section className="admin-grid cards">
          <ReportCard
            title="Utilisateurs par rôle"
            data={report.usersByRole}
            labelMapper={getUserRoleLabel}
          />

          <ReportCard
            title="Validation prestataires"
            data={report.providersByValidation}
            labelMapper={getProviderValidationLabel}
          />

          <ReportCard
            title="Packs par statut"
            data={report.packsByStatus}
            labelMapper={getPackStatusLabel}
          />

          <ReportCard
            title="Demandes de devis par statut"
            data={report.quoteRequestsByStatus}
            labelMapper={getQuoteStatusLabel}
          />

          <ReportCard
            title="Réservations par statut"
            data={report.bookingsByStatus}
            labelMapper={getBookingStatusLabel}
          />
        </section>
      )}
    </main>
  );
}

function ReportCard({ title, data, labelMapper }) {
  const entries = Object.entries(data || {});
  const total = entries.reduce((sum, [, value]) => sum + Number(value || 0), 0);

  return (
    <article className="admin-card">
      <div style={{ marginBottom: "1rem" }}>
        <h2 className="admin-card-title">{title}</h2>
        <p className="admin-stat-label">
          Total : <strong>{total}</strong>
        </p>
      </div>

      {entries.length === 0 ? (
        <p>Aucune donnée.</p>
      ) : (
        <div style={{ display: "grid", gap: "0.9rem" }}>
          {entries.map(([key, value]) => (
            <ReportRow
              key={key}
              label={labelMapper ? labelMapper(key) : key}
              value={Number(value || 0)}
              total={total}
            />
          ))}
        </div>
      )}
    </article>
  );
}

function ReportRow({ label, value, total }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "0.35rem",
        }}
      >
        <span style={{ fontWeight: 700 }}>{label}</span>
        <span>
          {value} <strong>({percentage}%)</strong>
        </span>
      </div>

      <div
        style={{
          height: "10px",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: "#111827",
            borderRadius: "999px",
          }}
        />
      </div>
    </div>
  );
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
    PENDING_OR_REJECTED: "En attente / non validés",
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
    PENDING_DEPOSIT: "En attente d’acompte",
    CONFIRMED: "Confirmées",
    CANCELLED: "Annulées",
    COMPLETED: "Terminées",
  };

  return labels[status] || status;
}

export default AdminReportsPage;