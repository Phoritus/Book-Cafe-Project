import { query } from '../config/db.js';

// Overlap check for booking (date range + optional time window)
// Logic: existing booking overlaps if (new.checkIn <= existing.checkOut) AND (new.checkOut >= existing.checkIn)
// Time window (startTime/endTime) used only if both have values; simplified assumption.

export async function hasOverlap({ room_number, checkIn, checkOut, startTime = null, endTime = null }) {
  let sql = `SELECT 1 FROM Booking_Room 
             WHERE room_number = ?
               AND NOT (checkOut < ? OR checkIn > ?)`; // date range overlap
  const params = [room_number, checkIn, checkOut];

  if (startTime && endTime) {
    // Additional time overlap refinement when both sides have times
    sql += ` AND ( (startTime IS NULL AND endTime IS NULL) OR NOT (endTime <= ? OR startTime >= ?) )`;
    params.push(startTime, endTime);
  }

  sql += ' LIMIT 1';
  const [rows] = await query(sql, params);
  return rows.length > 0;
}

export async function createBooking({ person_id, room_number, checkIn, checkOut, startTime = null, endTime = null, totalPrice, qrCode = null }) {
  const overlap = await hasOverlap({ room_number, checkIn, checkOut, startTime, endTime });
  if (overlap) {
    const err = new Error('Room already booked for the selected period');
    err.status = 409;
    throw err;
  }
  const sql = `INSERT INTO Booking_Room (person_id, room_number, checkIn, checkOut, startTime, endTime, totalPrice, qrCode)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [person_id, room_number, checkIn, checkOut, startTime, endTime, totalPrice, qrCode];
  const [result] = await query(sql, params);
  return await getBookingById(result.insertId);
}

export async function getBookingById(booking_id) {
  const [rows] = await query('SELECT * FROM Booking_Room WHERE booking_id = ? LIMIT 1', [booking_id]);
  return rows[0] || null;
}

export async function listBookingsByPerson(person_id) {
  const [rows] = await query('SELECT * FROM Booking_Room WHERE person_id = ? ORDER BY checkIn DESC', [person_id]);
  return rows;
}

export async function listBookingsByRoom(room_number) {
  const [rows] = await query('SELECT * FROM Booking_Room WHERE room_number = ? ORDER BY checkIn DESC', [room_number]);
  return rows;
}

export async function deleteBooking(booking_id, requesterPersonId, isAdmin = false) {
  if (!isAdmin) {
    const booking = await getBookingById(booking_id);
    if (!booking) return false;
    if (booking.person_id !== requesterPersonId) {
      const err = new Error('Forbidden');
      err.status = 403;
      throw err;
    }
  }
  const [result] = await query('DELETE FROM Booking_Room WHERE booking_id = ?', [booking_id]);
  return result.affectedRows > 0;
}

// Assign a qrCode to a booking if not already present
export async function assignBookingQrCode(booking_id, qrCode) {
  const [result] = await query('UPDATE Booking_Room SET qrCode = ? WHERE booking_id = ? AND (qrCode IS NULL OR qrCode = "")', [qrCode, booking_id]);
  return result.affectedRows > 0;
}