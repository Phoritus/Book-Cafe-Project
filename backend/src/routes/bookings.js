import express from 'express';
import { auth } from '../middleware/auth.js';
import { createBookingHandler, listBookingsHandler, deleteBookingHandler, upcomingBookingHandler } from '../controllers/bookingController.js';
import { validateCreateBooking } from '../middleware/validate.js';

const router = express.Router();

// POST /bookings
router.post('/', auth, validateCreateBooking, createBookingHandler);

// GET /bookings (current user's bookings) or all if admin & ?all=1
router.get('/', auth, listBookingsHandler);

// GET /bookings/upcoming - next upcoming booking of current user
router.get('/upcoming', auth, upcomingBookingHandler);

// DELETE /bookings/:id
router.delete('/:id', auth, deleteBookingHandler);


export default router;
