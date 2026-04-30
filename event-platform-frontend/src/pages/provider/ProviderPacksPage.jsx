import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import {
  deletePack,
  getMyPacks,
  togglePackStatus,
} from "../../services/api/packApi";

function ProviderPacksPage() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadPacks = async () => {
    try {
      const data = await getMyPacks();
      setPacks(data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Impossible de charger les packs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPacks();
  }, []);

  const handleToggleStatus = async (packId) => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await togglePackStatus(packId);
      await loadPacks();
      setSuccessMessage("Statut du pack mis à jour.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Impossible de changer le statut."
      );
    }
  };

  const handleDelete = async (packId) => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer ce pack ?");

    if (!confirmed) {
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");

    try {
      await deletePack(packId);
      await loadPacks();
      setSuccessMessage("Pack supprimé avec succès.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Impossible de supprimer le pack."
      );
    }
  };

  if (loading) {
    return <p style={{ padding: "2rem" }}>Chargement des packs...</p>;
  }

  return (
    <main className="app-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div>
          <h1>Mes packs</h1>
          <p>Gérez vos offres packagées.</p>
        </div>

        <Link to={ROUTES.PROVIDER_PACK_NEW}>Créer un pack</Link>
      </div>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {packs.length === 0 ? (
        <p>Aucun pack créé pour le moment.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
          {packs.map((pack) => (
            <article
              key={pack.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
              }}
            >
              <h2>{pack.name}</h2>

              <p>
                <strong>Type événement :</strong> {pack.eventType}
              </p>

              <p>
                <strong>Service :</strong> {pack.serviceType}
              </p>

              <p>
                <strong>Prix :</strong> {pack.price} MAD
              </p>

              <p>
                <strong>Convives :</strong> {pack.minGuests} - {pack.maxGuests}
              </p>

              <p>
                <strong>Ville :</strong> {pack.city}
              </p>

              <p>
                <strong>Statut :</strong>{" "}
                {pack.active ? "Actif" : "Inactif"}
              </p>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link to={`/provider/packs/${pack.id}/edit`}>Modifier</Link>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(pack.id)}
                >
                  {pack.active ? "Désactiver" : "Activer"}
                </button>

                <button type="button" onClick={() => handleDelete(pack.id)}>
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default ProviderPacksPage;