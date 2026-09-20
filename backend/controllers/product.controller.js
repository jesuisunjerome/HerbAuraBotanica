import cloudinary, { uploadImage } from "../lib/cloudinary.js";
import { AppError } from "../lib/error.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { CLOUDINARY_PRODUCTS_FOLDER } from "../lib/constants.js";

// Helper for SSRF prevention
const isValidImageUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    // Block common internal/local network addresses
    const forbiddenHostnames = ["localhost", "127.0.0.1", "169.254.169.254", "0.0.0.0"];
    if (forbiddenHostnames.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`))) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Private (Admin)
export const getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Product.countDocuments();
  const products = await Product.find().skip(skip).limit(limit).lean();
  
  res.json({ data: products, total, page, pages: Math.ceil(total / limit) });
};

// @desc    Get all active products
// @route   GET /api/products/active
// @access  Public
export const getAllActiveProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Product.countDocuments({ isActive: true });
  const products = await Product.find({ isActive: true }).skip(skip).limit(limit).lean();
  
  res.json({ data: products, total, page, pages: Math.ceil(total / limit) });
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

  if (images.some((img) => !isValidImageUrl(img.url))) {
    throw new AppError("Una o más URLs de imágenes son inválidas o inseguras", 400);
  }

  const uploadPromises = images.map(async ({ url }) =>
    uploadImage(url, CLOUDINARY_PRODUCTS_FOLDER),
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

  if (images && images.some((img) => !isValidImageUrl(img.url))) {
    throw new AppError("Una o más URLs de imágenes son inválidas o inseguras", 400);
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  // Delete only removed images from Cloudinary
  const newUrls = (images || []).map((img) => img.url);
  const imagesToDelete = (product.images || []).filter(
    (existing) => !newUrls.includes(existing.url) && existing.url.includes("res.cloudinary.com"),
  );

  if (imagesToDelete.length > 0) {
    try {
      await Promise.all(
        imagesToDelete.map(async ({ url }) => {
          const publicId = url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `${CLOUDINARY_PRODUCTS_FOLDER}/${publicId}`,
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

      return await uploadImage(url, CLOUDINARY_PRODUCTS_FOLDER);
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

// Helper function to escape special characters in regex (Kept for compatibility if needed elsewhere, but no longer used in search)
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// @desc    Filter products by search and sort criteria
// @route   GET /api/products/filter
// @access  Public
export const filterProducts = async (req, res) => {
  const { search, sortBy } = req.query;

  const query = { isActive: true };
  const queryOptions = {};

  if (search) {
    // Usamos el índice $text optimizado de MongoDB en lugar de expresiones regulares
    query.$text = { $search: search };
    queryOptions.score = { $meta: "textScore" };
  }

  let productsQuery = Product.find(query, queryOptions);

  const sortCriteria = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name_asc: { name: 1 },
    name_desc: { name: -1 },
    newest: { createdAt: -1 },
  };

  const defaultSort = search ? { score: { $meta: "textScore" } } : { createdAt: -1 };
  const sort = sortCriteria[sortBy] || defaultSort;

  productsQuery = productsQuery.sort(sort);

  const products = await productsQuery.lean();

  res.json(products);
};

// @desc    Paginate products
// @route   GET /api/products/paginate
// @access  Public
export const paginateProducts = (req, res) => {
  const { page, limit } = req.query;
  res.send(`Paginación de productos - Página: ${page}, Límite: ${limit}`);
};
