import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProviderPlanningBookings,
  getProviderPlanningBookingsByDate,
} from "../../services/api/providerPlanningApi";
import StatusBadge from "../../components/common/StatusBadge";

function ProviderPlanningPage() {
  const [planningBookings, setPlanningBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadPlanning = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getProviderPlanningBookings();
      setPlanningBookings(data);
    } catch (error) {
      console.error("Provider planning error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger le planning."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlanning();
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleFilterByDate = async (event) => {
    event.preventDefault();

    if (!selectedDate) {
      await loadPlanning();
      return;
    }

    setFiltering(true);
    setErrorMessage("");

    try {
      const data = await getProviderPlanningBookingsByDate(selectedDate);
      setPlanningBookings(data);
    } catch (error) {
      console.error(
        "Provider planning by date error:",
        error.response?.data || error
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de filtrer le planning par date."
      );
    } finally {
      setFiltering(false);
    }
  };

  const handleReset = async () => {
    setSelectedDate("");
    await loadPlanning();
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
    return <p style={{ padding: "2rem" }}>Chargement du planning...</p>;
  }

  return (
    <main className="app-container">
      <h1>Planning prestataire</h1>
      <p>Consultez vos réservations par date d’événement.</p>

      <form
        onSubmit={handleFilterByDate}
        style={{
          marginTop: "1.5rem",
          marginBottom: "1.5rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          display: "flex",
          gap: "1rem",
          alignItems: "end",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label>Date événement</label>
          <br />
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            style={{ padding: "0.75rem" }}
          />
        </div>

        <button type="submit" disabled={filtering}>
          {filtering ? "Filtrage..." : "Filtrer"}
        </button>

        <button type="button" onClick={handleReset} disabled={filtering}>
          Réinitialiser
        </button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {planningBookings.length === 0 ? (
        <p>Aucune réservation trouvée pour ce planning.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {planningBookings.map((booking) => (
            <article
              key={booking.bookingId}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
              }}
            >
              <h2>{booking.packName}</h2>

              <p>
                <strong>Date événement :</strong> {booking.eventDate}
              </p>

              <p>
                <strong>Ville :</strong> {booking.eventCity}
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
                <strong>Type événement :</strong> {booking.packEventType}
              </p>

              <p>
                <strong>Service :</strong> {booking.packServiceType}
              </p>

              <p>
                <strong>Convives :</strong> {booking.guestCount}
              </p>

              <p>
                <strong>Montant total :</strong> {booking.totalAmount} MAD
              </p>

              <p>
                <strong>Acompte :</strong>{" "}
                <StatusBadge type="deposit" value={booking.depositPaid} />
                {booking.depositAmount
                  ? `${booking.depositAmount} MAD`
                  : "Non défini"}
              </p>

              <p>
                <strong>Statut :</strong>{" "}
<StatusBadge type="booking" value={booking.status} />
              </p>

              {booking.providerNotes && (
                <p>
                  <strong>Notes :</strong> {booking.providerNotes}
                </p>
              )}

              <Link to={`/provider/bookings/${booking.bookingId}`}>
                Voir réservation
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default ProviderPlanningPage;