import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./lib/db.js";

import productRoutes from "./routes/product.route.js";
import checkoutRoutes from "./routes/checkout.route.js";
import orderRoutes from "./routes/order.route.js";
import subscriberRoutes from "./routes/subscriber.route.js";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  express.json({
    limit: "100mb",
  }),
);
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Routes
app.use("/api/products", productRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscribe", subscriberRoutes);

// Global error handler (try catch no longer needed in controllers)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// Server listening
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
