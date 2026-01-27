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
} from "../controllers/product.controller.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/active", getAllActiveProducts);
router.get("/new-arrivals", getNewArrivals);
router.get("/similar/:id", getSimilarProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/search", filterProducts);
router.get("/:id", getProductById);

// ADMIN ROUTES (protected by admin middleware)
router.get("/", getAllProducts);
router.post("/", createProduct);
router.put("/:id", updateProductById);
router.put("/:id/status", updateProductStatusById);

export default router;
