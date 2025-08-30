-- HuBiT Database Setup for Supabase
-- Run these commands in your Supabase SQL Editor
-- Project URL: https://djkrzbmgzfwagmripozi.supabase.co

-- =============================================================================
-- STEP 1: CREATE TABLES
-- =============================================================================

-- 1. Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    user_type TEXT NOT NULL CHECK (user_type IN ('particular', 'community_member', 'service_provider', 'property_administrator')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- 2. Create properties table
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    property_type TEXT NOT NULL CHECK (property_type IN ('residential', 'commercial', 'mixed')),
    description TEXT,
    units_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create budget_requests table
CREATE TABLE IF NOT EXISTS budget_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('cleaning', 'plumbing', 'electrical', 'gardening', 'painting', 'maintenance', 'security', 'other')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    budget_range_min DECIMAL(10,2),
    budget_range_max DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create service_providers table
CREATE TABLE IF NOT EXISTS service_providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    company_name TEXT NOT NULL,
    description TEXT,
    specialties TEXT[],
    service_area TEXT[],
    verified BOOLEAN DEFAULT FALSE,
    rating_average DECIMAL(3,2) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    budget_request_id UUID REFERENCES budget_requests(id) ON DELETE CASCADE NOT NULL,
    service_provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    estimated_duration TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 5),
    punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 5),
    communication INTEGER CHECK (communication >= 1 AND communication <= 5),
    value_for_money INTEGER CHECK (value_for_money >= 1 AND value_for_money <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_provider_id, user_id, quote_id)
);

-- 7. Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    service_provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    start_date DATE,
    end_date DATE,
    total_amount DECIMAL(10,2) NOT NULL,
    terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    related_entity_type TEXT,
    related_entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- STEP 2: ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- STEP 3: CREATE SECURITY POLICIES
-- =============================================================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Properties policies
DROP POLICY IF EXISTS "Users can view own properties" ON properties;
DROP POLICY IF EXISTS "Users can insert own properties" ON properties;
DROP POLICY IF EXISTS "Users can update own properties" ON properties;
DROP POLICY IF EXISTS "Users can delete own properties" ON properties;

CREATE POLICY "Users can view own properties" ON properties FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own properties" ON properties FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own properties" ON properties FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own properties" ON properties FOR DELETE USING (auth.uid() = user_id);

-- Budget requests policies
DROP POLICY IF EXISTS "Users can view own budget requests" ON budget_requests;
DROP POLICY IF EXISTS "Service providers can view budget requests" ON budget_requests;
DROP POLICY IF EXISTS "Users can insert own budget requests" ON budget_requests;
DROP POLICY IF EXISTS "Users can update own budget requests" ON budget_requests;
DROP POLICY IF EXISTS "Users can delete own budget requests" ON budget_requests;

CREATE POLICY "Users can view own budget requests" ON budget_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service providers can view budget requests" ON budget_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM service_providers WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert own budget requests" ON budget_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budget requests" ON budget_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budget requests" ON budget_requests FOR DELETE USING (auth.uid() = user_id);

-- Service providers policies
DROP POLICY IF EXISTS "Anyone can view service providers" ON service_providers;
DROP POLICY IF EXISTS "Users can manage own service provider profile" ON service_providers;

CREATE POLICY "Anyone can view service providers" ON service_providers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own service provider profile" ON service_providers FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Quotes policies
DROP POLICY IF EXISTS "Users can view quotes for their requests" ON quotes;
DROP POLICY IF EXISTS "Service providers can view own quotes" ON quotes;
DROP POLICY IF EXISTS "Service providers can create quotes" ON quotes;
DROP POLICY IF EXISTS "Service providers can update own quotes" ON quotes;

CREATE POLICY "Users can view quotes for their requests" ON quotes FOR SELECT USING (
    EXISTS (SELECT 1 FROM budget_requests WHERE id = quotes.budget_request_id AND user_id = auth.uid())
);
CREATE POLICY "Service providers can view own quotes" ON quotes FOR SELECT USING (
    EXISTS (SELECT 1 FROM service_providers WHERE id = quotes.service_provider_id AND user_id = auth.uid())
);
CREATE POLICY "Service providers can create quotes" ON quotes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM service_providers WHERE id = quotes.service_provider_id AND user_id = auth.uid())
);
CREATE POLICY "Service providers can update own quotes" ON quotes FOR UPDATE USING (
    EXISTS (SELECT 1 FROM service_providers WHERE id = quotes.service_provider_id AND user_id = auth.uid())
);

