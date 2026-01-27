import cloudinary, { uploadImage } from "../lib/cloudinary.js";
import Product from "../models/Product.js";

export const getAllProducts = async (_, res) => {
  try {
    console.log("getAllProducts controller");

    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.log("Server error in getAllProducts controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllActiveProducts = async (_, res) => {
  try {
    console.log("getAllActiveProducts controller");

    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    console.log("Server error in getAllActiveProducts controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const getNewArrivals = async (_, res) => {
  try {
    console.log("getNewArrivals controller");

    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(products);
  } catch (error) {
    console.log("Server error in getNewArrivals controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const getSimilarProducts = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("getSimilarProducts controller");

    const currentProduct = await Product.findById(id);
    if (!currentProduct)
      return res.status(404).json({ message: "Producto no encontrado" });

    const { category, tags } = currentProduct;
    const products = await Product.find({
      _id: { $ne: id },
      category,
      tags: { $in: tags },
      isActive: true,
    }).limit(4);

    res.json(products);
  } catch (error) {
    console.log("Server error in getSimilarProducts controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("getProductById controller");

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
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
    console.log("getProductsByCategory controller");
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
    console.log("createProduct controller");

    if (!images || images.length === 0) {
      return res
        .status(400)
        .json({ message: "Se requiere al menos una imagen" });
    }

    console.log(images);
    let cloudinaryImageUrls = [];
    const uploadPromises = images.map(async ({ url }) =>
      uploadImage(url, "HerbAuraBotanica/products"),
    );

    // Add the complete image objects with isMain property
    cloudinaryImageUrls = await Promise.all(uploadPromises);
    cloudinaryImageUrls = images.map((img, index) => ({
      ...img,
      url: cloudinaryImageUrls[index],
    }));

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
    console.log("updateProductById controller");

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Delete existing images from Cloudinary
    const imageUrlsToDelete = product.images || [];
    if (Array.isArray(imageUrlsToDelete)) {
      try {
        await Promise.all(
          imageUrlsToDelete.map(async ({ url }) => {
            const publicId = url.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(
              `HerbAuraBotanica/products/${publicId}`,
            );
          }),
        );
      } catch (error) {
        console.log("Cloudinary deletion error:", error);
      }
    }

    // Upload new images to Cloudinary
    let cloudinaryImageUrls = [];
    if (images && images.length > 0) {
      const uploadPromises = images.map(async ({ url }) => {
        // Check if the URL is already a Cloudinary URL
        if (
          url.startsWith("http://res.cloudinary.com/") ||
          url.startsWith("https://res.cloudinary.com/")
        )
          return url; // Return the existing URL without re-uploading

        return await uploadImage(url, "HerbAuraBotanica/products");
      });

      // Add the complete image objects with isMain property
      cloudinaryImageUrls = await Promise.all(uploadPromises);
      cloudinaryImageUrls = images.map((img, index) => ({
        ...img,
        url: cloudinaryImageUrls[index],
      }));
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

export const updateProductStatusById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("updateProductStatusById controller");

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    product.isActive = !product.isActive;
    await product.save();
    res.json({ message: "Estado del producto actualizado exitosamente" });
  } catch (error) {
    console.log(
      "Server error in updateProductStatusById controller",
      error.message,
    );
    res.status(500).json({ message: error.message });
  }
};

export const filterProducts = async (req, res) => {
  const { search, sortBy } = req.query;

  try {
    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ],
    });

    if (sortBy) {
      if (sortBy === "priceAsc") {
        products.sort((a, b) => a.price - b.price);
      } else if (sortBy === "priceDesc") {
        products.sort((a, b) => b.price - a.price);
      } else if (sortBy === "newest") {
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }

    res.json(products);
  } catch (error) {
    console.log("Server error in filterProducts controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const paginateProducts = (req, res) => {
  const { page, limit } = req.query;
  res.send(`Paginate products - Page: ${page}, Limit: ${limit}`);
};
