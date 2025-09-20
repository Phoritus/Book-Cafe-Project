import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me';
const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TTL = process.env.REFRESH_TOKEN_TTL || '7d';

/**
 * Sign Access Token
 * @param {object} payload
 * @param {object} [options]
 * @returns {string}
 */
export function signAccessToken(payload, options = {}) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL, ...options });
}

/**
 * Sign Refresh Token
 * @param {object} payload
 * @param {object} [options]
 * @returns {string}
 */
export function signRefreshToken(payload, options = {}) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL, ...options });
}

/**
 * Verify Access Token
 * @param {string} token
 * @returns {object} decoded
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

/**
 * Verify Refresh Token
 * @param {string} token
 * @returns {object} decoded
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

/**
 * Decode token without verifying signature (use cautiously)
 * @param {string} token
 */
export function decodeToken(token) {
  return jwt.decode(token, { complete: false });
}

export const jwtConfig = {
  ACCESS_TTL,
  REFRESH_TTL
};