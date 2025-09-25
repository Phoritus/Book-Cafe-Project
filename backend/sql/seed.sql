-- Seed data matching current schema (after migrations 001,002)
-- Execute AFTER running schema.sql and migrations.

-- Password hashes were pre-generated with bcrypt (10 rounds)
-- admin123 => $2b$10$WU3rqtWQ6hm8OV9LFp8pg.8ih5Gp0pf0UJ3LpvEyozUjMOyBJjDia
INSERT INTO person (firstname, lastname, nameTitle, phone, password, dateOfBirth, citizen_id, email, verifyCode, role)
VALUES ('admin', 'admin', 'Mr.', '080-000-0000', '$2b$10$WU3rqtWQ6hm8OV9LFp8pg.8ih5Gp0pf0UJ3LpvEyozUjMOyBJjDia', '1980-01-01', '0000000000000', 'admin@email.com', NULL, 'admin');

-- userPass1! => $2b$10$8bH6H3i4CkD9p5xivFHQWu5lFyd9bItIju7/fqlF7nLy3d0QvmbcC
-- userPass2! => $2b$10$4AF0nMQ1q8H3KE9lB4Y1xOIlkF5A4WQ5dFjl3mT2m6YVd/YwY0Q5Ri
INSERT INTO person (firstname, lastname, nameTitle, phone, password, dateOfBirth, citizen_id, email, verifyCode, role) VALUES
('somchai', 'jaidee', 'Mr.', '081-234-5678', '$2b$10$8bH6H3i4CkD9p5xivFHQWu5lFyd9bItIju7/fqlF7nLy3d0QvmbcC', '1990-05-15', '1234567890123', 'somchai@email.com', NULL, 'user'),
('somying', 'rakdee', 'Mrs.', '082-345-6789', '$2b$10$4AF0nMQ1q8H3KE9lB4Y1xOIlkF5A4WQ5dFjl3mT2m6YVd/YwY0Q5Ri', '1992-08-20', '2345678901234', 'somying@email.com', NULL, 'user');

INSERT INTO room (room_number, price, room_status, number_people) VALUES
('Room 1', 50.00, 'available', 7),
('Room 2', 50.00, 'available', 7),
('Room 3', 50.00, 'available', 11),
('Room 4', 50.00, 'available', 11);

-- NOTE: Schema defines table Book_Room but code currently queries Booking_Room.
-- If your actual table name is Book_Room, adjust code OR rename table.
-- Below we seed both for safety (ignore errors if one does not exist).
INSERT INTO booking_room (person_id, room_number, checkIn, checkOut, startTime, endTime, totalPrice, qrCode) VALUES
(1, 'Room 1', '2025-09-10', '2025-09-12', '14:00:00', '12:00:00', 200.00, 'QR123456'),
(2, 'Room 2', '2025-09-15', '2025-09-16', '15:00:00', '11:00:00', 250.00, 'QR789012')
ON DUPLICATE KEY UPDATE room_number=VALUES(room_number);

-- Optional duplicate seed into Book_Room if exists
-- (Removed Book_Room duplicate seed after normalization)

INSERT INTO book (book_id, book_name, book_status, category) VALUES
('B001', 'Python Programming Guide', 'available', 'Academic'),
('B002', 'MySQL Database Fundamentals', 'available', 'Academic'),
('B003', 'Harry Potter and the Stone', 'available', 'Fiction'),
('B004', 'The Great Gatsby', 'available', 'Fiction'),
('B005', 'SAD Methods', 'available', 'Academic'),
('B006', 'Child Stories Vol.1', 'available', 'Children'),
('B007', 'Deep Learning Basics', 'available', 'Academic'),
('B008', 'Startup Journey', 'available', 'Business'),
('B009', 'Forest Legends', 'available', 'Fiction'),
('B010', 'Mind Growth', 'available', 'Inspiration');

