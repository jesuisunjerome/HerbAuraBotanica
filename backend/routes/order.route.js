import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderByConfirmationNumber,
  getOrderById,
  updateOrderStatusById,
} from "../controllers/order.controller.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/confirmation/:confirmationNumber", getOrderByConfirmationNumber);
router.post("/", createOrder);

// ADMIN ROUTES (protected by admin middleware)
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.put("/status/:id", updateOrderStatusById);
router.put("/:id", updateOrderStatusById);

export default router;
