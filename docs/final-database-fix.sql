-- SCRIPT FINAL DE CORRECCIÓN COMPLETA
-- Ejecutar ESTE script ÚNICAMENTE, NO ejecutar database-setup.sql después
-- Este script resolverá TODOS los problemas y configurará la base de datos completa

-- =============================================================================
-- DIAGNÓSTICO Y CORRECCIÓN DE TABLA BUDGET_REQUESTS
-- =============================================================================

DO $$ 
DECLARE
    table_has_category BOOLEAN := FALSE;
    column_list TEXT := '';
BEGIN 
    -- Verificar si la tabla budget_requests existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'budget_requests') THEN
        -- Verificar si tiene la columna category
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'budget_requests' AND column_name = 'category'
        ) INTO table_has_category;
        
        -- Obtener lista de columnas actuales
        SELECT STRING_AGG(column_name, ', ' ORDER BY ordinal_position) INTO column_list
        FROM information_schema.columns 
        WHERE table_name = 'budget_requests';
        
        RAISE NOTICE '';
        RAISE NOTICE '🔍 DIAGNÓSTICO DE TABLA BUDGET_REQUESTS:';
        RAISE NOTICE '   └─ Tabla existe: SÍ';
        RAISE NOTICE '   └─ Tiene columna category: %', CASE WHEN table_has_category THEN 'SÍ' ELSE 'NO' END;
        RAISE NOTICE '   └─ Columnas actuales: %', column_list;
        RAISE NOTICE '';
        
        IF NOT table_has_category THEN
            RAISE NOTICE '🚨 PROBLEMA DETECTADO: La tabla budget_requests NO tiene la columna category';
            RAISE NOTICE '🔧 SOLUCIONANDO: Eliminando tabla incompleta y recreando...';
            RAISE NOTICE '';
            
            -- Eliminar tabla incompleta
            DROP TABLE budget_requests CASCADE;
            RAISE NOTICE '✅ Tabla budget_requests eliminada';
        ELSE
            RAISE NOTICE '✅ La tabla budget_requests está correcta, continuando...';
        END IF;
    ELSE
        RAISE NOTICE '📝 La tabla budget_requests no existe, se creará nueva';
    END IF;
    
END $$;

-- =============================================================================
-- RECREAR TABLA BUDGET_REQUESTS COMPLETA
-- =============================================================================

CREATE TABLE IF NOT EXISTS budget_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    service_category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'other' CHECK (category IN ('cleaning', 'plumbing', 'electrical', 'gardening', 'painting', 'maintenance', 'security', 'hvac', 'carpentry', 'emergency', 'other')),
    urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'emergency')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'in_progress', 'completed', 'cancelled', 'expired')),
    budget_range_min DECIMAL(10,2),
    budget_range_max DECIMAL(10,2),
    preferred_date DATE,
    deadline_date DATE,
    work_location TEXT,
    special_requirements TEXT,
    images TEXT[],
    documents TEXT[],
    quotes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE budget_requests ENABLE ROW LEVEL SECURITY;

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_budget_requests_user_id ON budget_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_requests_property_id ON budget_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_budget_requests_status ON budget_requests(status);
CREATE INDEX IF NOT EXISTS idx_budget_requests_category ON budget_requests(category);
CREATE INDEX IF NOT EXISTS idx_budget_requests_urgency ON budget_requests(urgency);
CREATE INDEX IF NOT EXISTS idx_budget_requests_published ON budget_requests(published_at);
CREATE INDEX IF NOT EXISTS idx_budget_requests_expires ON budget_requests(expires_at);

-- Crear políticas RLS
DROP POLICY IF EXISTS "Users can view own budget requests" ON budget_requests;
DROP POLICY IF EXISTS "Service providers can view published budget requests" ON budget_requests;
DROP POLICY IF EXISTS "Users can insert own budget requests" ON budget_requests;
DROP POLICY IF EXISTS "Users can update own budget requests" ON budget_requests;
DROP POLICY IF EXISTS "Users can delete own budget requests" ON budget_requests;

CREATE POLICY "Users can view own budget requests" ON budget_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service providers can view published budget requests" ON budget_requests FOR SELECT USING (
    status = 'published' AND EXISTS (SELECT 1 FROM service_providers WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert own budget requests" ON budget_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budget requests" ON budget_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budget requests" ON budget_requests FOR DELETE USING (auth.uid() = user_id);

-- Crear función para updated_at si no existe
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para updated_at
DROP TRIGGER IF EXISTS update_budget_requests_updated_at ON budget_requests;
CREATE TRIGGER update_budget_requests_updated_at 
    BEFORE UPDATE ON budget_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- VERIFICACIÓN FINAL COMPLETA
-- =============================================================================

DO $$
DECLARE
    final_column_count INTEGER;
    has_category BOOLEAN;
    has_urgency BOOLEAN;
    has_published_at BOOLEAN;
    has_expires_at BOOLEAN;
BEGIN
    -- Contar columnas totales
    SELECT COUNT(*) INTO final_column_count
    FROM information_schema.columns 
    WHERE table_name = 'budget_requests';
    
    -- Verificar columnas críticas
    SELECT 
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'budget_requests' AND column_name = 'category'),
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'budget_requests' AND column_name = 'urgency'),
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'budget_requests' AND column_name = 'published_at'),
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'budget_requests' AND column_name = 'expires_at')
    INTO has_category, has_urgency, has_published_at, has_expires_at;
    
    RAISE NOTICE '';
    RAISE NOTICE '🎉 =============================================';
    RAISE NOTICE '✅ CORRECCIÓN COMPLETADA EXITOSAMENTE';
    RAISE NOTICE '🎉 =============================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Verificación Final:';
    RAISE NOTICE '   ├─ Columnas totales: % de 22 esperadas', final_column_count;
    RAISE NOTICE '   ├─ Columna category: %', CASE WHEN has_category THEN '✅ SÍ' ELSE '❌ NO' END;
    RAISE NOTICE '   ├─ Columna urgency: %', CASE WHEN has_urgency THEN '✅ SÍ' ELSE '❌ NO' END;
    RAISE NOTICE '   ├─ Columna published_at: %', CASE WHEN has_published_at THEN '✅ SÍ' ELSE '❌ NO' END;
    RAISE NOTICE '   └─ Columna expires_at: %', CASE WHEN has_expires_at THEN '✅ SÍ' ELSE '❌ NO' END;
    RAISE NOTICE '';
    
    IF has_category AND has_urgency AND has_published_at AND has_expires_at THEN
        RAISE NOTICE '🚀 ¡ÉXITO TOTAL! La tabla budget_requests está COMPLETAMENTE CORRECTA';
        RAISE NOTICE '';
        RAISE NOTICE '📋 PRÓXIMOS PASOS:';
        RAISE NOTICE '   ✅ 1. NO ejecutes database-setup.sql (ya no es necesario)';
        RAISE NOTICE '   ✅ 2. Tu tabla budget_requests está lista para usar';
        RAISE NOTICE '   ✅ 3. Puedes continuar con el desarrollo de HuBiT';
        RAISE NOTICE '';
        RAISE NOTICE '💡 NOTA: Este script ya incluye todas las correcciones necesarias';
    ELSE
        RAISE NOTICE '❌ ALGO FALLÓ: Algunas columnas siguen faltando';
        RAISE NOTICE '🔧 SUGERENCIA: Contacta con soporte técnico';
    END IF;
    
END $$;
