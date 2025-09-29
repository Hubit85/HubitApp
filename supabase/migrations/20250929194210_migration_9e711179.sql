-- Agregar las nuevas columnas a la tabla properties si no existen
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS number TEXT,
ADD COLUMN IF NOT EXISTS floor TEXT,
ADD COLUMN IF NOT EXISTS door TEXT,
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'España';

-- Crear comentarios para documentar las columnas
COMMENT ON COLUMN properties.street IS 'Nombre de la calle';
COMMENT ON COLUMN properties.number IS 'Número de la propiedad en la calle';
COMMENT ON COLUMN properties.floor IS 'Piso de la propiedad (para distinguir propiedades individuales)';
COMMENT ON COLUMN properties.door IS 'Puerta/mano de la propiedad (para distinguir propiedades individuales)';
COMMENT ON COLUMN properties.province IS 'Provincia donde se ubica la propiedad';
COMMENT ON COLUMN properties.country IS 'País donde se ubica la propiedad';