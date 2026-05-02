import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import {
  createPack,
  getPackById,
  updatePack,
  uploadProviderPackImage,
} from "../../services/api/packApi";

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
    imageUrl: "",
  });

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

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
          active: pack.active ?? true,
          imageUrl: pack.imageUrl || "",
        });

        setImagePreview(pack.imageUrl || "");
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

    if (name === "imageUrl") {
      setImagePreview(value);
      setSelectedImageFile(null);
    }
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0];

    setSelectedImageFile(file || null);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(formData.imageUrl || "");
    }
  };

  const buildPayload = () => {
    return {
      ...formData,
      price: Number(formData.price),
      minGuests: Number(formData.minGuests),
      maxGuests: Number(formData.maxGuests),
      bookingDeadlineDays: Number(formData.bookingDeadlineDays),
      imageUrl: formData.imageUrl?.trim() || null,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setUploadingImage(false);
    setErrorMessage("");
    setValidationErrors({});

    try {
      const payload = buildPayload();

      const savedPack = isEditMode
        ? await updatePack(packId, payload)
        : await createPack(payload);

      const savedPackId = savedPack?.id || savedPack?.packId || packId;

      if (selectedImageFile) {
        setUploadingImage(true);
        await uploadProviderPackImage(savedPackId, selectedImageFile);
      }

      navigate(ROUTES.PROVIDER_PACKS);
    } catch (error) {
      const data = error.response?.data;

      setErrorMessage(data?.message || "Impossible d’enregistrer le pack.");
      setValidationErrors(data?.validationErrors || {});
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  const buildImagePreviewUrl = (url) => {
    if (!url) {
      return "";
    }

    if (url.startsWith("http") || url.startsWith("blob:")) {
      return url;
    }

    return `http://localhost:8080${url}`;
  };

  if (initialLoading) {
    return <p className="loading-text">Chargement du pack...</p>;
  }

  return (
    <main className="app-container" style={{ maxWidth: "860px" }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isEditMode ? "Modifier le pack" : "Créer un pack"}
          </h1>
          <p className="page-subtitle">
            Ajoutez les informations, le prix, les services et une image pour rendre le pack attractif.
          </p>
        </div>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form className="form card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="form-label">Nom du pack *</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control"
          />
          {validationErrors.name && (
            <small className="text-danger">{validationErrors.name}</small>
          )}
        </div>

        <div className="form-row">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="form-control"
          />
        </div>

        <div className="card-grid card-grid-2">
          <div className="form-row">
            <label className="form-label">Type d’événement *</label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="form-control"
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
              <small className="text-danger">{validationErrors.eventType}</small>
            )}
          </div>

          <div className="form-row">
            <label className="form-label">Type de service *</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="form-control"
            >
              <option value="TRAITEUR">Traiteur</option>
              <option value="BUFFET">Buffet</option>
              <option value="COCKTAIL">Cocktail</option>
              <option value="DECORATION">Décoration</option>
              <option value="EVENT_PLANNER">Organisation</option>
              <option value="OTHER">Autre</option>
            </select>
            {validationErrors.serviceType && (
              <small className="text-danger">{validationErrors.serviceType}</small>
            )}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="imageUrl">
            URL image du pack
          </label>

          <input
            id="imageUrl"
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="form-control"
            placeholder="https://exemple.com/image-pack.jpg"
          />

          <small className="text-muted">
            Optionnel : collez une URL publique, ou importez une image depuis votre PC ci-dessous.
          </small>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="packImage">
            Importer une image depuis mon PC
          </label>

          <input
            id="packImage"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleImageFileChange}
            className="form-control"
          />

          <small className="text-muted">
            Formats acceptés : JPG, PNG, WEBP. Taille max : 5 MB.
          </small>
        </div>

        {imagePreview && (
          <div className="card-soft">
            <strong>Aperçu image</strong>

            <img
              src={buildImagePreviewUrl(imagePreview)}
              alt="Aperçu du pack"
              style={{
                width: "100%",
                maxHeight: "280px",
                objectFit: "cover",
                borderRadius: "14px",
                marginTop: "0.75rem",
              }}
            />
          </div>
        )}

        <div className="form-row">
          <label className="form-label">Prix MAD *</label>
          <input
            name="price"
            type="number"
            min="1"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            className="form-control"
          />
          {validationErrors.price && (
            <small className="text-danger">{validationErrors.price}</small>
          )}
        </div>

        <div className="card-grid card-grid-2">
          <div className="form-row">
            <label className="form-label">Convives min *</label>
            <input
              name="minGuests"
              type="number"
              min="1"
              value={formData.minGuests}
              onChange={handleChange}
              required
              className="form-control"
            />
            {validationErrors.minGuests && (
              <small className="text-danger">{validationErrors.minGuests}</small>
            )}
          </div>

          <div className="form-row">
            <label className="form-label">Convives max *</label>
            <input
              name="maxGuests"
              type="number"
              min="1"
              value={formData.maxGuests}
              onChange={handleChange}
              required
              className="form-control"
            />
            {validationErrors.maxGuests && (
              <small className="text-danger">{validationErrors.maxGuests}</small>
            )}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Ville *</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="form-control"
          />
          {validationErrors.city && (
            <small className="text-danger">{validationErrors.city}</small>
          )}
        </div>

        <div className="form-row">
          <label className="form-label">Zones de service</label>
          <textarea
            name="serviceArea"
            value={formData.serviceArea}
            onChange={handleChange}
            rows={3}
            placeholder="Casablanca, Rabat, Mohammedia..."
            className="form-control"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Services inclus</label>
          <textarea
            name="includedServices"
            value={formData.includedServices}
            onChange={handleChange}
            rows={3}
            className="form-control"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Services exclus</label>
          <textarea
            name="excludedServices"
            value={formData.excludedServices}
            onChange={handleChange}
            rows={3}
            className="form-control"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Délai minimum de réservation en jours *</label>
          <input
            name="bookingDeadlineDays"
            type="number"
            min="0"
            value={formData.bookingDeadlineDays}
            onChange={handleChange}
            required
            className="form-control"
          />
          {validationErrors.bookingDeadlineDays && (
            <small className="text-danger">
              {validationErrors.bookingDeadlineDays}
            </small>
          )}
        </div>

        <div className="form-row">
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

        <div className="actions">
          <button className="btn" type="submit" disabled={saving || uploadingImage}>
            {saving || uploadingImage ? "Enregistrement..." : "Enregistrer"}
          </button>

          <button
            className="btn btn-secondary"
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