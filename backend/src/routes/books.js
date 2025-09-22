import express from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import { getAllBooks, getBookById, createBookHandler, patchBookStatus } from '../controllers/bookController.js';

const router = express.Router();

// GET /books
router.get('/', getAllBooks);

// GET /books/:book_id
router.get('/:book_id', getBookById);

// POST /books (admin)
router.post('/', auth, requireRole('admin'), createBookHandler);

// PATCH /books/:book_id/status (admin)
router.patch('/:book_id/status', auth, requireRole('admin'), patchBookStatus);

export default router;