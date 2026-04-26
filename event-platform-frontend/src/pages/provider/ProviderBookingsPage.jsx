import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProviderBookings } from "../../services/api/providerBookingApi";

function ProviderBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBookings = async () => {
    try {
      const data = await getProviderBookings();
      setBookings(data);
    } catch (error) {
  console.error("Bookings error:", error.response?.data || error);

  setErrorMessage(
    error.response?.data?.message ||
      "Impossible de charger les réservations."
  );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

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
    return <p style={{ padding: "2rem" }}>Chargement des réservations...</p>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Mes réservations</h1>
      <p>Suivez les événements confirmés ou en attente d’acompte.</p>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {bookings.length === 0 ? (
        <p>Aucune réservation pour le moment.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
          {bookings.map((booking) => (
            <article
              key={booking.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
              }}
            >
              <h2>{booking.packName}</h2>

              <p>
                <strong>Client :</strong> {booking.customerName}
              </p>

              <p>
                <strong>Date événement :</strong> {booking.eventDate}
              </p>

              <p>
                <strong>Ville :</strong> {booking.eventCity}
              </p>

              <p>
                <strong>Convives :</strong> {booking.guestCount}
              </p>

              <p>
                <strong>Montant total :</strong> {booking.totalAmount} MAD
              </p>

              <p>
                <strong>Acompte :</strong>{" "}
                {booking.depositAmount ? `${booking.depositAmount} MAD` : "Non défini"}
              </p>

              <p>
                <strong>Statut :</strong> {getStatusLabel(booking.status)}
              </p>

              <Link to={`/provider/bookings/${booking.id}`}>Voir détail</Link>
              <Link to={ROUTES.PROVIDER_BOOKINGS}>Réservations</Link>
            </article>
            
          ))}
        </div>
      )}
    </main>
  );
}

export default ProviderBookingsPage;