import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use GET or POST.' 
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
        message: '❌ RESEND_API_KEY no está configurada',
        details: {
          keyExists: false,
          keyLength: 0,
          recommendations: [
            '1. Ve a https://resend.com/api-keys y crea una nueva API Key',
            '2. Copia la clave (comienza con "re_")',
            '3. En Softgen, ve a Settings (arriba derecha) → Environment',
            '4. Agrega: RESEND_API_KEY=tu_clave_aqui',
            '5. Guarda y prueba de nuevo aquí'
          ]
        }
      });
    }

    if (!RESEND_API_KEY.startsWith('re_')) {
      return res.status(200).json({
        success: false,
        message: '❌ RESEND_API_KEY tiene formato incorrecto',
        details: {
          keyExists: true,
          keyLength: RESEND_API_KEY.length,
          keyPrefix: RESEND_API_KEY.substring(0, 10) + '...',
          currentKey: RESEND_API_KEY.length > 20 ? RESEND_API_KEY.substring(0, 20) + '...' : RESEND_API_KEY,
          recommendations: [
            '❌ La clave actual no es válida (debe empezar con "re_")',
            '1. Ve a https://resend.com/api-keys',
            '2. Crea una nueva API Key',
            '3. Copia EXACTAMENTE la clave completa',
            '4. Actualízala en Softgen Settings → Environment'
          ]
        }
      });
    }

    // Test paso 1: Validar la clave con endpoint básico
    console.log('📡 Step 1: Validating API key...');
    
    const validationResponse = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const validationData = await validationResponse.json();
    
    console.log('📡 Validation Response:', {
      status: validationResponse.status,
      statusText: validationResponse.statusText,
      data: validationData
    });

    if (validationResponse.status === 401) {
      return res.status(200).json({
        success: false,
        message: '🔑 API Key INVÁLIDA - Resend la rechazó',
        details: {
          status: validationResponse.status,
          error: validationData,
          keyExists: true,
          keyLength: RESEND_API_KEY.length,
          keyPrefix: RESEND_API_KEY.substring(0, 15) + '...',
          currentKey: RESEND_API_KEY.substring(0, 25) + '...',
          recommendations: [
            '🚨 PROBLEMA CONFIRMADO: La clave "re_G5uNjHmE_EQdCfxeNTY3j4YmvFmqSv5Es" NO funciona',
            '1. Ve INMEDIATAMENTE a: https://resend.com/api-keys',
            '2. Borra la clave actual si existe',
            '3. Crea una NUEVA API Key',
            '4. Copia la nueva clave COMPLETA (empieza con re_)',
            '5. Actualízala en Softgen: Settings → Environment → RESEND_API_KEY=nueva_clave',
            '6. ¡CRÍTICO! Usa la nueva clave, no la vieja'
          ]
        }
      });
    }

    if (validationResponse.status === 403) {
      return res.status(200).json({
        success: false,
        message: '🔑 API Key válida pero sin permisos',
        details: {
          status: validationResponse.status,
          error: validationData,
          recommendations: [
            'La clave funciona pero no tiene permisos completos',
            'Verifica que la API key tenga permisos de "Send emails"',
            'Revisa la configuración de tu cuenta en Resend'
          ]
        }
      });
    }

    if (!validationResponse.ok) {
      return res.status(200).json({
        success: false,
        message: `Error de validación: ${validationResponse.status}`,
        details: {
          status: validationResponse.status,
          error: validationData,
          recommendations: [
            `Código de error inesperado: ${validationResponse.status}`,
            'Contacta soporte de Resend si esto persiste',
            'Intenta crear una nueva API Key'
          ]
        }
      });
    }

    // Si llegamos aquí, la clave es válida
    console.log('✅ API Key validated successfully');
    
    // Test paso 2: Intentar envío simple de prueba
    console.log('📧 Step 2: Testing email sending capability...');
    
    const testEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev', // Usando dominio verificado de Resend
        to: ['delivered@resend.dev'],   // Email de prueba de Resend
        subject: 'HuBiT API Test - Ignore',
        html: '<p>Test email from HuBiT app - please ignore.</p>',
      })
    });

    const emailData = await testEmailResponse.json();
    
    if (testEmailResponse.status === 422) {
      // Probablemente problema de dominio, pero la clave funciona
      return res.status(200).json({
        success: true, // ¡La clave SÍ funciona!
        message: '🔑 API Key VÁLIDA - Configuración de dominio pendiente',
        details: {
          status: testEmailResponse.status,
          keyValidated: true,
          domainRequired: true,
          error: emailData,
          keyPrefix: RESEND_API_KEY.substring(0, 15) + '...',
          recommendations: [
            '✅ ¡EXCELENTE! Tu API Key funciona perfectamente',
            '🎯 Solo necesitas configurar el dominio para emails personalizados',
            '1. Ve a https://resend.com/domains',
            '2. Agrega el dominio que quieras usar (ej: tu-dominio.com)',
            '3. O usar "onboarding@resend.dev" temporalmente',
            '🚀 ¡Ya puedes recibir emails de verificación de roles!'
          ]
        }
      });
    }

    if (testEmailResponse.ok) {
      // ¡Todo perfecto!
      return res.status(200).json({
        success: true,
        message: '🎉 ¡PERFECTO! Resend API 100% funcional',
        details: {
          status: testEmailResponse.status,
          keyValidated: true,
          canSendEmails: true,
          emailSent: true,
          emailId: emailData.id,
          keyPrefix: RESEND_API_KEY.substring(0, 15) + '...',
          recommendations: [
            '🚀 ¡Todo configurado perfectamente!',
            '✅ Tu API Key funciona al 100%',
            '📧 Puedes enviar emails sin problemas',
            '🎯 Los usuarios recibirán emails de verificación',
            '💪 HuBiT está listo para producción'
          ]
        }
      });
    }

    // Cualquier otro error
    return res.status(200).json({
      success: false,
      message: `Error enviando email de prueba: ${testEmailResponse.status}`,
      details: {
        status: testEmailResponse.status,
        keyValidated: true, // La clave funciona
        error: emailData,
        recommendations: [
          'La API Key es válida, pero hay un problema con el envío',
          'Revisa los logs de Resend en tu dashboard',
          'Intenta configurar un dominio verificado'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Error testing Resend API:', error);
    
    let errorMessage = 'Error de conexión con Resend';
    let recommendations = ['Error interno - revisa los logs del servidor'];

    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage = 'No se pudo conectar con api.resend.com';
        recommendations = [
          'Problema de conectividad de red',
          'Verifica que api.resend.com esté accesible',
          'Intenta de nuevo en unos minutos',
          'Si persiste, puede ser un problema del servidor'
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