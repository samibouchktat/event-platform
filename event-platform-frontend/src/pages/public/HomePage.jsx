import { useEffect, useState } from "react";
import { checkApiHealth } from "../../services/api/healthApi";

function HomePage() {
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchApiHealth = async () => {
      try {
        const data = await checkApiHealth();
        setApiStatus(data);
      } catch (error) {
        setErrorMessage("Impossible de contacter le backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchApiHealth();
  }, []);

  return (
    <main className="app-container">
      <h1>Event Platform Maroc</h1>
      <p>Plateforme de gestion et réservation d’événements.</p>

      <section style={{ marginTop: "2rem" }}>
        <h2>Test API</h2>

        {loading && <p>Connexion au backend...</p>}

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {apiStatus && (
          <div>
            <p>
              <strong>Status :</strong> {apiStatus.status}
            </p>
            <p>
              <strong>Message :</strong> {apiStatus.message}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default HomePage;