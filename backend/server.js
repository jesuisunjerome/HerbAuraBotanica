import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import orderRoutes from "./routes/order.route.js";
import paymentRoutes from "./routes/payment.route.js";
import inventoryRoutes from "./routes/inventory.route.js";
import reportingRoutes from "./routes/reporting.route.js";
import subscriberRoutes from "./routes/subscriber.route.js";

import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Initialize Express app
const app = express();
app.disable("x-powered-by");
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Middleware inteligente de conexión a BD
app.use(async (req, res, next) => {
  // En servidor tradicional o en Serverless "caliente", readyState === 1 es true.
  // Pasa de inmediato síncronamente: 0ms de latencia, 0 sobrecarga.
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (error) {
    // 503 (Service Unavailable) es el código HTTP correcto cuando la BD no responde
    console.error("Database connection middleware error:", error);
    res.status(503).json({ message: "Base de datos temporalmente inaccesible. Reintente en un momento." });
  }
});

// Stripe webhook endpoint needs raw body, so we will handle it separately in the route
app.use(
  "/api/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
);

// For all other routes, use JSON body parser with increased limit
app.use(
  express.json({
    limit: "100mb",
  }),
);

app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/reports", reportingRoutes);
app.use("/api/subscribe", subscriberRoutes);
app.use("/", (req, res) => {
  res.send("API is running..." + process.env.CLIENT_URL + " " + PORT);
});

// Global error handler (try catch no longer needed in controllers)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)
      .map((el) => el.message)
      .join(", ");
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    status = 400;
    const field = Object.keys(err.keyValue || {})[0] || "campo";
    message = `El ${field} ya existe y debe ser único.`;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    status = 400;
    message = `Valor inválido para el campo: ${err.path}`;
  }

  res.status(status).json({ message });
});


// Función de arranque para servidor tradicional (VPS, Render, Railway, Docker, Local)
const startServer = async () => {
  try {
    // Conectar a BD primero antes de abrir el puerto
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // En servidor tradicional sí es seguro salir en el boot inicial
  }
};

// Si NO estamos en serverless (ej: Vercel), arrancamos con app.listen
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
if (!isServerless) {
  await startServer();
}

// Exportar app para que plataformas serverless (ej: Vercel) puedan montarla directamente
export default app;