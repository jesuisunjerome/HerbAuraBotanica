import express from "express";
import {
  captureOrder,
  createOrder,
  getAllOrders,
  getOrderByConfirmationNumber,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { USER_ROLES } from "../lib/constants.js";
import { authorizeRoles, protect } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  createOrderSchema,
  capturePaypalOrderSchema,
  updateOrderStatusSchema,
} from "../schemas/order.schema.js";

const router = express.Router();

// ADMIN ROUTES (protected by admin middleware)
router.get("/", protect, authorizeRoles(USER_ROLES.ADMIN), getAllOrders);
router.post("/", validateRequest(createOrderSchema), createOrder);
router.get("/confirmation/:confirmationNumber", getOrderByConfirmationNumber);
router.get("/:id", getOrderById);
router.post(
  "/:id/pay",
  validateRequest(capturePaypalOrderSchema),
  captureOrder,
);
router.put(
  "/:id/status",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  validateRequest(updateOrderStatusSchema),
  updateOrderStatus,
);

export default router;
