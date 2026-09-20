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
import { cacheRoute } from "../middleware/cache.middleware.js";
import {
  createProductSchema,
  filterProductSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";

const router = express.Router();

// PUBLIC ROUTES
// Aplicamos la caché en memoria para reducir los accesos a la BD.
router.get("/active", cacheRoute(300), getAllActiveProducts); // Cache por 5 mins
router.get("/best-sellers", cacheRoute(1800), getBestSellers); // Cache por 30 mins
router.get("/new-arrivals", cacheRoute(1800), getNewArrivals); // Cache por 30 mins
router.get("/:id/similar", cacheRoute(300), getSimilarProducts); // Cache por 5 mins
router.get("/category/:category", cacheRoute(300), getProductsByCategory); // Cache por 5 mins
router.get("/filter", validateRequest(filterProductSchema), cacheRoute(300), filterProducts); // Cache por 5 mins
router.get("/:id", cacheRoute(300), getProductById); // Cache por 5 mins

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
