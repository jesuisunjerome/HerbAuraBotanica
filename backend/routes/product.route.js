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
import { USER_ROLES } from "../lib/constants.js";
import { authorizeRoles, protect } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  createProductSchema,
  filterProductSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/active", getAllActiveProducts);
router.get("/best-sellers", getBestSellers);
router.get("/new-arrivals", getNewArrivals);
router.get("/:id/similar", getSimilarProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/filter", validateRequest(filterProductSchema), filterProducts);
router.get("/:id", getProductById);

// ADMIN ROUTES (protected by admin middleware)
router.get("/", protect, authorizeRoles(USER_ROLES.ADMIN), getAllProducts);
router.post(
  "/",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  validateRequest(createProductSchema),
  createProduct,
);
router.put(
  "/:id",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  validateRequest(updateProductSchema),
  updateProductById,
);
router.patch(
  "/:id/status",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  updateProductStatusById,
);

export default router;
