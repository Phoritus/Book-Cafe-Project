import { query } from '../config/db.js';
import { hashPassword } from '../utils/password.js';

// Person model functions align with current schema (person_id, firstname, lastname, etc.)

export async function createPerson({ firstname, lastname, nameTitle = null, phone = null, password, dateOfBirth = null, citizen_id = null, email, verifyCode = null, role = 'user' }) {
  const hashed = await hashPassword(password);
  const sql = `INSERT INTO Person (firstname, lastname, nameTitle, phone, password, dateOfBirth, citizen_id, email, verifyCode, role)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [firstname, lastname, nameTitle, phone, hashed, dateOfBirth, citizen_id, email, verifyCode, role];
  const [result] = await query(sql, params);
  return { person_id: result.insertId, firstname, lastname, email, role };
}

export async function findByEmail(email) {
  const [rows] = await query('SELECT * FROM Person WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

export async function findById(person_id) {
  const [rows] = await query('SELECT * FROM Person WHERE person_id = ? LIMIT 1', [person_id]);
  return rows[0] || null;
}

export async function findByCitizenId(citizen_id) {
  const [rows] = await query('SELECT * FROM Person WHERE citizen_id = ? LIMIT 1', [citizen_id]);
  return rows[0] || null;
}

export async function updateVerifyCode(person_id, code) {
  await query('UPDATE Person SET verifyCode = ? WHERE person_id = ?', [code, person_id]);
}

export async function updatePassword(person_id, newPlainPassword) {
  const hashed = await hashPassword(newPlainPassword);
  await query('UPDATE Person SET password = ? WHERE person_id = ?', [hashed, person_id]);
}
