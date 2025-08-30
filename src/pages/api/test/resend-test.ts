
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
          recommendations: [
            '1. Ve a https://resend.com/dashboard',
            '2. Crea una nueva API Key',
            '3. Configúrala en Softgen Settings → Environment'
          ]
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
          recommendations: [
            'La clave debe empezar con "re_"',
            'Verifica que copiaste la clave completa',
            'Genera una nueva si es necesario'
          ]
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
      data: responseData
    });

    if (testResponse.status === 401) {
      return res.status(200).json({
        success: false,
        message: '🔑 API Key inválida o expirada',
        details: {
          status: testResponse.status,
          error: responseData,
          currentKey: `${RESEND_API_KEY.substring(0, 15)}...`,
          recommendations: [
            '1. La clave actual no es válida según Resend',
            '2. Ve a https://resend.com/dashboard/api-keys',
            '3. Genera una nueva API Key',
            '4. Actualízala en Softgen Settings → Environment',
            '5. Usa esta herramienta para verificar que funciona'
          ]
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
          recommendations: [
            'La clave está autenticada pero no tiene permisos',
            'Verifica que la API key tenga permisos de envío de emails',
            'Revisa la configuración de tu cuenta en Resend'
          ]
        }
      });
    }

    if (testResponse.status === 422) {
      return res.status(200).json({
        success: false,
        message: 'API Key válida pero configuración de dominio requerida',
        details: {
          status: testResponse.status,
          error: responseData,
          recommendations: [
            '1. Tu API Key funciona, pero necesitas configurar el dominio',
            '2. Ve a https://resend.com/domains en tu dashboard',
            '3. Agrega y verifica el dominio "hubit-84-supabase-email-templates.softgen.ai"',
            '4. O cambia el remitente a "onboarding@resend.dev" temporalmente'
          ]
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
          recommendations: [
            `Código de error: ${testResponse.status}`,
            'Revisa la documentación de Resend para este código',
            'Contacta soporte de Resend si el problema persiste'
          ]
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
        emailId: responseData.id,
        keyPrefix: RESEND_API_KEY.substring(0, 15) + '...',
        recommendations: [
          '🎉 ¡Perfecto! Tu API Key funciona correctamente',
          'Ya puedes enviar emails de verificación',
          'Los usuarios recibirán emails cuando agreguen roles'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Error testing Resend API:', error);
    
    let errorMessage = 'Error de conexión con Resend';
    let recommendations = ['Error desconocido - revisa los logs del servidor'];

    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('fetch')) {
        errorMessage = 'No se pudo conectar con la API de Resend';
        recommendations = [
          'Verifica tu conexión a internet',
          'Comprueba que api.resend.com esté accesible',
          'Intenta de nuevo en unos minutos'
        ];
      }
    }

    return res.status(500).json({
      success: false,
      message: errorMessage,
      details: {
        error: String(error),
        recommendations
      }
    });
  }
}