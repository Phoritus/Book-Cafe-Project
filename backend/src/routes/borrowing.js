import express from 'express';
import { borrowHandler, returnHandler, listBorrowingHandler, listActiveBorrowingsHandler } from '../controllers/borrowingController.js';

const router = express.Router();

// POST /borrowing/borrow
router.post('/borrow', borrowHandler);

// POST /borrowing/return
router.post('/return', returnHandler);

// GET /borrowing?citizen_id=xxxx (if admin maybe allow any citizen)
router.get('/', listBorrowingHandler);

// GET /borrowing/active - list all currently borrowed (not yet returned)
router.get('/active', listActiveBorrowingsHandler);

export default router;
