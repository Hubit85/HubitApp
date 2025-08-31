import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔧 ENV CHECK: Checking all environment variables...');
    
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      NODE_ENV: process.env.NODE_ENV
    };

    console.log('🔧 ENV CHECK: Raw values:', {
      hasSupabaseUrl: !!envVars.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!envVars.SUPABASE_SERVICE_ROLE_KEY,
      hasAnonKey: !!envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasResendKey: !!envVars.RESEND_API_KEY,
      supabaseUrlLength: envVars.NEXT_PUBLIC_SUPABASE_URL?.length,
      serviceKeyLength: envVars.SUPABASE_SERVICE_ROLE_KEY?.length,
      anonKeyLength: envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length,
      resendKeyValid: envVars.RESEND_API_KEY?.startsWith('re_'),
      nodeEnv: envVars.NODE_ENV
    });
    
    return res.status(200).json({
      success: true,
      environment: {
        hasSupabaseUrl: !!envVars.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!envVars.SUPABASE_SERVICE_ROLE_KEY,
        hasAnonKey: !!envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasResendKey: !!envVars.RESEND_API_KEY,
        resendKeyValid: envVars.RESEND_API_KEY?.startsWith('re_'),
        supabaseUrlPreview: envVars.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 50) + '...',
        serviceKeyPreview: envVars.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...',
        nodeEnv: envVars.NODE_ENV
      }
    });
    
  } catch (error) {
    console.error('❌ ENV CHECK: Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Environment check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}