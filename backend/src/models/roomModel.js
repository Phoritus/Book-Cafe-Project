import { query } from '../config/db.js';

export async function listRooms() {
  const [rows] = await query('SELECT * FROM Room ORDER BY room_number');
  return rows;
}

export async function getRoom(room_number) {
  const [rows] = await query('SELECT * FROM Room WHERE room_number = ? LIMIT 1', [room_number]);
  return rows[0] || null;
}

export async function createRoom({ room_number, price, room_status = 'available', number_people = null }) {
  const sql = `INSERT INTO Room (room_number, price, room_status, number_people) VALUES (?, ?, ?, ?)`;
  const params = [room_number, price, room_status, number_people];
  await query(sql, params);
  return await getRoom(room_number);
}

export async function updateRoomStatus(room_number, room_status) {
  await query('UPDATE Room SET room_status = ? WHERE room_number = ?', [room_status, room_number]);
  return await getRoom(room_number);
}
