import { query } from '../config/db.js';
import { hashPassword } from '../utils/password.js';

// Person model functions align with current schema (person_id, firstname, lastname, etc.)

export async function createPerson({ firstname, lastname, nameTitle = null, phone = null, password, dateOfBirth = null, citizen_id = null, email, verifyCode = null, role = 'user' }) {
  const hashed = await hashPassword(password);
  const sql = `INSERT INTO person (firstname, lastname, nameTitle, phone, password, dateOfBirth, citizen_id, email, verifyCode, role)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [firstname, lastname, nameTitle, phone, hashed, dateOfBirth, citizen_id, email, verifyCode, role];
  const [result] = await query(sql, params);
  return { person_id: result.insertId, firstname, lastname, email, role };
}

export async function findByEmail(email) {
  const [rows] = await query('SELECT * FROM person WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

export async function findById(person_id) {
  const [rows] = await query('SELECT * FROM person WHERE person_id = ? LIMIT 1', [person_id]);
  return rows[0] || null;
}

export async function findByCitizenId(citizen_id) {
  const [rows] = await query('SELECT * FROM person WHERE citizen_id = ? LIMIT 1', [citizen_id]);
  return rows[0] || null;
}

export async function updateVerifyCode(person_id, code) {
  await query('UPDATE person SET verifyCode = ? WHERE person_id = ?', [code, person_id]);
}

// Change email flow support (stores pending new email + code + expiry)
export async function setPendingEmail(person_id, newEmail, code, expiresAt) {
  await query('UPDATE person SET new_email = ?, verifyCode = ?, verifyCodeExpires = ? WHERE person_id = ?', [newEmail, code, expiresAt, person_id]);
}

export async function findByPendingEmail(newEmail) {
  const [rows] = await query('SELECT * FROM person WHERE new_email = ? LIMIT 1', [newEmail]);
  return rows[0] || null;
}

export async function clearPendingEmail(person_id) {
  await query('UPDATE person SET email = new_email, new_email = NULL, verifyCode = NULL, verifyCodeExpires = NULL WHERE person_id = ? AND new_email IS NOT NULL', [person_id]);
}

export async function findByIdWithPending(person_id) {
  const [rows] = await query('SELECT person_id, email, new_email, verifyCode, verifyCodeExpires FROM person WHERE person_id = ? LIMIT 1', [person_id]);
  return rows[0] || null;
}

export async function updatePassword(person_id, newPlainPassword) {
  const hashed = await hashPassword(newPlainPassword);
  await query('UPDATE person SET password = ? WHERE person_id = ?', [hashed, person_id]);
}

// Dynamic profile update (only allowed fields). Returns updated row without password.
export async function updatePersonProfile(person_id, fields) {
  if (!fields || typeof fields !== 'object') return null;
  const allowed = ['firstname','lastname','nameTitle','phone','dateOfBirth','citizen_id'];
  const sets = [];
  const params = [];
  for (const key of allowed) {
    if (fields[key] != null && fields[key] !== '') {
      sets.push(`${key} = ?`);
      params.push(fields[key]);
    }
  }
  if (!sets.length) return null; // nothing to update
  const sql = `UPDATE person SET ${sets.join(', ')} WHERE person_id = ?`;
  params.push(person_id);
  await query(sql, params);
  // Return a safe subset of columns (exclude updated_at to avoid schema mismatch errors in some environments)
  const [rows] = await query('SELECT person_id, firstname, lastname, nameTitle, phone, dateOfBirth, citizen_id, email, role FROM person WHERE person_id = ? LIMIT 1', [person_id]);
  return rows[0] || null;
}