-- Ratings policies
DROP POLICY IF EXISTS "Users can view all ratings" ON ratings;
DROP POLICY IF EXISTS "Users can create ratings" ON ratings;
DROP POLICY IF EXISTS "Users can update own ratings" ON ratings;

CREATE POLICY "Users can view all ratings" ON ratings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create ratings" ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON ratings FOR UPDATE USING (auth.uid() = user_id);

-- Contracts policies  
DROP POLICY IF EXISTS "Users can view own contracts" ON contracts;
DROP POLICY IF EXISTS "Service providers can view own contracts" ON contracts;
DROP POLICY IF EXISTS "Users can create contracts" ON contracts;
DROP POLICY IF EXISTS "Users can update own contracts" ON contracts;

CREATE POLICY "Users can view own contracts" ON contracts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service providers can view own contracts" ON contracts FOR SELECT USING (
    EXISTS (SELECT 1 FROM service_providers WHERE id = contracts.service_provider_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create contracts" ON contracts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contracts" ON contracts FOR UPDATE USING (auth.uid() = user_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- =============================================================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_budget_requests_user_id ON budget_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_requests_property_id ON budget_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_budget_requests_status ON budget_requests(status);
CREATE INDEX IF NOT EXISTS idx_budget_requests_category ON budget_requests(category);
CREATE INDEX IF NOT EXISTS idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_service_providers_verified ON service_providers(verified);
CREATE INDEX IF NOT EXISTS idx_quotes_budget_request_id ON quotes(budget_request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_service_provider_id ON quotes(service_provider_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_ratings_service_provider_id ON ratings(service_provider_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_service_provider_id ON contracts(service_provider_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- =============================================================================
-- STEP 5: CREATE FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to automatically create profile on user registration
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

-- Trigger to call the function on user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at timestamps
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
DROP TRIGGER IF EXISTS update_budget_requests_updated_at ON budget_requests;
DROP TRIGGER IF EXISTS update_service_providers_updated_at ON service_providers;
DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
DROP TRIGGER IF EXISTS update_ratings_updated_at ON ratings;
DROP TRIGGER IF EXISTS update_contracts_updated_at ON contracts;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_requests_updated_at BEFORE UPDATE ON budget_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_providers_updated_at BEFORE UPDATE ON service_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update service provider rating average
CREATE OR REPLACE FUNCTION update_service_provider_rating()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE service_providers 
        SET 
            rating_average = (
                SELECT AVG(rating)::numeric(3,2) 
                FROM ratings 
                WHERE service_provider_id = NEW.service_provider_id
            ),
            rating_count = (
                SELECT COUNT(*) 
                FROM ratings 
                WHERE service_provider_id = NEW.service_provider_id
            )
        WHERE id = NEW.service_provider_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE service_providers 
        SET 
            rating_average = COALESCE((
                SELECT AVG(rating)::numeric(3,2) 
                FROM ratings 
                WHERE service_provider_id = OLD.service_provider_id
            ), 0),
            rating_count = (
                SELECT COUNT(*) 
                FROM ratings 
                WHERE service_provider_id = OLD.service_provider_id
            )
        WHERE id = OLD.service_provider_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language plpgsql security definer;

-- Trigger to update service provider ratings
DROP TRIGGER IF EXISTS update_service_provider_rating_trigger ON ratings;
CREATE TRIGGER update_service_provider_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_service_provider_rating();

-- =============================================================================
-- SETUP COMPLETE!
-- =============================================================================

-- Verify the setup
DO $$
BEGIN
    RAISE NOTICE '✅ HuBiT Database Setup Complete!';
    RAISE NOTICE '📊 Tables created: profiles, properties, budget_requests, service_providers, quotes, ratings, contracts, notifications';
    RAISE NOTICE '🔒 Row Level Security enabled on all tables';
    RAISE NOTICE '🛡️  Security policies created';
    RAISE NOTICE '⚡ Performance indexes created';
    RAISE NOTICE '🔄 Automatic triggers configured';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Your HuBiT application is now ready to use!';
    RAISE NOTICE '💡 You can now register users and start using all features.';
END;
$$;
