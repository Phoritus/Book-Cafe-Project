import express from 'express';
import { auth } from '../middleware/auth.js';
import { borrowBook, returnBook, listBorrowingByCitizen } from '../models/borrowingModel.js';

const router = express.Router();

// POST /api/borrowing/borrow
router.post('/borrow', auth, async (req, res) => {
  try {
    const { book_id, citizen_id } = req.body;
    if (!book_id || !citizen_id) return res.status(400).json({ error: true, message: 'book_id & citizen_id required' });
    const records = await borrowBook({ book_id, citizen_id });
    res.status(201).json(records);
  } catch (e) {
    res.status(e.status || 500).json({ error: true, message: e.message });
  }
});

// POST /api/borrowing/return
router.post('/return', auth, async (req, res) => {
  try {
    const { record_id } = req.body;
    if (!record_id) return res.status(400).json({ error: true, message: 'record_id required' });
    await returnBook({ record_id });
    res.json({ success: true });
  } catch (e) {
    res.status(e.status || 500).json({ error: true, message: e.message });
  }
});

// GET /api/borrowing?citizen_id=xxxx (if admin maybe allow any citizen)
router.get('/', auth, async (req, res) => {
  try {
    const citizen_id = req.query.citizen_id || req.user.citizen_id || req.body.citizen_id;
    if (!citizen_id) return res.status(400).json({ error: true, message: 'citizen_id required (query)' });
    const rows = await listBorrowingByCitizen(citizen_id);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
});

export default router;
