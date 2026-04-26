import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { getClientQuoteRequestById } from "../../services/api/clientQuoteApi";

function ClientQuoteRequestDetailsPage() {
  const { quoteRequestId } = useParams();

  const [quoteRequest, setQuoteRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadQuoteRequest = async () => {
    try {
      const data = await getClientQuoteRequestById(quoteRequestId);
      setQuoteRequest(data);
    } catch (error) {
      console.error(
        "Client quote request detail error:",
        error.response?.data || error
      );

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
        <Link to={ROUTES.CLIENT_QUOTE_REQUESTS}>
          ← Retour à mes demandes
        </Link>

        <h1>Détail demande de devis</h1>
        <p style={{ color: "red" }}>{errorMessage}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "820px", margin: "0 auto" }}>
      <Link to={ROUTES.CLIENT_QUOTE_REQUESTS}>← Retour à mes demandes</Link>

      <h1>Détail demande de devis</h1>

      {quoteRequest && (
        <>
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
              <strong>Prestataire :</strong>{" "}
              {quoteRequest.providerBusinessName}
            </p>

            <p>
              <strong>Statut :</strong> {getStatusLabel(quoteRequest.status)}
            </p>

            <p>
              <strong>Type événement :</strong>{" "}
              {quoteRequest.packEventType}
            </p>

            <p>
              <strong>Type service :</strong>{" "}
              {quoteRequest.packServiceType}
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
                <strong>Votre message :</strong> {quoteRequest.message}
              </p>
            )}
          </section>

          <section
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <h2>Réponse du prestataire</h2>

            {quoteRequest.providerResponse ? (
              <p>{quoteRequest.providerResponse}</p>
            ) : (
              <p>Le prestataire n’a pas encore répondu.</p>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default ClientQuoteRequestDetailsPage;