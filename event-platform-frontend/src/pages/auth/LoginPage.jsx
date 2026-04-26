import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";
import { hasProviderProfile } from "../../services/api/providerApi";

function LoginPage() {
  const navigate = useNavigate();
  const { login, authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

const redirectByRole = async (user) => {
  if (user.roles.includes(ROLES.ADMIN)) {
    navigate(ROUTES.ADMIN_DASHBOARD);
    return;
  }

  if (user.roles.includes(ROLES.PROVIDER)) {
    const profileExists = await hasProviderProfile();

    if (profileExists) {
      navigate(ROUTES.PROVIDER_DASHBOARD);
    } else {
      navigate(ROUTES.PROVIDER_ONBOARDING);
    }

    return;
  }

  navigate(ROUTES.CLIENT_DASHBOARD);
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const user = await login(formData);
      await redirectByRole(user);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Email ou mot de passe incorrect."
      );
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "420px", margin: "0 auto" }}>
      <h1>Connexion</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Mot de passe</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
        </div>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <button type="submit" disabled={authLoading}>
          {authLoading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Pas encore de compte ? <Link to={ROUTES.REGISTER}>Créer un compte</Link>
      </p>
    </main>
  );
}

export default LoginPage;