
// Cargar variables de entorno de forma más robusta
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Si las variables no están disponibles, intentar cargar desde .env.local
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    require('dotenv').config({ path: '.env.local', override: true });
  } catch (error) {
    console.warn('⚠️ No se pudo cargar .env.local');
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL no está definida');
  console.error('Variables disponibles:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
}

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY no está definida');
  console.error('Variables disponibles:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

// Log para debugging (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  console.log('🔧 Supabase Server Config:');
  console.log('- URL configurada:', SUPABASE_URL ? '✅' : '❌');
  console.log('- Service Key configurada:', SUPABASE_SERVICE_KEY ? '✅' : '❌');
  console.log('- URL value:', SUPABASE_URL);
  console.log('- Service Key prefix:', SUPABASE_SERVICE_KEY?.substring(0, 30));
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

export default supabaseServer;