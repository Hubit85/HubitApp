
import { NextApiRequest, NextApiResponse } from 'next';

// Configurar CORS y headers apropiados
function setCorsHeaders(res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configurar headers inmediatamente
  setCorsHeaders(res);
  
  console.log('🔧 RESEND TEST API: Called with method:', req.method);
  console.log('🔧 RESEND TEST API: Query params:', req.query);

  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
  }

  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const hasResendKey = !!(RESEND_API_KEY && RESEND_API_KEY.trim().length > 0 && RESEND_API_KEY !== 'missing');
    
    // Crear preview de la clave (solo los primeros 10 caracteres)
    const keyPreview = hasResendKey && RESEND_API_KEY ? 
      `${RESEND_API_KEY.substring(0, 10)}...` : 
      'No configurada';

    console.log('🔑 RESEND TEST API: Environment check:', {
      hasResendKey,
      keyPreview,
      keyLength: RESEND_API_KEY ? RESEND_API_KEY.length : 0,
      keyStartsWith: RESEND_API_KEY ? RESEND_API_KEY.startsWith('re_') : false
    });

    // Si solo se está pidiendo la configuración (GET request)
    if (req.method === 'GET' && req.query.config === 'true') {
      return res.status(200).json({
        success: true,
        hasResendKey,
        keyPreview,
        message: hasResendKey ? 'RESEND_API_KEY configurada' : 'RESEND_API_KEY no encontrada'
      });
    }

    // Para POST requests (test real)
    if (req.method === 'POST') {
      
      if (!hasResendKey) {
        return res.status(400).json({
          success: false,
          hasResendKey: false,
          keyPreview,
          message: 'RESEND_API_KEY no está configurada',
          details: {
            error: 'Missing API key',
            suggestion: 'Configura RESEND_API_KEY en las variables de entorno'
          }
        });
      }

      // Validar formato de la clave
      if (!RESEND_API_KEY.startsWith('re_')) {
        return res.status(400).json({
          success: false,
          hasResendKey: true,
          keyPreview,
          message: 'RESEND_API_KEY tiene formato inválido',
          details: {
            error: 'Invalid API key format',
            expected: 'Key should start with "re_"',
            actual: `Key starts with "${RESEND_API_KEY.substring(0, 3)}"`
          }
        });
      }

      // Obtener el email del body de la request
      const { testEmail } = req.body;
      const emailToTest = testEmail || 'borjapipaon@gmail.com'; // Email corregido del usuario por defecto

      // Hacer test real con Resend API
      console.log('🧪 RESEND TEST API: Testing actual Resend connection...');
      
      try {
        const testEmailData = {
          from: 'HuBiT Test <onboarding@resend.dev>', // Email verificado de Resend para pruebas
          to: emailToTest,
          subject: 'Test de Conexión HuBiT - Prueba de API',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
              <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px; border: 1px solid #e5e7eb;">
                <h2 style="color: #1f2937; margin-bottom: 20px;">🧪 Test de Conexión HuBiT</h2>
                <p style="color: #374151; line-height: 1.6;">Este es un email de prueba para verificar la conexión con Resend API.</p>
                <div style="background-color: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0;">
                  <p style="color: #1e40af; margin: 0;"><strong>✅ La configuración de Resend está funcionando correctamente!</strong></p>
                </div>
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                  Timestamp: ${new Date().toLocaleString('es-ES')}<br>
                  Email de destino: ${emailToTest}
                </p>
              </div>
            </div>
          `
        };

        console.log('📤 RESEND TEST API: Making test request to Resend API with email:', emailToTest);
        
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testEmailData)
        });

        const responseData = await response.json();
        
        console.log('📡 RESEND TEST API: Resend response:', {
          status: response.status,
          statusText: response.statusText,
          success: response.ok,
          data: responseData
        });

        if (!response.ok) {
          // Manejar errores específicos de Resend
          let errorMessage = `Error ${response.status}: ${responseData.message || response.statusText}`;
          let suggestions: string[] = [];

          if (response.status === 401) {
            errorMessage = "Clave de API inválida o expirada";
            suggestions = [
              "Verifica que la clave sea correcta",
              "Genera una nueva clave en https://resend.com/api-keys",
              "Asegúrate de que la clave tenga permisos de envío"
            ];
          } else if (response.status === 403) {
            // Error específico para limitaciones de desarrollo
            errorMessage = "Solo puedes enviar emails a tu dirección verificada (borjapipaon@gmail.com)";
            suggestions = [
              "Cambia el email de destino a: borjapipaon@gmail.com",
              "O verifica tu dominio en https://resend.com/domains",
              "Una vez verificado el dominio, podrás enviar a cualquier dirección",
              "Este es el comportamiento normal de Resend en modo desarrollo"
            ];
          } else if (response.status === 422) {
            errorMessage = "Error de validación en los datos del email";
            suggestions = [
              "El dominio 'resend.dev' debería funcionar para pruebas",
              "Verifica la configuración de tu dominio en Resend",
              "Asegúrate de que el email de destino sea válido"
            ];
          } else if (response.status === 429) {
            errorMessage = "Límite de rate limit alcanzado";
            suggestions = [
              "Espera unos minutos antes de volver a probar",
              "Considera upgrading tu plan de Resend si es necesario"
            ];
          }

          return res.status(200).json({
            success: false,
            hasResendKey: true,
            keyPreview,
            message: errorMessage,
            details: {
              status: response.status,
              error: responseData,
              suggestions,
              testedEmail: emailToTest
            }
          });
        }

        // Test exitoso
        console.log('✅ RESEND TEST API: Test successful!');
        
        return res.status(200).json({
          success: true,
          hasResendKey: true,
          keyPreview,
          message: `✅ Email enviado exitosamente a ${emailToTest}! La configuración está correcta.`,
          details: {
            status: response.status,
            emailId: responseData.id,
            message: 'API key válida y funcionando correctamente',
            testedEmail: emailToTest
          }
        });

      } catch (fetchError) {
        console.error('❌ RESEND TEST API: Network error:', fetchError);
        
        return res.status(200).json({
          success: false,
          hasResendKey: true,
          keyPreview,
          message: 'Error de conexión con Resend API',
          details: {
            error: fetchError instanceof Error ? fetchError.message : 'Unknown network error',
            type: 'network_error',
            suggestions: [
              'Verifica tu conexión a internet',
              'Los servicios de Resend podrían estar temporalmente no disponibles',
              'Intenta de nuevo en unos minutos'
            ]
          }
        });
      }
    }

    // Método no permitido
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
      allowedMethods: ['GET', 'POST', 'OPTIONS']
    });

  } catch (error) {
    console.error('❌ RESEND TEST API: Unexpected error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
}