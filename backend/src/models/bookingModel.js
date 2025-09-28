import { query } from '../config/db.js';

// Overlap check for booking (date range + optional time window)
// Logic: existing booking overlaps if (new.checkIn <= existing.checkOut) AND (new.checkOut >= existing.checkIn)
// Time window (startTime/endTime) used only if both have values; simplified assumption.

export async function hasOverlap({ room_number, checkIn, checkOut, startTime = null, endTime = null }) {
  // Ignore bookings that are already CANCELLED or CHECKED_OUT (their slots should be reusable).
  // Active blockers: BOOKED, CHECKED_IN (room still occupied until endTime).
  let sql = `SELECT 1 FROM booking_room 
             WHERE room_number = ?
               AND status NOT IN ('CANCELLED','CHECKED_OUT')
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

export async function createBooking({ person_id, room_number, checkIn, checkOut, startTime = null, endTime = null, totalPrice, qrCode = null, status = 'BOOKED' }) {
  const overlap = await hasOverlap({ room_number, checkIn, checkOut, startTime, endTime });
  if (overlap) {
    const err = new Error('Room already booked for the selected period');
    err.status = 409;
    throw err;
  }
  const sql = `INSERT INTO booking_room (person_id, room_number, checkIn, checkOut, startTime, endTime, totalPrice, qrCode, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [person_id, room_number, checkIn, checkOut, startTime, endTime, totalPrice, qrCode, status];
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

export async function listBookingsToday(room_number) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  // Join person table to enrich booking with user identity details
  const sql = `SELECT 
      b.*, 
      p.firstname, 
      p.lastname, 
      p.nameTitle, 
      p.phone, 
      p.citizen_id, 
      p.email, 
      p.role
    FROM booking_room b
    JOIN person p ON p.person_id = b.person_id
    WHERE b.room_number = ? AND b.checkIn = ?
    ORDER BY COALESCE(b.startTime,'00:00:00') ASC`;
  const [rows] = await query(sql, [room_number, today]);
  return rows;
}

// Get the nearest upcoming booking for a user (today or future),
// ordering by checkIn date then (startTime if present else checkIn time columns) ascending.
// Assumptions: checkIn stores the booking date (DATE), optional startTime/endTime are HH:MM:SS.
export async function getUpcomingBookingForUser(person_id) {
  // Definition change: return the current active/ongoing booking (today, started, not ended) OR the next future one.
  // Include cases:
  //   1. checkIn > today (future)
  //   2. checkIn = today AND ((startTime IS NULL) OR (endTime IS NULL) OR (endTime > now))
  //      -> this covers bookings that have not finished yet (even if already started)
  // Exclude bookings whose endTime <= now (already finished) unless endTime NULL (treat as still active today).
  const now = new Date();
  const today = now.toISOString().slice(0,10);
  const currentTime = now.toTimeString().slice(0,8);
  const sql = `SELECT * FROM booking_room
               WHERE person_id = ?
                 AND (
                       checkIn > ?
                       OR (
                           checkIn = ?
                           AND (
                                 startTime IS NULL
                              OR endTime IS NULL
                              OR endTime > ?
                           )
                       )
                 )
               ORDER BY checkIn ASC,
                        COALESCE(startTime, '00:00:00') ASC`;
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

export async function updateBookingStatus(booking_id, { status, actualCheckIn = null, actualCheckOut = null }) {
  const fields = [];
  const params = [];
  if (status) { fields.push('status = ?'); params.push(status); }
  if (actualCheckIn) { fields.push('actualCheckIn = ?'); params.push(actualCheckIn); }
  if (actualCheckOut) { fields.push('actualCheckOut = ?'); params.push(actualCheckOut); }
  if (!fields.length) return false;
  params.push(booking_id);
  const [res] = await query(`UPDATE booking_room SET ${fields.join(', ')} WHERE booking_id = ?`, params);
  return res.affectedRows > 0;
}

// Automatically mark a booking as CHECKED_OUT if past endTime and currently CHECKED_IN or BOOKED
export async function autoCheckoutExpired(booking) {
  if (!booking) return false;
  if (!booking.endTime) return false;
  const endDateTime = new Date(`${booking.checkIn}T${booking.endTime}`);
  if (Date.now() >= endDateTime.getTime() && (booking.status === 'CHECKED_IN' || booking.status === 'BOOKED')) {
    await updateBookingStatus(booking.booking_id, { status: 'CHECKED_OUT', actualCheckOut: endDateTime.toISOString().slice(0,19).replace('T',' ') });
    return true;
  }
  return false;
}