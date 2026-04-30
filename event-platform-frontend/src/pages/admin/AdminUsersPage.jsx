import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { getAdminUsers } from "../../services/api/adminApi";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (error) {
      console.error("Admin users error:", error.response?.data || error);
      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger les utilisateurs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const formatRoles = (roles) => {
    if (!roles || roles.length === 0) {
      return "Aucun rôle";
    }

    return roles.map(getRoleLabel).join(", ");
  };

  if (loading) {
    return (
      <main className="admin-container">
        <p>Chargement des utilisateurs...</p>
      </main>
    );
  }

  return (
    <main className="admin-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Utilisateurs</h1>
          <p className="admin-page-subtitle">
            Gérez l’activation des comptes clients et prestataires.
          </p>
        </div>

        <Link className="admin-link-btn secondary" to={ROUTES.ADMIN_DASHBOARD}>
          Retour dashboard
        </Link>
      </div>

      {errorMessage && <div className="admin-message error">{errorMessage}</div>}

      {users.length === 0 ? (
        <div className="admin-empty">Aucun utilisateur trouvé.</div>
      ) : (
        <section className="admin-card admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Contact</th>
                <th>Rôles</th>
                <th>Compte</th>
                <th>Provider</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>
                      {user.firstName} {user.lastName}
                    </strong>
                    <br />
                    <span>ID #{user.id}</span>
                  </td>

                  <td>
                    {user.email}
                    <br />
                    <span>{user.phone || "Téléphone non renseigné"}</span>
                  </td>

                  <td>{formatRoles(user.roles)}</td>

                  <td>
                    <StatusBadge
                      value={user.enabled ? "Actif" : "Désactivé"}
                      color={user.enabled ? "green" : "red"}
                    />
                  </td>

                  <td>
                    {user.roles?.includes("ROLE_PROVIDER") ? (
                      <StatusBadge
                        value={user.providerValidated ? "Validé" : "Non validé"}
                        color={user.providerValidated ? "green" : "orange"}
                      />
                    ) : (
                      <StatusBadge value="N/A" color="gray" />
                    )}
                  </td>

                  <td>
                    <Link className="admin-link-btn" to={`/admin/users/${user.id}`}>
                      Détail
                    </Link>
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

function getRoleLabel(role) {
  const labels = {
    ROLE_ADMIN: "Admin",
    ROLE_PROVIDER: "Prestataire",
    ROLE_CLIENT: "Client",
  };

  return labels[role] || role;
}

function StatusBadge({ value, color }) {
  return <span className={`admin-badge ${color}`}>{value}</span>;
}

export default AdminUsersPage;