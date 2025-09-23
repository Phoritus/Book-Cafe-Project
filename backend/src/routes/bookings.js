import express from 'express';
import { auth } from '../middleware/auth.js';
import { createBookingHandler, listBookingsHandler, deleteBookingHandler } from '../controllers/bookingController.js';
import { validateCreateBooking } from '../middleware/validate.js';

const router = express.Router();

// POST /bookings
router.post('/', auth, validateCreateBooking, createBookingHandler);

// GET /bookings (current user's bookings) or all if admin & ?all=1
router.get('/', auth, listBookingsHandler);

// DELETE /bookings/:id
router.delete('/:id', auth, deleteBookingHandler);


export default router;
