import mongoose from "mongoose";
import { INVENTORY_MOVEMENT_TYPES } from "../lib/constants.js";

const inventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    movementType: {
      type: String,
      enum: Object.values(INVENTORY_MOVEMENT_TYPES),
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    beforeQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    afterQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      default: "",
      trim: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
      index: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

inventoryLogSchema.index({ product: 1, createdAt: -1 });

const InventoryLog =
  mongoose.models.InventoryLog ||
  mongoose.model("InventoryLog", inventoryLogSchema);

export default InventoryLog;
