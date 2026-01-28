import { createBrowserRouter, Navigate } from "react-router";
import AdminLayout from "../layouts/admin/AdminLayout";
import MainLayout from "../layouts/public/MainLayout";
import DashboardPage from "../pages/admin/DashboardPage";
import OrderDetailsPage from "../pages/admin/OrderDetailsPage";
import OrdersPage from "../pages/admin/OrdersPage";
import ProductsPage from "../pages/admin/ProductsPage";
import AboutPage from "../pages/public/AboutPage";
import CatalogPage from "../pages/public/CatalogPage";
import CheckoutPage from "../pages/public/CheckoutPage";
import ContactPage from "../pages/public/ContactPage";
import HomePage from "../pages/public/HomePage";
import OrderConfirmationPage from "../pages/public/OrderConfirmationPage";
import OrderTrakingPage from "../pages/public/OrderTrakingPage";
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
      },
      {
        path: "/products",
        element: <CatalogPage />,
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
        path: "/order-confirmation/:orderId",
        element: <OrderConfirmationPage />,
      },
      {
        path: "/order/:orderId",
        element: <OrderTrakingPage />,
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
        index: true,
        element: <Navigate to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "products/:tab?",
        element: <ProductsPage />,
      },
      { path: "orders", element: <OrdersPage /> },
      {
        path: "orders/:orderId",
        element: <OrderDetailsPage />,
      },
      {
        path: "*",
        element: <div>Admin 404 Not Found</div>,
      },
    ],
  },
]);
export default router;
