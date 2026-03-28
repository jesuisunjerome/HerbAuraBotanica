import express from "express";
import {
  createProduct,
  updateProductStatusById,
  filterProducts,
  getAllActiveProducts,
  getAllProducts,
  getNewArrivals,
  getProductById,
  getProductsByCategory,
  getSimilarProducts,
  updateProductById,
  getBestSellers,
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/active", getAllActiveProducts);
router.get("/best-sellers", getBestSellers);
router.get("/new-arrivals", getNewArrivals);
router.get("/:id/similar", getSimilarProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/filter", filterProducts);
router.get("/:id", getProductById);

// ADMIN ROUTES (protected by admin middleware)
router.get("/", protect, getAllProducts);
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProductById);
router.patch("/:id/status", protect, updateProductStatusById);

export default router;
