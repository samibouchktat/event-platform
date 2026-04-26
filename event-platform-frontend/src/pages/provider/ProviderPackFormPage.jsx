import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { createPack, getPackById, updatePack } from "../../services/api/packApi";

function ProviderPackFormPage() {
  const navigate = useNavigate();
  const { packId } = useParams();

  const isEditMode = Boolean(packId);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    eventType: "MARIAGE",
    serviceType: "TRAITEUR",
    price: "",
    minGuests: "",
    maxGuests: "",
    city: "",
    serviceArea: "",
    includedServices: "",
    excludedServices: "",
    bookingDeadlineDays: 7,
    active: true,
  });

  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const loadPack = async () => {
      if (!isEditMode) {
        return;
      }

      try {
        const pack = await getPackById(packId);

        setFormData({
          name: pack.name || "",
          description: pack.description || "",
          eventType: pack.eventType || "MARIAGE",
          serviceType: pack.serviceType || "TRAITEUR",
          price: pack.price || "",
          minGuests: pack.minGuests || "",
          maxGuests: pack.maxGuests || "",
          city: pack.city || "",
          serviceArea: pack.serviceArea || "",
          includedServices: pack.includedServices || "",
          excludedServices: pack.excludedServices || "",
          bookingDeadlineDays: pack.bookingDeadlineDays ?? 7,
          active: pack.active,
        });
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Impossible de charger le pack."
        );
      } finally {
        setInitialLoading(false);
      }
    };

    loadPack();
  }, [isEditMode, packId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const buildPayload = () => {
    return {
      ...formData,
      price: Number(formData.price),
      minGuests: Number(formData.minGuests),
      maxGuests: Number(formData.maxGuests),
      bookingDeadlineDays: Number(formData.bookingDeadlineDays),
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");
    setValidationErrors({});

    try {
      const payload = buildPayload();

      if (isEditMode) {
        await updatePack(packId, payload);
      } else {
        await createPack(payload);
      }

      navigate(ROUTES.PROVIDER_PACKS);
    } catch (error) {
      const data = error.response?.data;

      setErrorMessage(data?.message || "Impossible d’enregistrer le pack.");
      setValidationErrors(data?.validationErrors || {});
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return <p style={{ padding: "2rem" }}>Chargement du pack...</p>;
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "760px", margin: "0 auto" }}>
      <h1>{isEditMode ? "Modifier le pack" : "Créer un pack"}</h1>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Nom du pack *</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.name && (
            <small style={{ color: "red" }}>{validationErrors.name}</small>
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
          <label>Type d’événement *</label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.75rem" }}
          >
            <option value="MARIAGE">Mariage</option>
            <option value="ANNIVERSAIRE">Anniversaire</option>
            <option value="BABY_REVEAL">Baby reveal</option>
            <option value="AQIQA">Aqiqa</option>
            <option value="SEMINAIRE">Séminaire</option>
            <option value="CONFERENCE">Conférence</option>
            <option value="COCKTAIL">Cocktail</option>
            <option value="ENTREPRISE">Événement entreprise</option>
            <option value="SUR_MESURE">Sur mesure</option>
          </select>
          {validationErrors.eventType && (
            <small style={{ color: "red" }}>{validationErrors.eventType}</small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Type de service *</label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.75rem" }}
          >
            <option value="TRAITEUR">Traiteur</option>
            <option value="BUFFET">Buffet</option>
            <option value="COCKTAIL">Cocktail</option>
            <option value="DECORATION">Décoration</option>
            <option value="EVENT_PLANNER">Organisation</option>
            <option value="OTHER">Autre</option>
          </select>
          {validationErrors.serviceType && (
            <small style={{ color: "red" }}>{validationErrors.serviceType}</small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Prix MAD *</label>
          <input
            name="price"
            type="number"
            min="1"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.price && (
            <small style={{ color: "red" }}>{validationErrors.price}</small>
          )}
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ marginBottom: "1rem", flex: 1 }}>
            <label>Convives min *</label>
            <input
              name="minGuests"
              type="number"
              min="1"
              value={formData.minGuests}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem" }}
            />
            {validationErrors.minGuests && (
              <small style={{ color: "red" }}>
                {validationErrors.minGuests}
              </small>
            )}
          </div>

          <div style={{ marginBottom: "1rem", flex: 1 }}>
            <label>Convives max *</label>
            <input
              name="maxGuests"
              type="number"
              min="1"
              value={formData.maxGuests}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem" }}
            />
            {validationErrors.maxGuests && (
              <small style={{ color: "red" }}>
                {validationErrors.maxGuests}
              </small>
            )}
          </div>
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

        <div style={{ marginBottom: "1rem" }}>
          <label>Services inclus</label>
          <textarea
            name="includedServices"
            value={formData.includedServices}
            onChange={handleChange}
            rows={3}
            style={{ width: "100%", padding: "0.75rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Services exclus</label>
          <textarea
            name="excludedServices"
            value={formData.excludedServices}
            onChange={handleChange}
            rows={3}
            style={{ width: "100%", padding: "0.75rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Délai minimum de réservation en jours *</label>
          <input
            name="bookingDeadlineDays"
            type="number"
            min="0"
            value={formData.bookingDeadlineDays}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.bookingDeadlineDays && (
            <small style={{ color: "red" }}>
              {validationErrors.bookingDeadlineDays}
            </small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            <input
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
            />{" "}
            Pack actif
          </label>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit" disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>

          <button
            type="button"
            onClick={() => navigate(ROUTES.PROVIDER_PACKS)}
          >
            Annuler
          </button>
        </div>
      </form>
    </main>
  );
}

export default ProviderPackFormPage;