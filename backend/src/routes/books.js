import express from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import { getAllBooks, getBookById, createBookHandler, patchBookStatus, patchBookMeta, deleteBookHandler } from '../controllers/bookController.js';
import { validateCreateBook } from '../middleware/validate.js';

const router = express.Router();

// GET /books
router.get('/', getAllBooks);

// GET /books/:book_id
router.get('/:book_id', getBookById);

// POST /books (admin)
router.post('/', auth, requireRole('admin'), validateCreateBook, createBookHandler);

// PATCH /books/:book_id/status (admin)
router.patch('/:book_id/status', auth, requireRole('admin'), patchBookStatus);

// PATCH /books/:book_id (meta: name/category) (admin)
router.patch('/:book_id', auth, requireRole('admin'), patchBookMeta);

// DELETE /books/:book_id (admin)
router.delete('/:book_id', auth, requireRole('admin'), deleteBookHandler);

export default router;