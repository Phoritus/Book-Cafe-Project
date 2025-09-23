import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables (force path relative to project root or backend folder)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// backend/src/config -> go up two levels to backend
const backendRoot = path.resolve(__dirname, '..', '..');
dotenv.config({ path: path.join(backendRoot, '.env') });

// Helper: read env with fallback list
function env(name, fallbacks = [], defaultValue = undefined) {
  const keys = [name, ...fallbacks];
  for (const k of keys) {
    const v = process.env[k];
    if (v !== undefined && v !== '') return v;
  }
  return defaultValue;
}

const DB_HOST = env('MYSQL_HOST', ['DB_HOST']);
const DB_USER = env('MYSQL_USER', ['DB_USER']);
const DB_PASSWORD = env('MYSQL_PASSWORD', ['DB_PASSWORD']);
const DB_NAME = env('MYSQL_DATABASE', ['DB_NAME']);
const DB_PORT = parseInt(env('MYSQL_PORT', ['DB_PORT'], '3306'), 10);

// Debug log (non-sensitive)
if (process.env.DEBUG_DB === 'true') {
  console.log('[DB][DEBUG] Loaded env:', { DB_HOST, DB_USER, DB_NAME, DB_PORT });
}

if (!DB_USER || !DB_NAME) {
  console.warn('[DB] Missing required env variables (MYSQL_USER / MYSQL_DATABASE). Current values:', { DB_USER, DB_NAME });
}

export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4_general_ci'
});

export async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    console.log('[DB] Connection OK', rows[0]);
  } catch (err) {
    console.error('[DB] Connection FAILED:', err.message);
    throw err;
  }
}
// Generic query helper (use this in models):
//   const [rows] = await query('SELECT * FROM person WHERE person_id = ?', [id]);
export async function query(sql, params = []) {
  return pool.execute(sql, params);
}
