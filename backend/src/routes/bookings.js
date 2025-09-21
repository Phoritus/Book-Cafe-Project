import express from 'express';
import { auth } from '../middleware/auth.js';
import { createBookingHandler, listBookingsHandler, deleteBookingHandler } from '../controllers/bookingController.js';

const router = express.Router();

// POST /bookings
router.post('/', auth, createBookingHandler);

// GET /bookings (current user's bookings) or all if admin & ?all=1
router.get('/', auth, listBookingsHandler);

// DELETE /bookings/:id
router.delete('/:id', auth, deleteBookingHandler);

export default router;
