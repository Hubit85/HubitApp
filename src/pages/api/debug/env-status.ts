
import { NextApiRequest, NextApiResponse } from 'next';
import { blockProductionDiagnosticRoute } from '@/lib/apiSecurity';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (blockProductionDiagnosticRoute(res)) {
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
    resendKey: process.env.RESEND_API_KEY ? 'SET' : 'NOT SET'
  });
}
