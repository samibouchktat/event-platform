import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import {
  disableAdminUser,
  enableAdminUser,
  getAdminUserById,
} from "../../services/api/adminApi";

function AdminUserDetailsPage() {
  const { userId } = useParams();

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadUser = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getAdminUserById(userId);
      setUserDetails(data);
    } catch (error) {
      console.error("Admin user details error:", error.response?.data || error);
      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger le détail de l’utilisateur."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [userId]);

  const hasAdminRole = userDetails?.roles?.includes("ROLE_ADMIN");

  const handleEnable = async () => {
    setUpdating(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedUser = await enableAdminUser(userId);
      setUserDetails(updatedUser);
      setSuccessMessage("Utilisateur activé avec succès.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Impossible d’activer l’utilisateur."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDisable = async () => {
    setUpdating(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedUser = await disableAdminUser(userId);
      setUserDetails(updatedUser);
      setSuccessMessage("Utilisateur désactivé avec succès.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de désactiver l’utilisateur."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="admin-container">
        <p>Chargement de l’utilisateur...</p>
      </main>
    );
  }

  if (!userDetails) {
    return (
      <main className="admin-container">
        <Link className="admin-link-btn secondary" to={ROUTES.ADMIN_USERS}>
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
          <h1 className="admin-page-title">
            {userDetails.firstName} {userDetails.lastName}
          </h1>
          <p className="admin-page-subtitle">
            Fiche utilisateur #{userDetails.id}
          </p>
        </div>

        <Link className="admin-link-btn secondary" to={ROUTES.ADMIN_USERS}>
          Retour utilisateurs
        </Link>
      </div>

      {successMessage && (
        <div className="admin-message success">{successMessage}</div>
      )}
      {errorMessage && <div className="admin-message error">{errorMessage}</div>}

      {!userDetails.enabled && (
        <div className="admin-message warning">
          Cet utilisateur est désactivé. Il ne peut plus se connecter.
        </div>
      )}

      {hasAdminRole && (
        <div className="admin-message warning">
          Les comptes admin ne peuvent pas être désactivés.
        </div>
      )}

      <section className="admin-grid cards">
        <article className="admin-card">
          <h2 className="admin-card-title">Informations</h2>

          <div className="admin-info-list">
            <InfoRow label="Email" value={userDetails.email} />
            <InfoRow label="Téléphone" value={userDetails.phone || "Non renseigné"} />
            <InfoRow label="Rôles" value={formatRoles(userDetails.roles)} />
            <InfoRow
              label="Compte"
              value={
                <StatusBadge
                  value={userDetails.enabled ? "Actif" : "Désactivé"}
                  color={userDetails.enabled ? "green" : "red"}
                />
              }
            />
          </div>
        </article>

        <article className="admin-card">
          <h2 className="admin-card-title">Statut prestataire</h2>

          {userDetails.roles?.includes("ROLE_PROVIDER") ? (
            <div className="admin-info-list">
              <InfoRow
                label="Validation"
                value={
                  <StatusBadge
                    value={userDetails.providerValidated ? "Validé" : "Non validé"}
                    color={userDetails.providerValidated ? "green" : "orange"}
                  />
                }
              />

              <p>
                La validation prestataire contrôle la visibilité publique des
                packs.
              </p>
            </div>
          ) : (
            <p>Cet utilisateur n’est pas un prestataire.</p>
          )}
        </article>

        <article className="admin-card">
          <h2 className="admin-card-title">Dates</h2>

          <div className="admin-info-list">
            <InfoRow
              label="Créé le"
              value={
                userDetails.createdAt
                  ? new Date(userDetails.createdAt).toLocaleString()
                  : "Non disponible"
              }
            />

            <InfoRow
              label="Mis à jour le"
              value={
                userDetails.updatedAt
                  ? new Date(userDetails.updatedAt).toLocaleString()
                  : "Non disponible"
              }
            />
          </div>
        </article>

        <article className="admin-card">
          <h2 className="admin-card-title">Actions admin</h2>

          <p>
            Désactiver un compte bloque la connexion et l’utilisation des anciens
            tokens.
          </p>

          <div className="admin-actions">
            <button
              className="admin-btn success"
              type="button"
              onClick={handleEnable}
              disabled={updating || userDetails.enabled}
            >
              Activer
            </button>

            <button
              className="admin-btn danger"
              type="button"
              onClick={handleDisable}
              disabled={updating || !userDetails.enabled || hasAdminRole}
            >
              Désactiver
            </button>
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

function getRoleLabel(role) {
  const labels = {
    ROLE_ADMIN: "Admin",
    ROLE_PROVIDER: "Prestataire",
    ROLE_CLIENT: "Client",
  };

  return labels[role] || role;
}

function formatRoles(roles) {
  if (!roles || roles.length === 0) {
    return "Aucun rôle";
  }

  return roles.map(getRoleLabel).join(", ");
}

function StatusBadge({ value, color }) {
  return <span className={`admin-badge ${color}`}>{value}</span>;
}

export default AdminUserDetailsPage;