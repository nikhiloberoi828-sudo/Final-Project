-- ═══════════════════════════════════════════════════════════════
-- Himachal Explorer – Supabase Database Setup
-- Run this in the Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/hfjsjmvflupeznutcmcw/sql
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. Bookings Table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  phone       VARCHAR(20),
  email       VARCHAR(255) NOT NULL,
  location    VARCHAR(255) NOT NULL,
  hotel_name  VARCHAR(255) DEFAULT 'General Booking',
  check_in    DATE NOT NULL,
  check_out   DATE NOT NULL,
  room_type   VARCHAR(50) DEFAULT 'Standard Room',
  total_price INTEGER DEFAULT 0,
  status      VARCHAR(20) DEFAULT 'confirmed',
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── 2. Contacts Table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── 3. Enable Row Level Security (optional but recommended) ──
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- ─── 4. Policies (allow backend service role to insert) ───────
-- Allow all operations for authenticated service role (backend uses direct PG connection)
CREATE POLICY "Allow all for service role" ON bookings FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON contacts FOR ALL USING (true);

-- ─── 5. Verify tables were created ────────────────────────────
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('bookings', 'contacts');
