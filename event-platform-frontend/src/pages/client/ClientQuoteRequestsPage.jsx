import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import StatusBadge from "../../components/common/StatusBadge";
import { getClientQuoteRequests } from "../../services/api/clientQuoteRequestApi";
import { getProviderQuoteRequests } from "../../services/api/providerQuoteRequestApi";

function ClientQuoteRequestsPage() {
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadQuoteRequests = async () => {
    setLoading(true);
    setErrorMessage("");

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

  if (loading) {
    return <p className="loading-text">Chargement de vos demandes de devis...</p>;
  }

  return (
    <main className="app-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mes demandes de devis</h1>
          <p className="page-subtitle">
            Suivez vos demandes envoyées aux prestataires et leur évolution.
          </p>
        </div>

        <Link className="link-btn link-btn-secondary" to={ROUTES.CLIENT_DASHBOARD}>
          Retour dashboard
        </Link>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {quoteRequests.length === 0 ? (
        <div className="empty-state">Aucune demande de devis pour le moment.</div>
      ) : (
        <section className="list-grid">
          {quoteRequests.map((quoteRequest) => (
            <article className="card" key={quoteRequest.id}>
              <div className="page-header" style={{ marginBottom: "1rem" }}>
                <div>
                  <h2 className="card-title">{quoteRequest.packName}</h2>
                  <p className="text-muted" style={{ margin: 0 }}>
                    {quoteRequest.eventCity} · {quoteRequest.eventDate}
                  </p>
                </div>

                <StatusBadge type="quote" value={quoteRequest.status} />
              </div>

              <div className="info-list">
                <InfoRow
                  label="Prestataire"
                  value={
                    quoteRequest.providerBusinessName ||
                    quoteRequest.providerName ||
                    "Non renseigné"
                  }
                />
                <InfoRow
                  label="Type événement"
                  value={quoteRequest.eventType || "Non renseigné"}
                />
                <InfoRow
                  label="Service"
                  value={quoteRequest.serviceType || "Non renseigné"}
                />
                <InfoRow
                  label="Convives"
                  value={quoteRequest.guestCount || "Non renseigné"}
                />
                <InfoRow
                  label="Budget"
                  value={
                    quoteRequest.estimatedBudget
                      ? `${quoteRequest.estimatedBudget} MAD`
                      : "Non défini"
                  }
                />
              </div>

              <div className="actions mt-1">
                <Link
                  className="link-btn"
                  to={`/client/quote-requests/${quoteRequest.id}`}
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

export default ClientQuoteRequestsPage;