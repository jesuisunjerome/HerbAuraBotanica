import "./lib/env.js"; // Validate env first
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./lib/db.js";
import logger from "./lib/logger.js";
import { initAgenda } from "./lib/queue.js";
import { defineEmailJob } from "./jobs/email.job.js";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import orderRoutes from "./routes/order.route.js";
import paymentRoutes from "./routes/payment.route.js";
import inventoryRoutes from "./routes/inventory.route.js";
import reportingRoutes from "./routes/reporting.route.js";
import subscriberRoutes from "./routes/subscriber.route.js";

// Initialize Express app
const app = express();
app.disable("x-powered-by");
app.use(helmet()); // Add Helmet for security headers
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Rate Limiting Global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // Limite de 1000 peticiones por ventana por IP
  message: { message: "Demasiadas peticiones desde esta IP, intente más tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Rate Limiting específico para Autenticación (Previene fuerza bruta)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Solo 20 intentos de login/registro por IP cada 15 min
  message: { message: "Demasiados intentos de autenticación, intente en 15 minutos." },
});

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
    logger.error(`Database connection middleware error: ${error.message}`);
    res.status(503).json({ message: "Base de datos temporalmente inaccesible. Reintente en un momento." });
  }
});

import { requireCsrfHeader } from "./middleware/csrf.middleware.js";

// Stripe webhook endpoint needs raw body, so we will handle it separately in the route
// (It is excluded from CSRF internally, but good to have it before global CSRF if needed)
app.use(
  "/api/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
);

// Global Anti-CSRF Middleware
app.use(requireCsrfHeader);

// For all other routes, use JSON body parser with increased limit
app.use(
  express.json({
    limit: "100mb",
  }),
);

// Sanitización de NoSQL Injection (reemplaza o elimina keys con '$' y '.')
// Usamos un middleware personalizado para evitar el error "Cannot set property query of #<IncomingMessage> which has only a getter" en Express
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  if (req.query) {
    const sanitizedQuery = mongoSanitize.sanitize(req.query);
    Object.defineProperty(req, "query", {
      value: sanitizedQuery,
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }
  next();
});

app.use(cookieParser());

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/reports", reportingRoutes);
app.use("/api/subscribe", subscriberRoutes);
app.use("/", (_, res) => {
  res.send("API is running..." + process.env.CLIENT_URL + " " + PORT);
});

// Global error handler (try catch no longer needed in controllers)
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
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

    // Iniciar Workers de fondo
    const agendaInstance = initAgenda(mongoose.connection.getClient().db());
    defineEmailJob(agendaInstance);
    await agendaInstance.start();

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
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