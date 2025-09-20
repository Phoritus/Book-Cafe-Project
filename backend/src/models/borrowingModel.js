import { query } from '../config/db.js';
import { getBook, updateBookStatus } from './bookModel.js';
import { findByCitizenId } from './personModel.js';

export async function borrowBook({ book_id, citizen_id }) {
  // Validate existence
  const book = await getBook(book_id);
  if (!book) {
    const err = new Error('Book not found');
    err.status = 404;
    throw err;
  }
  if (book.book_status === 'borrowed') {
    const err = new Error('Book already borrowed');
    err.status = 409;
    throw err;
  }

  const person = await findByCitizenId(citizen_id);
  if (!person) {
    const err = new Error('Person (citizen) not found');
    err.status = 404;
    throw err;
  }

  // Insert record
  const sql = `INSERT INTO Borrowing_Record (book_id, citizen_id) VALUES (?, ?)`;
  await query(sql, [book_id, citizen_id]);
  await updateBookStatus(book_id, 'borrowed');
  return await listBorrowingByCitizen(citizen_id);
}

export async function returnBook({ record_id }) {
  // Find record
  const [rows] = await query('SELECT * FROM Borrowing_Record WHERE record_id = ? LIMIT 1', [record_id]);
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

  await query('UPDATE Borrowing_Record SET returnTime = NOW() WHERE record_id = ?', [record_id]);
  // Check if any other active borrowing for this book exists; if none -> mark available
  const [stillBorrowed] = await query('SELECT 1 FROM Borrowing_Record WHERE book_id = ? AND returnTime IS NULL LIMIT 1', [record.book_id]);
  if (stillBorrowed.length === 0) {
    await updateBookStatus(record.book_id, 'available');
  }
  return true;
}

export async function listBorrowingByCitizen(citizen_id) {
  const [rows] = await query('SELECT * FROM Borrowing_Record WHERE citizen_id = ? ORDER BY borrowTime DESC', [citizen_id]);
  return rows;
}
