import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import {
  getAdminProviderById,
  rejectAdminProvider,
  validateAdminProvider,
} from "../../services/api/adminApi";

function AdminProviderDetailsPage() {
  const { providerProfileId } = useParams();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadProvider = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getAdminProviderById(providerProfileId);
      setProvider(data);
    } catch (error) {
      console.error("Admin provider details error:", error.response?.data || error);
      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger le détail du prestataire."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProvider();
  }, [providerProfileId]);

  const handleValidate = async () => {
    setUpdating(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedProvider = await validateAdminProvider(providerProfileId);
      setProvider(updatedProvider);
      setSuccessMessage(
        "Prestataire validé. Ses packs actifs peuvent apparaître publiquement si le compte est actif."
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Impossible de valider le prestataire."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    setUpdating(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedProvider = await rejectAdminProvider(providerProfileId);
      setProvider(updatedProvider);
      setSuccessMessage(
        "Prestataire non validé. Ses packs ne seront plus visibles publiquement."
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Impossible de rejeter le prestataire."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="admin-container">
        <p>Chargement du prestataire...</p>
      </main>
    );
  }

  if (!provider) {
    return (
      <main className="admin-container">
        <Link className="admin-link-btn secondary" to={ROUTES.ADMIN_PROVIDERS}>
          Retour
        </Link>
        <div className="admin-message error">{errorMessage}</div>
      </main>
    );
  }

  return (
    <main className="admin-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{provider.businessName}</h1>
          <p className="admin-page-subtitle">
            Détail du profil prestataire #{provider.providerProfileId}
          </p>
        </div>

        <Link className="admin-link-btn secondary" to={ROUTES.ADMIN_PROVIDERS}>
          Retour prestataires
        </Link>
      </div>

      {successMessage && (
        <div className="admin-message success">{successMessage}</div>
      )}
      {errorMessage && <div className="admin-message error">{errorMessage}</div>}

      <section className="admin-grid cards">
        <article className="admin-card">
          <h2 className="admin-card-title">Statuts</h2>

          <div className="admin-info-list">
            <InfoRow
              label="Compte"
              value={
                <StatusBadge
                  value={provider.enabled ? "Actif" : "Désactivé"}
                  color={provider.enabled ? "green" : "red"}
                />
              }
            />

            <InfoRow
              label="Validation"
              value={
                <StatusBadge
                  value={provider.providerValidated ? "Validé" : "Non validé"}
                  color={provider.providerValidated ? "green" : "orange"}
                />
              }
            />
          </div>

          <div className="admin-actions">
            <button
              className="admin-btn success"
              type="button"
              onClick={handleValidate}
              disabled={updating || provider.providerValidated}
            >
              Valider
            </button>

            <button
              className="admin-btn danger"
              type="button"
              onClick={handleReject}
              disabled={updating || !provider.providerValidated}
            >
              Rejeter
            </button>
          </div>
        </article>

        <article className="admin-card">
          <h2 className="admin-card-title">Utilisateur</h2>

          <div className="admin-info-list">
            <InfoRow label="Nom" value={`${provider.firstName} ${provider.lastName}`} />
            <InfoRow label="Email" value={provider.email} />
            <InfoRow label="Téléphone" value={provider.phone || "Non renseigné"} />
            <InfoRow label="User ID" value={provider.userId} />
          </div>

          <div className="admin-actions">
            <Link className="admin-link-btn secondary" to={`/admin/users/${provider.userId}`}>
              Ouvrir utilisateur
            </Link>
          </div>
        </article>

        <article className="admin-card">
          <h2 className="admin-card-title">Entreprise</h2>

          <div className="admin-info-list">
            <InfoRow label="Type" value={provider.businessType} />
            <InfoRow label="Ville" value={provider.city} />
            <InfoRow label="Adresse" value={provider.address || "Non renseignée"} />
            <InfoRow label="ICE" value={provider.ice || "Non renseigné"} />
            <InfoRow label="Description" value={provider.description || "Non renseignée"} />
          </div>
        </article>
      </section>
    </main>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="admin-info-row">
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}

function StatusBadge({ value, color }) {
  return <span className={`admin-badge ${color}`}>{value}</span>;
}

export default AdminProviderDetailsPage;