import { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
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
        <div className="px-3 lg:px-8 pb-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
