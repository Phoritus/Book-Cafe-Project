import express from 'express';
import { listBooks, getBook, createBook, updateBookStatus } from '../models/bookModel.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/books
router.get('/', async (req, res) => {
  const books = await listBooks();
  res.json(books);
});

// GET /api/books/:book_id
router.get('/:book_id', async (req, res) => {
  const book = await getBook(req.params.book_id);
  if (!book) return res.status(404).json({ error: true, message: 'Not found' });
  res.json(book);
});

// POST /api/books (admin)
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const { book_id, book_name, category } = req.body;
    if (!book_id || !book_name) return res.status(400).json({ error: true, message: 'book_id & book_name required' });
    const created = await createBook({ book_id, book_name, category });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
});

// PATCH /api/books/:book_id/status (admin)
router.patch('/:book_id/status', auth, requireRole('admin'), async (req, res) => {
  try {
    const { book_id } = req.params;
    const { book_status } = req.body;
    const updated = await updateBookStatus(book_id, book_status);
    if (!updated) return res.status(404).json({ error: true, message: 'Book not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
});

export default router;
