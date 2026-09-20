import { z } from "zod";
import logger from "./logger.js";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CLIENT_URL: z.url(),
  MONGO_URI: z.url().or(z.string().startsWith("mongodb://")),
  JWT_SECRET: z.string().min(10),
  GOOGLE_CLIENT_ID: z.string(),
  // Add other required env vars here if necessary, making them optional or required as needed
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().optional(),
  EMAIL_USER: z.email().optional(),
  GOOGLE_APP_PASSWORD: z.string().optional(),
});

try {
  envSchema.parse(process.env);
} catch (err) {
  logger.error("Error validando las variables de entorno:");
  err.errors.forEach((e) => {
    logger.error(`- ${e.path.join(".")}: ${e.message}`);
  });
  process.exit(1);
}
