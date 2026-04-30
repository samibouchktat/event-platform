import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import StatusBadge from "../../components/common/StatusBadge";
import { getProviderBookings } from "../../services/api/providerBookingApi";

function ProviderBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBookings = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getProviderBookings();
      setBookings(data);
    } catch (error) {
      console.error("Provider bookings error:", error.response?.data || error);

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

  if (loading) {
    return <p className="loading-text">Chargement des réservations...</p>;
  }

  return (
    <main className="app-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mes réservations</h1>
          <p className="page-subtitle">
            Suivez vos événements, acomptes, documents et statuts de
            confirmation.
          </p>
        </div>

        <Link className="link-btn link-btn-secondary" to={ROUTES.PROVIDER_DASHBOARD}>
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
                <InfoRow label="Client" value={booking.customerName || "Non renseigné"} />
                <InfoRow label="Email" value={booking.customerEmail || "Non renseigné"} />
                <InfoRow label="Téléphone" value={booking.customerPhone || "Non renseigné"} />
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
                  to={`/provider/bookings/${booking.bookingId || booking.id}`}
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

export default ProviderBookingsPage;