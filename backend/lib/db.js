import mongoose from "mongoose";
import logger from "./logger.js";

import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Detectar si estamos en un entorno serverless (Vercel, AWS Lambda, etc.)
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);

// Cache global para reutilizar la conexión entre ejecuciones (cold/warm starts)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // 1. Si ya está conectado, retornar inmediatamente (0ms)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // 2. Si ya hay una conexión resuelta en caché
  if (cached.conn) {
    return cached.conn;
  }

  // 3. Si no hay promesa de conexión en progreso, crear una
  if (!cached.promise) {
    const opts = {
      // En serverless el pool debe ser pequeño (máx 2-5) para no saturar Atlas
      // En servidor tradicional puede ser más grande (10)
      maxPoolSize: isServerless ? 3 : 10,
      // Fallar rápido si Mongo no responde (5s en vez de 30s) para evitar timeouts en Serverless
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((m) => {
      logger.info("MongoDB connected successfully");
      return m.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null; // Limpiar para permitir reintento en el siguiente request
    logger.error("MongoDB connection error:", error.message);
    // NUNCA llamar process.exit(1) aquí; se lanza el error para manejarlo según el entorno
    throw error;
  }
};

export default connectDB;
