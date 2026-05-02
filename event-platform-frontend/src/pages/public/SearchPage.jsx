import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchPacks } from "../../services/api/searchApi";
import { ROUTES } from "../../constants/routes";

function SearchPage() {
  const [filters, setFilters] = useState({
    city: "",
    eventType: "",
    serviceType: "",
    guests: "",
    maxBudget: "",
  });

  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadPacks = async (currentFilters = {}) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await searchPacks(currentFilters);
      setPacks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search packs error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message || "Impossible de charger les résultats."
      );
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadPacks();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loadPacks(filters);
  };

  const handleReset = async () => {
    const emptyFilters = {
      city: "",
      eventType: "",
      serviceType: "",
      guests: "",
      maxBudget: "",
    };

    setFilters(emptyFilters);
    await loadPacks(emptyFilters);
  };

  return (
    <main className="app-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Trouver un pack</h1>
          <p className="page-subtitle">
            Comparez les offres des prestataires validés selon votre ville,
            budget, service et type d’événement.
          </p>
        </div>

        <Link className="link-btn link-btn-secondary" to={ROUTES.HOME || "/"}>
          Accueil
        </Link>
      </div>

      <section className="card">
        <h2 className="card-title">Recherche rapide</h2>

        <form className="form" onSubmit={handleSubmit}>
          <div className="card-grid card-grid-3">
            <div className="form-row">
              <label className="form-label" htmlFor="city">
                Ville
              </label>

              <input
                id="city"
                name="city"
                value={filters.city}
                onChange={handleChange}
                placeholder="Casablanca, Rabat..."
                className="form-control"
              />
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="eventType">
                Type d’événement
              </label>

              <select
                id="eventType"
                name="eventType"
                value={filters.eventType}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Tous</option>
                <option value="MARIAGE">Mariage</option>
                <option value="ANNIVERSAIRE">Anniversaire</option>
                <option value="BABY_REVEAL">Baby reveal</option>
                <option value="AQIQA">Aqiqa</option>
                <option value="SEMINAIRE">Séminaire</option>
                <option value="CONFERENCE">Conférence</option>
                <option value="COCKTAIL">Cocktail</option>
                <option value="ENTREPRISE">Événement entreprise</option>
                <option value="SUR_MESURE">Sur mesure</option>
              </select>
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="serviceType">
                Type de service
              </label>

              <select
                id="serviceType"
                name="serviceType"
                value={filters.serviceType}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Tous</option>
                <option value="TRAITEUR">Traiteur</option>
                <option value="BUFFET">Buffet</option>
                <option value="COCKTAIL">Cocktail</option>
                <option value="DECORATION">Décoration</option>
                <option value="EVENT_PLANNER">Organisation</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="guests">
                Nombre de convives
              </label>

              <input
                id="guests"
                name="guests"
                type="number"
                min="1"
                value={filters.guests}
                onChange={handleChange}
                placeholder="Ex: 100"
                className="form-control"
              />
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="maxBudget">
                Budget max MAD
              </label>

              <input
                id="maxBudget"
                name="maxBudget"
                type="number"
                min="1"
                value={filters.maxBudget}
                onChange={handleChange}
                placeholder="Ex: 20000"
                className="form-control"
              />
            </div>
          </div>

          <div className="actions mt-1">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Recherche..." : "Rechercher"}
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleReset}
              disabled={loading}
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </section>

      <section className="mt-2">
        <div className="page-header">
          <div>
            <h2 className="page-title">Résultats</h2>
            <p className="page-subtitle">
              {packs.length} pack{packs.length > 1 ? "s" : ""} trouvé
              {packs.length > 1 ? "s" : ""}.
            </p>
          </div>
        </div>

        {initialLoading && <p className="loading-text">Chargement des packs...</p>}

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        {!loading && !errorMessage && packs.length === 0 && (
          <div className="empty-state">Aucun résultat trouvé.</div>
        )}

        {packs.length > 0 && (
          <div className="market-pack-grid">
            {packs.map((pack) => (
              <PackCard key={pack.packId || pack.id} pack={pack} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function PackCard({ pack }) {
  const packId = pack.packId || pack.id;
  const packName = pack.packName || pack.name || "Pack événementiel";
  const providerName =
    pack.providerBusinessName || pack.providerName || "Prestataire";
  const city = pack.city || pack.providerCity || "Ville non renseignée";
  const price = pack.price ? `${pack.price} MAD` : "Prix sur devis";
  const eventType = formatEnum(pack.eventType || pack.packEventType);
  const serviceType = formatEnum(pack.serviceType || pack.packServiceType);

  const rating = pack.averageRating || 0;
  const reviewCount = pack.reviewCount || 0;

  return (
    <article className="market-pack-card">
      <div className="market-pack-image">
        {pack.imageUrl ? (
          <img src={buildImageUrl(pack.imageUrl)} alt={packName} />
        ) : (
          <div className="market-pack-placeholder">
            <span>{getInitials(packName)}</span>
          </div>
        )}

        <span className="market-pack-price">{price}</span>
      </div>

      <div className="market-pack-body">
        <div className="market-pack-top">
          <span className="badge badge-info">{serviceType}</span>
          <RatingStars rating={rating} reviewCount={reviewCount} />
        </div>

        <h3 className="market-pack-title">{packName}</h3>

        <p className="text-muted market-pack-provider">
          {providerName} · {city}
        </p>

        <div className="market-pack-meta">
          <span>{eventType}</span>
          <span>
            {pack.minGuests || "?"} - {pack.maxGuests || "?"} convives
          </span>
        </div>

        {pack.description && (
          <p className="market-pack-description">{pack.description}</p>
        )}

        {pack.includedServices && (
          <p className="market-pack-description">
            <strong>Inclus :</strong> {pack.includedServices}
          </p>
        )}

      <div className="actions mt-1">
          <Link className="link-btn" to={`/packs/${packId}`}>
            Voir le pack
          </Link>

          <Link className="link-btn link-btn-secondary" to={`/quote-request/${packId}`}>
            Demander un devis
          </Link>
        </div>
      </div>
    </article>
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

export default SearchPage;