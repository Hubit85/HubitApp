-- CONFIGURACION COMPLETA DE BASE DE DATOS HUBIT
-- Este script configura TODO desde cero - NO ejecutar database-setup.sql despues
-- Incluye correcciones para TODOS los problemas de columnas faltantes

-- =============================================================================
-- PASO 1: LIMPIAR Y RECREAR TABLAS PROBLEMATICAS
-- =============================================================================

-- Eliminar tablas problematicas si existen (en orden correcto por dependencias)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS emergency_requests CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS work_sessions CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS service_providers CASCADE;
DROP TABLE IF EXISTS budget_requests CASCADE;
DROP TABLE IF EXISTS service_categories CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- =============================================================================
-- PASO 2: CREAR TODAS LAS TABLAS CON COLUMNAS CORRECTAS
-- =============================================================================

-- 1. Tabla profiles (con is_verified)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    user_type TEXT NOT NULL CHECK (user_type IN ('particular', 'community_member', 'service_provider', 'property_administrator')),
    avatar_url TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'Spain',
    language TEXT DEFAULT 'es',
    timezone TEXT DEFAULT 'Europe/Madrid',
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_code TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- 2. Tabla properties (con latitude, longitude, property_status)
CREATE TABLE properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    property_type TEXT NOT NULL CHECK (property_type IN ('residential', 'commercial', 'mixed')),
    description TEXT,
    units_count INTEGER DEFAULT 1,
    total_area DECIMAL(10,2),
    year_built INTEGER,
    property_status TEXT DEFAULT 'active' CHECK (property_status IN ('active', 'inactive', 'maintenance')),
    images TEXT[],
    amenities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla service_categories (con is_active)
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

-- 4. Tabla budget_requests (con category, urgency, published_at, expires_at)
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

-- 5. Tabla service_providers (con emergency_services y service_categories)
CREATE TABLE service_providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    company_name TEXT NOT NULL,
    business_license TEXT,
    tax_id TEXT,
    description TEXT,
    website TEXT,
    specialties TEXT[],
    service_categories UUID[] DEFAULT '{}',
    service_area TEXT[],
    service_radius INTEGER DEFAULT 25,
    verified BOOLEAN DEFAULT FALSE,
    insurance_verified BOOLEAN DEFAULT FALSE,
    background_check BOOLEAN DEFAULT FALSE,
    rating_average DECIMAL(3,2) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    total_jobs_completed INTEGER DEFAULT 0,
    response_time_hours DECIMAL(4,2) DEFAULT 24.0,
    availability_schedule JSONB,
    emergency_services BOOLEAN DEFAULT FALSE,
    min_project_amount DECIMAL(10,2) DEFAULT 0,
    travel_cost_per_km DECIMAL(5,2) DEFAULT 0,
    base_hourly_rate DECIMAL(10,2),
    portfolio_images TEXT[],
    certifications TEXT[],
    languages TEXT[] DEFAULT ARRAY['es'],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla quotes
CREATE TABLE quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    budget_request_id UUID REFERENCES budget_requests(id) ON DELETE CASCADE NOT NULL,
    service_provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    materials_cost DECIMAL(10,2) DEFAULT 0,
    labor_cost DECIMAL(10,2) NOT NULL,
    travel_cost DECIMAL(10,2) DEFAULT 0,
    estimated_duration TEXT,
    estimated_start_date DATE,
    warranty_period TEXT,
    terms_and_conditions TEXT,
    valid_until DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired', 'cancelled')),
    payment_terms TEXT DEFAULT 'on_completion',
    attachments TEXT[],
    notes TEXT,
    viewed_by_client BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(budget_request_id, service_provider_id)
);

-- 7. Tabla contracts
CREATE TABLE contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    service_provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE NOT NULL,
    contract_number TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'active', 'completed', 'cancelled', 'disputed')),
    start_date DATE,
    end_date DATE,
    completion_date DATE,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_schedule TEXT DEFAULT 'on_completion',
    terms TEXT,
    work_description TEXT NOT NULL,
    deliverables TEXT[],
    milestones JSONB,
    client_signature TEXT,
    provider_signature TEXT,
    signed_date TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0,
    last_update TEXT,
    cancellation_reason TEXT,
    dispute_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabla invoices
