import express from "express";
import {
  getAllOrders,
  getOrderByConfirmationNumber,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

// ADMIN ROUTES (protected by admin middleware)
router.get("/", getAllOrders);
router.get("/confirmation/:confirmationNumber", getOrderByConfirmationNumber);
router.put("/:id", updateOrderStatus);
router.get("/:id", getOrderById);

export default router;
