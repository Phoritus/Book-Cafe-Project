import bcrypt from 'bcrypt';

const DEFAULT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

/**
 * Hash plain text password.
 * @param {string} plain
 * @param {number} [saltRounds]
 * @returns {Promise<string>} hashed password
 */
export function hashPassword(plain, saltRounds = DEFAULT_SALT_ROUNDS) {
  if (!plain || typeof plain !== 'string') {
    return Promise.reject(new Error('PASSWORD_INVALID_INPUT'));
  }
  return bcrypt.hash(plain, saltRounds);
}

/**
 * Compare plain vs hash
 * @param {string} plain
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function comparePassword(plain, hash) {
  if (!plain || !hash) return Promise.resolve(false);
  return bcrypt.compare(plain, hash);
}

/**
 * Validate password complexity (basic) – extend rules as needed.
 * @param {string} password
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validatePassword(password) {
  const errors = [];
  if (typeof password !== 'string' || password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain a digit');
  return { valid: errors.length === 0, errors };
}