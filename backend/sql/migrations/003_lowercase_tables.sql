-- Migration: rename existing CamelCase / PascalCase tables to lowercase snake_case
-- Apply ONLY once on an existing database that still has old names.
-- If you already recreated schema with lowercase names, skip this file.

SET FOREIGN_KEY_CHECKS=0;
-- Use IF EXISTS guards to avoid errors if already renamed
RENAME TABLE Person TO person;
RENAME TABLE Room TO room;
RENAME TABLE Book_Room TO booking_room;
RENAME TABLE Booking_Room TO booking_room; -- in case alternative existed
RENAME TABLE Book TO book;
RENAME TABLE Borrowing_Record TO borrowing_record;
SET FOREIGN_KEY_CHECKS=1;

-- Optional: verify
-- SHOW TABLES LIKE 'person';
-- DESCRIBE person;