import express from 'express';
import { auth } from '../middleware/auth.js';
import { borrowHandler, returnHandler, listBorrowingHandler } from '../controllers/borrowingController.js';

const router = express.Router();

// POST /borrowing/borrow
router.post('/borrow', auth, borrowHandler);

// POST /borrowing/return
router.post('/return', auth, returnHandler);

// GET /borrowing?citizen_id=xxxx (if admin maybe allow any citizen)
router.get('/', auth, listBorrowingHandler);

export default router;
