import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="w-70 border-r h-dvh fixed hidden">Admin Sidebar</aside>
      <div className="flex-1 min-h-dvh ms-7s0">
        <main className="px-7 mb-10">
          <nav>Admin Navbar</nav>
          <Outlet />
        </main>
        {/* <footer>Admin Footer</footer> */}
      </div>
    </div>
  );
}
