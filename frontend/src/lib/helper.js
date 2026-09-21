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

/**
 * Redimensiona y comprime una imagen antes de convertirla a Base64
 * Mantiene transparencia si es PNG o WebP. Reduce tamaño para Vercel.
 */
export function compressImageToBase64(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Si la imagen original soporta transparencia (png o webp), usamos PNG
        // para garantizar 100% que los fondos no se vuelvan negros.
        let outputFormat = "image/jpeg";
        let outputQuality = quality;

        if (file.type === "image/png" || file.type === "image/webp") {
          outputFormat = "image/png";
          // PNG no usa el parámetro de calidad, pero respetará la transparencia del canvas
          outputQuality = undefined;
        }

        const compressedBase64 = canvas.toDataURL(outputFormat, outputQuality);
        resolve(compressedBase64);
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function calculateCartTotals(cartItems) {
  const itemsPrice = cartItems.reduce((total, item) => {
    const { discountedPrice } = getDiscountedPrice(
      item.price,
      item.discountPercentage,
    );
    return total + discountedPrice * item.quantity;
  }, 0);

  const shippingPrice = itemsPrice > 100 ? 0 : SHIPPING_COST;
  let totalPrice = itemsPrice + shippingPrice;
  const taxPrice = totalPrice * IVA_RATE;
  totalPrice += taxPrice;

  return {
    subtotal: itemsPrice,
    tax: taxPrice,
    shipping: shippingPrice,
    total: totalPrice,
  };
}

export function formatLongDateToString(date, time = false) {
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    ...(time && { hour: "2-digit", minute: "2-digit" }),
  }).format(date);
}

export function formatShortDateToString(date, time = false) {
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(time && { hour: "2-digit", minute: "2-digit" }),
  }).format(date);
}

export function highlightStyleWhenIdMatchesOnScroll(id) {
  const element = document.getElementById(id);

  if (!element) return;
  const rect = element.getBoundingClientRect();
  const isInView =
    rect.top >= 0 &&
    rect.bottom <=
    (window.innerHeight || document.documentElement.clientHeight);

  if (isInView)
    document.querySelectorAll(".menu-item").forEach((el) => {
      el.classList.remove("text-amber-600", "font-semibold", "text-gray-700");
      if (el.getAttribute("href") === `#${id}`) {
        el.classList.add("text-amber-600", "font-semibold");
      }
    });
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

export function getDiscountedPrice(price, discountPercentage) {
  const hasDiscount = discountPercentage && discountPercentage > 0;

  const discountedPrice = discountPercentage
    ? price - price * (discountPercentage / 100)
    : price;

  return { hasDiscount, discountedPrice, price };
}

export const MODAL_SIZES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
  full: "max-w-full",
};

export const MODAL_BUTTONS = {
  delete: "Eliminar",
  success: "Guardar",
  warning: "Confirmar",
  cancel: "Cancelar",
  close: "Cerrar",
};

export const COUNTRY_LIST = [
  { value: "MX", label: "México", supportsStripe: true },
  { value: "US", label: "Estados Unidos", supportsStripe: true },
  {
    value: "HT",
    label: "Haití",
    supportsStripe: false,
  },
  { value: "DO", label: "República Dominicana", supportsStripe: false },
  { value: "CA", label: "Canadá", supportsStripe: true },
  { value: "BR", label: "Brasil", supportsStripe: true },
  { value: "CL", label: "Chile", supportsStripe: true },
];

export const CART = {
  PAYMENT_METHODS: [
    {
      id: 2,
      name: "PayPal",
      description: "Paga de forma segura a través de tu cuenta PayPal.",
      img: "/images/payments/paypal-icon.webp",
    },
    {
      id: 3,
      name: "Mercado Pago",
      description:
        "Utiliza Mercado Pago para una experiencia de pago rápida y segura.",
      img: "/images/payments/mercadopago-icon.webp",
    },
    {
      id: 4,
      name: "Stripe",
      description: "Paga con tarjeta de crédito o débito a través de Stripe.",
      img: "/images/payments/stripe-icon.webp",
    },
    {
      id: 5,
      name: "Apple Pay",
      description: "Paga de forma rápida y segura con Apple Pay.",
      img: "/images/payments/applepay-icon.webp",
    },
  ],
  STEPS: {
    CART_INFO: "CART_INFO",
    PAYMENT: "PAYMENT",
  },
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

export const PAYMENT_STATUS = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
};

export const SORT_BY_OPTIONS = [
  { value: "", label: "Todos los productos" },
  { value: "priceAsc", label: "Precio: Bajo a Alto" },
  { value: "priceDesc", label: "Precio: Alto a Bajo" },
  { value: "newest", label: "Novedades" },
];

export const IVA_RATE = 0.16;
export const SHIPPING_COST = 16.0;

export const getOptimizedCloudinaryUrl = (url, width = 800) => {
  if (!url?.includes("res.cloudinary.com")) return url;
  if (url.includes("/upload/f_auto")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
};
