import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClientQuoteRequests } from "../../services/api/clientQuoteApi";

function ClientQuoteRequestsPage() {
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadQuoteRequests = async () => {
    try {
      const data = await getClientQuoteRequests();
      setQuoteRequests(data);
    } catch (error) {
      console.error("Client quote requests error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger vos demandes de devis."
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
    return <p style={{ padding: "2rem" }}>Chargement de vos demandes...</p>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Mes demandes de devis</h1>
      <p>Suivez les demandes envoyées aux prestataires.</p>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {quoteRequests.length === 0 ? (
        <p>Aucune demande de devis pour le moment.</p>
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
                <strong>Prestataire :</strong> {quote.providerBusinessName}
              </p>

              <p>
                <strong>Type événement :</strong> {quote.packEventType}
              </p>

              <p>
                <strong>Service :</strong> {quote.packServiceType}
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

              {quote.providerResponse && (
                <p>
                  <strong>Réponse prestataire :</strong>{" "}
                  {quote.providerResponse}
                </p>
              )}

              <Link to={`/client/quote-requests/${quote.id}`}>
                Voir détail
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default ClientQuoteRequestsPage;