import { query } from '../config/db.js';
import { getBook, updateBookStatus } from './bookModel.js';

export async function borrowBook({ book_id, citizen_id }) {
  // Validate book only
  const book = await getBook(book_id);
  if (!book) {
    const err = new Error('Book not found');
    err.status = 404;
    throw err;
  }

  const [activeBorrow] = await query(
    `SELECT 1 FROM borrowing_record WHERE book_id = ? AND returnTime IS NULL LIMIT 1`,
    [book_id]
  );
  if (activeBorrow.length > 0) {
    const err = new Error('Book already borrowed');
    err.status = 409;
    throw err;
  }

  // No longer require citizen to exist in person table; treat citizen_id as external ID
  const insertSql = `INSERT INTO borrowing_record (book_id, citizen_id) VALUES (?, ?)`;
  await query(insertSql, [book_id, citizen_id]);
  await updateBookStatus(book_id, 'borrowed');
  return await listBorrowingByCitizen(citizen_id);
}

export async function returnBook({ record_id }) {
  // Find record
  const [rows] = await query('SELECT * FROM borrowing_record WHERE record_id = ? LIMIT 1', [record_id]);
  const record = rows[0];
  if (!record) {
    const err = new Error('Borrowing record not found');
    err.status = 404;
    throw err;
  }
  if (record.returnTime) {
    const err = new Error('Already returned');
    err.status = 409;
    throw err;
  }

  await query('UPDATE borrowing_record SET returnTime = NOW() WHERE record_id = ?', [record_id]);
  // Check if any other active borrowing for this book exists; if none -> mark available
  const [stillBorrowed] = await query('SELECT 1 FROM borrowing_record WHERE book_id = ? AND returnTime IS NULL LIMIT 1', [record.book_id]);
  if (stillBorrowed.length === 0) {
    await updateBookStatus(record.book_id, 'available');
  }
  return true;
}

export async function listBorrowingByCitizen(citizen_id) {
  const sql = `
    SELECT br.record_id, br.book_id,
           br.citizen_id AS citizen_id,
           br.borrowTime, br.returnTime,
           b.book_name, b.book_status, b.category
    FROM borrowing_record br
    LEFT JOIN book b ON b.book_id = br.book_id
    WHERE br.citizen_id = ?
      AND br.returnTime IS NULL
    ORDER BY br.borrowTime DESC`;
  const [rows] = await query(sql, [citizen_id]);
  return rows;
}

export async function listActiveBorrowings() {
  const sql = `
    SELECT br.record_id, br.book_id,
           br.citizen_id AS citizen_id,
           br.borrowTime,
           b.book_name, b.book_status, b.category
    FROM borrowing_record br
    LEFT JOIN book b ON b.book_id = br.book_id
    WHERE br.returnTime IS NULL
    ORDER BY br.borrowTime DESC`;
  const [rows] = await query(sql);
  return rows;
}
