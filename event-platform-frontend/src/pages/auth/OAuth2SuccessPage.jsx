import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { getCurrentUser } from "../../services/api/authApi";
import { removeToken, saveToken } from "../../utils/storage";

function OAuth2SuccessPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      const token = searchParams.get("token");

      if (!token) {
        window.location.replace(
          `${ROUTES.LOGIN || "/login"}?error=google_token_missing`
        );
        return;
      }

      try {
        saveToken(token);

        const user = await getCurrentUser();

        localStorage.setItem("user", JSON.stringify(user));

        window.location.replace(ROUTES.CLIENT_DASHBOARD || "/client/dashboard");
      } catch (error) {
        console.error("OAuth2 success error:", error.response?.data || error);

        removeToken();
        localStorage.removeItem("user");

        window.location.replace(
          `${ROUTES.LOGIN || "/login"}?error=google_user_load_failed`
        );
      }
    };

    handleOAuthSuccess();
  }, [searchParams]);

  return (
    <main className="app-container">
      <section className="card oauth-success-card">
        <div className="oauth-success-loader" />
        <h1 className="card-title">Connexion avec Google</h1>
        <p className="text-muted">
          Connexion réussie. Préparation de votre espace client...
        </p>
      </section>
    </main>
  );
}

export default OAuth2SuccessPage;