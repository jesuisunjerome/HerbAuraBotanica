import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          isMain: { type: Boolean, default: false },
        },
      ],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "Un producto debe tener al menos una imagen.",
      },
    },
    category: {
      type: String,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
    lastLowStockAlertAt: {
      type: Date,
      default: null,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    tags: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Índices estándar para acelerar consultas comunes
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

// Índice de Texto para optimizar búsquedas (Full-text search)
productSchema.index(
  { name: "text", description: "text", category: "text", tags: "text" },
  { weights: { name: 10, category: 8, tags: 5, description: 2 } }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
