import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { getAdminProviders } from "../../services/api/adminApi";

function AdminProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadProviders = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getAdminProviders();
      setProviders(data);
    } catch (error) {
      console.error("Admin providers error:", error.response?.data || error);
      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger les prestataires."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  if (loading) {
    return (
      <main className="admin-container">
        <p>Chargement des prestataires...</p>
      </main>
    );
  }

  return (
    <main className="admin-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Prestataires</h1>
          <p className="admin-page-subtitle">
            Gérez la validation et la visibilité des prestataires.
          </p>
        </div>

        <Link className="admin-link-btn secondary" to={ROUTES.ADMIN_DASHBOARD}>
          Retour dashboard
        </Link>
      </div>

      {errorMessage && <div className="admin-message error">{errorMessage}</div>}

      {providers.length === 0 ? (
        <div className="admin-empty">Aucun prestataire trouvé.</div>
      ) : (
        <section className="admin-card admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Entreprise</th>
                <th>Responsable</th>
                <th>Ville</th>
                <th>Compte</th>
                <th>Validation</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {providers.map((provider) => (
                <tr key={provider.providerProfileId}>
                  <td>
                    <strong>{provider.businessName}</strong>
                    <br />
                    <span>{provider.businessType}</span>
                  </td>

                  <td>
                    {provider.firstName} {provider.lastName}
                    <br />
                    <span>{provider.email}</span>
                  </td>

                  <td>{provider.city}</td>

                  <td>
                    <StatusBadge
                      value={provider.enabled ? "Actif" : "Désactivé"}
                      color={provider.enabled ? "green" : "red"}
                    />
                  </td>

                  <td>
                    <StatusBadge
                      value={provider.providerValidated ? "Validé" : "En attente"}
                      color={provider.providerValidated ? "green" : "orange"}
                    />
                  </td>

                  <td>
                    <div className="admin-actions" style={{ marginTop: 0 }}>
                      <Link
                        className="admin-link-btn"
                        to={`/admin/providers/${provider.providerProfileId}`}
                      >
                        Détail
                      </Link>

                      <Link
                        className="admin-link-btn secondary"
                        to={`/admin/users/${provider.userId}`}
                      >
                        User
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

function StatusBadge({ value, color }) {
  return <span className={`admin-badge ${color}`}>{value}</span>;
}

export default AdminProvidersPage;