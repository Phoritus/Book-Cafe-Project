-- Seed data matching provided schema
-- Execute after schema.sql

-- Admin Password is 'admin123'
INSERT INTO Person (firstname, lastname, nameTitle, phone, password, dateOfBirth, citizen_id, email, verifyCode) VALUES
('admin', 'admin', 'Mr.', '080-000-0000', '$2b$10$WU3rqtWQ6hm8OV9LFp8pg.8ih5Gp0pf0UJ3LpvEyozUjMOyBJjDia', '1980-01-01', '0000000000000', 'admin@email.com', NULL);

-- Persons
INSERT INTO Person (firstname, lastname, nameTitle, phone, password, dateOfBirth, citizen_id, email, verifyCode) VALUES
('somchai', 'jaidee', 'Mr.', '081-234-5678', 'hashed_password_1', '1990-05-15', '1234567890123', 'somchai@email.com', NULL),
('somying', 'rakdee', 'Mrs.', '082-345-6789', 'hashed_password_2', '1992-08-20', '2345678901234', 'somying@email.com', NULL);

-- Rooms
INSERT INTO Room (room_number, price, room_status, number_people) VALUES
('Room 1', 50.00, 'available', 7),
('Room 2', 50.00, 'available', 7),
('Room 3', 50.00, 'available', 11),
('Room 4', 50.00, 'available', 11);

-- Room bookings
INSERT INTO Booking_Room (person_id, room_number, checkIn, checkOut, startTime, endTime, totalPrice, qrCode) VALUES
(1, 'Room 1', '2024-01-15', '2024-01-17', '14:00:00', '12:00:00', 200.00, 'QR123456'),
(2, 'Room 2', '2024-01-20', '2024-01-22', '15:00:00', '11:00:00', 250.00, 'QR789012');

-- Books
INSERT INTO Book (book_id, book_name, book_status, category) VALUES
('B001', 'Python Programming Guide', 'available', 'Academic'),
('B002', 'MySQL Database Fundamentals', 'available', 'Academic'),
('B003', 'Harry Potter and the Stone', 'borrowed', 'Fiction'),
('B004', 'The Great Gatsby', 'borrowed', 'Fiction');

-- Borrowing records
INSERT INTO Borrowing_Record (book_id, citizen_id, borrowTime, returnTime) VALUES
('B003', '3456789012345', '2024-01-18 16:20:00', NULL),
('B004', '1234567890123', '2024-01-20 10:30:00', NULL),
('B001', '2345678901234', '2023-12-20 14:30:00', '2023-12-27 16:00:00'),
('B002', '3456789012345', '2023-12-15 09:15:00', '2023-12-22 10:30:00');

-- Reminder: Replace placeholder password fields with real bcrypt hashes for login functionality.
