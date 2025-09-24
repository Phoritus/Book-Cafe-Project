-- Migration: create table for registration verification codes
-- Stores one active code per email; code expires after short TTL (e.g., 10 minutes)
CREATE TABLE IF NOT EXISTS Registration_Verify (
  email VARCHAR(100) NOT NULL PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  expiresAt DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_regverify_expires (expiresAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
