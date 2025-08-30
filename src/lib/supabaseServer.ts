
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import * as fs from 'fs';
import * as path from 'path';

// Función mejorada para cargar manualmente las variables del .env.local
function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envLines = envContent.split('
');
      
      let loadedCount = 0;
      envLines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#') && trimmedLine.includes('=')) {
          const equalIndex = trimmedLine.indexOf('=');
          const key = trimmedLine.substring(0, equalIndex).trim();
          const value = trimmedLine.substring(equalIndex + 1).trim();
          
          if (key && value) {
            // Forzar la actualización incluso si ya existe
            process.env[key] = value;
            loadedCount++;
            
            if (key.includes('SUPABASE') || key.includes('RESEND')) {
              console.log(`🔄 Variable actualizada: ${key} = ${value.substring(0, 20)}...`);
            }
          }
        }
      });
      
      console.log(`✅ ${loadedCount} variables cargadas/actualizadas desde .env.local`);
    } else {
      console.warn('⚠️ Archivo .env.local no encontrado en:', envPath);
    }
  } catch (error) {
    console.error('❌ Error cargando .env.local:', error);
  }
}

// Cargar variables manualmente primero - SIEMPRE
loadEnvFile();

// Logging detallado para debugging
console.log('🔧 Iniciando configuración Supabase Server...');
console.log('📍 NODE_ENV:', process.env.NODE_ENV);
console.log('📍 SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...');
console.log('📍 SERVICE KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('📍 SERVICE KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0);
console.log('📍 SERVICE KEY tipo:', typeof process.env.SUPABASE_SERVICE_ROLE_KEY);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('SUPABASE_URL present:', !!SUPABASE_URL);
  console.error('SUPABASE_SERVICE_KEY present:', !!SUPABASE_SERVICE_KEY);
  console.error('SUPABASE_SERVICE_KEY value preview:', SUPABASE_SERVICE_KEY?.substring(0, 50));
  
  // Intentar recargar una vez más
  console.log('🔄 Intentando recargar variables...');
  loadEnvFile();
  
  throw new Error('Missing required Supabase environment variables after reload attempt');
}

// Validación adicional del formato JWT
if (!SUPABASE_SERVICE_KEY.startsWith('eyJ')) {
  console.error('❌ SUPABASE_SERVICE_KEY no parece ser un JWT válido');
  console.error('Valor actual:', SUPABASE_SERVICE_KEY.substring(0, 50));
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

console.log('✅ Supabase Server configurado con claves actualizadas');

export default supabaseServer;