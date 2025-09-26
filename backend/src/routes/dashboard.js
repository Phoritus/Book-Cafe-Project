import express from 'express';
import { dailyBookings, mostBookedRooms } from '../controllers/dashboardController.js';
import { borrowingsByCategory, topBorrowedBooks } from '../controllers/borrowingDashboardController.js';

const router = express.Router();

// NOTE: Dashboard endpoints are now public (no auth). Re-add auth if sensitive.

router.get('/daily', dailyBookings);
router.get('/most-booked', mostBookedRooms);
// Borrowing analytics
router.get('/borrowings/by-category', borrowingsByCategory);
router.get('/borrowings/top-books', topBorrowedBooks);

export default router;
