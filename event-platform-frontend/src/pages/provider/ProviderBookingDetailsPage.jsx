import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import {
  getProviderBookingById,
  updateBookingStatus,
} from "../../services/api/providerBookingApi";

function ProviderBookingDetailsPage() {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [formData, setFormData] = useState({
    status: "PENDING_DEPOSIT",
    providerNotes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const loadBooking = async () => {
    try {
      const data = await getProviderBookingById(bookingId);
      setBooking(data);
      setFormData({
        status: data.status || "PENDING_DEPOSIT",
        providerNotes: data.providerNotes || "",
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger la réservation."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

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
      const updatedBooking = await updateBookingStatus(bookingId, formData);

      setBooking(updatedBooking);
      setFormData({
        status: updatedBooking.status,
        providerNotes: updatedBooking.providerNotes || "",
      });

      setSuccessMessage("Réservation mise à jour avec succès.");
    } catch (error) {
      const data = error.response?.data;

      setErrorMessage(
        data?.message || "Impossible de mettre à jour la réservation."
      );
      setValidationErrors(data?.validationErrors || {});
    } finally {
      setSaving(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING_DEPOSIT: "En attente d’acompte",
      CONFIRMED: "Confirmée",
      CANCELLED: "Annulée",
      COMPLETED: "Terminée",
    };

    return labels[status] || status;
  };

  if (loading) {
    return <p style={{ padding: "2rem" }}>Chargement de la réservation...</p>;
  }

  if (errorMessage && !booking) {
    return (
      <main style={{ padding: "2rem" }}>
        <Link to={ROUTES.PROVIDER_BOOKINGS}>← Retour aux réservations</Link>
        <h1>Détail réservation</h1>
        <p style={{ color: "red" }}>{errorMessage}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "820px", margin: "0 auto" }}>
      <Link to={ROUTES.PROVIDER_BOOKINGS}>← Retour aux réservations</Link>

      <h1>Détail réservation</h1>

      {booking && (
        <section
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2>{booking.packName}</h2>

          <p>
            <strong>Statut actuel :</strong> {getStatusLabel(booking.status)}
          </p>

          <p>
            <strong>Client :</strong> {booking.customerName}
          </p>

          <p>
            <strong>Email :</strong> {booking.customerEmail}
          </p>

          <p>
            <strong>Téléphone :</strong> {booking.customerPhone}
          </p>

          <p>
            <strong>Date événement :</strong> {booking.eventDate}
          </p>

          <p>
            <strong>Ville événement :</strong> {booking.eventCity}
          </p>

          <p>
            <strong>Nombre de convives :</strong> {booking.guestCount}
          </p>

          <p>
            <strong>Montant total :</strong> {booking.totalAmount} MAD
          </p>

          <p>
            <strong>Acompte :</strong>{" "}
            {booking.depositAmount ? `${booking.depositAmount} MAD` : "Non défini"}
          </p>

          <p>
            <strong>Type événement :</strong> {booking.packEventType}
          </p>

          <p>
            <strong>Type service :</strong> {booking.packServiceType}
          </p>

          {booking.providerNotes && (
            <p>
              <strong>Notes prestataire :</strong> {booking.providerNotes}
            </p>
          )}
        </section>
      )}

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
        }}
      >
        <h2>Changer le statut</h2>

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
              <option value="PENDING_DEPOSIT">En attente d’acompte</option>
              <option value="CONFIRMED">Confirmée</option>
              <option value="CANCELLED">Annulée</option>
              <option value="COMPLETED">Terminée</option>
            </select>
            {validationErrors.status && (
              <small style={{ color: "red" }}>{validationErrors.status}</small>
            )}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Notes prestataire</label>
            <textarea
              name="providerNotes"
              value={formData.providerNotes}
              onChange={handleChange}
              rows={5}
              placeholder="Ajoutez des notes internes ou informations de suivi..."
              style={{ width: "100%", padding: "0.75rem" }}
            />
            {validationErrors.providerNotes && (
              <small style={{ color: "red" }}>
                {validationErrors.providerNotes}
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

export default ProviderBookingDetailsPage;