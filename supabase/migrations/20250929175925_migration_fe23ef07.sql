-- Crear tabla community_codes si no existe
CREATE TABLE IF NOT EXISTS community_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  street TEXT NOT NULL,
  street_number TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE community_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view community codes" ON community_codes;
DROP POLICY IF EXISTS "Users can insert community codes" ON community_codes;
DROP POLICY IF EXISTS "Users can update their own codes" ON community_codes;
DROP POLICY IF EXISTS "Users can delete their own codes" ON community_codes;

CREATE POLICY "Users can view community codes" ON community_codes FOR SELECT USING (true);
CREATE POLICY "Users can insert community codes" ON community_codes FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own codes" ON community_codes FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own codes" ON community_codes FOR DELETE USING (auth.uid() = created_by);

-- Añadir nuevos campos a la tabla properties si no existen
DO $$
BEGIN
    -- Add street column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'street') THEN
        ALTER TABLE properties ADD COLUMN street TEXT;
    END IF;
    
    -- Add number column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'number') THEN
        ALTER TABLE properties ADD COLUMN number TEXT;
    END IF;
    
    -- Add province column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'province') THEN
        ALTER TABLE properties ADD COLUMN province TEXT;
    END IF;
    
    -- Add country column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'country') THEN
        ALTER TABLE properties ADD COLUMN country TEXT DEFAULT 'España';
    END IF;
    
    -- Add community_code column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'community_code') THEN
        ALTER TABLE properties ADD COLUMN community_code TEXT;
    END IF;
    
    -- Add property_photo_url column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'property_photo_url') THEN
        ALTER TABLE properties ADD COLUMN property_photo_url TEXT;
    END IF;
END $$;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_community_codes_location ON community_codes(country, province, city, street, street_number);
CREATE INDEX IF NOT EXISTS idx_community_codes_code ON community_codes(code);
CREATE INDEX IF NOT EXISTS idx_properties_community_code ON properties(community_code);