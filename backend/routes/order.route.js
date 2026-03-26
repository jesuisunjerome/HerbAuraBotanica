import express from "express";
import {
  captureOrder,
  createOrder,
  getAllOrders,
  getOrderByConfirmationNumber,
  getOrderById,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ADMIN ROUTES (protected by admin middleware)
router.get("/", protect, getAllOrders);
router.post("/", createOrder);
router.get("/confirmation/:confirmationNumber", getOrderByConfirmationNumber);
router.get("/:id", getOrderById);
router.post("/:id/pay", captureOrder);

export default router;
