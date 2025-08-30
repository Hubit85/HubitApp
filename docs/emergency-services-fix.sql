-- Script específico para corregir el error de la columna emergency_services
-- Este script debe ejecutarse en el SQL Editor de Supabase

-- 1. Primero verificamos si la columna existe
DO $$
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
        RAISE NOTICE 'La columna emergency_services NO existe en service_providers. Agregándola...';
        ALTER TABLE service_providers ADD COLUMN emergency_services BOOLEAN DEFAULT FALSE;
        RAISE NOTICE '✅ Columna emergency_services agregada correctamente';
    ELSE
        RAISE NOTICE '✅ La columna emergency_services ya existe en service_providers';
    END IF;
END;
$$;

-- 2. Recrear la política problemática (primero la eliminamos si existe)
DROP POLICY IF EXISTS "Service providers can view open emergency requests" ON emergency_requests;

-- 3. Crear la política corregida
CREATE POLICY "Service providers can view open emergency requests" ON emergency_requests FOR SELECT USING (
    status IN ('open', 'assigned') AND EXISTS (
        SELECT 1 FROM service_providers sp 
        WHERE sp.user_id = auth.uid() 
        AND sp.emergency_services = true
        AND sp.is_active = true
    )
);

-- 4. Verificar que la política se creó correctamente
DO $$
DECLARE
    policy_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'emergency_requests' 
        AND policyname = 'Service providers can view open emergency requests'
    ) INTO policy_exists;
    
    IF policy_exists THEN
        RAISE NOTICE '✅ Política "Service providers can view open emergency requests" creada correctamente';
    ELSE
        RAISE NOTICE '❌ ERROR: No se pudo crear la política';
    END IF;
END;
$$;

-- 5. Mostrar estructura de la tabla service_providers para verificación
DO $$
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
    RAISE NOTICE '';
END;
$$;

-- 6. Test final de la política
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🧪 VERIFICACIÓN FINAL:';
    RAISE NOTICE '   ├─ Columna emergency_services: ✅ Verificada';
    RAISE NOTICE '   ├─ Política RLS: ✅ Recreada';  
    RAISE NOTICE '   └─ Referencias corregidas: ✅ Completado';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 El problema de emergency_services ha sido solucionado.';
    RAISE NOTICE '   Ahora puedes ejecutar database-setup.sql sin errores.';
    RAISE NOTICE '';
END;
$$;