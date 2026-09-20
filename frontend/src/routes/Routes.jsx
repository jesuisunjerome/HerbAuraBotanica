import { createBrowserRouter, Navigate } from "react-router";
import UserProvider from "../contexts/UserContext";
import AdminLayout from "../layouts/admin/AdminLayout";
import MainLayout from "../layouts/public/MainLayout";
import DashboardPage from "../pages/admin/DashboardPage";
import InventoryPage from "../pages/admin/InventoryPage";
import OrderDetailsPage from "../pages/admin/OrderDetailsPage";
import OrdersPage from "../pages/admin/OrdersPage";
import ProductsPage from "../pages/admin/ProductsPage";
import ReportsPage from "../pages/admin/ReportsPage";
import AboutPage from "../pages/public/AboutPage";
import CatalogPage from "../pages/public/CatalogPage";
import CheckoutPage from "../pages/public/CheckoutPage";
import ContactPage from "../pages/public/ContactPage";
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import OrderConfirmationPage from "../pages/public/OrderConfirmationPage";
import OrderTrakingPage from "../pages/public/OrderTrakingPage";
import PolicyPage from "../pages/public/PolicyPage";
import ProductDetailsPage from "../pages/public/ProductDetailsPage";
import RegisterPage from "../pages/public/RegisterPage";
import ErrorPage from "../pages/public/ErrorPage";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <MainLayout><ErrorPage pathName="/" /></MainLayout>,
    children: [
      {
        path: "/",
        element: <ErrorPage />,
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
        path: "/track/:orderId",
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
    element: (
      <UserProvider>
        <AdminLayout />
      </UserProvider>
    ),
    path: "/admin",
    errorElement: <AdminLayout><ErrorPage pathName="/admin" /></AdminLayout>,
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
      {
        path: "inventory",
        element: <InventoryPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
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
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);
export default router;
