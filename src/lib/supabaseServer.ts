import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Cliente de Supabase para operaciones del servidor con Service Role Key
// Este cliente bypasea RLS y tiene permisos administrativos
export const supabaseServer = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Esta es la key que permite bypasear RLS
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default supabaseServer;