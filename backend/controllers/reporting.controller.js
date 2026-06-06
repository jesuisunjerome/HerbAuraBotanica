import InventoryLog from "../models/InventoryLog.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const parseDateRange = (from, to) => {
  const fromDate = from ? new Date(from) : new Date(new Date().setDate(1));
  const toDate = to ? new Date(to) : new Date();

  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999);

  return { fromDate, toDate };
};

const parsePagination = (page, limit, defaults = { page: 1, limit: 20 }) => {
  const parsedPage = Math.max(1, Number(page) || defaults.page);
  const parsedLimit = Math.min(
    100,
    Math.max(1, Number(limit) || defaults.limit),
  );

  return { page: parsedPage, limit: parsedLimit };
};

const parseSort = (sortBy, sortOrder, allowedSortFields, fallback) => {
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : fallback;
  const safeSortOrder = sortOrder === "asc" ? 1 : -1;

  return { [safeSortBy]: safeSortOrder };
};

const buildSalesMatchFilter = ({ fromDate, toDate, search, paymentMethod }) => {
  const match = {
    isPaid: true,
    paidAt: { $gte: fromDate, $lte: toDate },
  };

  if (paymentMethod) {
    match.paymentMethod = paymentMethod;
  }

  if (search) {
    match.$or = [
      { confirmationNumber: { $regex: search, $options: "i" } },
      { "customer.name": { $regex: search, $options: "i" } },
      { "customer.email": { $regex: search, $options: "i" } },
    ];
  }

  return match;
};

const buildMovementBaseFilter = ({
  fromDate,
  toDate,
  movementType,
  productId,
}) => {
  const filter = {
    createdAt: { $gte: fromDate, $lte: toDate },
  };

  if (movementType) {
    filter.movementType = movementType;
  }

  if (productId) {
    filter.product = productId;
  }

  return filter;
};

const fetchProductIdsByCategory = async (category) => {
  if (!category) {
    return null;
  }

  const products = await Product.find({
    category: { $regex: category, $options: "i" },
  }).select("_id");

  return products.map((product) => product._id);
};

const fetchProductIdsBySearch = async (search) => {
  if (!search) {
    return null;
  }

  const products = await Product.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ],
  }).select("_id");

  return products.map((product) => product._id);
};

const mergeProductIdFilters = (
  movementFilter,
  categoryProductIds,
  searchProductIds,
) => {
  const andClauses = [];

  if (movementFilter.product) {
    andClauses.push({ product: movementFilter.product });
    delete movementFilter.product;
  }

  if (Array.isArray(categoryProductIds)) {
    andClauses.push({ product: { $in: categoryProductIds } });
  }

  if (Array.isArray(searchProductIds)) {
    andClauses.push({ product: { $in: searchProductIds } });
  }

  if (andClauses.length === 1) {
    Object.assign(movementFilter, andClauses[0]);
  } else if (andClauses.length > 1) {
    movementFilter.$and = andClauses;
  }

  return movementFilter;
};

const getMovementReportData = async (query, { includePagination }) => {
  const { fromDate, toDate } = parseDateRange(query.from, query.to);
  const { page, limit } = parsePagination(query.page, query.limit, {
    page: 1,
    limit: includePagination ? 20 : 500,
  });

  const movementFilter = buildMovementBaseFilter({
    fromDate,
    toDate,
    movementType: query.movementType,
    productId: query.productId,
  });

  const [categoryProductIds, searchProductIds] = await Promise.all([
    fetchProductIdsByCategory(query.category),
    fetchProductIdsBySearch(query.search),
  ]);

  mergeProductIdFilters(movementFilter, categoryProductIds, searchProductIds);

  const movementSort = parseSort(
    query.sortBy,
    query.sortOrder,
    ["createdAt", "quantity", "beforeQuantity", "afterQuantity"],
    "createdAt",
  );

  const movementQuery = InventoryLog.find(movementFilter)
    .populate("product", "name category")
    .sort(movementSort);

  if (includePagination) {
    movementQuery.skip((page - 1) * limit).limit(limit);
  }

  const [movements, total] = await Promise.all([
    movementQuery,
    InventoryLog.countDocuments(movementFilter),
  ]);

  return {
    range: { from: fromDate, to: toDate },
    movements,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    filter: {
      movementType: query.movementType || "",
      productId: query.productId || "",
      category: query.category || "",
      search: query.search || "",
      sortBy: query.sortBy || "createdAt",
      sortOrder: query.sortOrder || "desc",
    },
  };
};

