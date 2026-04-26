import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";

function RegisterPage() {
  const navigate = useNavigate();
  const { register, authLoading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "CLIENT",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const redirectByRole = (user) => {
    if (user.roles.includes(ROLES.PROVIDER)) {
      navigate(ROUTES.PROVIDER_DASHBOARD);
      return;
    }

    navigate(ROUTES.CLIENT_DASHBOARD);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setValidationErrors({});

    try {
      const user = await register(formData);
      redirectByRole(user);
    } catch (error) {
      const data = error.response?.data;

      setErrorMessage(data?.message || "Impossible de créer le compte.");
      setValidationErrors(data?.validationErrors || {});
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "520px", margin: "0 auto" }}>
      <h1>Créer un compte</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Prénom</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.firstName && (
            <small style={{ color: "red" }}>{validationErrors.firstName}</small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Nom</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.lastName && (
            <small style={{ color: "red" }}>{validationErrors.lastName}</small>
          )}
        </div>

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
          {validationErrors.email && (
            <small style={{ color: "red" }}>{validationErrors.email}</small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Téléphone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.phone && (
            <small style={{ color: "red" }}>{validationErrors.phone}</small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Mot de passe</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            style={{ width: "100%", padding: "0.75rem" }}
          />
          {validationErrors.password && (
            <small style={{ color: "red" }}>{validationErrors.password}</small>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Type de compte</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.75rem" }}
          >
            <option value="CLIENT">Client</option>
            <option value="PROVIDER">Prestataire</option>
          </select>
          {validationErrors.role && (
            <small style={{ color: "red" }}>{validationErrors.role}</small>
          )}
        </div>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <button type="submit" disabled={authLoading}>
          {authLoading ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Déjà inscrit ? <Link to={ROUTES.LOGIN}>Se connecter</Link>
      </p>
    </main>
  );
}

export default RegisterPage;