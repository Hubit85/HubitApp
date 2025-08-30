
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

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})
