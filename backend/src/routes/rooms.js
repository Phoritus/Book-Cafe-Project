import express from 'express';
import { listRooms, createRoom, updateRoomStatus, getRoom } from '../models/roomModel.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/rooms
router.get('/', async (req, res) => {
  const rooms = await listRooms();
  res.json(rooms);
});

// POST /api/rooms (admin only)
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const { room_number, price, number_people, room_status, qrCode } = req.body;
    if (!room_number || price == null) {
      return res.status(400).json({ error: true, message: 'room_number & price required' });
    }
    const room = await createRoom({ room_number, price, number_people, room_status, qrCode });
    res.status(201).json(room);
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
});

// PATCH /api/rooms/:room_number/status (admin)
router.patch('/:room_number/status', auth, requireRole('admin'), async (req, res) => {
  try {
    const { room_number } = req.params;
    const { room_status } = req.body;
    const updated = await updateRoomStatus(room_number, room_status);
    if (!updated) return res.status(404).json({ error: true, message: 'Room not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
});

// GET /api/rooms/:room_number
router.get('/:room_number', async (req, res) => {
  const room = await getRoom(req.params.room_number);
  if (!room) return res.status(404).json({ error: true, message: 'Not found' });
  res.json(room);
});

export default router;
