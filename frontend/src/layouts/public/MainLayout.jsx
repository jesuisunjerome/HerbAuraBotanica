import { Outlet } from "react-router";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Analytics } from "@vercel/analytics/react";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Analytics />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
