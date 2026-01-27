export function formatCurrency(amount, locale = "es-MX", currency = "MXN") {
  return (
    Intl.NumberFormat(locale || navigator.language, {
      style: "currency",
      currency,
    }).format(amount) + " MXN"
  );
}

export function base64ToFile(base64String, filename) {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1]; // extrae el tipo MIME
  const bstr = atob(arr[1]); // decodifica base64
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export function calculateCartTotals(
  cartItems,
  ivaRate = 0.19,
  shippingCost = 19.0,
) {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const tax = subtotal * ivaRate;
  const shipping = cartItems.length > 0 ? shippingCost : 0;
  const total = subtotal + tax + shipping;
  return { subtotal, tax, shipping, total };
}

export function formatLongDateToString(date, time = false) {
  return new Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
    month: "long",
    day: "2-digit",
    ...(time && { hour: "2-digit", minute: "2-digit" }),
  }).format(date);
}

export function formatShortDateToString(date, time = false) {
  return new Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(time && { hour: "2-digit", minute: "2-digit" }),
  }).format(date);
}

export function updateSearchParams(key, value, searchParams, setSearchParams) {
  const params = new URLSearchParams(searchParams);
  if (value) params.set(key, value);
  else params.delete(key);
  setSearchParams(params);
}

export function getFirstAndLastDayOfMonth(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return { firstDay, lastDay };
}

export function getMinAndMaxDates(dates) {
  if (dates.length === 0) return { minDate: null, maxDate: null };

  let minDate = new Date(dates[0]);
  let maxDate = new Date(dates[0]);
  dates.forEach((dateStr) => {
    const date = new Date(dateStr);
    if (date < minDate) minDate = date;
    if (date > maxDate) maxDate = date;
  });

  return { minDate, maxDate };
}

export const CART = {
  PAYMENT_METHODS: [
    {
      id: 2,
      name: "PayPal",
      description: "Paga de forma segura a través de tu cuenta PayPal.",
      img: "/images/payments/paypal-icon.png",
    },
    {
      id: 3,
      name: "MercadoPago",
      description:
        "Utiliza MercadoPago para una experiencia de pago rápida y segura.",
      img: "/images/payments/mercadopago-icon.png",
    },
    {
      id: 4,
      name: "Stripe",
      description: "Paga con tarjeta de crédito o débito a través de Stripe.",
      img: "/images/payments/stripe-icon.png",
    },
  ],
  STEPS: {
    CART_INFO: "CART_INFO",
    PAYMENT: "PAYMENT",
  },
};

export const SORT_BY_OPTIONS = [
  { value: "", label: "Todos los productos" },
  { value: "priceAsc", label: "Precio: Bajo a Alto" },
  { value: "priceDesc", label: "Precio: Alto a Bajo" },
  { value: "newest", label: "Novedades" },
];
