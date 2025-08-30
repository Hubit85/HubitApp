-- Script de corrección para columnas faltantes
-- Ejecutar ANTES del database-setup.sql si ya tienes algunas tablas creadas

-- Verificar y añadir columna is_verified a la tabla ratings si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'ratings' AND column_name = 'is_verified'
    ) THEN
        ALTER TABLE ratings ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
        RAISE NOTICE '✅ Columna is_verified añadida a la tabla ratings';
    ELSE
        RAISE NOTICE '✅ La columna is_verified ya existe en la tabla ratings';
    END IF;
END $$;

-- Verificar y añadir columna is_verified a la tabla profiles si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'is_verified'
    ) THEN
        ALTER TABLE profiles ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
        RAISE NOTICE '✅ Columna is_verified añadida a la tabla profiles';
    ELSE
        RAISE NOTICE '✅ La columna is_verified ya existe en la tabla profiles';
    END IF;
END $$;

-- Verificar y añadir columna emergency_services a la tabla service_providers si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'service_providers' AND column_name = 'emergency_services'
    ) THEN
        ALTER TABLE service_providers ADD COLUMN emergency_services BOOLEAN DEFAULT FALSE;
        RAISE NOTICE '✅ Columna emergency_services añadida a la tabla service_providers';
    ELSE
        RAISE NOTICE '✅ La columna emergency_services ya existe en la tabla service_providers';
    END IF;
END $$;

-- Verificar y añadir columna is_active a la tabla service_categories si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'service_categories' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE service_categories ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
        RAISE NOTICE '✅ Columna is_active añadida a la tabla service_categories';
    ELSE
        RAISE NOTICE '✅ La columna is_active ya existe en la tabla service_categories';
    END IF;
END $$;

-- Verificar y añadir columna property_status a la tabla properties si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'property_status'
    ) THEN
        ALTER TABLE properties ADD COLUMN property_status TEXT DEFAULT 'active' CHECK (property_status IN ('active', 'inactive', 'maintenance'));
        RAISE NOTICE '✅ Columna property_status añadida a la tabla properties';
    ELSE
        RAISE NOTICE '✅ La columna property_status ya existe en la tabla properties';
    END IF;
END $$;

-- Verificar y añadir columnas de geolocalización a la tabla properties si no existen
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'latitude'
    ) THEN
        ALTER TABLE properties ADD COLUMN latitude DECIMAL(10, 8);
        RAISE NOTICE '✅ Columna latitude añadida a la tabla properties';
    ELSE
        RAISE NOTICE '✅ La columna latitude ya existe en la tabla properties';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'longitude'
    ) THEN
        ALTER TABLE properties ADD COLUMN longitude DECIMAL(11, 8);
        RAISE NOTICE '✅ Columna longitude añadida a la tabla properties';
    ELSE
        RAISE NOTICE '✅ La columna longitude ya existe en la tabla properties';
    END IF;
END $$;

-- Verificar y añadir columna urgency a la tabla budget_requests si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'budget_requests' AND column_name = 'urgency'
    ) THEN
        ALTER TABLE budget_requests ADD COLUMN urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'emergency'));
        RAISE NOTICE '✅ Columna urgency añadida a la tabla budget_requests';
    ELSE
        RAISE NOTICE '✅ La columna urgency ya existe en la tabla budget_requests';
    END IF;
END $$;

-- Verificar y añadir columna published_at a la tabla budget_requests si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'budget_requests' AND column_name = 'published_at'
    ) THEN
        ALTER TABLE budget_requests ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE '✅ Columna published_at añadida a la tabla budget_requests';
    ELSE
        RAISE NOTICE '✅ La columna published_at ya existe en la tabla budget_requests';
    END IF;
END $$;

-- Verificar y añadir columna expires_at a la tabla budget_requests si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'budget_requests' AND column_name = 'expires_at'
    ) THEN
        ALTER TABLE budget_requests ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE '✅ Columna expires_at añadida a la tabla budget_requests';
    ELSE
        RAISE NOTICE '✅ La columna expires_at ya existe en la tabla budget_requests';
    END IF;
