import cloudinary, { uploadImage } from "../lib/cloudnary.js";
import Product from "../models/Product.js";

export const getAllProducts = async (_, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.log("Server error in getAllProducts controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllActiveProducts = async (_, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    console.log("Server error in getAllActiveProducts controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.log("Server error in getProductById controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    // TODO: Verify cookie, if admin show all products else show only active products

    const products = await Product.find({ category, isActive: true });
    res.json(products);
  } catch (error) {
    console.log("Server error in getProductsByCategory controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { images, ...rest } = req.body;

  try {
    if (!images || images.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    let cloudinaryImageUrls = [];
    const uploadPromises = images.map(async (image) =>
      uploadImage(image, "HerbAuraBotanica/products"),
    );

    cloudinaryImageUrls = await Promise.all(uploadPromises);

    const newProduct = await Product.create({
      ...rest,
      images: cloudinaryImageUrls || [],
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.log("Server error in createProduct controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateProductById = async (req, res) => {
  const { id } = req.params;
  const { images, ...updatedData } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete existing images from Cloudinary
    const imageUrlsToDelete = product.images || [];
    if (Array.isArray(imageUrlsToDelete)) {
      try {
        await Promise.all(
          imageUrlsToDelete.map(async (imageUrl) => {
            const publicId = imageUrl.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`products/${publicId}`);
          }),
        );
      } catch (error) {
        console.log("Cloudinary deletion error:", error);
      }
    }

    // Upload new images to Cloudinary
    let cloudinaryImageUrls = [];
    if (images && images.length > 0) {
      const uploadPromises = images.map(async (image) =>
        uploadImage(image, "products"),
      );

      cloudinaryImageUrls = await Promise.all(uploadPromises);
    }

    const updatePayload = { ...updatedData };
    if (Array.isArray(images)) {
      updatePayload.images = images.length > 0 ? cloudinaryImageUrls : [];
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });

    res.json(updatedProduct);
  } catch (error) {
    console.log("Server error in updateProductById controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Server error in deleteProductById controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// TODO: Implement the following controller functions
export const searchProducts = (req, res) => {
  const { query } = req.query;
  res.send(`Search products with query: ${query}`);
};

export const sortProductsByPrice = (req, res) => {
  const { order } = req.query;
  res.send(`Sort products by price in ${order} order`);
};

export const paginateProducts = (req, res) => {
  const { page, limit } = req.query;
  res.send(`Paginate products - Page: ${page}, Limit: ${limit}`);
};
