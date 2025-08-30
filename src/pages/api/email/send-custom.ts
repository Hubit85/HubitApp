
import type { NextApiRequest, NextApiResponse } from 'next';

interface EmailRequest {
  userId: string;
  userEmail: string;
  roleType: string;
  verificationToken: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('🌐 API route: send-custom email triggered - DIRECT IMPLEMENTATION');

  try {
    const { userId, userEmail, roleType, verificationToken }: EmailRequest = req.body;

    console.log('📧 Processing email send request:', {
      userId,
      userEmail,
      roleType,
      tokenLength: verificationToken?.length || 0
    });

    // Validate input
    if (!userId || !userEmail || !roleType || !verificationToken) {
      console.error('❌ Missing required parameters');
      return res.status(400).json({ 
        success: false,
        error: 'Missing required parameters: userId, userEmail, roleType, verificationToken' 
      });
    }

    // HARDCODED API KEY - NO ENVIRONMENT DEPENDENCY
    const RESEND_API_KEY = 're_HMYRvjWf_93ML8R9PbPqRHU9EP1sTJ9oS';
    const SITE_URL = 'https://hubit-84-supabase-email-templates.softgen.ai';

    console.log('🔑 Using direct API key (hardcoded):', {
      keyExists: !!RESEND_API_KEY,
      keyPrefix: RESEND_API_KEY.substring(0, 10),
      keyValid: RESEND_API_KEY.startsWith('re_')
    });

    // Build verification URL
    const verificationUrl = `${SITE_URL}/auth/verify-role?token=${verificationToken}`;

    // Get role display name
    const getRoleDisplayName = (roleType: string): string => {
      const roleNames: Record<string, string> = {
        'particular': 'Particular',
        'community_member': 'Miembro de Comunidad', 
        'service_provider': 'Proveedor de Servicios',
        'property_administrator': 'Administrador de Fincas'
      };
      return roleNames[roleType] || roleType;
    };

    const roleDisplayName = getRoleDisplayName(roleType);

    // Create email template
    const currentYear = new Date().getFullYear();
    const emailHtml = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);">
  <div style="background-color: white; padding: 40px 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border: 1px solid rgba(186, 230, 253, 0.6);">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 35px;">
      <div style="display: inline-block; position: relative; margin-bottom: 25px;">
        <h1 style="color: #1e293b; font-size: 42px; margin: 0; font-weight: 800; background: linear-gradient(135deg, #0ea5e9, #0284c7, #0369a1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          HuBiT
        </h1>
        <div style="position: absolute; top: -8px; right: -12px; width: 16px; height: 16px; background: linear-gradient(135deg, #06b6d4, #0891b2); border-radius: 50%;"></div>
      </div>
      <h2 style="color: #0f172a; font-size: 28px; margin: 0; font-weight: 600; line-height: 1.3;">
        Verifica tu Nuevo Rol 🎯
      </h2>
    </div>

    <!-- Main message -->
    <div style="margin-bottom: 35px;">
      <p style="color: #475569; font-size: 18px; line-height: 1.7; margin-bottom: 20px;">
        ¡Hola! Has solicitado agregar un nuevo rol a tu cuenta de HuBiT.
      </p>
      
      <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #3b82f6;">
        <h3 style="color: #1e40af; font-size: 18px; margin-bottom: 12px; font-weight: 600; display: flex; align-items: center;">
          <span style="margin-right: 10px;">👤</span> Nueva Solicitud de Rol
        </h3>
        <p style="color: #1e40af; font-size: 16px; margin: 0; font-weight: 500;">
          Tipo de Rol: <strong>${roleDisplayName}</strong>
        </p>
      </div>
      
      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
        Para verificar y activar este nuevo rol, haz clic en el botón de abajo. Esto te permitirá cambiar entre tus diferentes roles dentro de la plataforma.
      </p>
    </div>

