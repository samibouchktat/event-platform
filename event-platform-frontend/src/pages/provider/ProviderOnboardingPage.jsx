import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { createProviderProfile } from "../../services/api/providerApi";

function ProviderOnboardingPage() {
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setValidationErrors({});

    try {
      await createProviderProfile(formData);
      navigate(ROUTES.PROVIDER_PROFILE);
    } catch (error) {
      const data = error.response?.data;

      setErrorMessage(data?.message || "Impossible de créer le profil.");
      setValidationErrors(data?.validationErrors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "720px", margin: "0 auto" }}>
      <h1>Onboarding prestataire</h1>
      <p>Complétez les informations de votre activité.</p>

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
            placeholder="https://example.ma"
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
            placeholder="Casablanca, Rabat, Mohammedia..."
            style={{ width: "100%", padding: "0.75rem" }}
          />
        </div>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : "Créer mon profil"}
        </button>
      </form>
    </main>
  );
}

export default ProviderOnboardingPage;