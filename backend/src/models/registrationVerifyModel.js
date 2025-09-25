import { query } from '../config/db.js';

// NOTE: Table names normalized to lowercase snake_case.
// This model manages transient registration verification codes.

// Upsert a verification code for an email
export async function upsertRegistrationCode(email, code, expiresAt) {
  const sql = `INSERT INTO registration_verify (email, code, expiresAt)
               VALUES (?, ?, ?)
               ON DUPLICATE KEY UPDATE code = VALUES(code), expiresAt = VALUES(expiresAt)`;
  await query(sql, [email, code, expiresAt]);
}

export async function getRegistrationCode(email) {
  const [rows] = await query('SELECT email, code, expiresAt FROM registration_verify WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

export async function consumeRegistrationCode(email) {
  await query('DELETE FROM registration_verify WHERE email = ?', [email]);
}

export async function purgeExpiredRegistrationCodes() {
  await query('DELETE FROM registration_verify WHERE expiresAt < NOW()');
}

export async function deleteVerificationEntry(email) {
  await query('UPDATE person SET verifyCode = NULL WHERE email = ?', [email]);
}