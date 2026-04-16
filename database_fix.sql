-- ⚠️ Run this query in pgAdmin / DBeaver to recreate your table properly ⚠️

-- 1. First, clear out the conflicting model completely
DROP TABLE IF EXISTS bookings;

-- 2. Drop the old ENUM types if they existed and conflicted
DROP TYPE IF EXISTS "enum_bookings_room_type" CASCADE;
DROP TYPE IF EXISTS "enum_bookings_status" CASCADE;

-- 3. Recreate the table with the exact columns your backend model expects
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    hotel_name VARCHAR(255),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    room_type VARCHAR(50) DEFAULT 'Standard Room',
    total_price INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Note: Once you run this query, restart your backend server (npm run dev:all)
-- Then interact with the frontend BookingModal again!
