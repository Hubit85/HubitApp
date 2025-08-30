
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Logging detallado para debugging
console.log('🔧 Iniciando configuración Supabase Server...');
console.log('📍 NODE_ENV:', process.env.NODE_ENV);
console.log('📍 Total env vars:', Object.keys(process.env).length);
console.log('📍 SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...');
console.log('📍 SERVICE KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('📍 SERVICE KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('SUPABASE_URL:', SUPABASE_URL ? 'SET' : 'NOT SET');
  console.error('SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? 'SET' : 'NOT SET');
  
  // Lista todas las variables que empiecen con SUPABASE
  const supabaseVars = Object.keys(process.env).filter(key => key.includes('SUPABASE'));
  console.error('Available SUPABASE vars:', supabaseVars);
  
  throw new Error('Missing required Supabase environment variables');
}

const supabaseServer = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

console.log('✅ Supabase Server configurado correctamente');

export default supabaseServer;