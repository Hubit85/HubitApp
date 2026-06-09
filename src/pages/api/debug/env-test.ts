import { NextApiRequest, NextApiResponse } from 'next';
import { blockProductionDiagnostics } from '@/lib/apiSecurity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (blockProductionDiagnostics(res)) {
    return;
  }

  try {
    const { default: supabaseServer } = await import('@/lib/supabaseServer');
    console.log('🔧 Testing server environment variables...');
    
    // Verificar variables de entorno
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendKey = process.env.RESEND_API_KEY;

    console.log('Environment check:');
    console.log('- SUPABASE_URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
    console.log('- SERVICE_KEY:', supabaseServiceKey ? '✅ Present' : '❌ Missing');
    console.log('- RESEND_KEY:', resendKey ? '✅ Present' : '❌ Missing');

    // Probar conexión a Supabase
    console.log('🔗 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabaseServer
      .from('profiles')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ Supabase connection failed:', testError);
      return res.status(500).json({
        success: false,
        environment: {
          supabaseUrl: !!supabaseUrl,
          serviceKey: !!supabaseServiceKey,
          resendKey: !!resendKey
        },
        supabaseTest: {
          success: false,
          error: testError.message,
          details: testError
        }
      });
    }

    console.log('✅ Supabase connection successful');
    
    return res.status(200).json({
      success: true,
      message: 'All tests passed',
      environment: {
        supabaseUrl: !!supabaseUrl,
        serviceKey: !!supabaseServiceKey,
        resendKey: !!resendKey
      },
      supabaseTest: {
        success: true,
        rowsFound: testData?.length || 0
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Server test failed:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}