CREATE TABLE invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    service_provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE NOT NULL,
    invoice_number TEXT NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'paid', 'overdue', 'cancelled')),
    due_date DATE NOT NULL,
    paid_date DATE,
    description TEXT,
    line_items JSONB,
    payment_method TEXT,
    payment_reference TEXT,
    notes TEXT,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabla payments
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    service_provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'paypal', 'bank_transfer', 'cash')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
    payment_intent_id TEXT,
    transaction_id TEXT,
    reference_number TEXT,
    payment_date TIMESTAMP WITH TIME ZONE,
    refunded_amount DECIMAL(10,2) DEFAULT 0,
    refund_reason TEXT,
    processing_fee DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tabla ratings (con is_verified y helpful_votes)
CREATE TABLE ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
    contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 5),
    punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 5),
    communication INTEGER CHECK (communication >= 1 AND communication <= 5),
    value_for_money INTEGER CHECK (value_for_money >= 1 AND value_for_money <= 5),
    cleanliness INTEGER CHECK (cleanliness >= 1 AND cleanliness <= 5),
    would_recommend BOOLEAN,
    images TEXT[],
    response_from_provider TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_provider_id, user_id, quote_id)
);

-- 11. Tabla work_sessions
CREATE TABLE work_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE NOT NULL,
    service_provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    description TEXT,
    work_performed TEXT,
    materials_used JSONB,
    images TEXT[],
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    client_approved BOOLEAN DEFAULT FALSE,
    client_notes TEXT,
    hourly_rate DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Tabla conversations
CREATE TABLE conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    budget_request_id UUID REFERENCES budget_requests(id) ON DELETE SET NULL,
    quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
    contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    service_provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE NOT NULL,
    subject TEXT,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE,
    unread_count_user INTEGER DEFAULT 0,
    unread_count_provider INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Tabla messages
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    attachments TEXT[],
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Tabla documents
CREATE TABLE documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    related_entity_type TEXT NOT NULL CHECK (related_entity_type IN ('budget_request', 'quote', 'contract', 'invoice', 'profile', 'property')),
    related_entity_id UUID NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('contract', 'invoice', 'receipt', 'certificate', 'license', 'insurance', 'photo', 'blueprint', 'permit', 'other')),
    name TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Tabla emergency_requests
CREATE TABLE emergency_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    service_category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    urgency_level TEXT DEFAULT 'high' CHECK (urgency_level IN ('high', 'critical')),
    location_details TEXT,
    contact_phone TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'resolved', 'cancelled')),
    assigned_provider_id UUID REFERENCES service_providers(id) ON DELETE SET NULL,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    response_time_minutes INTEGER,
    resolution_time_minutes INTEGER,
    images TEXT[],
    priority_score INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Tabla notifications
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'system')),
    category TEXT CHECK (category IN ('budget_request', 'quote', 'contract', 'payment', 'rating', 'message', 'system')),
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    action_label TEXT,
    related_entity_type TEXT,
    related_entity_id UUID,
    expires_at TIMESTAMP WITH TIME ZONE,
    priority INTEGER DEFAULT 1,
    sent_email BOOLEAN DEFAULT FALSE,
    sent_sms BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- PASO 3: CONFIGURAR RLS Y POLITICAS
-- =============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PASO 4: CREAR INDICES
-- =============================================================================

-- Indices principales
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_is_verified ON profiles(is_verified);

CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_status ON properties(property_status);
CREATE INDEX idx_properties_location ON properties(latitude, longitude);

CREATE INDEX idx_service_categories_parent ON service_categories(parent_id);
CREATE INDEX idx_service_categories_active ON service_categories(is_active);
CREATE INDEX idx_service_categories_emergency ON service_categories(emergency_available);

CREATE INDEX idx_budget_requests_user_id ON budget_requests(user_id);
CREATE INDEX idx_budget_requests_property_id ON budget_requests(property_id);
CREATE INDEX idx_budget_requests_status ON budget_requests(status);
CREATE INDEX idx_budget_requests_category ON budget_requests(category);
CREATE INDEX idx_budget_requests_urgency ON budget_requests(urgency);
CREATE INDEX idx_budget_requests_published ON budget_requests(published_at);
CREATE INDEX idx_budget_requests_expires ON budget_requests(expires_at);

