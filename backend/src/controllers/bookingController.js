import { createBooking, listBookingsByPerson, deleteBooking } from '../models/bookingModel.js';
import { query } from '../config/db.js';

export async function createBookingHandler(req, res) {
  try {
    const { room_number, checkIn, checkOut, startTime, endTime, totalPrice, qrCode } = req.body;
    if (!room_number || !checkIn || !checkOut || totalPrice == null) {
      return res.status(400).json({ error: true, message: 'Missing required fields' });
    }
    const booking = await createBooking({
      person_id: req.user.id,
      room_number,
      checkIn,
      checkOut,
      startTime,
      endTime,
      totalPrice,
      qrCode
    });
    res.status(201).json(booking);
  } catch (e) {
    res.status(e.status || 500).json({ error: true, message: e.message });
  }
}

export async function listBookingsHandler(req, res) {
  try {
    if (req.user.role === 'admin' && req.query.all === '1') {
      const [rows] = await query('SELECT * FROM Booking_Room ORDER BY checkIn DESC');
      return res.json(rows);
    }
    const rows = await listBookingsByPerson(req.user.id);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}

export async function deleteBookingHandler(req, res) {
  try {
    const ok = await deleteBooking(parseInt(req.params.id, 10), req.user.id, req.user.role === 'admin');
    if (!ok) return res.status(404).json({ error: true, message: 'Not found' });
    res.json({ success: true });
  } catch (e) {
    res.status(e.status || 500).json({ error: true, message: e.message });
  }
}

export default { createBookingHandler, listBookingsHandler, deleteBookingHandler };
