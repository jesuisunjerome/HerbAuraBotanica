import express from "express";
import {
  createProduct,
  deleteProductById,
  getAllActiveProducts,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProductById,
} from "../controllers/product.controller.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/active", getAllActiveProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);

// ADMIN ROUTES (protected by admin middleware)
router.get("/", getAllProducts);
router.post("/", createProduct);
router.put("/:id", updateProductById);
router.put("/delete/:id", deleteProductById);

export default router;
