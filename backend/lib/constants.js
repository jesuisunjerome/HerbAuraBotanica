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
};

export const CHECKOUT_STATUS = {
  PENDING: "Pending",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
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
