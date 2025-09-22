import { query } from '../config/db.js';

function parseDate(str) {
  if (!str) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  return str;
}

function todayISO() { return new Date().toISOString().slice(0,10); }

function rangeToDates(range, start, end) {
  const today = new Date();
  const pad = d => d.toISOString().slice(0,10);
  if (range === 'today') { const t = pad(today); return { start: t, end: t, label: 'today' }; }
  if (range === 'week') { const e = pad(today); const s = new Date(today.getTime() - 6*86400000); return { start: pad(s), end: e, label: 'week' }; }
  if (range === 'month') { const y=today.getFullYear(); const m=today.getMonth(); const first=new Date(Date.UTC(y,m,1)); const last=new Date(Date.UTC(y,m+1,0)); return { start: pad(first), end: pad(last), label: 'month' }; }
  if (range === 'custom') { const s=parseDate(start); const e=parseDate(end); if(!s||!e) throw new Error('Invalid start/end'); if(s>e) throw new Error('start after end'); return { start:s, end:e, label:'custom' }; }
  const t = pad(today); return { start: t, end: t, label: 'today' }; }

// Borrowings by category within range (counts borrow records whose borrowTime date within [start,end])
export async function borrowingsByCategory(req, res) {
  try {
    const range = (req.query.range || 'today').toLowerCase();
    let r;
    try { r = rangeToDates(range, req.query.start, req.query.end); } catch(err) { return res.status(400).json({ error:true, message: err.message }); }
    if ((new Date(r.end) - new Date(r.start)) / 86400000 > 180) {
      return res.status(400).json({ error:true, message: 'Range too large (max 180 days)' });
    }
    const sql = `SELECT b.category AS category, COUNT(br.record_id) AS borrowings
                 FROM Borrowing_Record br
                 JOIN Book b ON b.book_id = br.book_id
                 WHERE DATE(br.borrowTime) BETWEEN ? AND ?
                 GROUP BY b.category
                 ORDER BY borrowings DESC, category
                 LIMIT 50`;
    const [rows] = await query(sql, [r.start, r.end]);
    res.json({ range: r.label, start: r.start, end: r.end, categories: rows });
  } catch (e) {
    res.status(500).json({ error:true, message: e.message });
  }
}

// Top N borrowed books in range (by borrow count) - default top 5 if limit absent
export async function topBorrowedBooks(req, res) {
  try {
    const range = (req.query.range || 'today').toLowerCase();
    let r;
    try { r = rangeToDates(range, req.query.start, req.query.end); } catch(err) { return res.status(400).json({ error:true, message: err.message }); }
    if ((new Date(r.end) - new Date(r.start)) / 86400000 > 180) {
      return res.status(400).json({ error:true, message: 'Range too large (max 180 days)' });
    }
    let limit = parseInt(req.query.limit || '5', 10);
    if (isNaN(limit) || limit < 1) limit = 5;
    if (limit > 50) limit = 50;
    const sql = `SELECT b.book_id, b.book_name, b.category, COUNT(br.record_id) AS borrowings
                 FROM Borrowing_Record br
                 JOIN Book b ON b.book_id = br.book_id
                 WHERE DATE(br.borrowTime) BETWEEN ? AND ?
                 GROUP BY b.book_id, b.book_name, b.category
                 HAVING borrowings > 0
                 ORDER BY borrowings DESC, b.book_name
                 LIMIT ${limit}`; // safe because limit sanitized numeric
    const [rows] = await query(sql, [r.start, r.end]);
    res.json({ range: r.label, start: r.start, end: r.end, limit, books: rows });
  } catch (e) {
    res.status(500).json({ error:true, message: e.message });
  }
}

export default { borrowingsByCategory, topBorrowedBooks };