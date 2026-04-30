import { useEffect, useState } from "react";
import {
  getProviderProfile,
  updateProviderProfile,
} from "../../services/api/providerApi";

function ProviderProfilePage() {
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    city: "",
    address: "",
    phone: "",
    website: "",
    ice: "",
    businessType: "TRAITEUR",
    serviceArea: "",
  });

  const [profile, setProfile] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const loadProfile = async () => {
    try {
      const data = await getProviderProfile();
      setProfile(data);

      setFormData({
        businessName: data.businessName || "",
        description: data.description || "",
        city: data.city || "",
        address: data.address || "",
        phone: data.phone || "",
        website: data.website || "",
        ice: data.ice || "",
        businessType: data.businessType || "TRAITEUR",
        serviceArea: data.serviceArea || "",
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Impossible de charger le profil."
      );
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");
    setValidationErrors({});

    try {
      const updatedProfile = await updateProviderProfile(formData);
      setProfile(updatedProfile);
      setSuccessMessage("Profil mis à jour avec succès.");
    } catch (error) {
      const data = error.response?.data;
      setErrorMessage(data?.message || "Impossible de mettre à jour le profil.");
      setValidationErrors(data?.validationErrors || {});
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return <p style={{ padding: "2rem" }}>Chargement du profil...</p>;
  }

  if (errorMessage && !profile) {
    return (
      <main className="app-container">
        <h1>Mon profil prestataire</h1>
        <p style={{ color: "red" }}>{errorMessage}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "720px", margin: "0 auto" }}>
      <h1>Mon profil prestataire</h1>

      {profile && (
        <p>
          Statut validation :{" "}
          <strong>
            {profile.providerValidated ? "Validé" : "En attente de validation"}
          </strong>
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Nom commercial *</label>
          <input
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.businessName && (
            <small style={{ color: "red" }}>
              {validationErrors.businessName}
            </small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            style={{ width: "100%", padding: "0.75rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Ville *</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.city && (
            <small style={{ color: "red" }}>{validationErrors.city}</small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Adresse</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.75rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Téléphone professionnel *</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.phone && (
            <small style={{ color: "red" }}>{validationErrors.phone}</small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Site web</label>
          <input
            name="website"
            value={formData.website}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.75rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>ICE</label>
          <input
            name="ice"
            value={formData.ice}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.75rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Type d’activité *</label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.75rem" }}
          >
            <option value="TRAITEUR">Traiteur</option>
            <option value="EVENT_PLANNER">Organisateur d’événements</option>
            <option value="DECORATION">Décoration</option>
            <option value="PHOTOGRAPHER">Photographe</option>
            <option value="OTHER">Autre</option>
          </select>
          {validationErrors.businessType && (
            <small style={{ color: "red" }}>
              {validationErrors.businessType}
            </small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Zones de service</label>
          <textarea
            name="serviceArea"
            value={formData.serviceArea}
            onChange={handleChange}
            rows={3}
            style={{ width: "100%", padding: "0.75rem" }}
          />
        </div>

        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>
    </main>
  );
}

export default ProviderProfilePage;