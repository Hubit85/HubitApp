
-- HuBiT Database Setup for Supabase
-- Run these commands in your Supabase SQL Editor

-- 1. Create profiles table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    user_type TEXT NOT NULL CHECK (user_type IN ('particular', 'community_member', 'service_provider', 'property_administrator')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- 2. Create properties table
CREATE TABLE properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    property_type TEXT NOT NULL CHECK (property_type IN ('residential', 'commercial', 'mixed')),
    description TEXT,
    units_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create budget_requests table
CREATE TABLE budget_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    budget_range_min DECIMAL(10,2),
    budget_range_max DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_requests ENABLE ROW LEVEL SECURITY;

-- 5. Create security policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. Create security policies for properties
CREATE POLICY "Users can view own properties" ON properties FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own properties" ON properties FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own properties" ON properties FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own properties" ON properties FOR DELETE USING (auth.uid() = user_id);

-- 7. Create security policies for budget_requests
CREATE POLICY "Users can view own budget requests" ON budget_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budget requests" ON budget_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budget requests" ON budget_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budget requests" ON budget_requests FOR DELETE USING (auth.uid() = user_id);

-- 8. Create indexes for better performance
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_budget_requests_user_id ON budget_requests(user_id);
CREATE INDEX idx_budget_requests_property_id ON budget_requests(property_id);
CREATE INDEX idx_budget_requests_status ON budget_requests(status);
CREATE INDEX idx_budget_requests_category ON budget_requests(category);

-- 9. Create function to automatically create profile on user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, user_type, created_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'user_type', 'particular'),
    NOW()
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- 10. Create trigger to call the function on user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 11. Update function for profiles updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. Create triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_requests_updated_at BEFORE UPDATE ON budget_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Setup complete! Your Supabase database is now ready for HuBiT.
