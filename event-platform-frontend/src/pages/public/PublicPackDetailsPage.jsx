import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { searchPacks } from "../../services/api/searchApi";
import { getPackReviews } from "../../services/api/reviewApi";

function PublicPackDetailsPage() {
  const { packId } = useParams();

  const [pack, setPack] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [reviewsErrorMessage, setReviewsErrorMessage] = useState("");

  const loadPack = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await searchPacks({});
      const foundPack = Array.isArray(data)
        ? data.find((item) => String(item.packId || item.id) === String(packId))
        : null;

      if (!foundPack) {
        setErrorMessage("Pack introuvable ou non disponible publiquement.");
        setPack(null);
        return;
      }

      setPack(foundPack);
    } catch (error) {
      console.error("Public pack details error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger le détail du pack."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    setReviewsLoading(true);
    setReviewsErrorMessage("");

    try {
      const data = await getPackReviews(packId);
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Pack reviews error:", error.response?.data || error);

      setReviewsErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger les avis de ce pack."
      );
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    loadPack();
    loadReviews();
  }, [packId]);

  if (loading) {
    return <p className="loading-text">Chargement du pack...</p>;
  }

  if (errorMessage && !pack) {
    return (
      <main className="app-container">
        <Link className="link-btn link-btn-secondary" to={ROUTES.PUBLIC_PACKS}>
          Retour aux packs
        </Link>

        <div className="alert alert-danger">{errorMessage}</div>
      </main>
    );
  }

  const packName = pack.packName || pack.name || "Pack événementiel";
  const providerName =
    pack.providerBusinessName || pack.providerName || "Prestataire";
  const price = pack.price ? `${pack.price} MAD` : "Prix sur devis";
  const rating = Number(pack.averageRating || 0);
  const reviewCount = Number(pack.reviewCount || 0);

  return (
    <main className="app-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{packName}</h1>
          <p className="page-subtitle">
            Consultez les détails du pack, les services inclus et les avis
            clients avant d’envoyer votre demande de devis.
          </p>
        </div>

        <Link className="link-btn link-btn-secondary" to={ROUTES.PUBLIC_PACKS}>
          Retour aux packs
        </Link>
      </div>

      <section className="pack-detail-layout">
        <article className="card">
          <div className="pack-detail-image">
            {pack.imageUrl ? (
              <img src={buildImageUrl(pack.imageUrl)} alt={packName} />
            ) : (
              <div className="market-pack-placeholder">
                <span>{getInitials(packName)}</span>
              </div>
            )}

            <span className="market-pack-price">{price}</span>
          </div>

          <div className="pack-detail-content">
            <div className="actions" style={{ justifyContent: "space-between" }}>
              <span className="badge badge-info">
                {formatEnum(pack.serviceType || pack.packServiceType)}
              </span>

              <RatingStars rating={rating} reviewCount={reviewCount} />
            </div>

            <h2 className="card-title mt-1">{packName}</h2>

            <p className="text-muted">
              Proposé par <strong>{providerName}</strong>
            </p>

            <div className="info-list mt-1">
              <InfoRow label="Prix" value={price} />
              <InfoRow
                label="Ville"
                value={pack.city || pack.providerCity || "Non renseignée"}
              />
              <InfoRow
                label="Type événement"
                value={formatEnum(pack.eventType || pack.packEventType)}
              />
              <InfoRow
                label="Service"
                value={formatEnum(pack.serviceType || pack.packServiceType)}
              />
              <InfoRow
                label="Convives"
                value={`${pack.minGuests || "?"} - ${
                  pack.maxGuests || "?"
                } personnes`}
              />
              <InfoRow
                label="Délai réservation"
                value={
                  pack.bookingDeadlineDays !== null &&
                  pack.bookingDeadlineDays !== undefined
                    ? `${pack.bookingDeadlineDays} jour(s)`
                    : "Non renseigné"
                }
              />
            </div>

            <div className="actions mt-2">
              <Link className="link-btn" to={`/quote-request/${pack.packId || pack.id}`}>
                Demander un devis
              </Link>

              <Link className="link-btn link-btn-secondary" to={ROUTES.PUBLIC_PACKS}>
                Comparer avec d’autres packs
              </Link>
            </div>
          </div>
        </article>

        <aside className="card">
          <h2 className="card-title">Prestataire</h2>

          <div className="info-list">
            <InfoRow label="Nom" value={providerName} />
            <InfoRow
              label="Ville prestataire"
              value={pack.providerCity || "Non renseignée"}
            />
            <InfoRow
              label="Statut"
              value={
                pack.providerValidated
                  ? "Prestataire validé"
                  : "Validation en attente"
              }
            />
          </div>

          {pack.providerValidated ? (
            <div className="alert alert-success">
              Ce prestataire est validé par l’administration.
            </div>
          ) : (
            <div className="alert alert-warning">
              Ce prestataire n’est pas encore validé.
            </div>
          )}
        </aside>
      </section>

      <section className="card mt-1">
        <h2 className="card-title">Description du pack</h2>

        {pack.description ? (
          <p className="text-muted">{pack.description}</p>
        ) : (
          <p className="text-muted">Aucune description détaillée pour ce pack.</p>
        )}

        {pack.includedServices && (
          <>
            <h3 className="card-title mt-1">Services inclus</h3>
            <p className="text-muted">{pack.includedServices}</p>
          </>
        )}

        {pack.serviceArea && (
          <>
            <h3 className="card-title mt-1">Zones couvertes</h3>
            <p className="text-muted">{pack.serviceArea}</p>
          </>
        )}
      </section>

      <section className="card mt-1">
        <div className="page-header" style={{ marginBottom: "1rem" }}>
          <div>
            <h2 className="card-title">Avis clients</h2>
            <p className="text-muted" style={{ margin: 0 }}>
              Les avis sont basés sur les réservations terminées.
            </p>
          </div>

          <RatingStars rating={rating} reviewCount={reviewCount} />
        </div>

        {reviewsErrorMessage && (
          <div className="alert alert-danger">{reviewsErrorMessage}</div>
        )}

        {reviewsLoading ? (
          <p className="text-muted">Chargement des avis...</p>
        ) : reviews.length === 0 ? (
          <div className="empty-state">
            Aucun avis pour ce pack pour le moment.
          </div>
        ) : (
          <div className="list-grid">
            {reviews.map((review) => (
              <article className="card-soft" key={review.id}>
                <div className="actions" style={{ justifyContent: "space-between" }}>
                  <strong>{review.clientFullName || "Client"}</strong>
                  <RatingStars rating={review.rating} reviewCount={1} />
                </div>

                {review.comment && (
                  <p className="text-muted" style={{ marginBottom: 0 }}>
                    {review.comment}
                  </p>
                )}

                {review.createdAt && (
                  <small className="text-muted">
                    Avis publié le{" "}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
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

function RatingStars({ rating, reviewCount }) {
  if (!reviewCount || reviewCount === 0) {
    return (
      <div className="rating-stars rating-stars-empty">
        <span>☆☆☆☆☆</span>
        <small>Aucun avis</small>
      </div>
    );
  }

  const roundedRating = Number(rating || 0).toFixed(1);

  return (
    <div className="rating-stars" title={`${roundedRating}/5`}>
      <span>{buildStars(rating)}</span>
      <small>
        {roundedRating} ({reviewCount})
      </small>
    </div>
  );
}

function buildStars(rating) {
  const rounded = Math.round(Number(rating || 0));
  const fullStars = "★".repeat(rounded);
  const emptyStars = "☆".repeat(5 - rounded);

  return `${fullStars}${emptyStars}`;
}

function buildImageUrl(imageUrl) {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("http") || imageUrl.startsWith("blob:")) {
    return imageUrl;
  }

  return `http://localhost:8080${imageUrl}`;
}

function formatEnum(value) {
  if (!value) {
    return "Non renseigné";
  }

  return value
    .toString()
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function getInitials(text) {
  return text
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

export default PublicPackDetailsPage;