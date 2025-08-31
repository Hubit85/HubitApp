-- Script para preparar la columna emergency_services antes de ejecutar database-setup.sql
-- Este script debe ejecutarse ANTES de database-setup.sql

-- 1. Verificar si la tabla service_providers existe
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'service_providers' 
        AND table_schema = 'public'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE '⚠️  La tabla service_providers no existe aún.';
        RAISE NOTICE '   Esto es normal si es la primera vez ejecutando el setup.';
        RAISE NOTICE '   Puedes proceder a ejecutar database-setup.sql directamente.';
    ELSE
        RAISE NOTICE '✅ La tabla service_providers ya existe. Verificando columnas...';
        
        -- 2. Verificar si la columna emergency_services existe
        DECLARE
            column_exists BOOLEAN;
        BEGIN
            SELECT EXISTS (
                SELECT 1 
                FROM information_schema.columns 
                WHERE table_name = 'service_providers' 
                AND column_name = 'emergency_services'
                AND table_schema = 'public'
            ) INTO column_exists;
            
            IF NOT column_exists THEN
                RAISE NOTICE '   ├─ La columna emergency_services NO existe. Agregándola...';
                ALTER TABLE service_providers ADD COLUMN emergency_services BOOLEAN DEFAULT FALSE;
                RAISE NOTICE '   └─ ✅ Columna emergency_services agregada correctamente';
            ELSE
                RAISE NOTICE '   └─ ✅ La columna emergency_services ya existe';
            END IF;
        END;
        
        -- 3. Mostrar estructura actualizada de la tabla service_providers
        DECLARE
            rec RECORD;
        BEGIN
            RAISE NOTICE '';
            RAISE NOTICE '📋 Estructura actual de la tabla service_providers:';
            RAISE NOTICE '────────────────────────────────────────────────';
            
            FOR rec IN 
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = 'service_providers' 
                AND table_schema = 'public'
                ORDER BY ordinal_position
            LOOP
                RAISE NOTICE '   ├─ % | % | Nullable: % | Default: %', 
                    rec.column_name, 
                    rec.data_type, 
                    rec.is_nullable,
                    COALESCE(rec.column_default, 'NULL');
            END LOOP;
            
            RAISE NOTICE '────────────────────────────────────────────────';
        END;
    END IF;
END;
$$;

-- 4. Mensaje final con instrucciones
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎯 SIGUIENTE PASO:';
    RAISE NOTICE '   Ahora puedes ejecutar database-setup.sql sin problemas.';
    RAISE NOTICE '   La columna emergency_services estará disponible para las políticas.';
    RAISE NOTICE '';
END;
$$;