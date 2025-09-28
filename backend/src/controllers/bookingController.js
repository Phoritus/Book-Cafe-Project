import { createBooking, listBookingsByPerson, deleteBooking, getBookingById, getUpcomingBookingForUser, updateBookingStatus, autoCheckoutExpired, listBookingsToday } from '../models/bookingModel.js';
import { query } from '../config/db.js';

export async function createBookingHandler(req, res) {
  try {
    let { room_number, checkIn, checkOut, startTime, endTime, totalPrice, qrCode } = req.body;
    if (!qrCode) {
      const ts = Date.now().toString(36).toUpperCase();
      const rnd = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      qrCode = `QR-${ts}-${rnd}`;
    }
    // Auth required (route enforces auth) so req.user must exist
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

// GET/POST today bookings for a room. Accepts room_number either as URL param or JSON body { room_number: "Room 1" }
export async function listBookingsTodayHandler(req, res) {
  try {
    // New REST path: /bookings/today/:room_number
    const room_number = (req.params && req.params.room_number) || (req.body && req.body.room_number);
    if (!room_number) {
      return res.status(400).json({ error: true, message: 'room_number required in URL parameter :room_number' });
    }
    const rows = await listBookingsToday(room_number);
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
    let booking = await getUpcomingBookingForUser(req.user.id);
    if (!booking) return res.json({ booking: null });

    // Attempt auto checkout if past endTime
    const changed = await autoCheckoutExpired(booking);
    if (changed) booking = await getUpcomingBookingForUser(req.user.id) || booking; // re-fetch next upcoming if current auto-checked-out
    if (!booking) return res.json({ booking: null });

    const now = new Date();
    const bookingDate = booking.checkIn;
    let within30 = false;
    let canCheckIn = false;
    if (booking.startTime) {
      const startDateTime = new Date(`${bookingDate}T${booking.startTime}`);
      const diffMs = startDateTime - now;
      const diffMin = diffMs / 60000;
      within30 = diffMin <= 30 && diffMin >= -5; // allow a small grace after start
      if (within30 && booking.status === 'BOOKED') {
        canCheckIn = true;
      }
    }
    res.json({ booking, meta: { within30Minutes: within30, canCheckIn } });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}

// POST /bookings/:id/check-in
export async function checkInBookingHandler(req, res) {
  try {
    const bookingId = parseInt(req.params.id, 10);
    const booking = await getBookingById(bookingId);
    if (!booking) return res.status(404).json({ error: true, message: 'Not found' });
    if (booking.person_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: true, message: 'Forbidden' });
    if (booking.status !== 'BOOKED') return res.status(400).json({ error: true, message: `Cannot check-in from status ${booking.status}` });
    if (!booking.startTime) return res.status(400).json({ error: true, message: 'Booking has no startTime defined' });
    const startDateTime = new Date(`${booking.checkIn}T${booking.startTime}`);
    const diffMin = (startDateTime - Date.now()) / 60000;
    if (diffMin > 30) return res.status(400).json({ error: true, message: 'Too early to check in' });
    if (diffMin < -5) return res.status(400).json({ error: true, message: 'Check-in window passed' });
    const nowStr = new Date().toISOString().slice(0,19).replace('T',' ');
    await updateBookingStatus(bookingId, { status: 'CHECKED_IN', actualCheckIn: nowStr });
    const updated = await getBookingById(bookingId);
    res.json({ success: true, booking: updated });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}

export default { createBookingHandler, listBookingsHandler, deleteBookingHandler, upcomingBookingHandler, checkInBookingHandler, listBookingsTodayHandler };
