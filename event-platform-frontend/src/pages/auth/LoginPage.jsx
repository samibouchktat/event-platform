import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const getRedirectPath = (user) => {
    const roles = user?.roles || [];

    if (roles.includes("ROLE_ADMIN")) {
      return ROUTES.ADMIN_DASHBOARD || "/admin/dashboard";
    }

    if (roles.includes("ROLE_PROVIDER")) {
      return ROUTES.PROVIDER_DASHBOARD || "/provider/dashboard";
    }

    if (roles.includes("ROLE_CLIENT")) {
      return ROUTES.CLIENT_DASHBOARD || "/client/dashboard";
    }

    return "/";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const loggedUser = await login(formData.email, formData.password);
      const redirectPath = getRedirectPath(loggedUser);

      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Login error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Email ou mot de passe incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="auth-hero-content">
          <span className="auth-kicker">Event Platform Maroc</span>

          <h1 className="auth-title">
            Gérez vos événements avec plus de clarté.
          </h1>

          <p className="auth-description">
            Une plateforme marocaine pour rechercher des prestataires, gérer les
            demandes de devis, les réservations, les acomptes, les documents et
            les notifications.
          </p>

          <div className="auth-highlights">
            <Highlight text="Espace client pour suivre devis et réservations" />
            <Highlight text="Espace prestataire pour gérer packs et planning" />
            <Highlight text="Back-office admin pour valider et superviser" />
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-title">Connexion</h2>
            <p className="auth-card-subtitle">
              Accédez à votre espace client, prestataire ou administrateur.
            </p>
          </div>

          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="form-label" htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="exemple@email.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="password">
                Mot de passe
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Votre mot de passe"
                autoComplete="current-password"
                required
              />
            </div>

            <button className="btn auth-submit" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="auth-footer-text">
            Pas encore de compte ?{" "}
            <Link to={ROUTES.REGISTER || "/register"}>Créer un compte</Link>
          </p>

          <div className="auth-demo-box">
            <strong>Astuce test :</strong> connecte-toi avec tes comptes client,
            prestataire ou admin pour vérifier les redirections par rôle.
          </div>
        </div>
      </section>
    </main>
  );
}

function Highlight({ text }) {
  return (
    <div className="auth-highlight">
      <span className="auth-highlight-dot" />
      <span>{text}</span>
    </div>
  );
}

export default LoginPage;