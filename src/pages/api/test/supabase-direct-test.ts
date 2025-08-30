
import { NextApiRequest, NextApiResponse } from 'next';
import supabaseServer from '@/lib/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // Test 2: Probar inserción de datos de prueba
    const testUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'test@example.com',
      full_name: 'Test User'
    };

    const { data: insertTest, error: insertError } = await supabaseServer
      .from('profiles')
      .upsert(testUser)
      .select()
      .maybeSingle();

    return res.status(200).json({
      success: true,
      message: 'Conexión Supabase funcionando correctamente',
      tests: {
        basicConnection: { success: true, data: testData },
        insertTest: { success: !insertError, data: insertTest, error: insertError?.message }
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
