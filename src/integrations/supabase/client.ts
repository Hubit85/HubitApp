
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Validar que la URL tenga el formato correcto
if (!supabaseUrl.includes('supabase.co')) {
  throw new Error('Invalid Supabase URL format')
}

// Validar que la clave anón no sea la placeholder
if (supabaseAnonKey === 'invalid_anon_key' || supabaseAnonKey.length < 50) {
  throw new Error('Invalid Supabase anon key - please update your environment variables')
}

// Configuración mejorada para manejo de errores de red y conectividad
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'hubit-webapp'
    },
    fetch: (url, options = {}) => {
      // Configurar timeout personalizado para requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos

      // Configuración mejorada para manejo de errores de red
      const fetchOptions = {
        ...options,
        signal: controller.signal,
        // Configuraciones adicionales para mejorar conectividad
        keepalive: false,
        mode: 'cors' as RequestMode,
        credentials: 'same-origin' as RequestCredentials,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          ...options.headers,
        },
      };

      const fetchPromise = fetch(url, fetchOptions)
        .then(response => {
          clearTimeout(timeoutId);
          return response;
        })
        .catch(error => {
          clearTimeout(timeoutId);
          
          // Logging mejorado para debugging
          console.log(`🔗 Fetch error for ${url}:`, error);
          
          // Re-throw el error para que Supabase lo maneje
          throw error;
        });

      return fetchPromise;
    }
  },
  db: {
    schema: 'public'
  }
})

// Función para verificar conectividad
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('profiles').select('count').limit(0);
    return !error;
  } catch {
    return false;
  }
};

// Función para manejar reconexión automática
export const handleConnectionRecovery = async (): Promise<void> => {
  try {
    console.log('🔄 Attempting connection recovery...');
    
    // Verificar conectividad básica
    const isConnected = await checkSupabaseConnection();
    
    if (isConnected) {
      console.log('✅ Connection recovered successfully');
      
      // Intentar refrescar la sesión actual si existe
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('🔑 Session active, attempting refresh...');
        await supabase.auth.refreshSession();
      }
    } else {
      console.log('❌ Connection recovery failed');
    }
  } catch (error) {
    console.log('⚠️ Error during connection recovery:', error);
  }
};