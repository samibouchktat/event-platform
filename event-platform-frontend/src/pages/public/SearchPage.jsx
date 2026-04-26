import { useEffect, useState } from "react";
import { searchPacks } from "../../services/api/searchApi";
import { Link } from "react-router-dom";
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
      setPacks(data);
    } catch (error) {
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
    <main style={{ padding: "2rem" }}>
      <section style={{ maxWidth: "960px", margin: "0 auto" }}>
        <h1>Rechercher un prestataire</h1>
        <p>
          Trouvez des packs adaptés à votre événement selon la ville, le budget
          et le nombre de convives.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            display: "grid",
            gap: "1rem",
          }}
        >
          <div>
            <label>Ville</label>
            <input
              name="city"
              value={filters.city}
              onChange={handleChange}
              placeholder="Casablanca, Rabat..."
              style={{ width: "100%", padding: "0.75rem" }}
            />
          </div>

          <div>
            <label>Type d’événement</label>
            <select
              name="eventType"
              value={filters.eventType}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem" }}
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

          <div>
            <label>Type de service</label>
            <select
              name="serviceType"
              value={filters.serviceType}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem" }}
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

          <div>
            <label>Nombre de convives</label>
            <input
              name="guests"
              type="number"
              min="1"
              value={filters.guests}
              onChange={handleChange}
              placeholder="Ex: 100"
              style={{ width: "100%", padding: "0.75rem" }}
            />
          </div>

          <div>
            <label>Budget max MAD</label>
            <input
              name="maxBudget"
              type="number"
              min="1"
              value={filters.maxBudget}
              onChange={handleChange}
              placeholder="Ex: 20000"
              style={{ width: "100%", padding: "0.75rem" }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit" disabled={loading}>
              {loading ? "Recherche..." : "Rechercher"}
            </button>

            <button type="button" onClick={handleReset} disabled={loading}>
              Réinitialiser
            </button>
          </div>
        </form>

        <section style={{ marginTop: "2rem" }}>
          <h2>Résultats</h2>

          {initialLoading && <p>Chargement des packs...</p>}

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          {!loading && !errorMessage && packs.length === 0 && (
            <p>Aucun résultat trouvé.</p>
          )}

          {packs.length > 0 && (
            <div style={{ display: "grid", gap: "1rem" }}>
              {packs.map((pack) => (
                <article
                  key={pack.packId}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "1rem",
                  }}
                >
                  <h3>{pack.packName}</h3>

                  <p>
                    <strong>Prestataire :</strong>{" "}
                    {pack.providerBusinessName}
                  </p>

                  <p>
                    <strong>Ville :</strong> {pack.city}
                  </p>

                  <p>
                    <strong>Type événement :</strong> {pack.eventType}
                  </p>

                  <p>
                    <strong>Service :</strong> {pack.serviceType}
                  </p>

                  <p>
                    <strong>Prix :</strong> {pack.price} MAD
                  </p>

                  <p>
                    <strong>Convives :</strong> {pack.minGuests} -{" "}
                    {pack.maxGuests}
                  </p>

                  {pack.serviceArea && (
                    <p>
                      <strong>Zones :</strong> {pack.serviceArea}
                    </p>
                  )}

                  {pack.description && <p>{pack.description}</p>}

                  {pack.includedServices && (
                    <p>
                      <strong>Inclus :</strong> {pack.includedServices}
                    </p>
                  )}

                  <p>
                    <strong>Délai réservation :</strong>{" "}
                    {pack.bookingDeadlineDays} jour(s)
                  </p>

                  {!pack.providerValidated && (
                    <p style={{ color: "orange" }}>
                      Prestataire en attente de validation admin.
                    </p>
                  )}
                  {pack.description && <p>{pack.description}</p>}
                      <Link to={`/quote-request/${pack.packId}`}>
                        Demander un devis
                        </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default SearchPage;