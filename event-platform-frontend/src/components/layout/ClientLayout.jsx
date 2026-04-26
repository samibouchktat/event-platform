import { Outlet } from "react-router-dom";

function ClientLayout() {
  return (
    <div>
      <header style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <strong>Espace Client</strong>
      </header>

      <Outlet />
    </div>
  );
}

export default ClientLayout;