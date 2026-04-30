import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import StatusBadge from "../../components/common/StatusBadge";
import { getClientBookings } from "../../services/api/clientBookingApi";

function ClientBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBookings = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getClientBookings();
      setBookings(data);
    } catch (error) {
      console.error("Client bookings error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger vos réservations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  if (loading) {
    return <p className="loading-text">Chargement de vos réservations...</p>;
  }

  return (
    <main className="app-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mes réservations</h1>
          <p className="page-subtitle">
            Consultez vos événements confirmés, documents et suivi d’acompte.
          </p>
        </div>

        <Link className="link-btn link-btn-secondary" to={ROUTES.CLIENT_DASHBOARD}>
          Retour dashboard
        </Link>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {bookings.length === 0 ? (
        <div className="empty-state">Aucune réservation pour le moment.</div>
      ) : (
        <section className="list-grid">
          {bookings.map((booking) => (
            <article className="card" key={booking.bookingId || booking.id}>
              <div className="page-header" style={{ marginBottom: "1rem" }}>
                <div>
                  <h2 className="card-title">{booking.packName}</h2>
                  <p className="text-muted" style={{ margin: 0 }}>
                    {booking.eventCity} · {booking.eventDate}
                  </p>
                </div>

                <div className="actions">
                  <StatusBadge type="booking" value={booking.status} />
                  <StatusBadge type="deposit" value={booking.depositPaid} />
                </div>
              </div>

              <div className="info-list">
                <InfoRow
                  label="Prestataire"
                  value={
                    booking.providerBusinessName ||
                    booking.providerName ||
                    "Non renseigné"
                  }
                />
                <InfoRow label="Ville" value={booking.eventCity || "Non renseignée"} />
                <InfoRow label="Convives" value={booking.guestCount || "Non renseigné"} />
                <InfoRow
                  label="Montant total"
                  value={
                    booking.totalAmount
                      ? `${booking.totalAmount} MAD`
                      : "Non défini"
                  }
                />
                <InfoRow
                  label="Acompte"
                  value={
                    booking.depositAmount
                      ? `${booking.depositAmount} MAD`
                      : "Non défini"
                  }
                />
              </div>

              <div className="actions mt-1">
                <Link
                  className="link-btn"
                  to={`/client/bookings/${booking.bookingId || booking.id}`}
                >
                  Voir détail
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
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

export default ClientBookingsPage;