-- Actualizar la tabla properties para incluir los nuevos campos
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS number TEXT,
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'España',
ADD COLUMN IF NOT EXISTS community_code TEXT,
ADD COLUMN IF NOT EXISTS property_photo_url TEXT;

-- Crear tabla para gestionar códigos de comunidad únicos
CREATE TABLE IF NOT EXISTS community_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  street TEXT NOT NULL,
  street_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en la nueva tabla
ALTER TABLE community_codes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para community_codes
CREATE POLICY "Users can view all community codes" ON community_codes FOR SELECT USING (true);
CREATE POLICY "Users can insert community codes" ON community_codes FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their community codes" ON community_codes FOR UPDATE USING (auth.uid() = created_by);

-- Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_community_codes_location ON community_codes(country, province, city, street, street_number);
CREATE INDEX IF NOT EXISTS idx_community_codes_code ON community_codes(code);
CREATE INDEX IF NOT EXISTS idx_properties_community_code ON properties(community_code);

-- Migrar datos existentes de address a street (opcional, para datos existentes)
UPDATE properties 
SET street = address 
WHERE street IS NULL AND address IS NOT NULL;