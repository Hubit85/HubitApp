
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Verificar configuración
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    console.log('🧪 Testing Resend API configuration...');
    console.log('🔑 API Key status:', {
      exists: !!RESEND_API_KEY,
      length: RESEND_API_KEY?.length || 0,
      prefix: RESEND_API_KEY?.substring(0, 5) || 'none',
      startsWithRe: RESEND_API_KEY?.startsWith('re_') || false
    });

    if (!RESEND_API_KEY || RESEND_API_KEY.trim().length === 0) {
      return res.status(200).json({
        success: false,
        message: 'RESEND_API_KEY no está configurada o está vacía',
        details: {
          keyExists: false,
          keyLength: 0,
          recommendation: 'Configura RESEND_API_KEY en las variables de entorno'
        }
      });
    }

    if (!RESEND_API_KEY.startsWith('re_')) {
      return res.status(200).json({
        success: false,
        message: 'RESEND_API_KEY tiene formato inválido',
        details: {
          keyExists: true,
          keyLength: RESEND_API_KEY.length,
          keyPrefix: RESEND_API_KEY.substring(0, 10),
          expectedPrefix: 're_',
          recommendation: 'La clave debe empezar con "re_"'
        }
      });
    }

    // Test simple: intentar hacer una petición básica para validar la clave
    console.log('📡 Making test request to Resend API...');
    
    const testResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: ['delivered@resend.dev'],
        subject: 'HuBiT API Test - Please Ignore',
        html: '<p>This is a test email to validate API connection. Please ignore.</p>',
      })
    });

    const responseData = await testResponse.json();
    
    console.log('📡 Resend API Response:', {
      status: testResponse.status,
      statusText: testResponse.statusText,
      headers: Object.fromEntries(testResponse.headers.entries()),
      data: responseData
    });

    if (testResponse.status === 401) {
      return res.status(200).json({
        success: false,
        message: '🔑 API Key inválida o expirada',
        details: {
          status: testResponse.status,
          error: responseData,
          recommendation: 'La clave "re_HMYRvjWf_93ML8R9PbPqRHU9EP1sTJ9oS" no es válida. Genera una nueva desde tu dashboard de Resend.'
        }
      });
    }

    if (testResponse.status === 403) {
      return res.status(200).json({
        success: false,
        message: 'API Key válida pero sin permisos suficientes',
        details: {
          status: testResponse.status,
          error: responseData,
          recommendation: 'Verifica que la API key tenga permisos de envío de emails'
        }
      });
    }

    if (testResponse.status === 422) {
      return res.status(200).json({
        success: false,
        message: 'API Key válida pero dominio no verificado',
        details: {
          status: testResponse.status,
          error: responseData,
          recommendation: 'Necesitas verificar el dominio "hubit-84-supabase-email-templates.softgen.ai" en Resend o usar onboarding@resend.dev como remitente'
        }
      });
    }

    if (!testResponse.ok) {
      return res.status(200).json({
        success: false,
        message: `Error de la API de Resend: ${testResponse.status} ${testResponse.statusText}`,
        details: {
          status: testResponse.status,
          error: responseData,
          recommendation: 'Revisa la documentación de Resend para este código de error'
        }
      });
    }

    // Si llegamos aquí, la API está funcionando
    return res.status(200).json({
      success: true,
      message: '✅ API de Resend configurada correctamente',
      details: {
        status: testResponse.status,
        keyValidated: true,
        canSendEmails: true,
        response: responseData,
        keyPrefix: RESEND_API_KEY.substring(0, 10) + '...'
      }
    });

  } catch (error) {
    console.error('❌ Error testing Resend API:', error);
    
    let errorMessage = 'Error de conexión con Resend';
    let errorDetails: any = { error: String(error) };

    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('fetch')) {
        errorMessage = 'No se pudo conectar con la API de Resend - Verifica tu conexión';
        errorDetails.recommendation = 'Verifica tu conexión a internet y que api.resend.com esté accesible';
      }
    }

    return res.status(500).json({
      success: false,
      message: errorMessage,
      details: errorDetails
    });
  }
}
