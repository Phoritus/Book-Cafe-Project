// Simple environment variable presence checker
// Fails fast if any required variable is missing
export function verifyRequiredEnv(required = []) {
  const missing = [];
  for (const key of required) {
    if (!process.env[key] || process.env[key].trim() === '') missing.push(key);
  }
  if (missing.length) {
    const msg = `[ENV] Missing required environment variables: ${missing.join(', ')}`;
    console.error(msg);
    return { ok: false, missing };
  }
  return { ok: true };
}

export const DEFAULT_REQUIRED_ENV = [
  'MYSQL_HOST',
  'MYSQL_USER',
  'MYSQL_PASSWORD',
  'MYSQL_DATABASE',
  'JWT_ACCESS_SECRET',
  'MAIL_USER',
  'MAIL_PASS'
];
