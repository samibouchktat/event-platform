import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import axiosClient from "../../services/api/axiosClient";

import GoogleAuthButton from "../../components/auth/GoogleAuthButton";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "CLIENT",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      return "Le prénom est obligatoire.";
    }

    if (!formData.lastName.trim()) {
      return "Le nom est obligatoire.";
    }

    if (!formData.email.trim()) {
      return "L’email est obligatoire.";
    }

    if (!formData.phone.trim()) {
      return "Le téléphone est obligatoire.";
    }

    if (formData.password.length < 6) {
      return "Le mot de passe doit contenir au moins 6 caractères.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Les mots de passe ne correspondent pas.";
    }

    if (!["CLIENT", "PROVIDER"].includes(formData.role)) {
      return "Type de compte invalide.";
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
      };

      await axiosClient.post("/auth/register", payload);

      setSuccessMessage(
        "Compte créé avec succès. Vous pouvez maintenant vous connecter."
      );

      setTimeout(() => {
        navigate(ROUTES.LOGIN || "/login", { replace: true });
      }, 1200);
    } catch (error) {
      console.error("Register error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de créer le compte. Vérifiez les informations saisies."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="auth-hero-content">
          <span className="auth-kicker">Créer un compte</span>

          <h1 className="auth-title">
            Rejoignez votre plateforme événementielle.
          </h1>

          <p className="auth-description">
            Créez un compte client pour réserver des prestataires, ou un compte
            prestataire pour publier vos packs, gérer vos devis, réservations,
            documents et planning.
          </p>

          <div className="auth-highlights">
            <Highlight text="Clients : recherchez, demandez un devis et suivez vos réservations" />
            <Highlight text="Prestataires : gérez vos packs, devis, planning et documents" />
            <Highlight text="Une expérience simple, claire et adaptée au marché marocain" />
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-title">Inscription</h2>
            <p className="auth-card-subtitle">
              Choisissez votre type de compte et renseignez vos informations.
            </p>
          </div>

          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}

          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          <form className="form" onSubmit={handleSubmit}>
            <div className="card-grid card-grid-2">
              <div className="form-row">
                <label className="form-label" htmlFor="firstName">
                  Prénom
                </label>

                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ex: Sami"
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="lastName">
                  Nom
                </label>

                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ex: Alaoui"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

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
              <label className="form-label" htmlFor="phone">
                Téléphone
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
                placeholder="06XXXXXXXX"
                autoComplete="tel"
                required
              />
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="role">
                Type de compte
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-control"
              >
                <option value="CLIENT">Client</option>
                <option value="PROVIDER">Prestataire</option>
              </select>
            </div>

            {formData.role === "PROVIDER" && (
              <div className="alert alert-warning">
                Après inscription, le prestataire devra compléter son profil.
                Ses packs seront visibles publiquement uniquement après
                validation admin.
              </div>
            )}

            <div className="card-grid card-grid-2">
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
                  placeholder="Minimum 6 caractères"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="confirmPassword">
                  Confirmer
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Répéter le mot de passe"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button className="btn auth-submit" type="submit" disabled={loading}>
              {loading ? "Création du compte..." : "Créer mon compte"}
            </button>
          </form>

          <p className="auth-footer-text">
            Déjà un compte ?{" "}
            <Link to={ROUTES.LOGIN || "/login"}>Se connecter</Link>
          </p>
          <div className="auth-separator">
  <span>ou</span>
</div>

<GoogleAuthButton label="Créer un compte client avec Google" />
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

export default RegisterPage;