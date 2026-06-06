import express from "express";
import {
  adjustProductStock,
  getInventoryHistory,
  getInventorySummary,
  getLowStockProducts,
} from "../controllers/inventory.controller.js";
import { USER_ROLES } from "../lib/constants.js";
import { authorizeRoles, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/low-stock",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  getLowStockProducts,
);
router.get(
  "/summary",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  getInventorySummary,
);
router.get(
  "/history",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  getInventoryHistory,
);
router.get(
  "/history/:productId",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  getInventoryHistory,
);
router.post(
  "/:productId/adjust",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  adjustProductStock,
);

export default router;
