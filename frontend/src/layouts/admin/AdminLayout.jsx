import { useState } from "react";
import { Link, Outlet } from "react-router";
import { useLowStockProducts } from "../../hooks/products/queries";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const { lowStockProducts = [] } = useLowStockProducts();

  const [showNavMobile, setShowNavMobile] = useState(false);
  const handleToggleNav = () => {
    setShowNavMobile(!showNavMobile);
  };

  return (
    <div className="admin-layout">
      <Sidebar
        showNavMobile={showNavMobile}
        handleToggleNav={handleToggleNav}
      />

      <main className="flex-1 w-[calc(100vw-16rem)] transition-all duration-300 flex flex-col md:ml-64">
        <Navbar handleToggleNav={handleToggleNav} />
        {lowStockProducts.length > 0 && (
          <div className="mx-3 mt-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 lg:mx-8">
            Hay {lowStockProducts.length} producto(s) con inventario bajo.
            <Link
              to="/admin/inventory"
              className="ml-2 font-semibold underline hover:no-underline"
            >
              Revisar inventario
            </Link>
          </div>
        )}
        <div className="px-3 lg:px-8 pb-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
