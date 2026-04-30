import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <nav className="home-navbar">
          <div className="home-brand">
            <span className="home-brand-mark">EP</span>
            <span>Event Platform Maroc</span>
          </div>

          <div className="home-nav-actions">
            <Link className="link-btn link-btn-secondary" to={ROUTES.LOGIN || "/login"}>
              Connexion
            </Link>

            <Link className="link-btn" to={ROUTES.REGISTER || "/register"}>
              Créer un compte
            </Link>
          </div>
        </nav>

        <div className="home-hero-content">
          <span className="auth-kicker">Marketplace événementielle au Maroc</span>

          <h1 className="home-title">
            Trouvez, réservez et coordonnez vos prestataires événementiels.
          </h1>

          <p className="home-subtitle">
            Une plateforme SaaS pour gérer les demandes de devis, les
            réservations, les acomptes, les documents, le planning et les
            notifications entre clients et prestataires.
          </p>

          <div className="actions home-hero-actions">
            <Link className="link-btn" to={ROUTES.PUBLIC_PACKS || "/packs"}>
              Rechercher un pack
            </Link>

            <Link className="link-btn link-btn-secondary" to={ROUTES.REGISTER || "/register"}>
              Devenir prestataire
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="app-container">
          <div className="page-header">
            <div>
              <h2 className="page-title">Une plateforme pour deux espaces</h2>
              <p className="page-subtitle">
                Le client trouve des offres adaptées. Le prestataire gère ses
                demandes, son catalogue et ses réservations.
              </p>
            </div>
          </div>

          <div className="card-grid card-grid-2">
            <article className="card">
              <span className="badge badge-info">Client</span>
              <h3 className="card-title mt-1">Organiser un événement</h3>
              <p className="text-muted">
                Recherchez des packs, envoyez une demande de devis, suivez vos
                réservations, consultez vos documents et recevez les
                notifications importantes.
              </p>

              <div className="actions mt-1">
                <Link className="link-btn" to={ROUTES.PUBLIC_PACKS || "/packs"}>
                  Voir les packs
                </Link>
              </div>
            </article>

            <article className="card">
              <span className="badge badge-success">Prestataire</span>
              <h3 className="card-title mt-1">Développer son activité</h3>
              <p className="text-muted">
                Créez votre profil, publiez vos packs, répondez aux demandes de
                devis, gérez vos réservations, acomptes, documents et planning.
              </p>

              <div className="actions mt-1">
                <Link className="link-btn" to={ROUTES.REGISTER || "/register"}>
                  Créer un compte prestataire
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="home-section home-section-soft">
        <div className="app-container">
          <h2 className="section-title">Fonctionnalités MVP</h2>

          <div className="card-grid card-grid-3">
            <FeatureCard title="Recherche multicritère" text="Trouvez des packs par ville, type d’événement, service et budget." />
            <FeatureCard title="Demandes de devis" text="Envoyez et suivez les demandes entre clients et prestataires." />
            <FeatureCard title="Réservations" text="Transformez un devis accepté en réservation avec statut clair." />
            <FeatureCard title="Acompte simple" text="Suivez la confirmation de l’acompte côté client et prestataire." />
            <FeatureCard title="Documents" text="Partagez contrats, devis, factures et fichiers liés à la réservation." />
            <FeatureCard title="Notifications" text="Recevez les alertes essentielles sur les devis, réservations et acomptes." />
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="app-container home-footer-inner">
          <span>Event Platform Maroc</span>
          <span className="text-muted">MVP SaaS événementiel</span>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ title, text }) {
  return (
    <article className="card">
      <h3 className="card-title">{title}</h3>
      <p className="text-muted">{text}</p>
    </article>
  );
}

export default HomePage;