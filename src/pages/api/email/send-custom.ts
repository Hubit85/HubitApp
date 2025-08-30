
import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

  try {
    const { to, subject, html, from } = req.body as EmailRequest;

    // Validar campos requeridos
    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, html'
      });
    }

    // Validar email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Verificar que la API key esté configurada
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return res.status(500).json({
        success: false,
        error: 'Email service not configured. Please set RESEND_API_KEY environment variable.'
      });
    }

    // Configurar el from address
    const fromAddress = from || 'HuBiT Platform <noreply@hubit.com>';

    // Enviar email via Resend
    const emailResult = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject: subject,
      html: html
    });

    if (emailResult.error) {
      console.error('Resend API error:', emailResult.error);
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
    console.error('Email sending error:', error);
    
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
