-- EvacSafe Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create evacuation_zones table
CREATE TABLE IF NOT EXISTS evacuation_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  zone_type VARCHAR(50) DEFAULT 'low_risk',
  status VARCHAR(50) DEFAULT 'available',
  capacity INTEGER DEFAULT 0,
  current_occupancy INTEGER DEFAULT 0,
  coordinates JSONB NOT NULL,
  center_lat DECIMAL(10, 8),
  center_lng DECIMAL(11, 8),
  active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_locations table for analytics
CREATE TABLE IF NOT EXISTS user_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(8, 2),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create emergency_contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  organization VARCHAR(255),
  priority INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the nearby_zones function
CREATE OR REPLACE FUNCTION nearby_zones(
  user_lat DECIMAL(10, 8),
  user_lng DECIMAL(11, 8),
  radius_km INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  name VARCHAR(255),
  description TEXT,
  zone_type VARCHAR(50),
  status VARCHAR(50),
  capacity INTEGER,
  current_occupancy INTEGER,
  coordinates JSONB,
  center_lat DECIMAL(10, 8),
  center_lng DECIMAL(11, 8),
  active BOOLEAN,
  priority INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  distance_km DECIMAL(10, 2)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ez.id,
    ez.name,
    ez.description,
    ez.zone_type,
    ez.status,
    ez.capacity,
    ez.current_occupancy,
    ez.coordinates,
    ez.center_lat,
    ez.center_lng,
    ez.active,
    ez.priority,
    ez.created_at,
    ez.updated_at,
    ROUND(
      6371 * acos(
        cos(radians(user_lat)) * 
        cos(radians(ez.center_lat)) * 
        cos(radians(ez.center_lng) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(ez.center_lat))
      )::DECIMAL(10, 2) AS distance_km
  FROM evacuation_zones ez
  WHERE ez.active = true
    AND ez.center_lat IS NOT NULL 
    AND ez.center_lng IS NOT NULL
    AND (
      6371 * acos(
        cos(radians(user_lat)) * 
        cos(radians(ez.center_lat)) * 
        cos(radians(ez.center_lng) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(ez.center_lat))
      )
    ) <= radius_km
  ORDER BY distance_km ASC, ez.priority ASC;
END;
$$;

-- Insert sample evacuation zones
INSERT INTO evacuation_zones (name, description, zone_type, status, capacity, coordinates, center_lat, center_lng, priority) VALUES
('Downtown Emergency Shelter', 'Main evacuation center in downtown area', 'high_risk', 'available', 500, 
 '[[[40.7128, -74.0060], [40.7138, -74.0060], [40.7138, -74.0050], [40.7128, -74.0050], [40.7128, -74.0060]]]', 
 40.7133, -74.0055, 1),
('Community Center North', 'Secondary evacuation point in northern district', 'medium_risk', 'available', 300,
 '[[[40.7200, -74.0100], [40.7210, -74.0100], [40.7210, -74.0090], [40.7200, -74.0090], [40.7200, -74.0100]]]',
 40.7205, -74.0095, 2),
('School Gymnasium', 'Emergency shelter at local high school', 'low_risk', 'available', 200,
 '[[[40.7000, -74.0200], [40.7010, -74.0200], [40.7010, -74.0190], [40.7000, -74.0190], [40.7000, -74.0200]]]',
 40.7005, -74.0195, 3);

-- Insert sample emergency contacts
INSERT INTO emergency_contacts (name, phone, email, organization, priority) VALUES
('Emergency Services', '911', 'emergency@city.gov', 'City Emergency Management', 1),
('Red Cross', '1-800-RED-CROSS', 'help@redcross.org', 'American Red Cross', 2),
('Local Police', '(555) 123-4567', 'police@city.gov', 'City Police Department', 3);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_evacuation_zones_active ON evacuation_zones(active);
CREATE INDEX IF NOT EXISTS idx_evacuation_zones_priority ON evacuation_zones(priority);
CREATE INDEX IF NOT EXISTS idx_evacuation_zones_coordinates ON evacuation_zones USING GIST (
  ST_Point(center_lng, center_lat)
);

-- Enable Row Level Security (RLS)
ALTER TABLE evacuation_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to evacuation zones" ON evacuation_zones
  FOR SELECT USING (active = true);

CREATE POLICY "Allow public read access to emergency contacts" ON emergency_contacts
  FOR SELECT USING (active = true);

CREATE POLICY "Allow public insert to user locations" ON user_locations
  FOR INSERT WITH CHECK (true);
