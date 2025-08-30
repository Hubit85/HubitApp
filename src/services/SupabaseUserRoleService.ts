
import { supabase } from "@/integrations/supabase/client";

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
      // Verificar si el usuario ya tiene este rol
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id, is_verified')
        .eq('user_id', userId)
        .eq('role_type', request.role_type)
        .single();

      if (existingRole) {
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

      // Crear el nuevo rol (sin verificar)
      const { data, error } = await supabase
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

      if (error) {
        throw new Error(`Error creating role: ${error.message}`);
      }

      // Enviar email de verificación
      await this.sendRoleVerificationEmail(userId, request.role_type, verificationToken);

      return {
        success: true,
        message: `Se ha enviado un email de confirmación para verificar tu nuevo rol de ${this.getRoleDisplayName(request.role_type)}`,
        requiresVerification: true
      };

    } catch (error) {
      console.error("Error adding role:", error);
      return {
        success: false,
        message: "Error al agregar el rol. Por favor inténtalo de nuevo."
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

  static async sendRoleVerificationEmail(userId: string, roleType: UserRole['role_type'], verificationToken: string) {
    try {
      // Obtener datos del usuario
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no encontrado");

      const verificationUrl = `${window.location.origin}/auth/verify-role?token=${verificationToken}`;

      // En un entorno real, aquí enviarías el email a través de tu servicio de email
      // Por ahora, lo simulamos guardando la notificación
      console.log(`📧 Email de verificación de rol enviado a ${user.email}`);
      console.log(`🔗 URL de verificación: ${verificationUrl}`);
      console.log(`👤 Nuevo rol: ${this.getRoleDisplayName(roleType)}`);

      // Crear notificación en el sistema
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: `Verificar nuevo rol: ${this.getRoleDisplayName(roleType)}`,
          message: `Se ha enviado un email de verificación para confirmar tu nuevo rol de ${this.getRoleDisplayName(roleType)}`,
          type: 'info',
          category: 'role_verification'
        });

    } catch (error) {
      console.error("Error sending verification email:", error);
      throw error;
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
