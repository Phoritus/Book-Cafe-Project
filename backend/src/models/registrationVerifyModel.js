import { query } from '../config/db.js';

// Upsert a verification code for an email
export async function upsertRegistrationCode(email, code, expiresAt) {
  const sql = `INSERT INTO Registration_Verify (email, code, expiresAt)
               VALUES (?, ?, ?)
               ON DUPLICATE KEY UPDATE code = VALUES(code), expiresAt = VALUES(expiresAt)`;
  await query(sql, [email, code, expiresAt]);
}

export async function getRegistrationCode(email) {
  const [rows] = await query('SELECT email, code, expiresAt FROM Registration_Verify WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

export async function consumeRegistrationCode(email) {
  await query('DELETE FROM Registration_Verify WHERE email = ?', [email]);
}

export async function purgeExpiredRegistrationCodes() {
  await query('DELETE FROM Registration_Verify WHERE expiresAt < NOW()');
}

export async function deleteVerificationEntry(email) {
  await query('UPDATE Person SET verifyCode = NULL WHERE email = ?', [email]);
}