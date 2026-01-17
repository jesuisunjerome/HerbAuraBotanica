import { createBrowserRouter } from "react-router";
import AdminLayout from "../layouts/admin/AdminLayout";
import MainLayout from "../layouts/public/MainLayout";
import ProductPage from "../pages/admin/ProductPage";
import AboutPage from "../pages/public/AboutPage";
import CartPage from "../pages/public/CartPage";
import CatalogPage from "../pages/public/CatalogPage";
import ContactPage from "../pages/public/ContactPage";
import HomePage from "../pages/public/HomePage";
import PolicyPage from "../pages/public/PolicyPage";
import ProductDetailsPage from "../pages/public/ProductDetailsPage";

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
  {
    element: <AdminLayout />,
    path: "/admin",
    errorElement: <div>Admin Error page</div>,
    children: [
      {
        path: "products",
        element: <ProductPage />,
      },
    ],
  },
]);
export default router;
