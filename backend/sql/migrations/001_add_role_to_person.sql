-- Migration: add role column to Person
ALTER TABLE Person
  ADD COLUMN role ENUM('admin','user') NOT NULL DEFAULT 'user' AFTER password;

-- Optionally promote existing admin by email (edit as needed)
UPDATE Person SET role='admin' WHERE email='admin@email.com';
