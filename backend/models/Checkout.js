import mongoose from "mongoose";
import { CHECKOUT_STATUS, PAYMENT_STATUS } from "../lib/constants.js";

const checkoutItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const checkoutSchema = new mongoose.Schema(
  {
    shippingDetails: {
      user: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        postalCode: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
      },
      status: {
        type: String,
        enum: Object.values(CHECKOUT_STATUS),
        default: CHECKOUT_STATUS.PENDING,
      },
    },
    checkoutItems: [checkoutItemSchema],
    paymentMethod: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    paymentDetails: {
      type: mongoose.Schema.Types.Mixed, // To store various payment gateway responses (transaction ID, status, etc.)
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    isFinalized: {
      type: Boolean,
      default: false,
    },
    finalizedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Checkout =
  mongoose.models.Checkout || mongoose.model("Checkout", checkoutSchema);

export default Checkout;
