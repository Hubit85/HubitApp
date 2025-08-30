-- HuBiT Database Fix Script
-- Run this if you encounter the "column is_active does not exist" error
-- This script will check and fix any missing columns or structure issues

-- =============================================================================
-- DATABASE STRUCTURE VERIFICATION AND FIX
-- =============================================================================

-- Check if service_categories table exists and its current structure
DO $$
BEGIN
    -- Check if service_categories table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'service_categories') THEN
        RAISE NOTICE 'service_categories table exists';
        
        -- Check if is_active column exists
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'service_categories' AND column_name = 'is_active') THEN
            RAISE NOTICE 'Adding missing is_active column to service_categories';
            ALTER TABLE service_categories ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
        ELSE
            RAISE NOTICE 'is_active column already exists';
        END IF;
        
        -- Check other potentially missing columns
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'service_categories' AND column_name = 'sort_order') THEN
            RAISE NOTICE 'Adding missing sort_order column to service_categories';
            ALTER TABLE service_categories ADD COLUMN sort_order INTEGER DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'service_categories' AND column_name = 'emergency_available') THEN
            RAISE NOTICE 'Adding missing emergency_available column to service_categories';
            ALTER TABLE service_categories ADD COLUMN emergency_available BOOLEAN DEFAULT FALSE;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'service_categories' AND column_name = 'created_at') THEN
            RAISE NOTICE 'Adding missing created_at column to service_categories';
            ALTER TABLE service_categories ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'service_categories' AND column_name = 'updated_at') THEN
            RAISE NOTICE 'Adding missing updated_at column to service_categories';
            ALTER TABLE service_categories ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
        
    ELSE
        RAISE NOTICE 'service_categories table does not exist, creating it now';
        -- Create the table with all required columns
        CREATE TABLE service_categories (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            parent_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
            icon TEXT,
            color TEXT DEFAULT '#3B82F6',
            is_active BOOLEAN DEFAULT TRUE,
            sort_order INTEGER DEFAULT 0,
            emergency_available BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
        
        -- Create policy
        DROP POLICY IF EXISTS "Anyone can view service categories" ON service_categories;
        CREATE POLICY "Anyone can view service categories" ON service_categories FOR SELECT TO authenticated USING (is_active = true);
    END IF;
END;
$$;

-- Fix other potentially missing tables or columns
DO $$
BEGIN
    -- Check and fix properties table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'properties') THEN
        -- Add missing city column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'properties' AND column_name = 'city') THEN
            RAISE NOTICE 'Adding missing city column to properties';
            ALTER TABLE properties ADD COLUMN city TEXT NOT NULL DEFAULT '';
            -- Update the constraint to allow empty strings initially
            ALTER TABLE properties ALTER COLUMN city DROP DEFAULT;
        END IF;
        
        -- Add missing postal_code column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'properties' AND column_name = 'postal_code') THEN
            RAISE NOTICE 'Adding missing postal_code column to properties';
            ALTER TABLE properties ADD COLUMN postal_code TEXT;
        END IF;
    END IF;
    
    -- Check service_providers table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'service_providers') THEN
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'service_providers' AND column_name = 'is_active') THEN
            RAISE NOTICE 'Adding missing is_active column to service_providers';
            ALTER TABLE service_providers ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
        END IF;
    END IF;
END;
$$;

