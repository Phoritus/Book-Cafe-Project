import { query } from '../config/db.js';

// Overlap check for booking (date range + optional time window)
// Logic: existing booking overlaps if (new.checkIn <= existing.checkOut) AND (new.checkOut >= existing.checkIn)
// Time window (startTime/endTime) used only if both have values; simplified assumption.

export async function hasOverlap({ room_number, checkIn, checkOut, startTime = null, endTime = null }) {
  let sql = `SELECT 1 FROM booking_room 
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
  const sql = `INSERT INTO booking_room (person_id, room_number, checkIn, checkOut, startTime, endTime, totalPrice, qrCode)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [person_id, room_number, checkIn, checkOut, startTime, endTime, totalPrice, qrCode];
  const [result] = await query(sql, params);
  return await getBookingById(result.insertId);
}

export async function getBookingById(booking_id) {
  const [rows] = await query('SELECT * FROM booking_room WHERE booking_id = ? LIMIT 1', [booking_id]);
  return rows[0] || null;
}

export async function listBookingsByPerson(person_id) {
  const [rows] = await query('SELECT * FROM booking_room WHERE person_id = ? ORDER BY checkIn DESC', [person_id]);
  return rows;
}

export async function listBookingsByRoom(room_number) {
  const [rows] = await query('SELECT * FROM booking_room WHERE room_number = ? ORDER BY checkIn DESC', [room_number]);
  return rows;
}

// Get the nearest upcoming booking for a user (today or future),
// ordering by checkIn date then (startTime if present else checkIn time columns) ascending.
// Assumptions: checkIn stores the booking date (DATE), optional startTime/endTime are HH:MM:SS.
export async function getUpcomingBookingForUser(person_id) {
  // We consider a booking upcoming if its date is today or later AND:
  // - if date > today -> always upcoming
  // - if date = today -> startTime is null OR startTime >= now (within day)
  // We still return the next one even if within the 30 minute check-in window; frontend will handle messaging.
  const now = new Date();
  const today = now.toISOString().slice(0,10); // YYYY-MM-DD
  const currentTime = now.toTimeString().slice(0,8); // HH:MM:SS
  const sql = `SELECT * FROM booking_room
               WHERE person_id = ?
                 AND (
                      checkIn > ?
                      OR (checkIn = ? AND (startTime IS NULL OR startTime >= ?))
                 )
               ORDER BY checkIn ASC, COALESCE(startTime, '23:59:59') ASC
               LIMIT 1`;
  const params = [person_id, today, today, currentTime];
  const [rows] = await query(sql, params);
  return rows[0] || null;
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
  const [result] = await query('DELETE FROM booking_room WHERE booking_id = ?', [booking_id]);
  return result.affectedRows > 0;
}

// Assign a qrCode to a booking if not already present
export async function assignBookingQrCode(booking_id, qrCode) {
  const [result] = await query('UPDATE booking_room SET qrCode = ? WHERE booking_id = ? AND (qrCode IS NULL OR qrCode = "")', [qrCode, booking_id]);
  return result.affectedRows > 0;
}