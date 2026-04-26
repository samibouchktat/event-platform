import { Outlet } from "react-router-dom";

function ProviderLayout() {
  return (
    <div>
      <header style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <strong>Espace Prestataire</strong>
      </header>

      <Outlet />
    </div>
  );
}

export default ProviderLayout;