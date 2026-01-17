import { Outlet } from "react-router";
import Footer from "../../components/public/Footer";
import Navbar from "../../components/public/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
// px-3 lg:px-20 md:px-5