END $$;

-- Verificar y añadir columna service_categories a la tabla service_providers si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'service_providers' AND column_name = 'service_categories'
    ) THEN
        ALTER TABLE service_providers ADD COLUMN service_categories UUID[] DEFAULT '{}';
        RAISE NOTICE '✅ Columna service_categories añadida a la tabla service_providers';
    ELSE
        RAISE NOTICE '✅ La columna service_categories ya existe en la tabla service_providers';
    END IF;
END $$;

-- Verificar todas las columnas críticas
DO $$
DECLARE
    missing_columns TEXT := '';
    table_exists BOOLEAN;
BEGIN
    -- Verificar tabla ratings
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ratings') INTO table_exists;
    IF table_exists THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'is_verified') THEN
            missing_columns := missing_columns || 'ratings.is_verified, ';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'helpful_votes') THEN
            missing_columns := missing_columns || 'ratings.helpful_votes, ';
        END IF;
    END IF;

    -- Verificar tabla profiles
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') INTO table_exists;
    IF table_exists THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_verified') THEN
            missing_columns := missing_columns || 'profiles.is_verified, ';
        END IF;
    END IF;

    -- Verificar tabla service_providers
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'service_providers') INTO table_exists;
    IF table_exists THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_providers' AND column_name = 'emergency_services') THEN
            missing_columns := missing_columns || 'service_providers.emergency_services, ';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_providers' AND column_name = 'service_categories') THEN
            missing_columns := missing_columns || 'service_providers.service_categories, ';
        END IF;
    END IF;

    -- Verificar tabla service_categories
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'service_categories') INTO table_exists;
    IF table_exists THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_categories' AND column_name = 'is_active') THEN
            missing_columns := missing_columns || 'service_categories.is_active, ';
        END IF;
    END IF;

    -- Verificar tabla properties
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'properties') INTO table_exists;
    IF table_exists THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'property_status') THEN
            missing_columns := missing_columns || 'properties.property_status, ';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'latitude') THEN
            missing_columns := missing_columns || 'properties.latitude, ';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'longitude') THEN
            missing_columns := missing_columns || 'properties.longitude, ';
        END IF;
    END IF;

    -- Verificar tabla budget_requests
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'budget_requests') INTO table_exists;
    IF table_exists THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'budget_requests' AND column_name = 'urgency') THEN
            missing_columns := missing_columns || 'budget_requests.urgency, ';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'budget_requests' AND column_name = 'published_at') THEN
            missing_columns := missing_columns || 'budget_requests.published_at, ';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'budget_requests' AND column_name = 'expires_at') THEN
            missing_columns := missing_columns || 'budget_requests.expires_at, ';
        END IF;
    END IF;

    IF missing_columns != '' THEN
        missing_columns := rtrim(missing_columns, ', ');
        RAISE NOTICE '';
        RAISE NOTICE '⚠️  COLUMNAS FALTANTES DETECTADAS: %', missing_columns;
        RAISE NOTICE '❌ Tu base de datos tiene tablas incompletas.';
        RAISE NOTICE '';
        RAISE NOTICE '🔧 SOLUCIONES:';
        RAISE NOTICE '   OPCIÓN A: Ejecutar column-fix.sql primero, luego database-setup.sql';
        RAISE NOTICE '   OPCIÓN B: Borrar todas las tablas y ejecutar solo database-setup.sql';
        RAISE NOTICE '';
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '✅ ============================================';
        RAISE NOTICE '✅ TODAS LAS COLUMNAS ESTÁN CORRECTAS';
        RAISE NOTICE '✅ ============================================';
        RAISE NOTICE '';
        RAISE NOTICE '🚀 Ahora puedes ejecutar database-setup.sql sin errores';
        RAISE NOTICE '';
    END IF;
END $$;