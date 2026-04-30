import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import StatusBadge from "../../components/common/StatusBadge";
import { getClientBookingById } from "../../services/api/clientBookingApi";
import { getClientBookingDocuments } from "../../services/api/bookingDocumentApi";

const DOCUMENT_TYPES = [
  { value: "CONTRACT", label: "Contrat" },
  { value: "QUOTE", label: "Devis" },
  { value: "INVOICE", label: "Facture" },
  { value: "PROGRAM", label: "Programme" },
  { value: "TECHNICAL_SHEET", label: "Fiche technique" },
  { value: "OTHER", label: "Autre" },
];

function ClientBookingDetailsPage() {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [documentsErrorMessage, setDocumentsErrorMessage] = useState("");

  const loadBooking = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getClientBookingById(bookingId);
      setBooking(data);
    } catch (error) {
      console.error("Client booking details error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger la réservation."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    setDocumentsLoading(true);
    setDocumentsErrorMessage("");

    try {
      const data = await getClientBookingDocuments(bookingId);
      setDocuments(data);
    } catch (error) {
      console.error("Client booking documents error:", error.response?.data || error);

      setDocumentsErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger les documents."
      );
    } finally {
      setDocumentsLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
    loadDocuments();
  }, [bookingId]);

  const getDocumentTypeLabel = (type) => {
    const foundType = DOCUMENT_TYPES.find((item) => item.value === type);
    return foundType ? foundType.label : type;
  };

  const buildDocumentUrl = (fileUrl) => {
    if (!fileUrl) {
      return "#";
    }

    if (fileUrl.startsWith("http")) {
      return fileUrl;
    }

    return `http://localhost:8080${fileUrl}`;
  };

  if (loading) {
    return <p className="loading-text">Chargement de la réservation...</p>;
  }

  if (errorMessage && !booking) {
    return (
      <main className="app-container">
        <Link className="link-btn link-btn-secondary" to={ROUTES.CLIENT_BOOKINGS}>
          Retour aux réservations
        </Link>

        <div className="alert alert-danger">{errorMessage}</div>
      </main>
    );
  }

  return (
    <main className="app-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Détail réservation</h1>
          <p className="page-subtitle">
            Consultez le statut, l’acompte, les documents et les informations de votre réservation.
          </p>
        </div>

        <Link className="link-btn link-btn-secondary" to={ROUTES.CLIENT_BOOKINGS}>
          Retour aux réservations
        </Link>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {booking && (
        <>
          <section className="card">
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

            <div className="card-grid card-grid-2">
              <div className="card-soft">
                <h3 className="card-title">Résumé événement</h3>

                <div className="info-list">
                  <InfoRow label="Date événement" value={booking.eventDate || "Non renseignée"} />
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
              </div>

              <div className="card-soft">
                <h3 className="card-title">Prestataire</h3>

                <div className="info-list">
                  <InfoRow
                    label="Nom"
                    value={
                      booking.providerBusinessName ||
                      booking.providerName ||
                      "Non renseigné"
                    }
                  />
                  <InfoRow
                    label="Service"
                    value={booking.packServiceType || "Non renseigné"}
                  />
                  <InfoRow
                    label="Type événement"
                    value={booking.packEventType || "Non renseigné"}
                  />
                  <InfoRow
                    label="Notes prestataire"
                    value={booking.providerNotes || "Aucune note"}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="card mt-1">
            <div className="page-header" style={{ marginBottom: "1rem" }}>
              <div>
                <h2 className="card-title">Suivi de l’acompte</h2>
                <p className="text-muted" style={{ margin: 0 }}>
                  Suivez la confirmation de votre acompte par le prestataire.
                </p>
              </div>

              <StatusBadge type="deposit" value={booking.depositPaid} />
            </div>

            <div
              className={
                booking.depositPaid
                  ? "alert alert-success"
                  : "alert alert-warning"
              }
            >
              {booking.depositPaid
                ? "Votre acompte a été confirmé par le prestataire. Votre réservation est confirmée."
                : "Votre réservation est en attente de confirmation de l’acompte."}
            </div>

            <div className="info-list">
              <InfoRow
                label="Montant acompte"
                value={
                  booking.depositAmount
                    ? `${booking.depositAmount} MAD`
                    : "Non défini"
                }
              />

              <InfoRow
                label="Acompte payé"
                value={booking.depositPaid ? "Oui" : "Non"}
              />

              {booking.depositPaidAt && (
                <InfoRow
                  label="Date de confirmation"
                  value={new Date(booking.depositPaidAt).toLocaleString()}
                />
              )}
            </div>
          </section>

          <section className="card mt-1">
            <div className="page-header" style={{ marginBottom: "1rem" }}>
              <div>
                <h2 className="card-title">Documents de la réservation</h2>
                <p className="text-muted" style={{ margin: 0 }}>
                  Consultez les documents partagés par le prestataire.
                </p>
              </div>
            </div>

            {documentsErrorMessage && (
              <div className="alert alert-danger">{documentsErrorMessage}</div>
            )}

            {documentsLoading ? (
              <p className="text-muted">Chargement des documents...</p>
            ) : documents.length === 0 ? (
              <div className="empty-state">
                Aucun document disponible pour cette réservation.
              </div>
            ) : (
              <div className="list-grid">
                {documents.map((document) => (
                  <article className="card-soft" key={document.id}>
                    <div className="page-header" style={{ marginBottom: "1rem" }}>
                      <div>
                        <h3 className="card-title">{document.title}</h3>
                        <p className="text-muted" style={{ margin: 0 }}>
                          {getDocumentTypeLabel(document.documentType)}
                        </p>
                      </div>

                      <span className="badge badge-info">
                        {document.createdAt
                          ? new Date(document.createdAt).toLocaleDateString()
                          : "Date inconnue"}
                      </span>
                    </div>

                    {document.description && (
                      <p className="text-muted">{document.description}</p>
                    )}

                    <div className="info-list">
                      <InfoRow
                        label="Ajouté par"
                        value={`${document.uploadedByFullName} (${document.uploadedByEmail})`}
                      />
                    </div>

                    <div className="actions mt-1">
                      <a
                        className="link-btn"
                        href={buildDocumentUrl(document.fileUrl)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ouvrir le document
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
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

export default ClientBookingDetailsPage;