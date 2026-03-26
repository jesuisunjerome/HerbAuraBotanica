// import { lazy, Suspense } from "react";
// import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { RouterProvider } from "react-router";
import router from "./routes/Routes";
import FacebookInit from "./components/common/FacebookInit";

// const AdminLayout = lazy(() => import("./layouts/admin/AdminLayout"));
// const MainLayout = lazy(() => import("./layouts/public/MainLayout"));

// const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
// const OrderDetailsPage = lazy(() => import("./pages/admin/OrderDetailsPage"));
// const OrdersPage = lazy(() => import("./pages/admin/OrdersPage"));
// const ProductsPage = lazy(() => import("./pages/admin/ProductsPage"));

// const LoginPage = lazy(() => import("./pages/public/LoginPage"));
// const AboutPage = lazy(() => import("./pages/public/AboutPage"));
// const CatalogPage = lazy(() => import("./pages/public/CatalogPage"));
// const CheckoutPage = lazy(() => import("./pages/public/CheckoutPage"));
// const ContactPage = lazy(() => import("./pages/public/ContactPage"));
// const HomePage = lazy(() => import("./pages/public/HomePage"));
// const OrderConfirmationPage = lazy(
//   () => import("./pages/public/OrderConfirmationPage"),
// );
// const OrderTrakingPage = lazy(() => import("./pages/public/OrderTrakingPage"));
// const PolicyPage = lazy(() => import("./pages/public/PolicyPage"));
// const ProductDetailsPage = lazy(
//   () => import("./pages/public/ProductDetailsPage"),
// );

function App() {
  return (
    <>
    <FacebookInit/>
      {/* <UserProvider> */}
      <RouterProvider router={router} />
      {/* </UserProvider> */}
      {/* <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="/admin/*"
              element={
                <UserProvider>
                  <AdminLayout />
                </UserProvider>
              }
            >
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:orderId" element={<OrderDetailsPage />} />
              <Route path="products/:tab?" element={<ProductsPage />} />
            </Route>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<CatalogPage />} />
              <Route
                path="products/:productId"
                element={<ProductDetailsPage />}
              />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route
                path="order-confirmation/:orderId"
                element={<OrderConfirmationPage />}
              />
              <Route path="track/:orderId" element={<OrderTrakingPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="terms" element={<PolicyPage />} />
            </Route>
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Suspense>
      </BrowserRouter> */}
    </>
  );
}

export default App;
