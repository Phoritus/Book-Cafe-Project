import express from 'express';
import { dailyBookings, mostBookedRooms } from '../controllers/dashboardController.js';
import { borrowingsByCategory, topBorrowedBooks } from '../controllers/borrowingDashboardController.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Protect all dashboard endpoints (admin only)
router.use(auth, requireRole('admin'));

router.get('/daily', dailyBookings);
router.get('/most-booked', mostBookedRooms);
// Borrowing analytics
router.get('/borrowings/by-category', borrowingsByCategory);
router.get('/borrowings/top-books', topBorrowedBooks);

export default router;