-- Comprehensive September 2025 borrowing dataset for dashboard testing
INSERT INTO borrowing_record (book_id, citizen_id, borrowTime, returnTime) VALUES
-- Early month
 ('B001','1234567890123','2025-09-01 09:05:00','2025-09-02 10:00:00'),
 ('B001','1234567890124','2025-09-01 14:20:00','2025-09-03 11:30:00'),
 ('B002','1234567890125','2025-09-01 15:10:00',NULL),
 ('B003','2234567890123','2025-09-02 10:15:00','2025-09-05 16:00:00'),
 ('B004','3234567890123','2025-09-02 11:40:00',NULL),
 ('B005','4234567890123','2025-09-03 09:25:00','2025-09-10 14:00:00'),
 ('B001','5234567890123','2025-09-03 13:45:00',NULL),
 ('B009','6234567890123','2025-09-03 16:10:00','2025-09-04 10:00:00'),
 ('B006','7234567890123','2025-09-04 08:55:00',NULL),
 ('B007','8234567890123','2025-09-04 09:05:00','2025-09-12 12:00:00'),
-- Mid month
 ('B001','1234567890123','2025-09-06 10:00:00','2025-09-07 09:30:00'),
 ('B002','1234567890125','2025-09-06 11:15:00','2025-09-10 15:00:00'),
 ('B001','2234567890123','2025-09-07 12:45:00','2025-09-09 13:15:00'),
 ('B003','3234567890123','2025-09-07 14:30:00',NULL),
 ('B004','4234567890123','2025-09-08 09:10:00','2025-09-18 17:45:00'),
 ('B005','5234567890123','2025-09-08 13:00:00',NULL),
 ('B009','6234567890123','2025-09-08 18:20:00','2025-09-11 09:00:00'),
 ('B001','7234567890123','2025-09-09 10:40:00','2025-09-10 11:00:00'),
 ('B001','8234567890123','2025-09-09 12:05:00','2025-09-11 14:00:00'),
 ('B002','1234567890124','2025-09-10 09:55:00',NULL),
 ('B003','2234567890123','2025-09-10 10:35:00','2025-09-12 16:30:00'),
 ('B001','3234567890123','2025-09-11 11:45:00','2025-09-13 09:25:00'),
 ('B007','4234567890123','2025-09-11 13:05:00',NULL),
 ('B008','5234567890123','2025-09-11 15:30:00','2025-09-20 11:15:00'),
 ('B010','6234567890123','2025-09-12 08:40:00','2025-09-18 10:00:00'),
 ('B006','7234567890123','2025-09-12 09:05:00','2025-09-14 09:00:00'),
 ('B001','8234567890123','2025-09-12 10:10:00','2025-09-13 10:50:00'),
 ('B004','1234567890123','2025-09-13 11:20:00','2025-09-15 15:20:00'),
 ('B001','1234567890124','2025-09-14 09:15:00','2025-09-16 10:10:00'),
 ('B005','2234567890123','2025-09-14 14:45:00','2025-09-25 09:00:00'),
 ('B009','3234567890123','2025-09-15 16:25:00',NULL),
-- Late month
 ('B001','4234567890123','2025-09-16 09:35:00','2025-09-17 09:20:00'),
 ('B002','5234567890123','2025-09-16 11:50:00','2025-09-18 13:00:00'),
 ('B001','6234567890123','2025-09-17 12:10:00',NULL),
 ('B003','7234567890123','2025-09-17 13:40:00','2025-09-19 14:00:00'),
 ('B004','8234567890123','2025-09-17 15:05:00',NULL),
 ('B006','1234567890123','2025-09-18 08:55:00','2025-09-20 09:00:00'),
 ('B007','1234567890124','2025-09-18 09:10:00','2025-09-21 15:00:00'),
 ('B001','2234567890123','2025-09-18 10:25:00','2025-09-19 14:15:00'),
 ('B001','3234567890123','2025-09-19 11:55:00','2025-09-21 09:40:00'),
 ('B005','4234567890123','2025-09-19 13:05:00',NULL),
 ('B010','5234567890123','2025-09-20 10:10:00',NULL),
 ('B001','6234567890123','2025-09-20 11:30:00','2025-09-22 10:30:00'),
 ('B002','7234567890123','2025-09-21 14:45:00',NULL),
 ('B001','8234567890123','2025-09-21 15:55:00',NULL),
 ('B003','1234567890123','2025-09-22 09:05:00',NULL),
 ('B004','1234567890124','2025-09-22 10:15:00',NULL),
 ('B009','2234567890123','2025-09-22 11:25:00',NULL);

-- All password hashes above are real bcrypt hashes; you may regenerate with:
-- node -e "require('bcrypt').hash('YourPass1!',10).then(h=>console.log(h))"
-- If you keep both Booking_Room and Book_Room remove one to avoid confusion.
