import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import StatusBadge from "../../components/common/StatusBadge";
import {
  getProviderBookingById,
  markProviderBookingDepositAsPaid,
  updateProviderBookingStatus,
} from "../../services/api/providerBookingApi";
import {
  deleteProviderBookingDocument,
  getProviderBookingDocuments,
  uploadProviderBookingDocument,
} from "../../services/api/bookingDocumentApi";

const DOCUMENT_TYPES = [
  { value: "CONTRACT", label: "Contrat" },
  { value: "QUOTE", label: "Devis" },
  { value: "INVOICE", label: "Facture" },
  { value: "PROGRAM", label: "Programme" },
  { value: "TECHNICAL_SHEET", label: "Fiche technique" },
  { value: "OTHER", label: "Autre" },
];

function ProviderBookingDetailsPage() {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [markingDeposit, setMarkingDeposit] = useState(false);
  const [creatingDocument, setCreatingDocument] = useState(false);
  const [deletingDocumentId, setDeletingDocumentId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [documentErrorMessage, setDocumentErrorMessage] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [statusForm, setStatusForm] = useState({
    status: "",
    providerNotes: "",
  });

  const [documentForm, setDocumentForm] = useState({
    title: "",
    documentType: "CONTRACT",
    description: "",
  });

  const loadBooking = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getProviderBookingById(bookingId);
      setBooking(data);

      setStatusForm({
        status: data.status || "",
        providerNotes: data.providerNotes || "",
      });
    } catch (error) {
      console.error("Provider booking details error:", error.response?.data || error);

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
    setDocumentErrorMessage("");

    try {
      const data = await getProviderBookingDocuments(bookingId);
      setDocuments(data);
    } catch (error) {
      console.error("Provider booking documents error:", error.response?.data || error);

      setDocumentErrorMessage(
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

  const handleStatusChange = (event) => {
    const { name, value } = event.target;

    setStatusForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleUpdateStatus = async (event) => {
    event.preventDefault();

    setUpdatingStatus(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedBooking = await updateProviderBookingStatus(
        bookingId,
        statusForm
      );

      setBooking(updatedBooking);
      setSuccessMessage("Statut de réservation mis à jour avec succès.");
    } catch (error) {
      console.error("Update booking status error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de mettre à jour le statut."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleMarkDepositAsPaid = async () => {
    const confirmed = window.confirm(
      "Confirmer que l’acompte a bien été reçu ?"
    );

    if (!confirmed) {
      return;
    }

    setMarkingDeposit(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedBooking = await markProviderBookingDepositAsPaid(bookingId);

      setBooking(updatedBooking);
      setSuccessMessage(
        "Acompte marqué comme reçu. La réservation est confirmée et le client a été notifié."
      );
    } catch (error) {
      console.error("Mark deposit paid error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de marquer l’acompte comme reçu."
      );
    } finally {
      setMarkingDeposit(false);
    }
  };

  const handleDocumentInputChange = (event) => {
    const { name, value } = event.target;

    setDocumentForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const handleCreateDocument = async (event) => {
    event.preventDefault();

    setCreatingDocument(true);
    setDocumentErrorMessage("");
    setSuccessMessage("");

    try {
      if (!selectedFile) {
        setDocumentErrorMessage("Veuillez sélectionner un fichier.");
        setCreatingDocument(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", documentForm.title);
      formData.append("documentType", documentForm.documentType);
      formData.append("description", documentForm.description || "");
      formData.append("file", selectedFile);

      await uploadProviderBookingDocument(bookingId, formData);

      setDocumentForm({
        title: "",
        documentType: "CONTRACT",
        description: "",
      });
      setSelectedFile(null);

      const fileInput = document.getElementById("booking-document-file");
      if (fileInput) {
        fileInput.value = "";
      }

      await loadDocuments();
      setSuccessMessage("Document uploadé avec succès.");
    } catch (error) {
      console.error("Upload booking document error:", error.response?.data || error);

      setDocumentErrorMessage(
        error.response?.data?.message ||
          "Impossible d’uploader le document."
      );
    } finally {
      setCreatingDocument(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    const confirmed = window.confirm("Supprimer ce document ?");

    if (!confirmed) {
      return;
    }

    setDeletingDocumentId(documentId);
    setDocumentErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteProviderBookingDocument(bookingId, documentId);
      await loadDocuments();
      setSuccessMessage("Document supprimé avec succès.");
    } catch (error) {
      console.error("Delete booking document error:", error.response?.data || error);

      setDocumentErrorMessage(
        error.response?.data?.message ||
          "Impossible de supprimer le document."
      );
    } finally {
      setDeletingDocumentId(null);
    }
  };

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
        <Link className="link-btn link-btn-secondary" to={ROUTES.PROVIDER_BOOKINGS}>
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
            Suivez le statut, l’acompte, les documents et les informations client.
          </p>
        </div>

        <Link className="link-btn link-btn-secondary" to={ROUTES.PROVIDER_BOOKINGS}>
          Retour aux réservations
        </Link>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

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
                  <InfoRow label="Date événement" value={booking.eventDate} />
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
                <h3 className="card-title">Client</h3>

                <div className="info-list">
                  <InfoRow label="Nom" value={booking.customerName || "Non renseigné"} />
                  <InfoRow label="Email" value={booking.customerEmail || "Non renseigné"} />
                  <InfoRow label="Téléphone" value={booking.customerPhone || "Non renseigné"} />
                  <InfoRow
                    label="Notes client"
                    value={booking.clientNotes || "Aucune note"}
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
                  Confirmez manuellement la réception de l’acompte.
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
                ? "L’acompte est confirmé. La réservation est validée."
                : "L’acompte n’est pas encore confirmé."}
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
                label="Acompte reçu"
                value={booking.depositPaid ? "Oui" : "Non"}
              />

              {booking.depositPaidAt && (
                <InfoRow
                  label="Date de réception"
                  value={new Date(booking.depositPaidAt).toLocaleString()}
                />
              )}
            </div>

            {!booking.depositPaid && (
              <div className="actions mt-1">
                <button
                  className="btn btn-success"
                  type="button"
                  onClick={handleMarkDepositAsPaid}
                  disabled={markingDeposit || !booking.depositAmount}
                >
                  {markingDeposit ? "Confirmation..." : "Marquer acompte reçu"}
                </button>
              </div>
            )}
          </section>

          <section className="card mt-1">
            <h2 className="card-title">Mettre à jour le statut</h2>

            <form className="form" onSubmit={handleUpdateStatus}>
              <div className="form-row">
                <label className="form-label" htmlFor="booking-status">
                  Statut
                </label>

                <select
                  id="booking-status"
                  name="status"
                  value={statusForm.status}
                  onChange={handleStatusChange}
                  className="form-control"
                >
                  <option value="PENDING_DEPOSIT">En attente d’acompte</option>
                  <option value="CONFIRMED">Confirmée</option>
                  <option value="CANCELLED">Annulée</option>
                  <option value="COMPLETED">Terminée</option>
                </select>
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="provider-notes">
                  Notes provider
                </label>

                <textarea
                  id="provider-notes"
                  name="providerNotes"
                  value={statusForm.providerNotes}
                  onChange={handleStatusChange}
                  rows="4"
                  className="form-control"
                  placeholder="Ajouter une note interne ou visible selon votre logique métier"
                />
              </div>

              <div className="actions">
                <button className="btn" type="submit" disabled={updatingStatus}>
                  {updatingStatus ? "Mise à jour..." : "Mettre à jour le statut"}
                </button>
              </div>
            </form>
          </section>

          <section className="card mt-1">
            <div className="page-header" style={{ marginBottom: "1rem" }}>
              <div>
                <h2 className="card-title">Documents de la réservation</h2>
                <p className="text-muted" style={{ margin: 0 }}>
                  Ajoutez un contrat, une facture, un devis final ou une fiche technique.
                </p>
              </div>
            </div>

            {documentErrorMessage && (
              <div className="alert alert-danger">{documentErrorMessage}</div>
            )}

            <form className="form" onSubmit={handleCreateDocument}>
              <div className="card-grid card-grid-2">
                <div className="form-row">
                  <label className="form-label" htmlFor="document-title">
                    Titre du document
                  </label>

                  <input
                    id="document-title"
                    type="text"
                    name="title"
                    value={documentForm.title}
                    onChange={handleDocumentInputChange}
                    className="form-control"
                    placeholder="Ex: Contrat événement"
                    required
                  />
                </div>

                <div className="form-row">
                  <label className="form-label" htmlFor="document-type">
                    Type de document
                  </label>

                  <select
                    id="document-type"
                    name="documentType"
                    value={documentForm.documentType}
                    onChange={handleDocumentInputChange}
                    className="form-control"
                    required
                  >
                    {DOCUMENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="booking-document-file">
                  Fichier
                </label>

                <input
                  id="booking-document-file"
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="document-description">
                  Description
                </label>

                <textarea
                  id="document-description"
                  name="description"
                  value={documentForm.description}
                  onChange={handleDocumentInputChange}
                  rows="3"
                  className="form-control"
                  placeholder="Description optionnelle"
                />
              </div>

              <div className="actions">
                <button className="btn" type="submit" disabled={creatingDocument}>
                  {creatingDocument ? "Upload..." : "Uploader le document"}
                </button>
              </div>
            </form>

            <div className="mt-2">
              {documentsLoading ? (
                <p className="text-muted">Chargement des documents...</p>
              ) : documents.length === 0 ? (
                <div className="empty-state">
                  Aucun document lié à cette réservation.
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
                          Ouvrir
                        </a>

                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => handleDeleteDocument(document.id)}
                          disabled={deletingDocumentId === document.id}
                        >
                          {deletingDocumentId === document.id
                            ? "Suppression..."
                            : "Supprimer"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
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

export default ProviderBookingDetailsPage;