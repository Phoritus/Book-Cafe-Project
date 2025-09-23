import { query } from '../config/db.js';

function parseDate(str) {
  if (!str) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  return str;
}

function todayISO() {
  return new Date().toISOString().slice(0,10);
}

function rangeToDates(range, start, end) {
  const today = new Date();
  const pad = d => d.toISOString().slice(0,10);
  if (range === 'today') {
    const t = pad(today);
    return { start: t, end: t, label: 'today' };
  }
  if (range === 'week') {
    const endDate = pad(today);
    const s = new Date(today.getTime() - 6*24*60*60*1000);
    return { start: pad(s), end: endDate, label: 'week' };
  }
  if (range === 'month') {
    const y = today.getFullYear();
    const m = today.getMonth();
    const first = new Date(Date.UTC(y, m, 1));
    const last = new Date(Date.UTC(y, m + 1, 0));
    return { start: pad(first), end: pad(last), label: 'month' };
  }
  if (range === 'custom') {
    const sValid = parseDate(start);
    const eValid = parseDate(end);
    if (!sValid || !eValid) throw new Error('Invalid start/end');
    if (sValid > eValid) throw new Error('start after end');
    return { start: sValid, end: eValid, label: 'custom' };
  }
  // default fallback
  const t = pad(today);
  return { start: t, end: t, label: 'today' };
}

export async function dailyBookings(req, res) {
  try {
    const date = parseDate(req.query.date) || todayISO();
  // room_number is stored directly as a string in booking_room (no separate room FK table used here)
    // Count bookings where the requested date falls within the inclusive checkIn-checkOut window.
  const sql = `SELECT room_number, COUNT(booking_id) AS bookings
         FROM booking_room
                 WHERE ? BETWEEN checkIn AND checkOut
                 GROUP BY room_number
                 ORDER BY room_number`;
    const [rows] = await query(sql, [date]);
    const total = rows.reduce((sum, r) => sum + Number(r.bookings || 0), 0);
  // Keep room_name field for backward compatibility (mirror room_number)
    const rooms = rows.map(r => ({ room_number: r.room_number, room_name: r.room_number, bookings: r.bookings }));
    res.json({ date, rooms, total });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}

export async function mostBookedRooms(req, res) {
  try {
    const range = (req.query.range || 'today').toLowerCase();
    let start = req.query.start;
    let end = req.query.end;
    let r;
    try {
      r = rangeToDates(range, start, end);
    } catch (err) {
      return res.status(400).json({ error: true, message: err.message });
    }
    // Limit very large span ( > 180 days )
    if ((new Date(r.end) - new Date(r.start)) / (1000*60*60*24) > 180) {
      return res.status(400).json({ error: true, message: 'Range too large (max 180 days)' });
    }
  // Overlap logic: booking is counted if (checkIn <= end) AND (checkOut >= start)
  const sql = `SELECT room_number, COUNT(booking_id) AS bookings
         FROM booking_room
                 WHERE checkIn <= ? AND checkOut >= ?
                 GROUP BY room_number
                 HAVING bookings > 0
                 ORDER BY bookings DESC, room_number
                 LIMIT 50`;
    const [rows] = await query(sql, [r.end, r.start]);
    const rooms = rows.map(rw => ({ room_number: rw.room_number, room_name: rw.room_number, bookings: rw.bookings }));
    res.json({ range: r.label, start: r.start, end: r.end, rooms });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}

export default { dailyBookings, mostBookedRooms };
