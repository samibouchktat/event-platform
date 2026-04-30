import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import StatusBadge from "../../components/common/StatusBadge";
import { getClientQuoteRequestById } from "../../services/api/clientQuoteRequestApi";

function ClientQuoteRequestDetailsPage() {
  const { quoteRequestId, id } = useParams();
  const currentQuoteRequestId = quoteRequestId || id;

  const [quoteRequest, setQuoteRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadQuoteRequest = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getClientQuoteRequestById(currentQuoteRequestId);
      setQuoteRequest(data);
    } catch (error) {
      console.error("Client quote request details error:", error.response?.data || error);

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
  }, [currentQuoteRequestId]);

  if (loading) {
    return <p className="loading-text">Chargement de la demande de devis...</p>;
  }

  if (errorMessage && !quoteRequest) {
    return (
      <main className="app-container">
        <Link
          className="link-btn link-btn-secondary"
          to={ROUTES.CLIENT_QUOTE_REQUESTS}
        >
          Retour aux devis
        </Link>

        <div className="alert alert-danger">{errorMessage}</div>
      </main>
    );
  }

  return (
    <main className="app-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Détail demande de devis</h1>
          <p className="page-subtitle">
            Consultez l’état de votre demande et la réponse du prestataire.
          </p>
        </div>

        <Link
          className="link-btn link-btn-secondary"
          to={ROUTES.CLIENT_QUOTE_REQUESTS}
        >
          Retour aux devis
        </Link>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {quoteRequest && (
        <>
          <section className="card">
            <div className="page-header" style={{ marginBottom: "1rem" }}>
              <div>
                <h2 className="card-title">{quoteRequest.packName}</h2>
                <p className="text-muted" style={{ margin: 0 }}>
                  {quoteRequest.eventCity} · {quoteRequest.eventDate}
                </p>
              </div>

              <StatusBadge type="quote" value={quoteRequest.status} />
            </div>

            <div className="card-grid card-grid-2">
              <div className="card-soft">
                <h3 className="card-title">Informations événement</h3>

                <div className="info-list">
                  <InfoRow
                    label="Date événement"
                    value={quoteRequest.eventDate || "Non renseignée"}
                  />
                  <InfoRow
                    label="Ville"
                    value={quoteRequest.eventCity || "Non renseignée"}
                  />
                  <InfoRow
                    label="Convives"
                    value={quoteRequest.guestCount || "Non renseigné"}
                  />
                  <InfoRow
                    label="Budget estimé"
                    value={
                      quoteRequest.estimatedBudget
                        ? `${quoteRequest.estimatedBudget} MAD`
                        : "Non défini"
                    }
                  />
                  <InfoRow
                    label="Message envoyé"
                    value={
                      quoteRequest.message ||
                      quoteRequest.clientMessage ||
                      "Aucun message"
                    }
                  />
                </div>
              </div>

              <div className="card-soft">
                <h3 className="card-title">Prestataire / pack</h3>

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
                    value={quoteRequest.eventType || quoteRequest.packEventType || "Non renseigné"}
                  />
                  <InfoRow
                    label="Service"
                    value={quoteRequest.serviceType || quoteRequest.packServiceType || "Non renseigné"}
                  />
                  <InfoRow
                    label="Prix pack"
                    value={
                      quoteRequest.packPrice
                        ? `${quoteRequest.packPrice} MAD`
                        : "Non défini"
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="card mt-1">
            <div className="page-header" style={{ marginBottom: "1rem" }}>
              <div>
                <h2 className="card-title">Réponse du prestataire</h2>
                <p className="text-muted" style={{ margin: 0 }}>
                  Suivez la décision ou les remarques du prestataire.
                </p>
              </div>

              <StatusBadge type="quote" value={quoteRequest.status} />
            </div>

            {quoteRequest.status === "PENDING" && (
              <div className="alert alert-warning">
                Votre demande est en attente de réponse du prestataire.
              </div>
            )}

            {quoteRequest.status === "IN_DISCUSSION" && (
              <div className="alert alert-info">
                Le prestataire souhaite discuter certains détails avant validation.
              </div>
            )}

            {quoteRequest.status === "ACCEPTED" && (
              <div className="alert alert-success">
                Votre demande a été acceptée. Le prestataire peut maintenant créer une réservation.
              </div>
            )}

            {quoteRequest.status === "REJECTED" && (
              <div className="alert alert-danger">
                Votre demande a été refusée par le prestataire.
              </div>
            )}

            {quoteRequest.status === "CANCELLED" && (
              <div className="alert alert-warning">
                Cette demande a été annulée.
              </div>
            )}

            <div className="info-list">
              <InfoRow
                label="Statut"
                value={<StatusBadge type="quote" value={quoteRequest.status} />}
              />
              <InfoRow
                label="Réponse"
                value={
                  quoteRequest.providerResponse ||
                  quoteRequest.providerNotes ||
                  quoteRequest.responseMessage ||
                  "Aucune réponse pour le moment"
                }
              />
              {quoteRequest.createdAt && (
                <InfoRow
                  label="Date création"
                  value={new Date(quoteRequest.createdAt).toLocaleString()}
                />
              )}
              {quoteRequest.updatedAt && (
                <InfoRow
                  label="Dernière mise à jour"
                  value={new Date(quoteRequest.updatedAt).toLocaleString()}
                />
              )}
            </div>
          </section>

          <section className="card mt-1">
            <h2 className="card-title">Prochaine étape</h2>

            {quoteRequest.status === "ACCEPTED" ? (
              <div className="alert alert-success">
                Attendez la création de la réservation par le prestataire. Elle
                apparaîtra ensuite dans votre espace réservations.
              </div>
            ) : (
              <div className="alert alert-info">
                Vous pouvez suivre l’évolution de cette demande depuis votre
                espace devis et vos notifications.
              </div>
            )}

            <div className="actions">
              <Link className="link-btn" to={ROUTES.CLIENT_BOOKINGS}>
                Voir mes réservations
              </Link>

              <Link
                className="link-btn link-btn-secondary"
                to={ROUTES.CLIENT_QUOTE_REQUESTS}
              >
                Voir mes devis
              </Link>
            </div>
          </section>
        </>
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

export default ClientQuoteRequestDetailsPage;