import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: {},
    supabase: {},
    network: {}
  };

  try {
    // 1. Verificar variables de entorno
    results.environment = {
      nodeEnv: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasResendKey: !!process.env.RESEND_API_KEY,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0
    };

    // 2. Probar conexión HTTP a Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'HEAD',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
          }
        });
        
        results.network.httpTest = {
          success: response.ok,
          status: response.status,
          statusText: response.statusText
        };
      } catch (networkError) {
        results.network.httpTest = {
          success: false,
          error: networkError instanceof Error ? networkError.message : 'Network error'
        };
      }
    }

    // 3. Probar cliente Supabase básico
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );

      // Test simple query
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      results.supabase.queryTest = {
        success: !error,
        error: error?.message,
        errorCode: error?.code,
        errorDetails: error?.details,
        data: data
      };

      // Test de salud específico
      if (error?.code === 'PGRST116') {
        results.supabase.diagnosis = 'Table exists but no data - this is actually GOOD';
      } else if (error?.code) {
        results.supabase.diagnosis = `Error code ${error.code}: ${error.message}`;
      } else {
        results.supabase.diagnosis = 'Connection working correctly';
      }

    } catch (clientError) {
      results.supabase.queryTest = {
        success: false,
        error: clientError instanceof Error ? clientError.message : 'Client creation error'
      };
    }

    // 4. Recomendaciones basadas en los resultados
    const recommendations = [];
    
    if (!results.environment.hasServiceKey) {
      recommendations.push('❌ SUPABASE_SERVICE_ROLE_KEY falta o es inválido');
    }
    
    if (!results.network.httpTest?.success) {
      recommendations.push('❌ No se puede conectar a Supabase vía HTTP');
    }
    
    if (results.supabase.queryTest?.error?.includes('Invalid API key')) {
      recommendations.push('❌ La Service Role Key es incorrecta o ha expirado');
    }
    
    if (results.supabase.queryTest?.error?.includes('relation') && results.supabase.queryTest?.error?.includes('does not exist')) {
      recommendations.push('❌ La tabla "profiles" no existe en la base de datos');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Todo parece estar configurado correctamente');
    }

    results.recommendations = recommendations;
    results.summary = recommendations.length === 1 && recommendations[0].startsWith('✅') 
      ? 'SUCCESS' 
      : 'ISSUES_FOUND';

    return res.status(200).json(results);

  } catch (globalError) {
    return res.status(500).json({
      success: false,
      error: globalError instanceof Error ? globalError.message : 'Unknown error',
      results
    });
  }
}
