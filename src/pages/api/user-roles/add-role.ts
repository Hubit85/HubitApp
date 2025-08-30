import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '@/lib/supabaseServer';

interface AddRoleRequestBody {
  userId: string;
  roleType: 'particular' | 'community_member' | 'service_provider' | 'property_administrator';
  roleSpecificData?: Record<string, any>;
}

// Configurar CORS y headers apropiados
function setCorsHeaders(res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configurar headers inmediatamente
  setCorsHeaders(res);
  
  console.log('🚀 API: add-role endpoint called with method:', req.method);

  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('❌ API: Method not allowed:', req.method);
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed',
      message: 'Solo se permite método POST' 
    });
  }

  try {
    // Validar que el body existe
    if (!req.body) {
      console.log('❌ API: No request body provided');
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó información en la solicitud'
      });
    }

    const { userId, roleType, roleSpecificData }: AddRoleRequestBody = req.body;

    console.log('📋 API: Request data received:', { 
      userId: userId ? 'present' : 'missing', 
      roleType, 
      hasRoleSpecificData: !!roleSpecificData,
      bodyKeys: Object.keys(req.body || {})
    });

    // Validación de entrada más robusta
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      console.log('❌ API: Invalid or missing userId:', userId);
      return res.status(400).json({ 
        success: false, 
        message: 'userId es requerido y debe ser una cadena válida no vacía' 
      });
    }

    if (!roleType || typeof roleType !== 'string' || roleType.trim().length === 0) {
      console.log('❌ API: Invalid or missing roleType:', roleType);
      return res.status(400).json({ 
        success: false, 
        message: 'roleType es requerido y debe ser una cadena válida no vacía' 
      });
    }

    const validRoles = ['particular', 'community_member', 'service_provider', 'property_administrator'];
    if (!validRoles.includes(roleType)) {
      console.log('❌ API: Invalid roleType:', roleType);
      return res.status(400).json({
        success: false,
        message: `Tipo de rol inválido. Debe ser uno de: ${validRoles.join(', ')}`
      });
    }

    // Verificar variables de entorno críticas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('❌ API: NEXT_PUBLIC_SUPABASE_URL not configured');
      return res.status(500).json({
        success: false,
        message: 'Error de configuración del servidor: URL de Supabase faltante'
      });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ API: SUPABASE_SERVICE_ROLE_KEY not configured');
      return res.status(500).json({
        success: false,
        message: 'Error de configuración del servidor: Clave de servicio de Supabase faltante'
      });
    }

    // Verificar conexión a Supabase con mejor manejo de errores
    console.log('🔗 API: Testing Supabase connection...');
    
    try {
      const { data: testData, error: connectionError, count } = await supabaseServer
        .from('user_roles')
        .select('id', { count: 'exact' })
        .limit(1);
      
      if (connectionError) {
        console.error('❌ API: Supabase connection failed:', {
          code: connectionError.code,
          message: connectionError.message,
          details: connectionError.details,
          hint: connectionError.hint
        });
        return res.status(500).json({
          success: false,
          message: `Error de conexión con la base de datos: ${connectionError.message}`
        });
      }
      
      console.log('✅ API: Supabase connection successful, found', count, 'total roles');
    } catch (connError) {
      console.error('❌ API: Supabase connection error:', connError);
      return res.status(500).json({
        success: false,
        message: `Error al conectar con la base de datos: ${connError instanceof Error ? connError.message : 'Error desconocido'}`
      });
    }

    // Verificar si el usuario existe en profiles
    console.log('👤 API: Validating user exists...');
    const { data: userProfile, error: userError } = await supabaseServer
      .from('profiles')
      .select('id, email')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('❌ API: User validation failed:', userError);
      return res.status(400).json({
        success: false,
        message: `Usuario no encontrado: ${userError.message}`
      });
    }

    if (!userProfile) {
      console.log('❌ API: User profile not found for userId:', userId);
      return res.status(400).json({
        success: false,
        message: 'Usuario no encontrado en el sistema'
      });
    }

    console.log('✅ API: User validated:', { 
      userId, 
      hasEmail: !!userProfile.email 
    });

    // Verificar si el usuario ya tiene este rol
    console.log('🔍 API: Checking for existing roles...');
    const { data: existingRole, error: checkError } = await supabaseServer
      .from('user_roles')
      .select('id, is_verified, role_type, created_at')
      .eq('user_id', userId)
      .eq('role_type', roleType)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ API: Error checking existing roles:', checkError);
      return res.status(500).json({
        success: false,
        message: `Error al verificar roles existentes: ${checkError.message}`
      });
    }

    if (existingRole) {
      console.log('⚠️ API: Role already exists:', existingRole);
      const roleDisplayName = getRoleDisplayName(roleType);
      
      if (existingRole.is_verified) {
        return res.status(400).json({
          success: false,
          message: `Ya tienes el rol de ${roleDisplayName} verificado`
        });
      } else {
        return res.status(400).json({
          success: false,
          message: `Ya tienes una solicitud pendiente para el rol de ${roleDisplayName}. Revisa tu email para confirmar.`
        });
      }
    }

    // Generar token de verificación
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    console.log('🔐 API: Generated verification token, expires at:', expiresAt.toISOString());

    // Crear el nuevo rol (sin verificar) con mejor manejo de errores
    console.log('💾 API: Creating new role in database...');
    const { data: newRole, error: insertError } = await supabaseServer
      .from('user_roles')
      .insert({
        user_id: userId,
        role_type: roleType,
        is_active: false,
        is_verified: false,
        verification_token: verificationToken,
        verification_expires_at: expiresAt.toISOString(),
        role_specific_data: roleSpecificData || {}
      })
      .select('id, role_type, user_id, created_at')
      .single();

    if (insertError) {
      console.error('❌ API: Database insert error:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
      return res.status(500).json({
        success: false,
        message: `Error al crear el rol en la base de datos: ${insertError.message}`
      });
    }

    if (!newRole) {
      console.error('❌ API: No data returned from insert');
      return res.status(500).json({
        success: false,
        message: 'Error: No se pudo crear el rol correctamente'
      });
    }

    console.log('✅ API: Role created successfully:', { 
      id: newRole.id, 
      role_type: newRole.role_type,
      user_id: newRole.user_id
    });

    const userEmail = userProfile.email;

    if (!userEmail) {
      console.error('❌ API: No email found for user');
      return res.status(200).json({
        success: true,
        message: "Rol creado correctamente, pero no se pudo enviar el email de verificación: email no encontrado",
        requiresVerification: true
      });
    }

    console.log('📧 API: User email found, proceeding with email send...');

    // ENVIO DE EMAIL con mejor manejo de errores
    try {
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      
      if (!RESEND_API_KEY || RESEND_API_KEY.trim().length === 0) {
        console.error('❌ API: RESEND_API_KEY not configured or empty');
        return res.status(200).json({
          success: true,
          message: `Rol creado correctamente, pero no se pudo enviar el email de verificación: Falta configurar RESEND_API_KEY`,
          requiresVerification: true
        });
      }

      const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'https://hubit-84-supabase-email-templates.softgen.ai';
      
      const verificationUrl = `${SITE_URL}/auth/verify-role?token=${verificationToken}`;
      const roleDisplayName = getRoleDisplayName(roleType);
      const currentYear = new Date().getFullYear();

      // Create email HTML template
      const emailHtml = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);">
  <div style="background-color: white; padding: 40px 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border: 1px solid rgba(186, 230, 253, 0.6);">
    
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

    <div style="text-align: center; margin: 40px 0;">
      <a href="${verificationUrl}" 
         style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%); color: white; padding: 18px 45px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 18px; box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3); transition: all 0.3s ease;">
        Verificar Rol
      </a>
    </div>

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

      const emailData = {
        from: 'HuBiT <noreply@resend.dev>',
        to: userEmail,
        subject: `Verificar tu nuevo rol en HuBiT - ${roleDisplayName}`,
        html: emailHtml
      };

      console.log('📤 API: Sending email to:', userEmail);
      console.log('🔑 API: Using RESEND_API_KEY (first 10 chars):', RESEND_API_KEY.substring(0, 10) + '...');

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      const responseData = await emailResponse.json();
      console.log('📡 API: Resend response:', {
        status: emailResponse.status,
        statusText: emailResponse.statusText,
        success: emailResponse.ok,
        data: responseData
      });

      if (!emailResponse.ok) {
        console.error('❌ API: Resend API error:', {
          status: emailResponse.status,
          statusText: emailResponse.statusText,
          data: responseData
        });
        return res.status(200).json({
          success: true,
          message: `Rol creado correctamente, pero no se pudo enviar el email de verificación: ${responseData.message || `Error ${emailResponse.status}`}`,
          requiresVerification: true,
          emailError: responseData
        });
      }

      console.log('✅ API: Email sent successfully:', responseData);

      return res.status(200).json({
        success: true,
        message: `¡Éxito! Se ha enviado un email de verificación para tu nuevo rol de ${roleDisplayName}. Revisa tu bandeja de entrada y spam.`,
        requiresVerification: true,
        emailId: responseData.id
      });

    } catch (emailError) {
      console.error('❌ API: Email sending error:', {
        name: emailError instanceof Error ? emailError.name : 'Unknown',
        message: emailError instanceof Error ? emailError.message : String(emailError),
        stack: emailError instanceof Error ? emailError.stack : undefined
      });
      
      return res.status(200).json({
        success: true,
        message: `Rol creado correctamente, pero hubo un problema al enviar el email de verificación: ${emailError instanceof Error ? emailError.message : 'Error desconocido'}`,
        requiresVerification: true
      });
    }

  } catch (error) {
    console.error('❌ API: Unexpected error in handler:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Asegurar que siempre devolvamos JSON válido
    return res.status(500).json({
      success: false,
      message: `Error interno del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      error: error instanceof Error ? error.name : 'Unknown'
    });
  }
}

function getRoleDisplayName(roleType: string): string {
  const roleNames = {
    'particular': 'Particular',
    'community_member': 'Miembro de Comunidad',
    'service_provider': 'Proveedor de Servicios',
    'property_administrator': 'Administrador de Fincas'
  };
  return roleNames[roleType as keyof typeof roleNames] || roleType;
}

function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
