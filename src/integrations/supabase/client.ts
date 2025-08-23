
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://djkrzbmgzfwagmripozi.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqa3J6Ym1nemZ3YWdtcmlwb3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMjIyODgsImV4cCI6MjA2Njc5ODI4OH0.P6gVuh5Vi-EP9hSm1WooCXjJKiy8sCl4wZcC_N2KehY";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Create client without strict typing to avoid TypeScript issues
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
