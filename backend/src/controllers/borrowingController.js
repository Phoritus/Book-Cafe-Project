import { borrowBook, returnBook, listBorrowingByCitizen, listActiveBorrowings } from '../models/borrowingModel.js';

export async function borrowHandler(req, res) {
  try {
    const { book_id, citizen_id } = req.body;
    if (!book_id || !citizen_id) return res.status(400).json({ error: true, message: 'book_id & citizen_id required' });
    const records = await borrowBook({ book_id, citizen_id });
    res.status(201).json(records);
  } catch (e) {
    res.status(e.status || 500).json({ error: true, message: e.message });
  }
}

export async function returnHandler(req, res) {
  try {
    const { record_id } = req.body;
    if (!record_id) return res.status(400).json({ error: true, message: 'record_id required' });
    await returnBook({ record_id });
    res.json({ success: true });
  } catch (e) {
    res.status(e.status || 500).json({ error: true, message: e.message });
  }
}

export async function listBorrowingHandler(req, res) {
  try {
    const citizen_id = req.query.citizen_id || req.user.citizen_id || req.body.citizen_id;
    if (!citizen_id) return res.status(400).json({ error: true, message: 'citizen_id required (query)' });
    const rows = await listBorrowingByCitizen(citizen_id);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}

export async function listActiveBorrowingsHandler(req, res) {
  try {
    const rows = await listActiveBorrowings();
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}

export default { borrowHandler, returnHandler, listBorrowingHandler, listActiveBorrowingsHandler };
