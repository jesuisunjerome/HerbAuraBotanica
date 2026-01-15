import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import AboutPage from "../pages/AboutPage";
import CartPage from "../pages/CartPage";
import CatalogPage from "../pages/CatalogPage";
import ContactPage from "../pages/ContactPage";
import HomePage from "../pages/HomePage";
import PolicyPage from "../pages/PolicyPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <div>Error page</div>,
    children: [
      {
        path: "/",
        element: <HomePage />,
        meta: [{ title: "Home" }],
      },
      {
        path: "/products",
        element: <CatalogPage />,
        meta: [{ title: "Products" }],
      },
      {
        path: "/products/:productId",
        element: <ProductDetailsPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/terms",
        element: <PolicyPage />,
      },
      {
        path: "*",
        element: <div>404 Not Found</div>,
      },
    ],
  },
]);
export default router;
