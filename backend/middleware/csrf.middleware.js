/**
 * Middleware to prevent CSRF attacks on API routes.
 * 
 * Since cookies might be configured with sameSite: "none", the API is vulnerable to CSRF.
 * By requiring a custom header on mutative requests (POST, PUT, PATCH, DELETE),
 * we force the browser to send a pre-flight OPTIONS request (CORS).
 * A malicious cross-site script cannot set custom headers without passing the CORS check,
 * thereby stopping CSRF effectively without needing stateful tokens.
 */
export const requireCsrfHeader = (req, res, next) => {
  // Safe methods that do not mutate state
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // Check for the presence of a custom anti-CSRF header
  const csrfHeader = req.headers["x-requested-with"] || req.headers["x-app-request"];
  
  // Webhooks from 3rd parties (like Stripe/MercadoPago) will NOT have this header,
  // but those routes usually validate signatures instead.
  // Assuming those webhooks are handled before this middleware or are excluded.
  if (req.originalUrl.startsWith("/api/payments/stripe/webhook")) {
    return next();
  }

  if (!csrfHeader) {
    return res.status(403).json({ 
      message: "Forbidden: Falta el encabezado Anti-CSRF (x-requested-with o x-app-request) necesario para esta operación mutativa." 
    });
  }

  next();
};
