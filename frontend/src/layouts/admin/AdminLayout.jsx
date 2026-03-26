import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useConnectedUser } from "../../hooks/auth/queries";
import router from "../../routes/Routes";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const { isConnectedUserLoading, connectedUser } = useConnectedUser();

  const totalSeconds = 20;
  const [counter, setCounter] = useState(0);
  const [showNavMobile, setShowNavMobile] = useState(false);
  const handleToggleNav = () => {
    setShowNavMobile(!showNavMobile);
  };

  useEffect(() => {
    if (!isConnectedUserLoading && !connectedUser?.isAdmin) {
      const interval = setInterval(() => {
        setCounter((prev) => prev + 1);
      }, 1000);

      setTimeout(() => {
        router.navigate("/login");
      }, totalSeconds * 1000);

      return () => clearInterval(interval);
    }
  }, [isConnectedUserLoading, connectedUser]);

  if (!isConnectedUserLoading && !connectedUser?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">
          No tienes permiso para acceder a esta página
        </h1>
        <h1 className="text-lg mt-2">
          Serás redirigido a la página de inicio de sesión en{" "}
          {totalSeconds - counter} segundos...
        </h1>
      </div>
    );
  }

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
