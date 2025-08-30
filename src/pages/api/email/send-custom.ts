
import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

// Inicializar Resend solo si la API key está presente
let resend: Resend | null = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  details?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmailResponse>
) {
  console.log('📧 Email API called with method:', req.method);
  
  // Solo permitir método POST
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  // Verificar configuración de API
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY environment variable not set');
    return res.status(500).json({
      success: false,
      error: 'Email service not configured. RESEND_API_KEY environment variable is missing.'
    });
  }

  if (!resend) {
    console.error('❌ Resend client not initialized');
    return res.status(500).json({
      success: false,
      error: 'Email service initialization failed. Check API key format.'
    });
  }

  // Validar que la API key tenga el formato correcto
  if (!process.env.RESEND_API_KEY.startsWith('re_')) {
    console.error('❌ Invalid RESEND_API_KEY format. Must start with "re_"');
    return res.status(500).json({
      success: false,
      error: 'Invalid Resend API key format. Key must start with "re_".'
    });
  }

  try {
    const { to, subject, html, from } = req.body as EmailRequest;

    console.log('📧 Processing email request:', {
      to: to ? to.substring(0, 5) + '***' : 'missing',
      subject: subject || 'missing',
      hasHtml: !!html,
      htmlLength: html ? html.length : 0,
      from: from || 'default'
    });

    // Validar campos requeridos con mensajes específicos
    const missingFields: string[] = [];
    if (!to) missingFields.push('to');
    if (!subject) missingFields.push('subject');  
    if (!html) missingFields.push('html');

    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validar formato de email con regex más estricto
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(to)) {
      console.error('❌ Invalid email format:', to);
      return res.status(400).json({
        success: false,
        error: `Invalid email format: ${to}`
      });
    }

    // Validar longitud del HTML (evitar emails demasiado grandes)
    if (html.length > 500000) { // 500KB limit
      console.error('❌ HTML content too large:', html.length);
      return res.status(400).json({
        success: false,
        error: 'Email content too large. Maximum size is 500KB.'
      });
    }

    // Configurar el from address - usar el dominio verificado de Resend
    const fromAddress = from || 'HuBiT Platform <onboarding@resend.dev>';

    console.log('📤 Sending email via Resend API:', {
      to,
      subject,
      from: fromAddress,
      htmlLength: html.length,
      timestamp: new Date().toISOString()
    });

    // Enviar email via Resend con timeout
    const emailPromise = resend.emails.send({
      from: fromAddress,
      to: [to],
      subject: subject,
      html: html
    });

    // Implementar timeout de 30 segundos para evitar requests colgados
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Email sending timeout')), 30000)
    );

    const emailResult = await Promise.race([emailPromise, timeoutPromise]) as any;

    console.log('📧 Resend API response received:', {
      hasData: !!emailResult.data,
      hasError: !!emailResult.error,
      messageId: emailResult.data?.id,
      timestamp: new Date().toISOString()
    });

    if (emailResult.error) {
      console.error('❌ Resend API returned error:', {
        errorType: emailResult.error.name || 'Unknown',
        errorMessage: emailResult.error.message || 'No message',
        errorDetails: emailResult.error
      });
      
      // Proporcionar mensajes de error más específicos basados en el tipo de error
      let userFriendlyMessage = 'Failed to send email';
      if (emailResult.error.message?.includes('API key')) {
        userFriendlyMessage = 'Invalid API key configuration';
      } else if (emailResult.error.message?.includes('rate')) {
        userFriendlyMessage = 'Rate limit exceeded, please try again later';
      } else if (emailResult.error.message?.includes('domain')) {
        userFriendlyMessage = 'Email domain not verified';
      } else if (emailResult.error.message?.includes('invalid')) {
        userFriendlyMessage = 'Invalid email address or content';
      }

      return res.status(500).json({
        success: false,
        error: userFriendlyMessage,
        details: emailResult.error.message || 'Unknown error from email service'
      });
    }

    if (!emailResult.data || !emailResult.data.id) {
      console.error('❌ Resend API succeeded but no message ID returned');
      return res.status(500).json({
        success: false,
        error: 'Email service returned success but no confirmation ID'
      });
    }

    console.log('✅ Email sent successfully:', {
      to,
      subject,
      messageId: emailResult.data.id,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      messageId: emailResult.data.id
    });

  } catch (error) {
    console.error('❌ Unexpected email sending error:', {
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack?.substring(0, 500) : 'No stack',
      timestamp: new Date().toISOString()
    });
    
    // Manejo específico de errores conocidos
    let errorMessage = 'Internal server error while sending email';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        errorMessage = 'Email sending timeout. Please try again.';
        statusCode = 408;
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error while connecting to email service';
        statusCode = 503;
      } else if (error.message.includes('API key')) {
        errorMessage = 'Invalid API key configuration';
        statusCode = 500;
      } else if (error.message.toLowerCase().includes('fetch')) {
        errorMessage = 'Failed to connect to email service';
        statusCode = 503;
      }
    }
    
    return res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Configuración de Next.js API
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};