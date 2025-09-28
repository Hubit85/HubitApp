import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check environment variables
    const config = {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ Falta',
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ Falta',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurado' : '❌ Falta',
      RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅ Configurado' : '❌ Falta',
      NODE_ENV: process.env.NODE_ENV || 'undefined'
    };

    // Test Supabase connection
    let connectionTest = { status: 'error', message: 'No se pudo probar' };
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const testClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        );

        const { error } = await testClient
          .from('profiles')
          .select('id')
          .limit(1);

        if (error) {
          connectionTest = { 
            status: 'error', 
            message: `Error de Supabase: ${error.message}`
          };
        } else {
          connectionTest = { 
            status: 'success', 
            message: '✅ Conexión exitosa a Supabase'
          };
        }
      } catch (testError) {
        connectionTest = { 
          status: 'error', 
          message: `Error en test: ${testError instanceof Error ? testError.message : 'Error desconocido'}`
        };
      }
    }

    return res.status(200).json({
      timestamp: new Date().toISOString(),
      environment: config,
      connectionTest,
      debug: {
        url_length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
        service_key_prefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) || 'No disponible'
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Error interno',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
