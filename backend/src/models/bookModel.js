import { query } from '../config/db.js';

export async function listBooks() {
  const [rows] = await query('SELECT * FROM book ORDER BY book_name');
  return rows;
}

export async function getBook(book_id) {
  const [rows] = await query('SELECT * FROM book WHERE book_id = ? LIMIT 1', [book_id]);
  return rows[0] || null;
}

export async function createBook({ book_id, book_name, category = null }) {
  const sql = `INSERT INTO book (book_id, book_name, category) VALUES (?, ?, ?)`;
  await query(sql, [book_id, book_name, category]);
  return await getBook(book_id);
}

export async function updateBookStatus(book_id, book_status) {
  await query('UPDATE book SET book_status = ? WHERE book_id = ?', [book_status, book_id]);
  return await getBook(book_id);
}

// Update editable metadata fields (book_name, category). Ignore undefined values.
export async function updateBookMeta(book_id, { book_name, category }) {
  const sets = [];
  const params = [];
  if (book_name != null && book_name !== '') {
    sets.push('book_name = ?');
    params.push(book_name);
  }
  if (category !== undefined) { // allow null to clear category
    sets.push('category = ?');
    params.push(category === '' ? null : category);
  }
  if (!sets.length) return await getBook(book_id); // nothing to change
  const sql = `UPDATE book SET ${sets.join(', ')} WHERE book_id = ?`;
  params.push(book_id);
  await query(sql, params);
  return await getBook(book_id);
}

export async function deleteBook(book_id) {
  // Return deleted row for confirmation (fetch first then delete)
  const existing = await getBook(book_id);
  if (!existing) return null;
  await query('DELETE FROM book WHERE book_id = ?', [book_id]);
  return existing;
}