-- Insert service categories data if the table is empty
DO $$
DECLARE
    category_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO category_count FROM service_categories;
    
    IF category_count = 0 THEN
        RAISE NOTICE 'Inserting initial service categories data';
        
        -- Insert main service categories with hierarchical structure
        INSERT INTO service_categories (id, name, description, parent_id, icon, color, sort_order, emergency_available) VALUES
        -- Main categories
        ('550e8400-e29b-41d4-a716-446655440001', 'Fontanería', 'Servicios de fontanería y plomería', NULL, 'Wrench', '#3B82F6', 1, true),
        ('550e8400-e29b-41d4-a716-446655440002', 'Electricidad', 'Servicios eléctricos y instalaciones', NULL, 'Zap', '#F59E0B', 2, true),
        ('550e8400-e29b-41d4-a716-446655440003', 'Limpieza', 'Servicios de limpieza y mantenimiento', NULL, 'Sparkles', '#10B981', 3, false),
        ('550e8400-e29b-41d4-a716-446655440004', 'Jardinería', 'Cuidado de jardines y espacios verdes', NULL, 'Trees', '#059669', 4, false),
        ('550e8400-e29b-41d4-a716-446655440005', 'Pintura', 'Servicios de pintura y decoración', NULL, 'Paintbrush', '#8B5CF6', 5, false),
        ('550e8400-e29b-41d4-a716-446655440006', 'Climatización', 'HVAC, calefacción y aire acondicionado', NULL, 'Thermometer', '#EF4444', 6, true),
        ('550e8400-e29b-41d4-a716-446655440007', 'Carpintería', 'Trabajos en madera y carpintería', NULL, 'Hammer', '#D97706', 7, false),
        ('550e8400-e29b-41d4-a716-446655440008', 'Cerrajería', 'Servicios de cerrajería y seguridad', NULL, 'Key', '#6366F1', 8, true),
        ('550e8400-e29b-41d4-a716-446655440009', 'Albañilería', 'Trabajos de construcción y reformas', NULL, 'Wrench', '#64748B', 9, false),
        ('550e8400-e29b-41d4-a716-446655440010', 'Techado', 'Reparación y mantenimiento de techos', NULL, 'Home', '#0F172A', 10, true),
        ('550e8400-e29b-41d4-a716-446655440011', 'Vidriería', 'Instalación y reparación de cristales', NULL, 'Square', '#06B6D4', 11, true),
        ('550e8400-e29b-41d4-a716-446655440012', 'Seguridad', 'Sistemas de seguridad y alarmas', NULL, 'Shield', '#DC2626', 12, false),
        ('550e8400-e29b-41d4-a716-446655440013', 'Electrodomésticos', 'Reparación de electrodomésticos', NULL, 'Zap', '#7C3AED', 13, false),
        ('550e8400-e29b-41d4-a716-446655440014', 'Piscinas', 'Mantenimiento y reparación de piscinas', NULL, 'Waves', '#0EA5E9', 14, false),
        ('550e8400-e29b-41d4-a716-446655440015', 'Mudanzas', 'Servicios de mudanza y transporte', NULL, 'Truck', '#F97316', 15, false)
        ON CONFLICT (id) DO NOTHING;

        -- Insert subcategories for Fontanería
        INSERT INTO service_categories (id, name, description, parent_id, icon, color, sort_order, emergency_available) VALUES
        ('550e8400-e29b-41d4-a716-446655440101', 'Reparación de fugas', 'Reparación de fugas de agua', '550e8400-e29b-41d4-a716-446655440001', 'Droplets', '#3B82F6', 1, true),
        ('550e8400-e29b-41d4-a716-446655440102', 'Desatascos', 'Desatasco de tuberías y desagües', '550e8400-e29b-41d4-a716-446655440001', 'AlertCircle', '#DC2626', 2, true),
        ('550e8400-e29b-41d4-a716-446655440103', 'Instalación sanitaria', 'Instalación de baños y cocinas', '550e8400-e29b-41d4-a716-446655440001', 'Wrench', '#3B82F6', 3, false),
        ('550e8400-e29b-41d4-a716-446655440104', 'Calentadores', 'Reparación e instalación de calentadores', '550e8400-e29b-41d4-a716-446655440001', 'Flame', '#F59E0B', 4, true)
        ON CONFLICT (id) DO NOTHING;

        -- Insert subcategories for Electricidad
        INSERT INTO service_categories (id, name, description, parent_id, icon, color, sort_order, emergency_available) VALUES
        ('550e8400-e29b-41d4-a716-446655440201', 'Instalaciones eléctricas', 'Nuevas instalaciones eléctricas', '550e8400-e29b-41d4-a716-446655440002', 'Zap', '#F59E0B', 1, false),
        ('550e8400-e29b-41d4-a716-446655440202', 'Reparaciones urgentes', 'Averías eléctricas urgentes', '550e8400-e29b-41d4-a716-446655440002', 'AlertTriangle', '#DC2626', 2, true),
        ('550e8400-e29b-41d4-a716-446655440203', 'Iluminación', 'Instalación de sistemas de iluminación', '550e8400-e29b-41d4-a716-446655440002', 'Lightbulb', '#FCD34D', 3, false),
        ('550e8400-e29b-41d4-a716-446655440204', 'Domótica', 'Sistemas inteligentes del hogar', '550e8400-e29b-41d4-a716-446655440002', 'Smartphone', '#8B5CF6', 4, false)
        ON CONFLICT (id) DO NOTHING;

        RAISE NOTICE 'Service categories data inserted successfully';
    ELSE
        RAISE NOTICE 'Service categories already contain data (% categories found)', category_count;
    END IF;
END;
$$;

-- Create missing indexes
DO $$
BEGIN
    -- Check and create missing indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_service_categories_active') THEN
        RAISE NOTICE 'Creating missing index: idx_service_categories_active';
        CREATE INDEX idx_service_categories_active ON service_categories(is_active);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_service_categories_parent') THEN
        RAISE NOTICE 'Creating missing index: idx_service_categories_parent';
        CREATE INDEX idx_service_categories_parent ON service_categories(parent_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_service_categories_emergency') THEN
        RAISE NOTICE 'Creating missing index: idx_service_categories_emergency';
        CREATE INDEX idx_service_categories_emergency ON service_categories(emergency_available);
    END IF;
END;
$$;

-- Test the fix by running a query that was failing
DO $$
DECLARE
    test_count INTEGER;
    rec RECORD;  -- Properly declare the record variable
BEGIN
    -- This should now work without the "column does not exist" error
    SELECT COUNT(*) INTO test_count FROM service_categories WHERE is_active = true;
    RAISE NOTICE 'SUCCESS: Found % active service categories', test_count;
    
    -- Show categories with properly declared record variable
    RAISE NOTICE 'Available main categories:';
    FOR rec IN SELECT name, is_active FROM service_categories WHERE parent_id IS NULL ORDER BY sort_order LOOP
        RAISE NOTICE '  - % (active: %)', rec.name, rec.is_active;
    END LOOP;
END;
$$;

-- Final verification
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🔧 ============================================';
    RAISE NOTICE '✅ Database Fix COMPLETED!';
    RAISE NOTICE '🔧 ============================================';
    RAISE NOTICE '';
    RAISE NOTICE 'The "column is_active does not exist" error should now be resolved.';
    RAISE NOTICE 'You can now run the main database-setup.sql script safely.';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Run the main database-setup.sql script';
    RAISE NOTICE '2. Run database-verification.sql to verify everything is working';
    RAISE NOTICE '3. Update your application environment variables';
    RAISE NOTICE '';
END;
$$;