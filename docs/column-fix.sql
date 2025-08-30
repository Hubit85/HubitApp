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
    END IF;

    -- Verificar tabla service_categories
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'service_categories') INTO table_exists;
    IF table_exists THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_categories' AND column_name = 'is_active') THEN
            missing_columns := missing_columns || 'service_categories.is_active, ';
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