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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configurar headers inmediatamente
  setCorsHeaders(res);
  
  console.log('🚀 API: add-role endpoint called with method:', req.method);

  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
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
      hasRoleSpecificData: !!roleSpecificData
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

    // VALIDACIÓN ROBUSTA DE VARIABLES DE ENTORNO
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    console.log('🔧 API: Environment validation:', {
      hasSupabaseUrl: !!SUPABASE_URL,
      hasSupabaseServiceKey: !!SUPABASE_SERVICE_KEY,
      hasResendKey: !!RESEND_API_KEY,
      supabaseUrlFormat: SUPABASE_URL ? 'valid' : 'missing'
    });

    // Verificar configuración básica de Supabase
    if (!SUPABASE_URL || !SUPABASE_URL.includes('supabase.co')) {
      console.error('❌ API: Invalid SUPABASE_URL');
      return res.status(500).json({
        success: false,
        message: 'Error de configuración: URL de Supabase no válida'
      });
    }

    if (!SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY.length < 100) {
      console.error('❌ API: Invalid SUPABASE_SERVICE_ROLE_KEY');
      return res.status(500).json({
        success: false,
        message: 'Error de configuración: Clave de servicio de Supabase inválida'
      });
    }

    // Verificar que no sean claves placeholder
    if (SUPABASE_SERVICE_KEY.includes('invalid') || SUPABASE_SERVICE_KEY.includes('your-')) {
      console.error('❌ API: SUPABASE_SERVICE_ROLE_KEY appears to be placeholder');
      return res.status(500).json({
        success: false,
        message: 'Error de configuración: Clave de servicio de Supabase es un placeholder'
      });
    }

    // Resend es opcional para esta operación
    const resendAvailable = RESEND_API_KEY && 
                           RESEND_API_KEY.trim().length > 0 && 
                           !RESEND_API_KEY.includes('missing') && 
                           RESEND_API_KEY.startsWith('re_');

    console.log('📧 API: Email service status:', { resendAvailable });

    // CONEXIÓN SUPABASE MEJORADA - Test más simple y robusto
    console.log('🔗 API: Testing Supabase connection...');
    
    try {
      // Test de conectividad básico - usar una consulta simple que debería funcionar siempre
      const { data: healthCheck, error: healthError } = await supabaseServer
        .from('profiles')
        .select('id')
        .limit(1);
      
      // Si hay error con profiles, es probable que sea un problema de configuración
      if (healthError) {
        console.error('❌ API: Supabase connection test failed:', healthError.message);
        
        // Determinar tipo de error más específico
        let errorMessage = 'Error de base de datos';
        
        if (healthError.message?.includes('JWT') || healthError.message?.includes('authorization')) {
          errorMessage = 'Invalid API key';
        } else if (healthError.message?.includes('network') || healthError.message?.includes('connection')) {
          errorMessage = 'Error de conexión con la base de datos';
        } else {
          errorMessage = `Error de base de datos: ${healthError.message}`;
        }
        
        return res.status(500).json({
          success: false,
          message: errorMessage
        });
      }
      
      console.log('✅ API: Supabase connection successful');
      
    } catch (connError) {
      console.error('❌ API: Supabase connection exception:', connError);
      return res.status(500).json({
        success: false,
        message: 'Error de base de datos: Invalid API key'
      });
    }

    // Verificar si el usuario existe en profiles
    console.log('👤 API: Validating user exists...');
    const { data: userProfile, error: userError } = await supabaseServer
      .from('profiles')
      .select('id, email, full_name')
      .eq('id', userId)
      .maybeSingle();

    if (userError) {
      console.error('❌ API: User validation failed:', userError);
      return res.status(400).json({
        success: false,
        message: `Error al validar usuario: ${userError.message}`
      });
    }

    if (!userProfile) {
      console.error('❌ API: User not found in profiles');
      return res.status(400).json({
        success: false,
        message: 'Usuario no encontrado en el sistema'
      });
    }

    console.log('✅ API: User validated:', { 
      userId, 
      hasEmail: !!userProfile.email
    });

    // Verificar si el rol ya existe
    console.log('🔍 API: Checking for existing roles...');
    const { data: existingRole, error: checkError } = await supabaseServer
      .from('user_roles')
      .select('id, is_verified, role_type')
      .eq('user_id', userId)
      .eq('role_type', roleType)
      .maybeSingle();

    if (checkError) {
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

    console.log('🔐 API: Generated verification token');

    // Crear el nuevo rol
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
      .select('id, role_type, user_id')
      .single();

    if (insertError || !newRole) {
      console.error('❌ API: Database insert error:', insertError);
      return res.status(500).json({
        success: false,
        message: `Error al crear el rol en la base de datos: ${insertError?.message || 'Error desconocido'}`
      });
    }

    console.log('✅ API: Role created successfully:', newRole.id);

    // Preparar email
    const userEmail = userProfile.email;
    if (!userEmail) {
      console.error('❌ API: No email found for user');
      return res.status(200).json({
        success: true,
        message: "Rol creado correctamente, pero no se pudo enviar email: email no encontrado",
        requiresVerification: true
      });
    }

    // ENVIAR EMAIL con Resend (solo si está disponible)
    console.log('📧 API: Preparing to send verification email...');
    
    let emailSent = false;
    let emailErrorMessage = '';

    if (!resendAvailable) {
      console.warn('⚠️ API: Resend not available, skipping email');
      emailErrorMessage = 'Configuración de email no disponible';
    } else {
      try {
        const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'https://hubit-84-supabase-email-templates.softgen.ai';
        const verificationUrl = `${SITE_URL}/auth/verify-role?token=${verificationToken}`;
        const roleDisplayName = getRoleDisplayName(roleType);
        const currentYear = new Date().getFullYear();

        const emailHtml = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);">
  <div style="background-color: white; padding: 40px 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 35px;">
      <h1 style="color: #1e293b; font-size: 42px; margin: 0; font-weight: 800; background: linear-gradient(135deg, #0ea5e9, #0284c7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">HuBiT</h1>
      <h2 style="color: #0f172a; font-size: 28px; margin: 15px 0 0 0; font-weight: 600;">Verifica tu Nuevo Rol 🎯</h2>
    </div>

    <p style="color: #475569; font-size: 18px; line-height: 1.7; margin-bottom: 20px;">
      ¡Hola ${userProfile.full_name || 'Usuario'}! Has solicitado agregar un nuevo rol a tu cuenta.
    </p>
    
    <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #3b82f6;">
      <h3 style="color: #1e40af; font-size: 18px; margin-bottom: 12px; font-weight: 600;">👤 Nueva Solicitud de Rol</h3>
      <p style="color: #1e40af; font-size: 16px; margin: 0; font-weight: 500;">Tipo de Rol: <strong>${roleDisplayName}</strong></p>
    </div>
    
    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
      Para verificar y activar este rol, haz clic en el botón de abajo:
    </p>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; padding: 18px 45px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 18px;">Verificar Rol Ahora</a>
    </div>

    <div style="background: #fef3c7; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b; margin: 25px 0;">
      <h4 style="color: #92400e; font-size: 16px; margin-bottom: 10px;">⚡ Información Importante</h4>
      <ul style="color: #92400e; font-size: 14px; margin: 0; padding-left: 20px;">
        <li>Este enlace expira en 24 horas</li>
        <li>Una vez verificado, puedes cambiar entre roles en tu dashboard</li>
        <li>Si no solicitaste esto, ignora este email</li>
      </ul>
    </div>

    <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 2px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 14px; margin-bottom: 10px;">
        ¿Necesitas ayuda? <a href="mailto:support@hubit.com" style="color: #0ea5e9;">support@hubit.com</a>
      </p>
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${currentYear} HuBiT. Todos los derechos reservados.</p>
    </div>
  </div>
</div>`;

        const emailData = {
          from: 'HuBiT <onboarding@resend.dev>',
          to: userEmail,
          subject: `Verificar tu nuevo rol en HuBiT - ${roleDisplayName}`,
          html: emailHtml
        };

        console.log('📤 API: Calling Resend API...');

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
          success: emailResponse.ok
        });

        if (emailResponse.ok) {
          console.log('✅ API: Email sent successfully');
          emailSent = true;
        } else {
          console.error('❌ API: Resend API error:', responseData);
          
          if (emailResponse.status === 401) {
            emailErrorMessage = "Clave de API de Resend inválida";
          } else if (emailResponse.status === 403) {
            emailErrorMessage = "Solo puedes enviar emails a tu dirección verificada (borjapipaon@gmail.com)";
          } else {
            emailErrorMessage = `Error ${emailResponse.status}: ${responseData.message || emailResponse.statusText}`;
          }
        }

      } catch (emailError) {
        console.error('❌ API: Email sending error:', emailError);
        emailErrorMessage = `Error al enviar email: ${emailError instanceof Error ? emailError.message : 'Error desconocido'}`;
      }
    }

    // Respuesta final con información sobre el estado del email
    const roleDisplayName = getRoleDisplayName(roleType);
    
    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: `¡Éxito! Se ha enviado un email de verificación para tu nuevo rol de ${roleDisplayName}. Revisa tu bandeja de entrada y carpeta de spam.`,
        requiresVerification: true
      });
    } else {
      return res.status(200).json({
        success: true,
        message: `Rol de ${roleDisplayName} creado correctamente. ${emailErrorMessage ? `Nota: ${emailErrorMessage}` : 'Email de verificación no disponible temporalmente.'}`,
        requiresVerification: true,
        emailError: true,
        emailErrorDetails: emailErrorMessage
      });
    }

  } catch (error) {
    console.error('❌ API: Unexpected error:', error);
    
    return res.status(500).json({
      success: false,
      message: `Error interno del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}`
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