
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
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  // Verificar configuración de API
  if (!process.env.RESEND_API_KEY || !resend) {
    console.error('❌ RESEND_API_KEY not configured');
    return res.status(500).json({
      success: false,
      error: 'Email service not configured. Please set RESEND_API_KEY environment variable.'
    });
  }

  try {
    const { to, subject, html, from } = req.body as EmailRequest;

    // Validar campos requeridos
    if (!to || !subject || !html) {
      console.error('❌ Missing required fields:', { to: !!to, subject: !!subject, html: !!html });
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, html'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      console.error('❌ Invalid email format:', to);
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Configurar el from address - usar el dominio verificado de Resend
    const fromAddress = from || 'HuBiT Platform <onboarding@resend.dev>';

    console.log('📤 Attempting to send email:', {
      to,
      subject,
      from: fromAddress,
      htmlLength: html.length
    });

    // Enviar email via Resend
    const emailResult = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject: subject,
      html: html
    });

    console.log('📧 Resend response:', emailResult);

    if (emailResult.error) {
      console.error('❌ Resend API error:', emailResult.error);
      return res.status(500).json({
        success: false,
        error: 'Failed to send email via Resend',
        details: emailResult.error
      });
    }

    console.log('✅ Email sent successfully:', {
      to,
      subject,
      messageId: emailResult.data?.id
    });

    return res.status(200).json({
      success: true,
      messageId: emailResult.data?.id
    });

  } catch (error) {
    console.error('❌ Email sending error:', error);
    
    // Manejo específico de errores de Resend
    if (error && typeof error === 'object' && 'message' in error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to send email',
        details: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error while sending email',
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
