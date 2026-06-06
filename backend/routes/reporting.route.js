import express from "express";
import {
  exportInventoryMovementsCsv,
  exportSalesReportCsv,
  getInventoryMovementsReport,
  getSalesReport,
} from "../controllers/reporting.controller.js";
import { USER_ROLES } from "../lib/constants.js";
import { authorizeRoles, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/sales", protect, authorizeRoles(USER_ROLES.ADMIN), getSalesReport);
router.get(
  "/movements",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  getInventoryMovementsReport,
);
router.get(
  "/sales/export.csv",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  exportSalesReportCsv,
);
router.get(
  "/movements/export.csv",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  exportInventoryMovementsCsv,
);

export default router;
