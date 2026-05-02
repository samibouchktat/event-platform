import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { searchPacks } from "../services/api/searchApi";

function HomePage() {
  const [featuredPacks, setFeaturedPacks] = useState([]);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [packsErrorMessage, setPacksErrorMessage] = useState("");

  const loadFeaturedPacks = async () => {
    setLoadingPacks(true);
    setPacksErrorMessage("");

    try {
      const data = await searchPacks({});
      setFeaturedPacks(Array.isArray(data) ? data.slice(0, 6) : []);
    } catch (error) {
      console.error("Home featured packs error:", error.response?.data || error);

      setPacksErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger les packs pour le moment."
      );
    } finally {
      setLoadingPacks(false);
    }
  };

  useEffect(() => {
    loadFeaturedPacks();
  }, []);

  return (
    <main className="home-page">
<section className="market-hero home-premium-hero">
  <div className="home-hero-blur home-hero-blur-one" />
  <div className="home-hero-blur home-hero-blur-two" />

  <nav className="home-navbar premium-navbar">
    <div className="home-brand">
      <span className="home-brand-mark">EP</span>
      <div>
        <strong>Event Platform Maroc</strong>
        <small>Marketplace événementielle</small>
      </div>
    </div>

    <div className="home-nav-actions">
      <Link className="link-btn link-btn-secondary" to={ROUTES.LOGIN}>
        Connexion
      </Link>

      <Link className="link-btn" to={ROUTES.REGISTER}>
        Créer un compte
      </Link>
    </div>
  </nav>

  <div className="market-hero-content premium-hero-content">
    <div className="premium-hero-left">
      <span className="auth-kicker premium-kicker">
        Marketplace événementielle au Maroc
      </span>

      <h1 className="home-title premium-home-title">
        Organisez votre événement avec les bons prestataires.
      </h1>

      <p className="home-subtitle premium-home-subtitle">
        Comparez des packs, consultez les prix, envoyez une demande de devis
        et suivez vos réservations depuis une plateforme simple et centralisée.
      </p>

      <div className="premium-hero-actions">
        <Link className="link-btn premium-primary-btn" to={ROUTES.PUBLIC_PACKS}>
          Explorer les packs
        </Link>

        <Link className="link-btn link-btn-secondary premium-secondary-btn" to={ROUTES.REGISTER}>
          Devenir prestataire
        </Link>
      </div>

      <div className="premium-trust-row">
        <span>Prestataires validés</span>
        <span>Devis suivis</span>
        <span>Réservations centralisées</span>
      </div>
    </div>

    <aside className="premium-hero-card">
      <div className="premium-card-header">
        <span className="badge badge-success">MVP actif</span>
        <strong>Event Platform</strong>
      </div>

      <div className="premium-dashboard-preview">
        <div className="premium-preview-line premium-preview-line-lg" />
        <div className="premium-preview-grid">
          <div />
          <div />
          <div />
        </div>

        <div className="premium-preview-list">
          <div>
            <span />
            <strong>Demande de devis</strong>
            <small>Client → Prestataire</small>
          </div>

          <div>
            <span />
            <strong>Réservation</strong>
            <small>Acompte, documents, planning</small>
          </div>

          <div>
            <span />
            <strong>Notification</strong>
            <small>Suivi automatique</small>
          </div>
        </div>
      </div>

      <div className="premium-stats">
        <div>
          <strong>{featuredPacks.length}</strong>
          <span>Packs affichés</span>
        </div>

        <div>
          <strong>3</strong>
          <span>Espaces</span>
        </div>

        <div>
          <strong>24/7</strong>
          <span>Accessible</span>
        </div>
      </div>
    </aside>
  </div>
</section>

      <section className="home-section">
        <div className="app-container">
          <div className="page-header">
            <div>
              <h2 className="page-title">Packs recommandés</h2>
              <p className="page-subtitle">
                Découvrez quelques offres disponibles chez les prestataires
                validés de la plateforme.
              </p>
            </div>

            <Link className="link-btn link-btn-secondary" to={ROUTES.PUBLIC_PACKS}>
              Voir tous les packs
            </Link>
          </div>

          {packsErrorMessage && (
            <div className="alert alert-danger">{packsErrorMessage}</div>
          )}

          {loadingPacks ? (
            <p className="loading-text">Chargement des packs...</p>
          ) : featuredPacks.length === 0 ? (
            <div className="empty-state">
              Aucun pack public disponible pour le moment.
            </div>
          ) : (
            <div className="market-pack-grid">
              {featuredPacks.map((pack) => (
                <PackCard key={pack.packId || pack.id} pack={pack} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="home-section home-section-soft">
        <div className="app-container">
          <div className="page-header">
            <div>
              <h2 className="page-title">Comment ça marche ?</h2>
              <p className="page-subtitle">
                Un parcours simple pour les clients qui ne veulent pas se
                compliquer avec la technique.
              </p>
            </div>
          </div>

          <div className="card-grid card-grid-3">
            <StepCard
              number="1"
              title="Choisissez un pack"
              text="Comparez les offres selon la ville, le prix, le service et le type d’événement."
            />

            <StepCard
              number="2"
              title="Envoyez une demande"
              text="Expliquez votre besoin : date, nombre d’invités, budget et message."
            />

            <StepCard
              number="3"
              title="Suivez votre réservation"
              text="Le prestataire répond, crée la réservation, partage les documents et confirme l’acompte."
            />
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="app-container">
          <div className="card market-provider-cta">
            <div>
              <span className="badge badge-success">Prestataires</span>
              <h2 className="card-title mt-1">
                Vous êtes traiteur, décorateur ou organisateur ?
              </h2>
              <p className="text-muted">
                Créez votre profil, publiez vos packs, recevez des demandes de
                devis et gérez vos réservations depuis un espace simple.
              </p>
            </div>

            <Link className="link-btn" to={ROUTES.REGISTER}>
              Créer un compte prestataire
            </Link>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="app-container home-footer-inner">
          <span>Event Platform Maroc</span>
          <span className="text-muted">Marketplace événementielle MVP</span>
        </div>
      </footer>
    </main>
  );
}

function PackCard({ pack }) {
  const packId = pack.packId || pack.id;
  const packName = pack.packName || pack.name || "Pack événementiel";
  const providerName =
    pack.providerBusinessName || pack.providerName || "Prestataire";
  const city = pack.city || "Ville non renseignée";
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

function StepCard({ number, title, text }) {
  return (
    <article className="card premium-step-card">
      <span className="premium-step-number">{number}</span>
      <h3 className="card-title mt-1">{title}</h3>
      <p className="text-muted">{text}</p>
    </article>
  );
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
function buildImageUrl(imageUrl) {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("http") || imageUrl.startsWith("blob:")) {
    return imageUrl;
  }

  return `http://localhost:8080${imageUrl}`;
}
export default HomePage;