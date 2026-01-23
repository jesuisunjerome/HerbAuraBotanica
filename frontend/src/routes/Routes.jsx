import { createBrowserRouter } from "react-router";
import AdminLayout from "../layouts/admin/AdminLayout";
import MainLayout from "../layouts/public/MainLayout";
import ProductPage from "../pages/admin/ProductPage";
import AboutPage from "../pages/public/AboutPage";
import CatalogPage from "../pages/public/CatalogPage";
import CheckoutPage from "../pages/public/CheckoutPage";
import ContactPage from "../pages/public/ContactPage";
import HomePage from "../pages/public/HomePage";
import OrderConfirmationPage from "../pages/public/OrderConfirmationPage";
import PolicyPage from "../pages/public/PolicyPage";
import ProductDetailsPage from "../pages/public/ProductDetailsPage";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: (
      <div>
        Error page
        <button onClick={() => localStorage.removeItem("cart-herbaura")}>
          clear cart
        </button>
      </div>
    ),
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
        path: "/checkout",
        element: <CheckoutPage />,
      },
      {
        path: "/order-confirmation",
        element: <OrderConfirmationPage />,
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
