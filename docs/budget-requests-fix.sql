-- Script específico para arreglar la tabla budget_requests
-- Ejecutar ANTES del database-setup.sql si tienes problemas con la columna "category"

-- Eliminar y recrear la tabla budget_requests con todas las columnas necesarias
DO $$ 
BEGIN 
    -- Verificar si la tabla budget_requests existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'budget_requests') THEN
        -- Desactivar RLS temporalmente para poder eliminar
        ALTER TABLE budget_requests DISABLE ROW LEVEL SECURITY;
        
        -- Eliminar triggers si existen
        DROP TRIGGER IF EXISTS update_budget_requests_updated_at ON budget_requests;
        
        -- Eliminar políticas RLS si existen
        DROP POLICY IF EXISTS "Users can view own budget requests" ON budget_requests;
        DROP POLICY IF EXISTS "Service providers can view published budget requests" ON budget_requests;
        DROP POLICY IF EXISTS "Users can insert own budget requests" ON budget_requests;
        DROP POLICY IF EXISTS "Users can update own budget requests" ON budget_requests;
        DROP POLICY IF EXISTS "Users can delete own budget requests" ON budget_requests;
        
        -- Eliminar índices si existen
        DROP INDEX IF EXISTS idx_budget_requests_user_id;
        DROP INDEX IF EXISTS idx_budget_requests_property_id;
        DROP INDEX IF EXISTS idx_budget_requests_status;
        DROP INDEX IF EXISTS idx_budget_requests_category;
        DROP INDEX IF EXISTS idx_budget_requests_urgency;
        DROP INDEX IF EXISTS idx_budget_requests_published;
        DROP INDEX IF EXISTS idx_budget_requests_expires;
        
        -- Eliminar la tabla
        DROP TABLE budget_requests CASCADE;
        
        RAISE NOTICE '🗑️ Tabla budget_requests eliminada exitosamente';
    ELSE
        RAISE NOTICE 'ℹ️ La tabla budget_requests no existe, se creará nueva';
    END IF;
    
    -- Crear la tabla budget_requests con TODAS las columnas correctas
    CREATE TABLE budget_requests (
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
    
    RAISE NOTICE '✅ Tabla budget_requests creada con TODAS las columnas correctas';
    
    -- Habilitar RLS
    ALTER TABLE budget_requests ENABLE ROW LEVEL SECURITY;
    
    -- Crear índices
    CREATE INDEX idx_budget_requests_user_id ON budget_requests(user_id);
    CREATE INDEX idx_budget_requests_property_id ON budget_requests(property_id);
    CREATE INDEX idx_budget_requests_status ON budget_requests(status);
    CREATE INDEX idx_budget_requests_category ON budget_requests(category);
    CREATE INDEX idx_budget_requests_urgency ON budget_requests(urgency);
    CREATE INDEX idx_budget_requests_published ON budget_requests(published_at);
    CREATE INDEX idx_budget_requests_expires ON budget_requests(expires_at);
    
    -- Crear políticas RLS
    CREATE POLICY "Users can view own budget requests" ON budget_requests FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Service providers can view published budget requests" ON budget_requests FOR SELECT USING (
        status = 'published' AND EXISTS (SELECT 1 FROM service_providers WHERE user_id = auth.uid())
    );
    CREATE POLICY "Users can insert own budget requests" ON budget_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update own budget requests" ON budget_requests FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can delete own budget requests" ON budget_requests FOR DELETE USING (auth.uid() = user_id);
    
    -- Crear trigger para updated_at
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';
    
    CREATE TRIGGER update_budget_requests_updated_at 
        BEFORE UPDATE ON budget_requests 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    RAISE NOTICE '🛡️ RLS, políticas e índices configurados correctamente';
    
    RAISE NOTICE '';
    RAISE NOTICE '🎉 =============================================';
    RAISE NOTICE '✅ TABLA BUDGET_REQUESTS ARREGLADA COMPLETAMENTE';
    RAISE NOTICE '🎉 =============================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Columnas incluidas:';
    RAISE NOTICE '   ✅ category (con valores válidos)';
    RAISE NOTICE '   ✅ urgency (low, normal, high, emergency)';
    RAISE NOTICE '   ✅ published_at (timestamp)';
    RAISE NOTICE '   ✅ expires_at (timestamp)';
    RAISE NOTICE '   ✅ Todas las demás columnas estándar';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 AHORA PUEDES EJECUTAR database-setup.sql SIN ERRORES';
    RAISE NOTICE '';
    
END $$;
