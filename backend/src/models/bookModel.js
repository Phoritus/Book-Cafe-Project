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