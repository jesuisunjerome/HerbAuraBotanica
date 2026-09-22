import express from "express";
import "dotenv/config";
import connectDB from "../lib/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import sampleProducts from "./ecommerce_db.products.json" with { type: "json" };
import sampleUsers from "./ecommerce_db.users.json" with { type: "json" };

const app = express();
const PORT = process.env.PORT || 3000;

export const seedProducts = async () => {
  try {
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);

    await User.deleteMany({});
    await User.insertMany(sampleUsers);
    console.log("Products seeded successfully");
  } catch (error) {
    console.log("Error seeding products:", error);
  } finally {
    console.log("Seeded ends");
    process.exit(1);
  }
};

// Server listening
app.listen(PORT, async () => {
  await connectDB();
  seedProducts();
  console.log(`Seed Server is running on port ${PORT}`);
});
