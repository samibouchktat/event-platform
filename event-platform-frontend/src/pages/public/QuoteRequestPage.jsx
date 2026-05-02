import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { searchPacks } from "../../services/api/searchApi";
import { createQuoteRequest } from "../../services/api/quoteApi";
import useAuth from "../../hooks/useAuth";

function QuoteRequestPage() {
  const { packId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pack, setPack] = useState(null);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    eventDate: "",
    eventCity: "",
    guestCount: "",
    estimatedBudget: "",
    message: "",
  });

  const [loadingPack, setLoadingPack] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const isAuthenticated = Boolean(user);
  const roles = user?.roles || [];
  const isClient = roles.includes("ROLE_CLIENT");
  const isProvider = roles.includes("ROLE_PROVIDER");
  const isAdmin = roles.includes("ROLE_ADMIN");

  const canSubmitQuoteRequest = !isAuthenticated || isClient;

  const loadPack = async () => {
    setLoadingPack(true);
    setErrorMessage("");

    try {
      const data = await searchPacks({});
      const foundPack = Array.isArray(data)
        ? data.find((item) => String(item.packId || item.id) === String(packId))
        : null;

      if (!foundPack) {
        setErrorMessage("Pack introuvable ou indisponible.");
        return;
      }

      setPack(foundPack);

      setFormData((current) => ({
        ...current,
        customerName:
          user?.firstName || user?.lastName
            ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
            : current.customerName,
        customerEmail: user?.email || current.customerEmail,
        customerPhone: user?.phone || current.customerPhone,
        eventCity: foundPack.city || foundPack.providerCity || "",
        estimatedBudget: foundPack.price || "",
      }));
    } catch (error) {
      console.error("Load pack for quote error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger les informations du pack."
      );
    } finally {
      setLoadingPack(false);
    }
  };

  useEffect(() => {
    loadPack();
  }, [packId, user?.email]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.customerName.trim()) {
      errors.customerName = "Le nom est obligatoire.";
    }

    if (!formData.customerEmail.trim()) {
      errors.customerEmail = "L’email est obligatoire.";
    }

    if (!formData.customerPhone.trim()) {
      errors.customerPhone = "Le téléphone est obligatoire.";
    }

    if (!formData.eventDate) {
      errors.eventDate = "La date de l’événement est obligatoire.";
    }

    if (!formData.eventCity.trim()) {
      errors.eventCity = "La ville de l’événement est obligatoire.";
    }

    if (!formData.guestCount || Number(formData.guestCount) <= 0) {
      errors.guestCount = "Le nombre d’invités doit être supérieur à 0.";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canSubmitQuoteRequest) {
      setErrorMessage(
        "Seul un compte client peut envoyer une demande de devis. Connectez-vous avec un compte client."
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    setValidationErrors({});

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim().toLowerCase(),
        customerPhone: formData.customerPhone.trim(),
        eventDate: formData.eventDate,
        eventCity: formData.eventCity.trim(),
        guestCount: Number(formData.guestCount),
        estimatedBudget: formData.estimatedBudget
          ? Number(formData.estimatedBudget)
          : null,
        message: formData.message.trim() || null,
      };

      await createQuoteRequest(packId, payload);

      if (isClient) {
        setSuccessMessage(
          "Votre demande de devis a été envoyée avec succès. Redirection vers vos devis..."
        );

        setTimeout(() => {
          navigate(ROUTES.CLIENT_QUOTE_REQUESTS || "/client/quote-requests", {
            replace: true,
          });
        }, 1200);

        return;
      }

      setSuccessMessage(
        "Votre demande de devis a été envoyée avec succès. Créez un compte ou connectez-vous pour suivre son évolution."
      );

      setFormData((current) => ({
        ...current,
        eventDate: "",
        guestCount: "",
        message: "",
      }));
    } catch (error) {
      console.error("Create quote request error:", error.response?.data || error);

      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 401 || status === 403) {
        setErrorMessage(
          "Vous devez être connecté avec un compte client pour envoyer une demande de devis."
        );
        return;
      }

      setErrorMessage(
        data?.message ||
          "Impossible d’envoyer la demande de devis. Vérifiez les informations saisies."
      );

      setValidationErrors(data?.validationErrors || {});
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPack) {
    return <p className="loading-text">Chargement du pack...</p>;
  }

  if (errorMessage && !pack) {
    return (
      <main className="app-container">
        <Link className="link-btn link-btn-secondary" to={ROUTES.PUBLIC_PACKS}>
          Retour aux packs
        </Link>

        <div className="alert alert-danger">{errorMessage}</div>
      </main>
    );
  }

  return (
    <main className="app-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Demander un devis</h1>
          <p className="page-subtitle">
            Remplissez quelques informations simples pour aider le prestataire à
            vous répondre rapidement.
          </p>
        </div>

        <Link className="link-btn link-btn-secondary" to={`/packs/${packId}`}>
          Retour au pack
        </Link>
      </div>

      {isProvider && (
        <div className="alert alert-warning">
          Vous êtes connecté comme prestataire. Pour envoyer une demande de
          devis, utilisez un compte client.
        </div>
      )}

      {isAdmin && (
        <div className="alert alert-warning">
          Vous êtes connecté comme administrateur. Les demandes de devis doivent
          être envoyées depuis un compte client.
        </div>
      )}

      {!isAuthenticated && (
        <div className="alert alert-info">
          Vous pouvez envoyer une demande maintenant. Pour suivre son statut,
          connectez-vous ou créez un compte client après l’envoi.
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}

          {!isAuthenticated && (
            <div className="actions mt-1">
              <Link className="link-btn" to={ROUTES.LOGIN || "/login"}>
                Se connecter
              </Link>

              <Link
                className="link-btn link-btn-secondary"
                to={ROUTES.REGISTER || "/register"}
              >
                Créer un compte
              </Link>
            </div>
          )}
        </div>
      )}

      {errorMessage && pack && (
        <div className="alert alert-danger">
          {errorMessage}

          {(errorMessage.includes("connecté") ||
            errorMessage.includes("compte client")) && (
            <div className="actions mt-1">
              <Link className="link-btn" to={ROUTES.LOGIN || "/login"}>
                Se connecter
              </Link>

              <Link
                className="link-btn link-btn-secondary"
                to={ROUTES.REGISTER || "/register"}
              >
                Créer un compte client
              </Link>
            </div>
          )}
        </div>
      )}

      <section className="quote-layout">
        <article className="card">
          <h2 className="card-title">Vos informations</h2>

          <form className="form" onSubmit={handleSubmit}>
            <div className="card-grid card-grid-2">
              <FormRow label="Nom complet" error={validationErrors.customerName}>
                <input
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ex: Sami Alaoui"
                  disabled={!canSubmitQuoteRequest || submitting}
                />
              </FormRow>

              <FormRow label="Téléphone" error={validationErrors.customerPhone}>
                <input
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="06XXXXXXXX"
                  disabled={!canSubmitQuoteRequest || submitting}
                />
              </FormRow>
            </div>

            <FormRow label="Email" error={validationErrors.customerEmail}>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                className="form-control"
                placeholder="exemple@email.com"
                disabled={!canSubmitQuoteRequest || submitting}
              />
            </FormRow>

            <div className="card-grid card-grid-2">
              <FormRow label="Date de l’événement" error={validationErrors.eventDate}>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="form-control"
                  disabled={!canSubmitQuoteRequest || submitting}
                />
              </FormRow>

              <FormRow label="Ville de l’événement" error={validationErrors.eventCity}>
                <input
                  name="eventCity"
                  value={formData.eventCity}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Casablanca, Rabat..."
                  disabled={!canSubmitQuoteRequest || submitting}
                />
              </FormRow>
            </div>

            <div className="card-grid card-grid-2">
              <FormRow label="Nombre d’invités" error={validationErrors.guestCount}>
                <input
                  type="number"
                  min="1"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ex: 150"
                  disabled={!canSubmitQuoteRequest || submitting}
                />
              </FormRow>

              <FormRow
                label="Budget estimé MAD"
                error={validationErrors.estimatedBudget}
              >
                <input
                  type="number"
                  min="0"
                  name="estimatedBudget"
                  value={formData.estimatedBudget}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ex: 20000"
                  disabled={!canSubmitQuoteRequest || submitting}
                />
              </FormRow>
            </div>

            <FormRow label="Message au prestataire" error={validationErrors.message}>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="form-control"
                placeholder="Expliquez votre besoin : type d’ambiance, lieu, contraintes, services souhaités..."
                disabled={!canSubmitQuoteRequest || submitting}
              />
            </FormRow>

            <div className="actions">
              <button
                className="btn"
                type="submit"
                disabled={submitting || !canSubmitQuoteRequest}
              >
                {submitting ? "Envoi..." : "Envoyer la demande"}
              </button>

              <Link className="link-btn link-btn-secondary" to={ROUTES.PUBLIC_PACKS}>
                Voir d’autres packs
              </Link>
            </div>
          </form>
        </article>

        {pack && (
          <aside className="card quote-pack-summary">
            <div className="quote-pack-image">
              {pack.imageUrl ? (
                <img src={buildImageUrl(pack.imageUrl)} alt={pack.packName} />
              ) : (
                <div className="market-pack-placeholder">
                  <span>{getInitials(pack.packName || "Pack")}</span>
                </div>
              )}
            </div>

            <h2 className="card-title mt-1">{pack.packName}</h2>

            <p className="text-muted">
              Proposé par <strong>{pack.providerBusinessName}</strong>
            </p>

            <div className="info-list mt-1">
              <InfoRow
                label="Prix"
                value={pack.price ? `${pack.price} MAD` : "Sur devis"}
              />
              <InfoRow
                label="Ville"
                value={pack.city || pack.providerCity || "Non renseignée"}
              />
              <InfoRow label="Événement" value={formatEnum(pack.eventType)} />
              <InfoRow label="Service" value={formatEnum(pack.serviceType)} />
              <InfoRow
                label="Convives"
                value={`${pack.minGuests || "?"} - ${
                  pack.maxGuests || "?"
                } personnes`}
              />
            </div>

            <div className="alert alert-info">
              Votre demande sera envoyée au prestataire. Il pourra ensuite
              répondre, accepter ou créer une réservation.
            </div>
          </aside>
        )}
      </section>
    </main>
  );
}

function FormRow({ label, error, children }) {
  return (
    <div className="form-row">
      <label className="form-label">{label}</label>
      {children}
      {error && <small className="text-danger">{error}</small>}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}

function buildImageUrl(imageUrl) {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("http") || imageUrl.startsWith("blob:")) {
    return imageUrl;
  }

  return `http://localhost:8080${imageUrl}`;
}

function formatEnum(value) {
  if (!value) {
    return "Non renseigné";
  }

  return value
    .toString()
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function getInitials(text) {
  return text
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

export default QuoteRequestPage;