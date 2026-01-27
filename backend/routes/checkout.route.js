import express from "express";
import {
  createNewCheckoutSession,
  finalizeCheckoutSession,
  updateCheckoutPaymentStatus,
} from "../controllers/checkout.controller.js";

const router = express.Router();

router.post("/", createNewCheckoutSession);
router.put("/:id/pay", updateCheckoutPaymentStatus);
router.post("/:id/finalize", finalizeCheckoutSession);

export default router;
