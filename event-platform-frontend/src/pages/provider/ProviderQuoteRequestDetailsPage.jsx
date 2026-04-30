import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import StatusBadge from "../../components/common/StatusBadge";
import {
  getProviderQuoteRequestById,
  updateProviderQuoteRequestStatus,
} from "../../services/api/providerQuoteRequestApi";
import { createBookingFromQuoteRequest } from "../../services/api/providerBookingApi";

function ProviderQuoteRequestDetailsPage() {
  const { quoteRequestId } = useParams();

  const [quoteRequest, setQuoteRequest] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [creatingBooking, setCreatingBooking] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [statusForm, setStatusForm] = useState({
    status: "",
    providerResponse: "",
  });

  const [bookingForm, setBookingForm] = useState({
    totalAmount: "",
    depositAmount: "",
    providerNotes: "",
  });

  const loadQuoteRequest = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getProviderQuoteRequestById(quoteRequestId);
      setQuoteRequest(data);

      setStatusForm({
        status: data.status || "PENDING",
        providerResponse: data.providerResponse || "",
      });

      setBookingForm({
        totalAmount: data.packPrice || data.estimatedBudget || "",
        depositAmount: "",
        providerNotes: "",
      });
    } catch (error) {
      console.error("Provider quote request details error:", error.response?.data || error);

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

  const handleStatusFormChange = (event) => {
    const { name, value } = event.target;

    setStatusForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleBookingFormChange = (event) => {
    const { name, value } = event.target;

    setBookingForm((current) => ({
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
      const updatedQuoteRequest = await updateProviderQuoteRequestStatus(
        quoteRequestId,
        {
          status: statusForm.status,
          providerResponse: statusForm.providerResponse,
        }
      );

      setQuoteRequest(updatedQuoteRequest);
      setSuccessMessage("Statut de la demande de devis mis à jour avec succès.");
    } catch (error) {
      console.error("Update quote request status error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de mettre à jour la demande de devis."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCreateBooking = async (event) => {
    event.preventDefault();

    if (quoteRequest?.status !== "ACCEPTED") {
      setErrorMessage(
        "La réservation peut être créée uniquement après acceptation du devis."
      );
      return;
    }

    setCreatingBooking(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        totalAmount: bookingForm.totalAmount
          ? Number(bookingForm.totalAmount)
          : null,
        depositAmount: bookingForm.depositAmount
          ? Number(bookingForm.depositAmount)
          : null,
        providerNotes: bookingForm.providerNotes,
      };

      const createdBooking = await createBookingFromQuoteRequest(
        quoteRequestId,
        payload
      );

      setSuccessMessage(
        `Réservation créée avec succès. ID réservation : ${createdBooking.id}`
      );
    } catch (error) {
      console.error("Create booking from quote error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de créer la réservation depuis ce devis."
      );
    } finally {
      setCreatingBooking(false);
    }
  };

  if (loading) {
    return <p className="loading-text">Chargement de la demande de devis...</p>;
  }

  if (errorMessage && !quoteRequest) {
    return (
      <main className="app-container">
        <Link
          className="link-btn link-btn-secondary"
          to={ROUTES.PROVIDER_QUOTE_REQUESTS}
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
            Consultez la demande client, répondez au devis et créez une réservation si elle est acceptée.
          </p>
        </div>

        <Link
          className="link-btn link-btn-secondary"
          to={ROUTES.PROVIDER_QUOTE_REQUESTS}
        >
          Retour aux devis
        </Link>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

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
                    label="Message client"
                    value={quoteRequest.message || quoteRequest.clientMessage || "Aucun message"}
                  />
                </div>
              </div>

              <div className="card-soft">
                <h3 className="card-title">Informations client</h3>

                <div className="info-list">
                  <InfoRow
                    label="Nom"
                    value={
                      quoteRequest.customerName ||
                      quoteRequest.clientName ||
                      "Non renseigné"
                    }
                  />
                  <InfoRow
                    label="Email"
                    value={
                      quoteRequest.customerEmail ||
                      quoteRequest.clientEmail ||
                      "Non renseigné"
                    }
                  />
                  <InfoRow
                    label="Téléphone"
                    value={
                      quoteRequest.customerPhone ||
                      quoteRequest.clientPhone ||
                      "Non renseigné"
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="card mt-1">
            <h2 className="card-title">Répondre à la demande</h2>

            <form className="form" onSubmit={handleUpdateStatus}>
              <div className="form-row">
                <label className="form-label" htmlFor="quote-status">
                  Statut
                </label>

                <select
                  id="quote-status"
                  name="status"
                  value={statusForm.status}
                  onChange={handleStatusFormChange}
                  className="form-control"
                >
                  <option value="PENDING">En attente</option>
                  <option value="IN_DISCUSSION">En discussion</option>
                  <option value="ACCEPTED">Acceptée</option>
                  <option value="REJECTED">Refusée</option>
                  <option value="CANCELLED">Annulée</option>
                </select>
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="provider-response">
                  Réponse au client
                </label>

                <textarea
                  id="provider-response"
                  name="providerResponse"
                  value={statusForm.providerResponse}
                  onChange={handleStatusFormChange}
                  rows="4"
                  className="form-control"
                  placeholder="Ex: Nous sommes disponibles pour cette date. Voici notre proposition..."
                />
              </div>

              <div className="actions">
                <button className="btn" type="submit" disabled={updatingStatus}>
                  {updatingStatus ? "Mise à jour..." : "Mettre à jour la demande"}
                </button>
              </div>
            </form>
          </section>

          <section className="card mt-1">
            <div className="page-header" style={{ marginBottom: "1rem" }}>
              <div>
                <h2 className="card-title">Créer une réservation</h2>
                <p className="text-muted" style={{ margin: 0 }}>
                  Disponible uniquement si la demande de devis est acceptée.
                </p>
              </div>

              <StatusBadge type="quote" value={quoteRequest.status} />
            </div>

            {quoteRequest.status !== "ACCEPTED" && (
              <div className="alert alert-warning">
                Vous devez d’abord accepter la demande de devis avant de créer une réservation.
              </div>
            )}

            <form className="form" onSubmit={handleCreateBooking}>
              <div className="card-grid card-grid-2">
                <div className="form-row">
                  <label className="form-label" htmlFor="total-amount">
                    Montant total MAD
                  </label>

                  <input
                    id="total-amount"
                    type="number"
                    min="0"
                    name="totalAmount"
                    value={bookingForm.totalAmount}
                    onChange={handleBookingFormChange}
                    className="form-control"
                    placeholder="Ex: 25000"
                  />
                </div>

                <div className="form-row">
                  <label className="form-label" htmlFor="deposit-amount">
                    Acompte MAD
                  </label>

                  <input
                    id="deposit-amount"
                    type="number"
                    min="0"
                    name="depositAmount"
                    value={bookingForm.depositAmount}
                    onChange={handleBookingFormChange}
                    className="form-control"
                    placeholder="Ex: 5000"
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="booking-notes">
                  Notes réservation
                </label>

                <textarea
                  id="booking-notes"
                  name="providerNotes"
                  value={bookingForm.providerNotes}
                  onChange={handleBookingFormChange}
                  rows="3"
                  className="form-control"
                  placeholder="Notes liées à la réservation"
                />
              </div>

              <div className="actions">
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={creatingBooking || quoteRequest.status !== "ACCEPTED"}
                >
                  {creatingBooking ? "Création..." : "Créer la réservation"}
                </button>
              </div>
            </form>
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

export default ProviderQuoteRequestDetailsPage;