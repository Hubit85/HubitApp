
import { NextApiRequest, NextApiResponse } from 'next';
import supabaseServer from '@/lib/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    console.log('🧪 Iniciando prueba directa de Supabase...');
    
    // Test 1: Verificar conexión básica
    const { data: testData, error: testError } = await supabaseServer
      .from('profiles')
      .select('count')
      .limit(1)
      .maybeSingle();

    if (testError) {
      return res.status(500).json({
        success: false,
        step: 'basic_connection',
        error: testError.message,
        details: testError,
        suggestions: [
          'Verifica que el SUPABASE_SERVICE_ROLE_KEY sea correcto',
          'Confirma que las RLS policies permitan acceso al service role',
          'Revisa que la tabla profiles exista en Supabase'
        ]
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Conexión Supabase funcionando correctamente',
      tests: {
        basicConnection: { success: true, data: testData }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      step: 'connection_failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      suggestions: [
        'Verifica la conexión a Internet',
        'Confirma que el proyecto Supabase esté activo',
        'Revisa que las credenciales sean válidas'
      ]
    });
  }
}