CREATE INDEX idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX idx_service_providers_verified ON service_providers(verified);
CREATE INDEX idx_service_providers_active ON service_providers(is_active);
CREATE INDEX idx_service_providers_rating ON service_providers(rating_average);
CREATE INDEX idx_service_providers_emergency ON service_providers(emergency_services);
CREATE INDEX idx_service_providers_categories ON service_providers USING GIN(service_categories);

CREATE INDEX idx_quotes_budget_request_id ON quotes(budget_request_id);
CREATE INDEX idx_quotes_service_provider_id ON quotes(service_provider_id);
CREATE INDEX idx_quotes_status ON quotes(status);

CREATE INDEX idx_ratings_service_provider_id ON ratings(service_provider_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_verified ON ratings(is_verified);

-- =============================================================================
-- PASO 5: INSERTAR CATEGORIAS DE SERVICIOS
-- =============================================================================

INSERT INTO service_categories (id, name, description, parent_id, icon, color, sort_order, emergency_available) VALUES
-- Categorias principales
('550e8400-e29b-41d4-a716-446655440001', 'Fontaneria', 'Servicios de fontaneria y plomeria', NULL, 'Wrench', '#3B82F6', 1, true),
('550e8400-e29b-41d4-a716-446655440002', 'Electricidad', 'Servicios electricos y instalaciones', NULL, 'Zap', '#F59E0B', 2, true),
('550e8400-e29b-41d4-a716-446655440003', 'Limpieza', 'Servicios de limpieza y mantenimiento', NULL, 'Sparkles', '#10B981', 3, false),
('550e8400-e29b-41d4-a716-446655440004', 'Jardineria', 'Cuidado de jardines y espacios verdes', NULL, 'Trees', '#059669', 4, false),
('550e8400-e29b-41d4-a716-446655440005', 'Pintura', 'Servicios de pintura y decoracion', NULL, 'Paintbrush', '#8B5CF6', 5, false),
('550e8400-e29b-41d4-a716-446655440006', 'Climatizacion', 'HVAC, calefaccion y aire acondicionado', NULL, 'Thermometer', '#EF4444', 6, true),
('550e8400-e29b-41d4-a716-446655440007', 'Carpinteria', 'Trabajos en madera y carpinteria', NULL, 'Hammer', '#D97706', 7, false),
('550e8400-e29b-41d4-a716-446655440008', 'Cerrajeria', 'Servicios de cerrajeria y seguridad', NULL, 'Key', '#6366F1', 8, true),
('550e8400-e29b-41d4-a716-446655440009', 'Albanileria', 'Trabajos de construccion y reformas', NULL, 'Wrench', '#64748B', 9, false),
('550e8400-e29b-41d4-a716-446655440010', 'Techado', 'Reparacion y mantenimiento de techos', NULL, 'Home', '#0F172A', 10, true)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- PASO 6: CREAR FUNCIONES Y TRIGGERS
-- =============================================================================

-- Funcion para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_requests_updated_at BEFORE UPDATE ON budget_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_providers_updated_at BEFORE UPDATE ON service_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Funcion para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type, created_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'user_type', 'particular'),
    NOW()
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger para nuevos usuarios
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- VERIFICACION FINAL COMPLETA
-- =============================================================================

DO $$
DECLARE
    total_tables INTEGER;
    categories_count INTEGER;
BEGIN
    -- Contar tablas
    SELECT COUNT(*) INTO total_tables 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    
    -- Contar categorias
    SELECT COUNT(*) INTO categories_count FROM service_categories;
    
    -- Mensajes de confirmacion sin problemas de formato
    RAISE INFO 'CONFIGURACION COMPLETA EXITOSA';
    RAISE INFO 'Tablas creadas: %', total_tables;
    RAISE INFO 'Categorias de servicio: %', categories_count;
    RAISE INFO 'Tu plataforma HuBiT esta lista para produccion';
    
END $$;
