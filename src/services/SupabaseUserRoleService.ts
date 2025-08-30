
import { supabase } from "@/integrations/supabase/client";
import CustomEmailService from "@/lib/customEmailService";

export interface UserRole {
  id: string;
  user_id: string;
  role_type: 'particular' | 'community_member' | 'service_provider' | 'property_administrator';
  is_active: boolean;
  is_verified: boolean;
  verification_token?: string | null;
  verification_expires_at?: string | null;
  verification_confirmed_at?: string | null;
  role_specific_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AddRoleRequest {
  role_type: UserRole['role_type'];
  role_specific_data?: Record<string, any>;
}

export class SupabaseUserRoleService {
  
  static async getUserRoles(userId: string): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Error fetching user roles: ${error.message}`);
    }

    return (data || []) as UserRole[];
  }

  static async getActiveRole(userId: string): Promise<UserRole | null> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No active role found
      }
      throw new Error(`Error fetching active role: ${error.message}`);
    }

    return data as UserRole;
  }

  static async addRole(userId: string, request: AddRoleRequest): Promise<{ success: boolean; message: string; requiresVerification?: boolean }> {
    try {
      console.log('🚀 Starting addRole process:', { userId, roleType: request.role_type });

      // Verificar si el usuario ya tiene este rol
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('id, is_verified')
        .eq('user_id', userId)
        .eq('role_type', request.role_type)
        .single();

      // Log para debugging
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking existing roles:', checkError);
        throw new Error(`Error al verificar roles existentes: ${checkError.message}`);
      }

      if (existingRole) {
        console.log('⚠️ Role already exists:', existingRole);
        if (existingRole.is_verified) {
          return { 
            success: false, 
            message: `Ya tienes el rol de ${this.getRoleDisplayName(request.role_type)} verificado` 
          };
        } else {
          return { 
            success: false, 
            message: `Ya has solicitado el rol de ${this.getRoleDisplayName(request.role_type)}. Revisa tu email para confirmar.` 
          };
        }
      }

      // Generar token de verificación
      const verificationToken = this.generateVerificationToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

      console.log('🔐 Generated verification token:', { 
        token: verificationToken.substring(0, 8) + '...', 
        expiresAt 
      });

      // Crear el nuevo rol (sin verificar)
      const { data, error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_type: request.role_type,
          is_active: false,
          is_verified: false,
          verification_token: verificationToken,
          verification_expires_at: expiresAt.toISOString(),
          role_specific_data: request.role_specific_data || {}
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        throw new Error(`Error al crear el rol en la base de datos: ${insertError.message}`);
      }

      console.log('✅ Role created successfully:', { id: data.id, role_type: data.role_type });

      // Obtener el usuario actual para el email
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Usuario no encontrado para envío de email");
      }

      // IMPLEMENTACIÓN DIRECTA - LLAMAR RESEND DIRECTAMENTE DESDE AQUÍ
      console.log('📧 Sending verification email DIRECTLY from service (no API route calls)...');
      try {
        // HARDCODED API KEY - ELIMINANDO TODA DEPENDENCIA
        const RESEND_API_KEY = 're_HMYRvjWf_93ML8R9PbPqRHU9EP1sTJ9oS';
        const SITE_URL = 'https://hubit-84-supabase-email-templates.softgen.ai';
        
        const verificationUrl = `${SITE_URL}/auth/verify-role?token=${verificationToken}`;
        const roleDisplayName = this.getRoleDisplayName(request.role_type);
        const currentYear = new Date().getFullYear();

        // Create email HTML template directly
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
          to: user.email!,
          subject: `Verificar tu nuevo rol en HuBiT - ${roleDisplayName}`,
          html: emailHtml
        };

        console.log('📤 Calling Resend API DIRECTLY from service...');
        console.log('📋 Request details:', {
          to: emailData.to,
          subject: emailData.subject,
          apiKeyPrefix: RESEND_API_KEY.substring(0, 10),
          apiKeyValid: RESEND_API_KEY.startsWith('re_')
        });

        // Send email using fetch directly - NO API ROUTE DEPENDENCY
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

        console.log('✅ Email sent successfully via direct Resend API call from service');
        console.log('📧 Email ID:', responseData.id);

        return {
          success: true,
          message: `¡Éxito! Se ha enviado un email de verificación para tu nuevo rol de ${roleDisplayName}. Revisa tu bandeja de entrada y spam.`,
          requiresVerification: true
        };

      } catch (emailError) {
        console.error('❌ Direct email API call failed:', emailError);
        
        return {
          success: false,
          message: `Rol creado pero error al enviar email de verificación: ${emailError instanceof Error ? emailError.message : 'Error del servidor de email'}`
        };
      }

    } catch (error) {
      console.error("❌ Complete addRole error:", error);
      
      // Proporcionar mensaje de error más específico basado en el tipo de error
      let errorMessage = "Error al agregar el rol. ";
      
      if (error instanceof Error) {
        console.log("📋 Full error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack?.substring(0, 200)
        });
        
        // Mensajes de error más específicos y útiles
        if (error.message.includes('base de datos')) {
          errorMessage = "Error de base de datos: " + error.message;
        } else if (error.message.includes('Usuario no encontrado')) {
          errorMessage = "Error de autenticación: " + error.message;
        } else if (error.message.includes('verificar roles existentes')) {
          errorMessage = "Error al verificar roles: " + error.message;
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Error de conectividad: Verifica tu conexión a internet.";
        } else {
          errorMessage = `${error.message}`;
        }
      } else {
        errorMessage = "Error inesperado: " + String(error);
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  static async activateRole(userId: string, roleType: UserRole['role_type']): Promise<{ success: boolean; message: string }> {
    try {
      // Desactivar todos los roles primero
      await supabase
        .from('user_roles')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      // Activar el rol seleccionado
      const { error } = await supabase
        .from('user_roles')
        .update({ 
          is_active: true, 
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', userId)
        .eq('role_type', roleType)
        .eq('is_verified', true);

      if (error) {
        throw new Error(`Error activating role: ${error.message}`);
      }

      return {
        success: true,
        message: `Rol ${this.getRoleDisplayName(roleType)} activado correctamente`
      };

    } catch (error) {
      console.error("Error activating role:", error);
      return {
        success: false,
        message: "Error al activar el rol"
      };
    }
  }

  static async verifyRole(verificationToken: string): Promise<{ success: boolean; message: string; role?: UserRole }> {
    try {
      // Buscar el rol con este token
      const { data: roleData, error: fetchError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('verification_token', verificationToken)
        .single();

      if (fetchError || !roleData) {
        return {
          success: false,
          message: "Token de verificación inválido o expirado"
        };
      }

      // Verificar si el token no ha expirado
      if (roleData.verification_expires_at && new Date() > new Date(roleData.verification_expires_at)) {
        return {
          success: false,
          message: "El token de verificación ha expirado"
        };
      }

      // Marcar como verificado
      const { data: updatedRole, error: updateError } = await supabase
        .from('user_roles')
        .update({
          is_verified: true,
          verification_confirmed_at: new Date().toISOString(),
          verification_token: null,
          verification_expires_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', roleData.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Crear notificación de éxito
      try {
        await supabase
          .from('notifications')
          .insert({
            user_id: roleData.user_id,
            title: `¡Rol verificado correctamente!`,
            message: `Tu rol de ${this.getRoleDisplayName(roleData.role_type)} ha sido verificado y activado.`,
            type: 'success',
            category: 'role_verification',
            is_read: false
          });
      } catch (notificationError) {
        console.warn('Could not create success notification:', notificationError);
      }

      return {
        success: true,
        message: `¡Rol de ${this.getRoleDisplayName(roleData.role_type)} verificado correctamente!`,
        role: updatedRole as UserRole
      };

    } catch (error) {
      console.error("Error verifying role:", error);
      return {
        success: false,
        message: "Error al verificar el rol"
      };
    }
  }

  static async removeRole(userId: string, roleType: UserRole['role_type']): Promise<{ success: boolean; message: string }> {
    try {
      // No permitir eliminar el último rol verificado
      const roles = await this.getUserRoles(userId);
      const verifiedRoles = roles.filter(r => r.is_verified);
      
      if (verifiedRoles.length <= 1) {
        return {
          success: false,
          message: "No puedes eliminar tu único rol verificado"
        };
      }

      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_type', roleType);

      if (error) {
        throw new Error(error.message);
      }

      // Si se eliminó el rol activo, activar otro rol verificado
      const activeRole = await this.getActiveRole(userId);
      if (!activeRole || activeRole.role_type === roleType) {
        const remainingRoles = await this.getUserRoles(userId);
        const nextRole = remainingRoles.find(r => r.is_verified);
        if (nextRole) {
          await this.activateRole(userId, nextRole.role_type);
        }
      }

      return {
        success: true,
        message: `Rol de ${this.getRoleDisplayName(roleType)} eliminado correctamente`
      };

    } catch (error) {
      console.error("Error removing role:", error);
      return {
        success: false,
        message: "Error al eliminar el rol"
      };
    }
  }

  /**
   * Elimina todas las verificaciones pendientes (roles no verificados)
   */
  static async clearPendingVerifications(userId: string): Promise<{ success: boolean; message: string; removedCount?: number }> {
    try {
      console.log('🧹 Starting clearPendingVerifications for user:', userId);

      // Obtener todos los roles del usuario
      const roles = await this.getUserRoles(userId);
      const pendingRoles = roles.filter(r => !r.is_verified);
      
      console.log('📋 Found roles:', {
        total: roles.length,
        pending: pendingRoles.length,
        verified: roles.filter(r => r.is_verified).length
      });

      if (pendingRoles.length === 0) {
        return {
          success: true,
          message: "No hay verificaciones pendientes para eliminar",
          removedCount: 0
        };
      }

      // Eliminar todos los roles no verificados
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('is_verified', false);

      if (error) {
        console.error('❌ Error deleting pending roles:', error);
        throw new Error(`Error al eliminar verificaciones pendientes: ${error.message}`);
      }

      console.log(`✅ Successfully removed ${pendingRoles.length} pending verifications`);

      return {
        success: true,
        message: `Se eliminaron ${pendingRoles.length} verificación${pendingRoles.length === 1 ? '' : 'es'} pendiente${pendingRoles.length === 1 ? '' : 's'} correctamente`,
        removedCount: pendingRoles.length
      };

    } catch (error) {
      console.error("❌ Error clearing pending verifications:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al eliminar las verificaciones pendientes"
      };
    }
  }

  /**
   * Elimina una verificación pendiente específica
   */
  static async removePendingRole(userId: string, roleType: UserRole['role_type']): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🗑️ Removing pending role:', { userId, roleType });

      // Verificar que el rol existe y no está verificado
      const { data: roleData, error: fetchError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role_type', roleType)
        .single();

      if (fetchError || !roleData) {
        return {
          success: false,
          message: "Rol no encontrado"
        };
      }

      if (roleData.is_verified) {
        return {
          success: false,
          message: "No puedes eliminar un rol ya verificado. Usa la opción 'Eliminar' en su lugar."
        };
      }

      // Eliminar el rol no verificado
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_type', roleType)
        .eq('is_verified', false);

      if (deleteError) {
        console.error('❌ Error deleting pending role:', deleteError);
        throw new Error(`Error al eliminar verificación pendiente: ${deleteError.message}`);
      }

      console.log('✅ Successfully removed pending role:', roleType);

      return {
        success: true,
        message: `Verificación pendiente de ${this.getRoleDisplayName(roleType)} eliminada correctamente`
      };

    } catch (error) {
      console.error("❌ Error removing pending role:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al eliminar la verificación pendiente"
      };
    }
  }

  /**
   * Envía email de verificación de rol usando el servicio personalizado
   */
  static async sendRoleVerificationEmail(userId: string, roleType: UserRole['role_type'], verificationToken: string): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      // Obtener datos del usuario
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Usuario no encontrado");
      }

      // Usar el servicio de email personalizado
      const result = await CustomEmailService.sendRoleVerificationEmail(
        userId,
        user.email!,
        roleType,
        verificationToken
      );

      if (result.success) {
        console.log(`📧 Email de verificación de rol enviado exitosamente a ${user.email}`);
        console.log(`👤 Nuevo rol: ${this.getRoleDisplayName(roleType)}`);
      }

      return result;

    } catch (error) {
      console.error("Error sending verification email:", error);
      return {
        success: false,
        message: 'Failed to send verification email',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static getRoleDisplayName(roleType: UserRole['role_type']): string {
    const roleNames = {
      'particular': 'Particular',
      'community_member': 'Miembro de Comunidad',
      'service_provider': 'Proveedor de Servicios',
      'property_administrator': 'Administrador de Fincas'
    };
    return roleNames[roleType] || roleType;
  }

  static generateVerificationToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  static getAllRoleTypes(): { value: UserRole['role_type']; label: string; description: string }[] {
    return [
      { value: "particular", label: "Particular", description: "Usuario individual" },
      { value: "community_member", label: "Miembro de Comunidad", description: "Residente de comunidad" },
      { value: "service_provider", label: "Proveedor de Servicios", description: "Empresa o autónomo" },
      { value: "property_administrator", label: "Administrador de Fincas", description: "Gestión de propiedades" }
    ];
  }
}