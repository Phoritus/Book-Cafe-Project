-- Migration: add role column to person (legacy capitalization adjusted)
-- If coming from an older schema where table was named `Person`, ensure it has been renamed to `person` first.
ALTER TABLE person
  ADD COLUMN role ENUM('admin','user') NOT NULL DEFAULT 'user' AFTER password;

-- Optionally promote existing admin by email (edit as needed)
UPDATE person SET role='admin' WHERE email='admin@email.com';
