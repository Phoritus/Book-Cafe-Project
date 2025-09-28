import express from 'express';
import { auth } from '../middleware/auth.js';
import { createBookingHandler, listBookingsHandler, deleteBookingHandler, upcomingBookingHandler, checkInBookingHandler, listBookingsTodayHandler, checkOutBookingHandler } from '../controllers/bookingController.js';
import { validateCreateBooking } from '../middleware/validate.js';

const router = express.Router();

// POST /bookings (create booking)
router.post('/', auth, validateCreateBooking, createBookingHandler);

// GET /bookings (current user's bookings) or admin with ?all=1
router.get('/', auth, listBookingsHandler);

// GET /bookings/today/:room_number - today's bookings for a room
router.get('/today/:room_number', auth, listBookingsTodayHandler);

// GET /bookings/upcoming - next upcoming booking of current user
router.get('/upcoming', auth, upcomingBookingHandler);

// POST /bookings/:id/check-in - perform check-in within allowed window
router.post('/:id/check-in', auth, checkInBookingHandler);

// POST /bookings/:id/check-out - perform check-out if currently CHECKED_IN
router.post('/:id/check-out', auth, checkOutBookingHandler);

// DELETE /bookings/:id
router.delete('/:id', auth, deleteBookingHandler);


export default router;
