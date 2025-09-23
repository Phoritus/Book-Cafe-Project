-- Migration: add columns to support change email flow
-- Adds new_email (pending target email) and verifyCodeExpires (expiry timestamp for verifyCode)
-- Safe to run multiple times? Minimal: will fail if columns already exist (MySQL <8 has no IF NOT EXISTS for ADD COLUMN before 8.0.29).
-- Run order: after 001_add_role_to_person.sql

-- Ensure legacy `Person` has been renamed to `person` before executing (see 003_lowercase_tables if needed)
ALTER TABLE person
  ADD COLUMN new_email VARCHAR(100) NULL AFTER email,
  ADD COLUMN verifyCodeExpires DATETIME NULL AFTER verifyCode;

-- Optional: index to speed lookups by pending new email
CREATE INDEX idx_person_new_email ON person(new_email);

-- (Optional alternative) To prevent duplicates, uncomment below for unique constraint:
-- ALTER TABLE person ADD UNIQUE INDEX uq_person_new_email (new_email);
