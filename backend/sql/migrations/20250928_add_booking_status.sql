-- Migration: add status and actual check-in/out columns to booking_room
ALTER TABLE booking_room
  ADD COLUMN status ENUM('BOOKED','CHECKED_IN','CHECKED_OUT','CANCELLED') NOT NULL DEFAULT 'BOOKED',
  ADD COLUMN actualCheckIn DATETIME NULL,
  ADD COLUMN actualCheckOut DATETIME NULL;
