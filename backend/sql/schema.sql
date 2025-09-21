-- Book Store / Cafe mixed schema (user-provided variant)
-- NOTE: This replaces previous design; models must align with these column names.

/* Optional: create database (can be omitted if handled externally) */
-- CREATE DATABASE IF NOT EXISTS Book_Store;
-- USE Book_Store;

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS Borrowing_Record;
DROP TABLE IF EXISTS Booking_Room;
DROP TABLE IF EXISTS Book;
DROP TABLE IF EXISTS Room;
DROP TABLE IF EXISTS Person;
SET FOREIGN_KEY_CHECKS=1;

-- Person (customers / members)
CREATE TABLE Person (
  person_id INT PRIMARY KEY AUTO_INCREMENT,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  nameTitle VARCHAR(10),
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  dateOfBirth DATE,
  citizen_id VARCHAR(13) UNIQUE,
  email VARCHAR(100) UNIQUE NOT NULL,
  verifyCode VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Room (rooms) – using string primary key room_number
CREATE TABLE Room (
  room_number VARCHAR(10) PRIMARY KEY,
  price DECIMAL(10,2) NOT NULL,
  room_status ENUM('available','occupied','booked') DEFAULT 'available',
  number_people INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Booking of rooms (many bookings per person/room)
CREATE TABLE Book_Room (
  booking_id INT PRIMARY KEY AUTO_INCREMENT,
  person_id INT NOT NULL,
  room_number VARCHAR(10) NOT NULL,
  checkOut DATE NOT NULL,
  checkIn DATE NOT NULL,
  startTime TIME,
  endTime TIME,
  totalPrice DECIMAL(10,2) NOT NULL,
  qrCode VARCHAR(255),
  FOREIGN KEY (person_id) REFERENCES Person(person_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (room_number) REFERENCES Room(room_number)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT check_dates CHECK (checkOut >= checkIn),
  INDEX idx_booking_dates (checkIn, checkOut),
  INDEX idx_booking_person (person_id),
  INDEX idx_booking_room (room_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Book catalog
CREATE TABLE Book (
  book_id VARCHAR(20) PRIMARY KEY,
  book_name VARCHAR(255) NOT NULL,
  book_status ENUM('available','borrowed') DEFAULT 'available',
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Borrowing records (book loans)
CREATE TABLE Borrowing_Record (
  record_id INT PRIMARY KEY AUTO_INCREMENT,
  book_id VARCHAR(20) NOT NULL,
  citizen_id VARCHAR(13) NOT NULL,
  borrowTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  returnTime DATETIME,
  FOREIGN KEY (book_id) REFERENCES Book(book_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_borrow_book (book_id),
  INDEX idx_borrow_citizen (citizen_id),
  INDEX idx_borrow_time (borrowTime),
  INDEX idx_return_time (returnTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Helpful indexes
CREATE INDEX idx_person_email ON Person(email);
CREATE INDEX idx_person_citizen ON Person(citizen_id);
CREATE INDEX idx_room_status ON Room(room_status);
CREATE INDEX idx_book_status ON Book(book_status);
CREATE INDEX idx_book_category ON Book(category);

/* NOTE: If you want stronger referential integrity for Borrowing_Record -> Person
   you can add:  ALTER TABLE Borrowing_Record ADD CONSTRAINT fk_borrow_citizen
                 FOREIGN KEY (citizen_id) REFERENCES Person(citizen_id);
   (Omitted for now because citizen_id may be NULL for legacy imports.) */

