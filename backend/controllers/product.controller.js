import cloudinary, { uploadImage } from "../lib/cloudinary.js";
import { AppError } from "../lib/error.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Private (Admin)
export const getAllProducts = async (_, res) => {
  const products = await Product.find().lean();
  res.json(products);
};

// @desc    Get all active products
// @route   GET /api/products/active
// @access  Public
export const getAllActiveProducts = async (_, res) => {
  const products = await Product.find({ isActive: true }).lean();
  res.json(products);
};

// @desc    Get best sellers, if no sales return last 3 created products
// @route   GET /api/products/best-sellers
// @access  Public
export const getBestSellers = async (_, res) => {
  // Best seller logic based on sales data
  const orders = await Order.find({ isPaid: true })
    .populate("orderItems.product")
    .lean();

  // If there are no orders, return last 3 created products
  if (orders.length === 0) {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    // Return in the same format as bestSellers for consistency
    const bestSellers = products.map((product) => ({
      product,
      quantity: 0, // No sales, so quantity is 0
    }));
    return res.json(bestSellers);
  }

  const productSales = {};
  orders.forEach((order) => {
    order.orderItems.forEach((item) => {
      if (!item.product) return; // Guard in case product was deleted
      const productId = item.product._id.toString();
      if (!productSales[productId]) {
        productSales[productId] = { product: item.product, quantity: 0 };
      }
      productSales[productId].quantity += item.quantity;
    });
  });

  const bestSellers = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 3);

  res.json(bestSellers);
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
export const getNewArrivals = async (_, res) => {
  const products = await Product.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  res.json(products);
};

// @desc    Get similar products
// @route   GET /api/products/:id/similar
// @access  Public
export const getSimilarProducts = async (req, res) => {
  const { id } = req.params;

  const currentProduct = await Product.findById(id).lean();
  if (!currentProduct) {
    throw new AppError("Producto no encontrado", 404);
  }

  const { category, tags } = currentProduct;
  const products = await Product.find({
    _id: { $ne: id },
    category,
    tags: { $in: tags },
    isActive: true,
  })
    .limit(4)
    .lean();

  res.json(products);
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).lean();
  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  res.json(product);
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  // TODO: Verify cookie, if admin show all products else show only active products

  const products = await Product.find({ category, isActive: true }).lean();
  res.json(products);
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
export const createProduct = async (req, res) => {
  const { images, ...rest } = req.body;

  if (!images || images.length === 0) {
    throw new AppError("Se requiere al menos una imagen", 400);
  }

  const uploadPromises = images.map(async ({ url }) =>
    uploadImage(url, "HerbAuraBotanica/products"),
  );

  let cloudinaryImageUrls = await Promise.all(uploadPromises);
  const formattedImages = images.map((img, index) => ({
    ...img,
    url: cloudinaryImageUrls[index],
  }));

  const newProduct = await Product.create({
    ...rest,
    images: formattedImages || [],
  });

  res.status(201).json(newProduct);
};

// @desc    Update product by ID
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProductById = async (req, res) => {
  const { id } = req.params;
  const { images, ...updatedData } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("Producto no encontrado", 404);
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
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion error:", cloudinaryError);
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
  }).lean();

  res.json(updatedProduct);
};

// @desc    Update product status (active/inactive) by ID
// @route   PATCH /api/products/:id/status
// @access  Private (Admin)
export const updateProductStatusById = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  product.isActive = !product.isActive;
  await product.save();

  res.json({ message: "Estado del producto actualizado exitosamente" });
};

// @desc    Filter products by search and sort criteria
// @route   GET /api/products/filter
// @access  Public
export const filterProducts = async (req, res) => {
  const { search, sortBy } = req.query;

  const products = await Product.find({
    isActive: true,
    $or: [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ],
  }).lean();

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
};

// @desc    Paginate products
// @route   GET /api/products/paginate
// @access  Public
export const paginateProducts = (req, res) => {
  const { page, limit } = req.query;
  res.send(`Paginación de productos - Página: ${page}, Límite: ${limit}`);
};
