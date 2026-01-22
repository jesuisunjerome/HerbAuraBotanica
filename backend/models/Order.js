import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    confirmationNumber: {
      type: String,
      unique: true,
      required: true, // Generado al crear la orden
    },
    user: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    products: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
          price: {
            type: Number,
            required: true,
            min: 0,
          },
        },
      ],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "An order must have at least one product.",
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pendiente", "En Proceso", "Enviado", "Entregado", "Cancelado"],
      default: "Pendiente",
    },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
