import { INVENTORY_MOVEMENT_TYPES } from "../lib/constants.js";
import Product from "../models/Product.js";
import InventoryLog from "../models/InventoryLog.js";
import { sendLowStockAlertEmail } from "./email.service.js";

const LOW_STOCK_ALERT_COOLDOWN_HOURS = Number(
  process.env.LOW_STOCK_ALERT_COOLDOWN_HOURS || 8,
);

const shouldSendLowStockAlert = (product) => {
  if (product.stockQuantity > product.lowStockThreshold) {
    return false;
  }

  if (!product.lastLowStockAlertAt) {
    return true;
  }

  const elapsedMs =
    Date.now() - new Date(product.lastLowStockAlertAt).getTime();
  const cooldownMs = LOW_STOCK_ALERT_COOLDOWN_HOURS * 60 * 60 * 1000;

  return elapsedMs >= cooldownMs;
};

export const maybeTriggerLowStockAlert = async (product) => {
  if (!shouldSendLowStockAlert(product)) {
    return;
  }

  await sendLowStockAlertEmail({
    name: product.name,
    stockQuantity: product.stockQuantity,
    lowStockThreshold: product.lowStockThreshold,
  });

  product.lastLowStockAlertAt = new Date();
  await product.save();
};

export const applyInventoryForPaidOrder = async (order) => {
  if (order.inventoryProcessed) {
    return order;
  }

  const adjustedItems = [];

  try {
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        throw new Error(`Producto no encontrado: ${item.name}`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new Error(`Stock insuficiente para ${item.name}`);
      }

      const beforeQuantity = product.stockQuantity;
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,
          stockQuantity: { $gte: item.quantity },
        },
        {
          $inc: { stockQuantity: -item.quantity },
        },
        { new: true },
      );

      if (!updatedProduct) {
        throw new Error(`No se pudo descontar stock para ${item.name}`);
      }

      adjustedItems.push({
        productId: item.product,
        quantity: item.quantity,
      });

      await InventoryLog.create({
        product: item.product,
        order: order._id,
        movementType: INVENTORY_MOVEMENT_TYPES.OUT,
        quantity: item.quantity,
        beforeQuantity,
        afterQuantity: updatedProduct.stockQuantity,
        reason: `Salida por venta orden ${order.confirmationNumber}`,
      });

      await maybeTriggerLowStockAlert(updatedProduct);
    }

    order.inventoryProcessed = true;
    order.inventoryProcessedAt = new Date();
    order.inventoryReverted = false;
    order.inventoryRevertedAt = null;

    await order.save();

    return order;
  } catch (error) {
    if (adjustedItems.length > 0) {
      await Promise.all(
        adjustedItems.map(({ productId, quantity }) =>
          Product.findByIdAndUpdate(productId, {
            $inc: { stockQuantity: quantity },
          }),
        ),
      );
    }

    throw error;
  }
};

export const restoreInventoryForCancelledOrder = async (
  order,
  userId = null,
) => {
  if (!order.inventoryProcessed || order.inventoryReverted) {
    return order;
  }

  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      continue;
    }

    const beforeQuantity = product.stockQuantity;
    product.stockQuantity += item.quantity;
    await product.save();

    await InventoryLog.create({
      product: item.product,
      order: order._id,
      movementType: INVENTORY_MOVEMENT_TYPES.IN,
      quantity: item.quantity,
      beforeQuantity,
      afterQuantity: product.stockQuantity,
      reason: `Reposicion por cancelacion orden ${order.confirmationNumber}`,
      performedBy: userId,
    });
  }

  order.inventoryReverted = true;
  order.inventoryRevertedAt = new Date();
  await order.save();

  return order;
};
