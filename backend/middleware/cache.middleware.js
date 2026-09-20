import NodeCache from "node-cache";

// Initialize cache with standard configuration
// stdTTL: Default time to live in seconds.
const cache = new NodeCache();

/**
 * Middleware para cachear respuestas HTTP
 * @param {number} durationInSeconds - Tiempo que durará la caché
 */
export const cacheRoute = (durationInSeconds) => {
  return (req, res, next) => {
    // Solo cacheamos peticiones GET
    if (req.method !== "GET") {
      return next();
    }

    // La llave del caché será la URL completa con sus queries
    const key = req.originalUrl;
    
    // Si la respuesta ya existe en caché, devolverla inmediatamente
    const cachedResponse = cache.get(key);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Si no existe, interceptamos la función res.json nativa
    const originalJson = res.json.bind(res);
    
    res.json = (body) => {
      // Guardar la respuesta en caché
      cache.set(key, body, durationInSeconds);
      // Continuar con el envío real
      originalJson(body);
    };

    next();
  };
};

export const clearCache = (keyPattern) => {
  const keys = cache.keys();
  if (keyPattern) {
    const keysToDelete = keys.filter(k => k.includes(keyPattern));
    cache.del(keysToDelete);
  } else {
    cache.flushAll();
  }
};
