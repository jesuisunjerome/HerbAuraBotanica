export const PAYMENT_STATUS = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
};

export const ORDER_STATUS = {
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
  REFUNDED: "Refunded",
};

export const ALLOWED_STATUS_TRANSITIONS = {
  [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED, ORDER_STATUS.RETURNED],
  [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.RETURNED, ORDER_STATUS.REFUNDED],
  [ORDER_STATUS.RETURNED]: [ORDER_STATUS.REFUNDED],
  [ORDER_STATUS.REFUNDED]: [],
  [ORDER_STATUS.CANCELLED]: [],
};

export const CHECKOUT_STATUS = {
  PENDING: "Pending",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const INVENTORY_MOVEMENT_TYPES = {
  IN: "IN",
  OUT: "OUT",
};

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

export const COOKIE_NAME = {
  accessToken: "herbaura_access_token",
  refreshToken: "herbaura_refresh_token",
  jwtTokenInMinute: "15", // Token válido por 15 minutos
  refreshTokenInDay: "7", // Refresh token válido por 7 días
};

export const IVA = 0.16; // 16% IVA
export const SHIPPING_COST = 16.0; // Flat shipping cost
export const CLOUDINARY_PRODUCTS_FOLDER = "HerbAuraBotanica/products";