    <!-- Verification button -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="${verificationUrl}" 
         style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%); color: white; padding: 18px 45px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 18px; box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3); transition: all 0.3s ease;">
        Verificar Rol
      </a>
    </div>

    <!-- Security notice -->
    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #f59e0b; margin: 25px 0;">
      <h3 style="color: #92400e; font-size: 16px; margin-bottom: 12px; font-weight: 600; display: flex; align-items: center;">
        <span style="margin-right: 8px;">⚡</span> Información Importante
      </h3>
      <ul style="color: #92400e; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 8px;">Este enlace de verificación expira en <strong>24 horas</strong> por seguridad</li>
        <li style="margin-bottom: 8px;">Una vez verificado, puedes cambiar entre roles en tu dashboard</li>
        <li style="margin-bottom: 8px;">Cada rol puede tener diferentes permisos y características</li>
        <li>Si no solicitaste este rol, puedes ignorar este email</li>
      </ul>
    </div>

    <!-- Role benefits -->
    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #22c55e;">
      <h3 style="color: #15803d; font-size: 18px; margin-bottom: 15px; font-weight: 600; display: flex; align-items: center;">
        <span style="margin-right: 10px;">✨</span> Beneficios de Múltiples Roles
      </h3>
      <div style="display: grid; gap: 10px;">
        <div style="display: flex; align-items: center; color: #166534; font-size: 14px;">
          <span style="margin-right: 10px;">🔄</span>
          <span>Cambia entre roles instantáneamente</span>
        </div>
        <div style="display: flex; align-items: center; color: #166534; font-size: 14px;">
          <span style="margin-right: 10px;">🎯</span>
          <span>Accede a características específicas de cada rol</span>
        </div>
        <div style="display: flex; align-items: center; color: #166534; font-size: 14px;">
          <span style="margin-right: 10px;">📊</span>
          <span>Gestiona diferentes tipos de proyectos</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 45px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">
        ¿Necesitas ayuda? Contacta nuestro soporte en <a href="mailto:support@hubit.com" style="color: #0ea5e9; text-decoration: none;">support@hubit.com</a>
      </p>
      <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 0;">
        © ${currentYear} HuBiT. Todos los derechos reservados.<br>
        <strong>Potenciando múltiples identidades profesionales.</strong>
      </p>
    </div>

  </div>
</div>
    `;

    // Prepare email data for Resend
    const emailData = {
      from: 'HuBiT <noreply@resend.dev>',
      to: userEmail,
      subject: `Verificar tu nuevo rol en HuBiT - ${roleDisplayName}`,
      html: emailHtml
    };

    console.log('📤 Attempting to send email via Resend API (direct implementation)...');
    console.log('📋 Request details:', {
      to: emailData.to,
      subject: emailData.subject,
      apiKeyPrefix: RESEND_API_KEY.substring(0, 10),
      apiKeyValid: RESEND_API_KEY.startsWith('re_')
    });

    // Send email using fetch directly with hardcoded values
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    console.log('📡 Resend API response status:', response.status);
    
    const responseData = await response.json();
    console.log('📋 Resend API response:', responseData);

    if (!response.ok) {
      throw new Error(`Resend API error: ${responseData.message || response.statusText}`);
    }

    console.log('✅ Email sent successfully via Resend (direct implementation)');
    console.log('📧 Email ID:', responseData.id);

    return res.status(200).json({
      success: true,
      message: `Email de verificación enviado a ${userEmail}`,
      emailId: responseData.id
    });

  } catch (error) {
    console.error('❌ API route error:', error);
    
    let errorMessage = 'Unknown error occurred';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      console.log('🔍 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 200)
      });

      // Handle specific error types
      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        statusCode = 429;
        errorMessage = 'Email service rate limit exceeded';
      } else if (error.message.includes('authorization') || error.message.includes('401')) {
        statusCode = 401;
        errorMessage = 'Email service authorization failed - check API key';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        statusCode = 503;
        errorMessage = 'Network error when connecting to email service';
      }
    }

    return res.status(statusCode).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown'
    });
  }
}