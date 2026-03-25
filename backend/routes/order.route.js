import express from "express";
import {
  captureOrder,
  createOrder,
  getAllOrders,
  getOrderByConfirmationNumber,
  getOrderById,
} from "../controllers/order.controller.js";

const router = express.Router();

// ADMIN ROUTES (protected by admin middleware)
router.get("/", getAllOrders);
router.post("/", createOrder);
router.get("/confirmation/:confirmationNumber", getOrderByConfirmationNumber);
router.get("/:id", getOrderById);
router.post("/:id/pay", captureOrder);

export default router;
