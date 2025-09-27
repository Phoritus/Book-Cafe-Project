import { createBooking, listBookingsByPerson, deleteBooking, getBookingById, getUpcomingBookingForUser } from '../models/bookingModel.js';
import { query } from '../config/db.js';

export async function createBookingHandler(req, res) {
  try {
    let { room_number, checkIn, checkOut, startTime, endTime, totalPrice, qrCode } = req.body;
    if (!qrCode) {
      const ts = Date.now().toString(36).toUpperCase();
      const rnd = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      qrCode = `QR-${ts}-${rnd}`;
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
  const [rows] = await query('SELECT * FROM booking_room ORDER BY checkIn DESC');
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

// GET /bookings/upcoming - next upcoming booking for current user
export async function upcomingBookingHandler(req, res) {
  try {
    const booking = await getUpcomingBookingForUser(req.user.id);
    if (!booking) return res.json({ booking: null });
    // Add derived fields for client convenience
    const now = new Date();
    const bookingDate = booking.checkIn; // assuming DATE string YYYY-MM-DD
    let within30 = false;
    if (booking.startTime) {
      const startDateTime = new Date(`${bookingDate}T${booking.startTime}`);
      const diffMs = startDateTime - now;
      const diffMin = diffMs / 60000;
      within30 = diffMin <= 30 && diffMin >= 0;
    }
    res.json({ booking, meta: { within30Minutes: within30 } });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}

export default { createBookingHandler, listBookingsHandler, deleteBookingHandler, upcomingBookingHandler };
