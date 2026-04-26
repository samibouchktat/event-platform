import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { createQuoteRequest } from "../../services/api/quoteApi";

function QuoteRequestPage() {
  const { packId } = useParams();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    eventDate: "",
    eventCity: "",
    guestCount: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const buildPayload = () => {
    return {
      packId: Number(packId),
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      eventDate: formData.eventDate,
      eventCity: formData.eventCity,
      guestCount: Number(formData.guestCount),
      message: formData.message,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setValidationErrors({});
    setSuccessResponse(null);

    try {
      const response = await createQuoteRequest(buildPayload());
      setSuccessResponse(response);
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        eventDate: "",
        eventCity: "",
        guestCount: "",
        message: "",
      });
    } catch (error) {
      const data = error.response?.data;

      setErrorMessage(data?.message || "Impossible d’envoyer la demande.");
      setValidationErrors(data?.validationErrors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "720px", margin: "0 auto" }}>
      <Link to={ROUTES.SEARCH}>← Retour à la recherche</Link>

      <h1>Demander un devis</h1>
      <p>
        Remplissez les informations de votre événement. Le prestataire pourra
        ensuite vous répondre.
      </p>

      {successResponse && (
        <div
          style={{
            padding: "1rem",
            border: "1px solid green",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <h2>Demande envoyée</h2>
          <p>
            Votre demande a été envoyée au prestataire{" "}
            <strong>{successResponse.providerBusinessName}</strong>.
          </p>
          <p>
            Statut : <strong>{successResponse.status}</strong>
          </p>
        </div>
      )}

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Nom complet *</label>
          <input
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.customerName && (
            <small style={{ color: "red" }}>
              {validationErrors.customerName}
            </small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Email *</label>
          <input
            name="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.customerEmail && (
            <small style={{ color: "red" }}>
              {validationErrors.customerEmail}
            </small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Téléphone *</label>
          <input
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.customerPhone && (
            <small style={{ color: "red" }}>
              {validationErrors.customerPhone}
            </small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Date de l’événement *</label>
          <input
            name="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.eventDate && (
            <small style={{ color: "red" }}>
              {validationErrors.eventDate}
            </small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Ville de l’événement *</label>
          <input
            name="eventCity"
            value={formData.eventCity}
            onChange={handleChange}
            required
            placeholder="Casablanca, Rabat..."
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.eventCity && (
            <small style={{ color: "red" }}>
              {validationErrors.eventCity}
            </small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Nombre de convives *</label>
          <input
            name="guestCount"
            type="number"
            min="1"
            value={formData.guestCount}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.guestCount && (
            <small style={{ color: "red" }}>
              {validationErrors.guestCount}
            </small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            placeholder="Ajoutez des détails sur votre événement..."
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.message && (
            <small style={{ color: "red" }}>{validationErrors.message}</small>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer la demande"}
        </button>
      </form>
    </main>
  );
}

export default QuoteRequestPage;