import { createBrowserRouter, Navigate } from "react-router";
import { lazy } from "react";
import UserProvider from "../contexts/UserContext";
import { Loadable } from "../components/common/Loadable";

const NotFoundPage = Loadable(lazy(() => import("../layouts/public/NotFound")));

// Layouts
const AdminLayout = Loadable(lazy(() => import("../layouts/admin/AdminLayout")));
const MainLayout = Loadable(lazy(() => import("../layouts/public/MainLayout")));

// Admin Pages
const DashboardPage = Loadable(lazy(() => import("../pages/admin/DashboardPage")));
const InventoryPage = Loadable(lazy(() => import("../pages/admin/InventoryPage")));
const OrderDetailsPage = Loadable(lazy(() => import("../pages/admin/OrderDetailsPage")));
const OrdersPage = Loadable(lazy(() => import("../pages/admin/OrdersPage")));
const ProductsPage = Loadable(lazy(() => import("../pages/admin/ProductsPage")));
const ReportsPage = Loadable(lazy(() => import("../pages/admin/ReportsPage")));

// Public Pages
const AboutPage = Loadable(lazy(() => import("../pages/public/AboutPage")));
const CatalogPage = Loadable(lazy(() => import("../pages/public/CatalogPage")));
const CheckoutPage = Loadable(lazy(() => import("../pages/public/CheckoutPage")));
const ContactPage = Loadable(lazy(() => import("../pages/public/ContactPage")));
const HomePage = Loadable(lazy(() => import("../pages/public/HomePage")));
const LoginPage = Loadable(lazy(() => import("../pages/public/LoginPage")));
const OrderConfirmationPage = Loadable(lazy(() => import("../pages/public/OrderConfirmationPage")));
const OrderTrakingPage = Loadable(lazy(() => import("../pages/public/OrderTrakingPage")));
const PolicyPage = Loadable(lazy(() => import("../pages/public/PolicyPage")));
const ProductDetailsPage = Loadable(lazy(() => import("../pages/public/ProductDetailsPage")));
const RegisterPage = Loadable(lazy(() => import("../pages/public/RegisterPage")));
const ErrorPage = Loadable(lazy(() => import("../pages/public/ErrorPage")));

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <MainLayout><ErrorPage pathName="/" /></MainLayout>,
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
        element: <NotFoundPage />,
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
    errorElement: <ErrorPage pathName="/admin" />,
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
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  // {
  //   path: "/register",
  //   element: <RegisterPage />,
  // },
]);

export default router;