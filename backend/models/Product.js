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
      type: [String],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "A product must have at least one image.",
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

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
