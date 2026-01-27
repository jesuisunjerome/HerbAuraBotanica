import express from "express";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

// ADMIN ROUTES (protected by admin middleware)
router.get("/", getAllOrders);
router.put("/:id", updateOrderStatus);
router.get("/:id", getOrderById);

export default router;
