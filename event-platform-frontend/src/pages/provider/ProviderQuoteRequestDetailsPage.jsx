import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import {
  getReceivedQuoteRequestById,
  updateQuoteRequestStatus,
} from "../../services/api/providerQuoteApi";
import { createBookingFromQuoteRequest } from "../../services/api/providerBookingApi";

function ProviderQuoteRequestDetailsPage() {
  const { quoteRequestId } = useParams();
  const navigate = useNavigate();
  const [quoteRequest, setQuoteRequest] = useState(null);
  const [formData, setFormData] = useState({
    status: "PENDING",
    providerResponse: "",
  });
  const [creatingBooking, setCreatingBooking] = useState(false);
    const [bookingForm, setBookingForm] = useState({
    totalAmount: "",
    depositAmount: "",
    providerNotes: "",
    });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
const handleBookingChange = (event) => {
  const { name, value } = event.target;

  setBookingForm((previous) => ({
    ...previous,
    [name]: value,
  }));
};

const handleCreateBooking = async (event) => {
  event.preventDefault();

  setCreatingBooking(true);
  setSuccessMessage("");
  setErrorMessage("");

  try {
    const payload = {
      totalAmount: bookingForm.totalAmount
        ? Number(bookingForm.totalAmount)
        : null,
      depositAmount: bookingForm.depositAmount
        ? Number(bookingForm.depositAmount)
        : null,
      providerNotes: bookingForm.providerNotes,
    };

    const booking = await createBookingFromQuoteRequest(
      quoteRequestId,
      payload
    );

    navigate(`/provider/bookings/${booking.id}`);
  } catch (error) {
    const data = error.response?.data;
    setErrorMessage(data?.message || "Impossible de créer la réservation.");
  } finally {
    setCreatingBooking(false);
  }
};
  const loadQuoteRequest = async () => {
    try {
      const data = await getReceivedQuoteRequestById(quoteRequestId);
      setQuoteRequest(data);
      setFormData({
        status: data.status || "PENDING",
        providerResponse: data.providerResponse || "",
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger la demande de devis."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuoteRequest();
  }, [quoteRequestId]);

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
      const updatedQuoteRequest = await updateQuoteRequestStatus(
        quoteRequestId,
        formData
      );

      setQuoteRequest(updatedQuoteRequest);
      setFormData({
        status: updatedQuoteRequest.status,
        providerResponse: updatedQuoteRequest.providerResponse || "",
      });
      setSuccessMessage("Demande mise à jour avec succès.");
    } catch (error) {
      const data = error.response?.data;

      setErrorMessage(data?.message || "Impossible de mettre à jour la demande.");
      setValidationErrors(data?.validationErrors || {});
    } finally {
      setSaving(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: "En attente",
      IN_DISCUSSION: "En discussion",
      ACCEPTED: "Acceptée",
      REJECTED: "Refusée",
      CANCELLED: "Annulée",
    };

    return labels[status] || status;
  };

  if (loading) {
    return <p style={{ padding: "2rem" }}>Chargement de la demande...</p>;
  }

  if (errorMessage && !quoteRequest) {
    return (
      <main style={{ padding: "2rem" }}>
        <Link to={ROUTES.PROVIDER_QUOTE_REQUESTS}>
          ← Retour aux demandes
        </Link>
        <h1>Détail demande de devis</h1>
        <p style={{ color: "red" }}>{errorMessage}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "820px", margin: "0 auto" }}>
      <Link to={ROUTES.PROVIDER_QUOTE_REQUESTS}>← Retour aux demandes</Link>

      <h1>Détail demande de devis</h1>

      {quoteRequest && (
        <section
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2>{quoteRequest.packName}</h2>

          <p>
            <strong>Statut actuel :</strong>{" "}
            {getStatusLabel(quoteRequest.status)}
          </p>

          <p>
            <strong>Client :</strong> {quoteRequest.customerName}
          </p>

          <p>
            <strong>Email :</strong> {quoteRequest.customerEmail}
          </p>

          <p>
            <strong>Téléphone :</strong> {quoteRequest.customerPhone}
          </p>

          <p>
            <strong>Date événement :</strong> {quoteRequest.eventDate}
          </p>

          <p>
            <strong>Ville événement :</strong> {quoteRequest.eventCity}
          </p>

          <p>
            <strong>Nombre de convives :</strong> {quoteRequest.guestCount}
          </p>

          {quoteRequest.message && (
            <p>
              <strong>Message client :</strong> {quoteRequest.message}
            </p>
          )}

          <p>
            <strong>Type événement :</strong> {quoteRequest.packEventType}
          </p>

          <p>
            <strong>Type service :</strong> {quoteRequest.packServiceType}
          </p>
        </section>
      )}

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
        }}
      >
        <h2>Répondre / changer le statut</h2>

        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Statut</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem" }}
            >
              <option value="PENDING">En attente</option>
              <option value="IN_DISCUSSION">En discussion</option>
              <option value="ACCEPTED">Acceptée</option>
              <option value="REJECTED">Refusée</option>
              <option value="CANCELLED">Annulée</option>
            </select>
            {validationErrors.status && (
              <small style={{ color: "red" }}>{validationErrors.status}</small>
            )}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Réponse au client</label>
            <textarea
              name="providerResponse"
              value={formData.providerResponse}
              onChange={handleChange}
              rows={5}
              placeholder="Écrivez votre réponse ou demande de précision..."
              style={{ width: "100%", padding: "0.75rem" }}
            />
            {validationErrors.providerResponse && (
              <small style={{ color: "red" }}>
                {validationErrors.providerResponse}
              </small>
            )}
          </div>

          <button type="submit" disabled={saving}>
            {saving ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default ProviderQuoteRequestDetailsPage;