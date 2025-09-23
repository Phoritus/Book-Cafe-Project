import express from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import { getAllRooms, createRoomHandler, patchRoomStatus, getRoomById } from '../controllers/roomController.js';
import { validateCreateRoom } from '../middleware/validate.js';

const router = express.Router();

// GET /rooms
router.get('/', getAllRooms);

// POST /rooms (admin only)
router.post('/', auth, requireRole('admin'), validateCreateRoom, createRoomHandler);

// PATCH /rooms/:room_number/status (admin)
router.patch('/:room_number/status', auth, requireRole('admin'), patchRoomStatus);

// GET /rooms/:room_number
router.get('/:room_number', getRoomById);

export default router;
