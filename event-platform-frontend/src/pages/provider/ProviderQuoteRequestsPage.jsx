import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReceivedQuoteRequests } from "../../services/api/providerQuoteApi";

function ProviderQuoteRequestsPage() {
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadQuoteRequests = async () => {
    try {
      const data = await getReceivedQuoteRequests();
      setQuoteRequests(data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger les demandes de devis."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuoteRequests();
  }, []);

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
    return <p style={{ padding: "2rem" }}>Chargement des demandes...</p>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Demandes de devis reçues</h1>
      <p>Consultez et traitez les demandes envoyées par les clients.</p>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {quoteRequests.length === 0 ? (
        <p>Aucune demande reçue pour le moment.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
          {quoteRequests.map((quote) => (
            <article
              key={quote.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
              }}
            >
              <h2>{quote.packName}</h2>

              <p>
                <strong>Client :</strong> {quote.customerName}
              </p>

              <p>
                <strong>Email :</strong> {quote.customerEmail}
              </p>

              <p>
                <strong>Téléphone :</strong> {quote.customerPhone}
              </p>

              <p>
                <strong>Date événement :</strong> {quote.eventDate}
              </p>

              <p>
                <strong>Ville :</strong> {quote.eventCity}
              </p>

              <p>
                <strong>Convives :</strong> {quote.guestCount}
              </p>

              <p>
                <strong>Statut :</strong> {getStatusLabel(quote.status)}
              </p>

              <Link to={`/provider/quote-requests/${quote.id}`}>
                Voir détail
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default ProviderQuoteRequestsPage;