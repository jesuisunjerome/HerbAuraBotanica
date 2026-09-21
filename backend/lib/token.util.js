import crypto from "node:crypto";

/**
 * Creates a SHA-256 hash of the given token.
 * @param {string} token - The token to hash.
 * @returns {string} The hashed token in hex format.
 */
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
