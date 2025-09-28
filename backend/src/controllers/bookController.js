import { listBooks, getBook, createBook, updateBookStatus, updateBookMeta, deleteBook } from '../models/bookModel.js';

export async function getAllBooks(req, res) {
  const books = await listBooks();
  res.json(books);
}

export async function getBookById(req, res) {
  const book = await getBook(req.params.book_id);
  if (!book) return res.status(404).json({ error: true, message: 'Not found' });
  res.json(book);
}

export async function createBookHandler(req, res) {
  try {
    const { book_id, book_name, category } = req.body;
    if (!book_id || !book_name) return res.status(400).json({ error: true, message: 'book_id & book_name required' });
    const created = await createBook({ book_id, book_name, category });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}

export async function patchBookStatus(req, res) {
  try {
    const { book_id } = req.params;
    const { book_status } = req.body;
    const updated = await updateBookStatus(book_id, book_status);
    if (!updated) return res.status(404).json({ error: true, message: 'Book not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}

// PATCH /books/:book_id (metadata like name/category)
export async function patchBookMeta(req, res) {
  try {
    const { book_id } = req.params;
    const { book_name, category } = req.body || {};
    const existing = await getBook(book_id);
    if (!existing) return res.status(404).json({ error: true, message: 'Book not found' });
    if ((book_name == null || book_name === existing.book_name) && category === undefined) {
      return res.json(existing); // nothing to change
    }
    if (book_name != null && book_name === '') return res.status(400).json({ error: true, message: 'book_name cannot be empty string' });
    const updated = await updateBookMeta(book_id, { book_name, category });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}

// DELETE /books/:book_id
export async function deleteBookHandler(req, res) {
  try {
    const { book_id } = req.params;
    const deleted = await deleteBook(book_id);
    if (!deleted) return res.status(404).json({ error: true, message: 'Book not found' });
    res.json({ success: true, deleted });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}

export default { getAllBooks, getBookById, createBookHandler, patchBookStatus, patchBookMeta, deleteBookHandler };
