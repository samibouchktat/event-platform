import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div>
      <header style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <strong>Admin</strong>
      </header>

      <Outlet />
    </div>
  );
}

export default AdminLayout;