export const getSalesReport = async (req, res) => {
  try {
    const { fromDate, toDate } = parseDateRange(req.query.from, req.query.to);
    const { page, limit } = parsePagination(req.query.page, req.query.limit);
    const salesSort = parseSort(
      req.query.sortBy,
      req.query.sortOrder,
      ["paidAt", "totalPrice", "createdAt"],
      "paidAt",
    );

    const match = buildSalesMatchFilter({
      fromDate,
      toDate,
      search: req.query.search,
      paymentMethod: req.query.paymentMethod,
    });

    const [summaryAgg, topProductsAgg, topCategoriesAgg, orders, total] =
      await Promise.all([
        Order.aggregate([
          { $match: match },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalPrice" },
              totalOrders: { $sum: 1 },
              totalItemsSold: { $sum: { $sum: "$orderItems.quantity" } },
            },
          },
        ]),
        Order.aggregate([
          { $match: match },
          { $unwind: "$orderItems" },
          {
            $group: {
              _id: "$orderItems.product",
              name: { $first: "$orderItems.name" },
              quantity: { $sum: "$orderItems.quantity" },
              revenue: {
                $sum: {
                  $multiply: ["$orderItems.quantity", "$orderItems.price"],
                },
              },
            },
          },
          { $sort: { quantity: -1 } },
          { $limit: 10 },
        ]),
        Order.aggregate([
          { $match: match },
          { $unwind: "$orderItems" },
          {
            $lookup: {
              from: "products",
              localField: "orderItems.product",
              foreignField: "_id",
              as: "productDoc",
            },
          },
          { $unwind: "$productDoc" },
          {
            $group: {
              _id: "$productDoc.category",
              quantity: { $sum: "$orderItems.quantity" },
              revenue: {
                $sum: {
                  $multiply: ["$orderItems.quantity", "$orderItems.price"],
                },
              },
            },
          },
          { $sort: { quantity: -1 } },
          { $limit: 10 },
        ]),
        Order.find(match)
          .sort(salesSort)
          .skip((page - 1) * limit)
          .limit(limit)
          .select(
            "confirmationNumber customer itemsPrice taxPrice shippingPrice totalPrice paidAt paymentMethod createdAt",
          ),
        Order.countDocuments(match),
      ]);

    const summary = summaryAgg[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      totalItemsSold: 0,
    };

    res.json({
      range: { from: fromDate, to: toDate },
      summary,
      topProducts: topProductsAgg,
      topCategories: topCategoriesAgg,
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      filter: {
        search: req.query.search || "",
        paymentMethod: req.query.paymentMethod || "",
        sortBy: req.query.sortBy || "paidAt",
        sortOrder: req.query.sortOrder || "desc",
      },
    });
  } catch (error) {
    console.error("Error in getSalesReport:", error.message);
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const getInventoryMovementsReport = async (req, res) => {
  try {
    const data = await getMovementReportData(req.query, {
      includePagination: true,
    });

    res.json(data);
  } catch (error) {
    console.error("Error in getInventoryMovementsReport:", error.message);
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const exportSalesReportCsv = async (req, res) => {
  try {
    const { fromDate, toDate } = parseDateRange(req.query.from, req.query.to);
    const match = buildSalesMatchFilter({
      fromDate,
      toDate,
      search: req.query.search,
      paymentMethod: req.query.paymentMethod,
    });
    const salesSort = parseSort(
      req.query.sortBy,
      req.query.sortOrder,
      ["paidAt", "totalPrice", "createdAt"],
      "paidAt",
    );

    const orders = await Order.find(match).sort(salesSort);

    const csvRows = [
      [
        "orderId",
        "confirmationNumber",
        "paidAt",
        "customerName",
        "customerEmail",
        "itemsPrice",
        "taxPrice",
        "shippingPrice",
        "totalPrice",
      ].join(","),
      ...orders.map((order) =>
        [
          order._id,
          order.confirmationNumber,
          order.paidAt?.toISOString() || "",
          `"${(order.customer?.name || "").replace(/"/g, '""')}"`,
          `"${(order.customer?.email || "").replace(/"/g, '""')}"`,
          order.itemsPrice,
          order.taxPrice,
          order.shippingPrice,
          order.totalPrice,
        ].join(","),
      ),
    ];

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="sales-report-${Date.now()}.csv"`,
    );

    res.status(200).send(csvRows.join("\n"));
  } catch (error) {
    console.error("Error in exportSalesReportCsv:", error.message);
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const exportInventoryMovementsCsv = async (req, res) => {
  try {
    const data = await getMovementReportData(req.query, {
      includePagination: false,
    });
    const movements = data.movements;

    const csvRows = [
      [
        "createdAt",
        "productId",
        "productName",
        "category",
        "movementType",
        "quantity",
        "beforeQuantity",
        "afterQuantity",
        "orderId",
        "reason",
      ].join(","),
      ...movements.map((movement) =>
        [
          movement.createdAt?.toISOString() || "",
          movement.product?._id || "",
          `"${(movement.product?.name || "").replace(/"/g, '""')}"`,
          `"${(movement.product?.category || "").replace(/"/g, '""')}"`,
          movement.movementType,
          movement.quantity,
          movement.beforeQuantity,
          movement.afterQuantity,
          movement.order || "",
          `"${(movement.reason || "").replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ];

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="inventory-movements-${Date.now()}.csv"`,
    );

    res.status(200).send(csvRows.join("\n"));
  } catch (error) {
    console.error("Error in exportInventoryMovementsCsv:", error.message);
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};
