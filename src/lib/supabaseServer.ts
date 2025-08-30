import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

console.log('🔧 SUPABASE SERVER: Initializing with environment variables...');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 Environment check:', {
  url: SUPABASE_URL ? 'SET' : 'MISSING',
  serviceKey: SUPABASE_SERVICE_KEY ? 'SET' : 'MISSING',
  urlValue: SUPABASE_URL,
  keyPrefix: SUPABASE_SERVICE_KEY ? SUPABASE_SERVICE_KEY.substring(0, 20) + '...' : 'MISSING'
});

// Validación de variables de entorno
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  const errorMsg = 'Missing required Supabase environment variables';
  console.error('❌ SUPABASE SERVER ERROR:', errorMsg);
  console.error('Details:', {
    NEXT_PUBLIC_SUPABASE_URL: !!SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_KEY
  });
  throw new Error(errorMsg);
}

console.log('✅ SUPABASE SERVER: Creating client...');

// Cliente de Supabase para operaciones del servidor con Service Role Key
export const supabaseServer = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

console.log('✅ SUPABASE SERVER: Client created successfully');

export default supabaseServer;