import { INVENTORY_MOVEMENT_TYPES } from "../lib/constants.js";
import InventoryLog from "../models/InventoryLog.js";
import Product from "../models/Product.js";
import { maybeTriggerLowStockAlert } from "../services/inventory.service.js";

export const getLowStockProducts = async (_, res) => {
  try {
    const lowStockProducts = await Product.find({
      $expr: { $lte: ["$stockQuantity", "$lowStockThreshold"] },
      isActive: true,
    }).sort({ stockQuantity: 1, updatedAt: -1 });

    res.json(lowStockProducts);
  } catch (error) {
    console.error("Error in getLowStockProducts:", error.message);
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const getInventorySummary = async (_, res) => {
  try {
    const [summary] = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStockUnits: { $sum: "$stockQuantity" },
          lowStockCount: {
            $sum: {
              $cond: [{ $lte: ["$stockQuantity", "$lowStockThreshold"] }, 1, 0],
            },
          },
          outOfStockCount: {
            $sum: {
              $cond: [{ $lte: ["$stockQuantity", 0] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.json(
      summary || {
        totalProducts: 0,
        totalStockUnits: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
      },
    );
  } catch (error) {
    console.error("Error in getInventorySummary:", error.message);
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const getInventoryHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);

    const filter = productId ? { product: productId } : {};

    const [items, total] = await Promise.all([
      InventoryLog.find(filter)
        .populate("product", "name category")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      InventoryLog.countDocuments(filter),
    ]);

    res.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in getInventoryHistory:", error.message);
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const adjustProductStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { movementType, quantity, reason } = req.body;

    if (!Object.values(INVENTORY_MOVEMENT_TYPES).includes(movementType)) {
      return res
        .status(400)
        .json({ message: "Tipo de movimiento de inventario invalido" });
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      return res
        .status(400)
        .json({ message: "La cantidad debe ser un numero mayor a 0" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const beforeQuantity = product.stockQuantity;
    let afterQuantity = beforeQuantity;

    if (movementType === INVENTORY_MOVEMENT_TYPES.IN) {
      afterQuantity += parsedQuantity;
    } else if (movementType === INVENTORY_MOVEMENT_TYPES.OUT) {
      if (beforeQuantity < parsedQuantity) {
        return res.status(400).json({
          message: `Stock insuficiente. Stock actual: ${beforeQuantity}`,
        });
      }
      afterQuantity -= parsedQuantity;
    }

    product.stockQuantity = afterQuantity;
    await product.save();

    await InventoryLog.create({
      product: product._id,
      movementType,
      quantity: parsedQuantity,
      beforeQuantity,
      afterQuantity,
      reason: reason || "Ajuste manual de inventario",
      performedBy: req.user?._id || null,
    });

    await maybeTriggerLowStockAlert(product);

    res.json({
      message: "Stock actualizado exitosamente",
      product,
    });
  } catch (error) {
    console.error("Error in adjustProductStock:", error.message);
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};
