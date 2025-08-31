import { NextApiRequest, NextApiResponse } from 'next';
import supabaseServer from '@/lib/supabaseServer';

type RoleType = 'particular' | 'community_member' | 'service_provider' | 'property_administrator';

interface AddRoleRequestBody {
  userId: string;
  roleType: RoleType;
  roleSpecificData?: Record<string, any>;
}

function setCorsHeaders(res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed',
      message: 'Solo se permite método POST' 
    });
  }

  try {
    const { userId, roleType, roleSpecificData }: AddRoleRequestBody = req.body;

    if (!userId || !roleType) {
      return res.status(400).json({
        success: false,
        message: 'userId y roleType son requeridos'
      });
    }

    const validRoles: RoleType[] = ['particular', 'community_member', 'service_provider', 'property_administrator'];
    if (!validRoles.includes(roleType as RoleType)) {
      return res.status(400).json({
        success: false,
        message: `Tipo de rol inválido. Debe ser uno de: ${validRoles.join(', ')}`
      });
    }

    // Ensure roleType is properly typed
    const typedRoleType = roleType as RoleType;

    // Verificar si el usuario existe
    const { data: userProfile, error: userError } = await supabaseServer
      .from('profiles')
      .select('id, email, full_name')
      .eq('id', userId)
      .maybeSingle();

    if (userError) {
      return res.status(500).json({
        success: false,
        message: `Error al validar usuario: ${userError.message}`
      });
    }

    if (!userProfile) {
      return res.status(400).json({
        success: false,
        message: 'Usuario no encontrado en el sistema'
      });
    }

    // Verificar si el rol ya existe
    const { data: existingRole, error: checkError } = await supabaseServer
      .from('user_roles')
      .select('id, is_verified, role_type')
      .eq('user_id', userId)
      .eq('role_type', typedRoleType)
      .maybeSingle();

    if (checkError) {
      return res.status(500).json({
        success: false,
        message: `Error al verificar roles existentes: ${checkError.message}`
      });
    }

    if (existingRole) {
      const roleDisplayName = getRoleDisplayName(typedRoleType);
      
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
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Crear el nuevo rol
    const { data: newRole, error: insertError } = await supabaseServer
      .from('user_roles')
      .insert({
        user_id: userId,
        role_type: typedRoleType,
        is_active: false,
        is_verified: false,
        verification_token: verificationToken,
        verification_expires_at: expiresAt.toISOString(),
        role_specific_data: roleSpecificData || {}
      })
      .select('id, role_type, user_id')
      .single();

    if (insertError || !newRole) {
      return res.status(500).json({
        success: false,
        message: `Error al crear el rol: ${insertError?.message || 'Error desconocido'}`
      });
    }

    // Enviar email de verificación
    let emailSent = false;
    let emailErrorMessage = '';
    const userEmail = userProfile.email;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (userEmail && RESEND_API_KEY && RESEND_API_KEY.startsWith('re_')) {
      try {
        const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hubit-84-supabase-email-templates.softgen.ai';
        const verificationUrl = `${SITE_URL}/auth/verify-role?token=${verificationToken}`;
        const roleDisplayName = getRoleDisplayName(typedRoleType);
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

        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'HuBiT <onboarding@resend.dev>',
            to: userEmail,
            subject: `Verificar tu nuevo rol en HuBiT - ${roleDisplayName}`,
            html: emailHtml
          })
        });

        if (emailResponse.ok) {
          emailSent = true;
        } else {
          const responseData = await emailResponse.json();
          if (emailResponse.status === 403) {
            emailErrorMessage = "Solo puedes enviar emails a tu dirección verificada (borjapipaon@gmail.com)";
          } else {
            emailErrorMessage = `Error ${emailResponse.status}: ${responseData.message || emailResponse.statusText}`;
          }
        }

      } catch (emailError) {
        emailErrorMessage = `Error al enviar email: ${emailError instanceof Error ? emailError.message : 'Error desconocido'}`;
      }
    } else {
      emailErrorMessage = 'Configuración de email no disponible';
    }

    const roleDisplayName = getRoleDisplayName(typedRoleType);
    
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
    return res.status(500).json({
      success: false,
      message: `Error interno del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}`
    });
  }
}

function getRoleDisplayName(roleType: RoleType): string {
  const roleNames: Record<RoleType, string> = {
    'particular': 'Particular',
    'community_member': 'Miembro de Comunidad',
    'service_provider': 'Proveedor de Servicios',
    'property_administrator': 'Administrador de Fincas'
  };
  return roleNames[roleType] || roleType;
}

function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}