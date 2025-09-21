import { listRooms, createRoom, updateRoomStatus, getRoom } from '../models/roomModel.js';

export async function getAllRooms(req, res) {
  const rooms = await listRooms();
  res.json(rooms);
}

export async function createRoomHandler(req, res) {
  try {
    const { room_number, price, number_people, room_status} = req.body;
    if (!room_number || price == null) {
      return res.status(400).json({ error: true, message: 'room_number & price required' });
    }
    const room = await createRoom({ room_number, price, number_people, room_status});
    res.status(201).json(room);
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}

export async function patchRoomStatus(req, res) {
  try {
    const { room_number } = req.params;
    const { room_status } = req.body;
    const updated = await updateRoomStatus(room_number, room_status);
    if (!updated) return res.status(404).json({ error: true, message: 'Room not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}

export async function getRoomById(req, res) {
  const room = await getRoom(req.params.room_number);
  if (!room) return res.status(404).json({ error: true, message: 'Not found' });
  res.json(room);
}

export default { getAllRooms, createRoomHandler, patchRoomStatus, getRoomById };
