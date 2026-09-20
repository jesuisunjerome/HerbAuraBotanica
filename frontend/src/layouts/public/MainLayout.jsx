import { Outlet } from "react-router";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Analytics />
      <SpeedInsights />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
