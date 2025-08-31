
import { supabase } from "@/integrations/supabase/client";
import { UserRole, UserRoleInsert, UserRoleUpdate } from "@/integrations/supabase/types";

export interface AddRoleRequest {
  role_type: UserRole['role_type'];
  role_specific_data?: Record<string, any>;
}

export class SupabaseUserRoleService {
  
  static async getUserRoles(userId: string, retries = 3): Promise<UserRole[]> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔍 getUserRoles attempt ${attempt}/${retries} for user:`, userId);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (error) {
          console.warn(`getUserRoles attempt ${attempt} failed:`, error.message);
          
          if (attempt === retries) {
            throw new Error(`Error fetching user roles: ${error.message}`);
          }
          
          // Esperar antes del siguiente intento (backoff exponencial)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }

        console.log(`✅ getUserRoles successful on attempt ${attempt}`);
        return (data || []) as UserRole[];
        
      } catch (networkError) {
        console.warn(`getUserRoles attempt ${attempt} network error:`, networkError);
        
        if (attempt === retries) {
          // En el último intento, devolver array vacío en lugar de lanzar error
          console.error("All getUserRoles attempts failed, returning empty array");
          return [];
        }
        
        // Esperar antes del siguiente intento
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    return [];
  }

  static async getActiveRole(userId: string, retries = 3): Promise<UserRole | null> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🎯 getActiveRole attempt ${attempt}/${retries} for user:`, userId);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true)
          .maybeSingle();

        if (error) {
          console.warn(`getActiveRole attempt ${attempt} failed:`, error.message);
          
          if (attempt === retries) {
            throw new Error(`Error fetching active role: ${error.message}`);
          }
          
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }

        console.log(`✅ getActiveRole successful on attempt ${attempt}`);
        return data as UserRole | null;
        
      } catch (networkError) {
        console.warn(`getActiveRole attempt ${attempt} network error:`, networkError);
        
        if (attempt === retries) {
          console.error("All getActiveRole attempts failed, returning null");
          return null;
        }
        
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    return null;
  }

  static async addRole(
    userId: string, 
    request: AddRoleRequest
  ): Promise<{ 
    success: boolean; 
    message: string; 
    requiresVerification?: boolean;
    errorCode?: string;
    emailError?: boolean;
    emailErrorDetails?: string;
  }> {
    try {
      console.log('🚀 Frontend: Starting addRole process via API route:', { userId, roleType: request.role_type });

      // Crear AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos timeout

      try {
        // Hacer la llamada a la API route con timeout
        const response = await fetch('/api/user-roles/add-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            roleType: request.role_type,
            roleSpecificData: request.role_specific_data
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Intentar parsear la respuesta JSON
        let result;
        try {
          result = await response.json();
        } catch (parseError) {
          console.error('❌ Frontend: Failed to parse response JSON:', parseError);
          return {
            success: false,
            message: "Error: Respuesta del servidor no válida"
          };
        }
        
        console.log('📡 Frontend: API response:', {
          status: response.status,
          ...result
        });

        if (!response.ok) {
          // Manejar errores específicos basados en el status code
          let errorMessage = result.message || `Error del servidor: ${response.status}`;
          
          if (response.status === 500 && errorMessage.includes('Invalid API key')) {
            errorMessage = "Error de configuración: Verifica las credenciales de Supabase";
          } else if (response.status === 403) {
            errorMessage = "Error de permisos: Solo puedes enviar emails a tu dirección verificada (borjapipaon@gmail.com)";
          } else if (response.status >= 500) {
            errorMessage = "Error interno del servidor. Intenta nuevamente en unos momentos.";
          }
          
          return {
            success: false,
            message: errorMessage,
            errorCode: response.status.toString(),
            ...result
          };
        }

        // Devuelve todo el objeto de éxito de la API
        return {
          success: true,
          ...result
        };

      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        console.error("❌ Frontend: Fetch error in addRole:", fetchError);
        
        // Manejar diferentes tipos de errores de red
        if (fetchError instanceof Error) {
          if (fetchError.name === 'AbortError') {
            return {
              success: false,
              message: "Error: La solicitud tardó demasiado tiempo. Verifica tu conexión e intenta nuevamente."
            };
          } else if (fetchError.message.includes('fetch')) {
            return {
              success: false,
              message: "Error de conexión: No se pudo conectar con el servidor. Verifica tu conexión a internet."
            };
          } else if (fetchError.message.includes('network')) {
            return {
              success: false,
              message: "Error de red: Problema de conectividad. Intenta nuevamente en unos momentos."
            };
          }
        }
        
        throw fetchError; // Re-lanzar para el manejo en el catch principal
      }

    } catch (error) {
      console.error("❌ Frontend: Complete addRole error:", error);
      
      // Proporcionar mensaje de error más específico
      let errorMessage = "Error al agregar el rol. ";
      
      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          errorMessage = "Error de conexión: No se pudo conectar con el servidor. Verifica tu conexión a internet.";
        } else if (error.message.includes('network')) {
          errorMessage = "Error de red: Problema de conectividad. Intenta nuevamente.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "Error: La operación tardó demasiado tiempo. Intenta nuevamente.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      } else {
        errorMessage = "Error inesperado al procesar la solicitud.";
      }

      return {
        success: false,
        message: errorMessage,
        errorCode: 'NETWORK_ERROR'
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

      // Crear notificación de éxito con tipos correctos
      try {
        await supabase
          .from('notifications')
          .insert({
            user_id: roleData.user_id,
            title: `¡Rol verificado correctamente!`,
            message: `Tu rol de ${this.getRoleDisplayName(roleData.role_type)} ha sido verificado y activado.`,
            type: 'success' as const,
            category: 'system' as const,
            read: false
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

  static async addUserRole(userId: string, roleType: UserRole['role_type'], roleData?: any) {
    try {
      const roleRecord: UserRoleInsert = {
        user_id: userId,
        role_type: roleType,
        is_verified: false,
        is_active: false,
        role_specific_data: roleData || {}
      };

      const { data, error } = await supabase
        .from("user_roles")
        .insert(roleRecord)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error("Error adding user role:", error);
      return { success: false, error: error.message };
    }
  }

  static async verifyUserRole(userId: string, roleType: UserRole['role_type']) {
    try {
      const updateData: UserRoleUpdate = { 
        is_verified: true,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from("user_roles")
        .update(updateData)
        .eq("user_id", userId)
        .eq("role_type", roleType)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error("Error verifying role:", error);
      return { success: false, error: error.message };
    }
  }
}

// Re-export UserRole type for convenience
export { UserRole };
