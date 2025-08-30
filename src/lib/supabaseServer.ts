import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { config } from 'dotenv';
import path from 'path';

// FORZAR CARGA DE VARIABLES DE ENTORNO
config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 SUPABASE SERVER DEBUG: URL =', SUPABASE_URL ? 'SET' : 'MISSING');
console.log('🔧 SUPABASE SERVER DEBUG: SERVICE_KEY =', SUPABASE_SERVICE_KEY ? 'SET' : 'MISSING');

// Validación más estricta de variables de entorno
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE SERVER: Missing required environment variables');
  console.error('URL present:', !!SUPABASE_URL);
  console.error('Service Key present:', !!SUPABASE_SERVICE_KEY);
  throw new Error('Missing Supabase environment variables');
}

// Cliente de Supabase para operaciones del servidor con Service Role Key
// Este cliente bypasea RLS y tiene permisos administrativos
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

export default supabaseServer;