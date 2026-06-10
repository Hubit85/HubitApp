import { NextApiRequest, NextApiResponse } from 'next';
import { blockProductionDiagnosticRoute } from '@/lib/apiSecurity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (blockProductionDiagnosticRoute(res)) {
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { default: supabaseServer } = await import('@/lib/supabaseServer');
    console.log('🔧 TEST: Starting Supabase connection test...');
    
    // Test 1: Variables de entorno
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('🔧 TEST: Environment variables:', { hasUrl, hasServiceKey, hasAnonKey });
    
    // Test 2: Conexión básica
    const { error: testError } = await supabaseServer
      .from('profiles')
      .select('count')
      .limit(1);
      
    if (testError) {
      console.error('❌ TEST: Connection failed:', testError);
      return res.status(500).json({
        success: false,
        error: 'Connection failed',
        details: {
          message: testError.message,
          code: testError.code,
          hasUrl,
          hasServiceKey,
          hasAnonKey
        }
      });
    }
    
    console.log('✅ TEST: Connection successful');
    
    return res.status(200).json({
      success: true,
      message: 'Supabase connection working',
      environment: {
        hasUrl,
        hasServiceKey,
        hasAnonKey,
        nodeEnv: process.env.NODE_ENV
      }
    });
    
  } catch (error) {
    console.error('❌ TEST: Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unexpected error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
