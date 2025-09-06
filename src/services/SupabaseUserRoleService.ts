import { supabase } from "@/integrations/supabase/client";
import { UserRole, UserRoleInsert, UserRoleUpdate } from "@/integrations/supabase/types";

export interface AddRoleRequest {
  role_type: UserRole['role_type'];
  role_specific_data?: Record<string, any>;
}

// Connection pool to prevent too many simultaneous requests
class ConnectionManager {
  private static activeRequests = 0;
  private static readonly MAX_CONCURRENT_REQUESTS = 3;
  private static readonly QUEUE_TIMEOUT = 10000; // 10 seconds

  static async executeWithLimit<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Request queued too long'));
      }, this.QUEUE_TIMEOUT);

      const tryExecute = async () => {
        if (this.activeRequests >= this.MAX_CONCURRENT_REQUESTS) {
          // Wait a bit and try again
          setTimeout(tryExecute, 100);
          return;
        }

        clearTimeout(timeoutId);
        this.activeRequests++;

        try {
          const result = await operation();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeRequests--;
        }
      };

      tryExecute();
    });
  }
}

export class SupabaseUserRoleService {
  
  static async getUserRoles(userId: string): Promise<UserRole[]> {
    return ConnectionManager.executeWithLimit(async () => {
      try {
        console.log(`🔍 getUserRoles for user:`, userId);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (error) {
          console.warn(`getUserRoles failed:`, error.message);
          
          // Return empty array for certain non-critical errors
          if (error.code === 'PGRST116' || error.message.includes('no rows')) {
            console.log('✅ No roles found (empty result)');
            return [];
          }
          
          throw new Error(`Error fetching user roles: ${error.message}`);
        }

        console.log(`✅ getUserRoles successful, found ${data?.length || 0} roles`);
        return (data || []) as UserRole[];
        
      } catch (networkError) {
        console.warn(`getUserRoles network error:`, networkError);
        
        // For network errors, return empty array to prevent app breaking
        console.error("getUserRoles failed completely, returning empty array");
        return [];
      }
    });
  }

  static async getActiveRole(userId: string): Promise<UserRole | null> {
    return ConnectionManager.executeWithLimit(async () => {
      try {
        console.log(`🎯 getActiveRole for user:`, userId);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true)
          .maybeSingle();

        if (error) {
          console.warn(`getActiveRole failed:`, error.message);
          
          if (error.code === 'PGRST116') {
            console.log('✅ No active role found (empty result)');
            return null;
          }
          
          throw new Error(`Error fetching active role: ${error.message}`);
        }

        console.log(`✅ getActiveRole successful`);
        return data as UserRole | null;
        
      } catch (networkError) {
        console.warn(`getActiveRole network error:`, networkError);
        console.error("getActiveRole failed completely, returning null");
        return null;
      }
    });
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
    return ConnectionManager.executeWithLimit(async () => {
      try {
        console.log('🚀 Frontend: Starting addRole process via API route:', { userId: userId.substring(0, 8) + '...', roleType: request.role_type });

        // Enhanced session validation before making API call
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            console.error('❌ Frontend: Session validation failed:', userError);
            return {
              success: false,
              message: "Sesión expirada. Por favor, inicia sesión nuevamente.",
              errorCode: 'SESSION_EXPIRED'
            };
          }
          
          if (user.id !== userId) {
            console.error('❌ Frontend: User ID mismatch in session');
            return {
              success: false,
              message: "Error de autorización. ID de usuario no coincide con la sesión.",
              errorCode: 'AUTH_MISMATCH'
            };
          }
          
          console.log('✅ Frontend: Session validation passed');
        } catch (sessionError) {
          console.warn('⚠️ Frontend: Session validation error:', sessionError);
          return {
            success: false,
            message: "Error de validación de sesión. Por favor, recarga la página e intenta nuevamente.",
            errorCode: 'SESSION_ERROR'
          };
        }

        // Create AbortController with longer timeout for API calls
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout for role creation

        try {
          // Add retry logic for network issues
          let attempts = 0;
          const maxAttempts = 2;
          let lastError: any = null;
          
          while (attempts < maxAttempts) {
            try {
              console.log(`📡 Frontend: Making API call (attempt ${attempts + 1}/${maxAttempts})`);
              
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

              let result;
              try {
                result = await response.json();
              } catch (parseError) {
                console.error('❌ Frontend: Failed to parse response JSON:', parseError);
                throw new Error("Respuesta del servidor no válida");
              }
              
              console.log('📡 Frontend: API response:', {
                status: response.status,
                success: result?.success,
                message: result?.message?.substring(0, 100) + (result?.message?.length > 100 ? '...' : ''),
                processingTime: result?.processingTime
              });

              if (!response.ok) {
                let errorMessage = result.message || `Error del servidor: ${response.status}`;
                
                // Enhanced error handling with user-friendly messages
                if (response.status === 400) {
                  if (errorMessage.includes('Datos incompletos')) {
                    errorMessage = `Faltan datos requeridos para el rol ${this.getRoleDisplayName(request.role_type)}: ${result.message}`;
                  } else if (errorMessage.includes('inválido')) {
                    errorMessage = "Los datos proporcionados no son válidos. Verifica la información e intenta nuevamente.";
                  } else {
                    errorMessage = "Solicitud inválida: " + errorMessage;
                  }
                } else if (response.status === 401) {
                  errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
                } else if (response.status === 403) {
                  errorMessage = "No tienes permisos para realizar esta acción.";
                } else if (response.status === 404) {
                  errorMessage = "Usuario no encontrado. Verifica que tu cuenta esté creada correctamente.";
                } else if (response.status === 409) {
                  if (errorMessage.includes('verificado')) {
                    errorMessage = `Ya tienes el rol de ${this.getRoleDisplayName(request.role_type)} verificado.`;
                  } else if (errorMessage.includes('pendiente')) {
                    errorMessage = `Ya tienes una verificación pendiente para el rol de ${this.getRoleDisplayName(request.role_type)}.`;
                  } else {
                    errorMessage = "Ya existe un registro para este rol.";
                  }
                } else if (response.status === 408) {
                  errorMessage = "La operación tardó demasiado tiempo. Intenta nuevamente.";
                } else if (response.status === 429) {
                  errorMessage = "Demasiadas solicitudes. Espera un momento antes de intentar de nuevo.";
                } else if (response.status >= 500) {
                  errorMessage = "Error interno del servidor. Intenta nuevamente en unos momentos.";
                  
                  // For 500 errors, might be worth retrying
                  if (attempts < maxAttempts - 1) {
                    console.log(`⚠️ Frontend: Server error, will retry in ${(attempts + 1) * 2000}ms...`);
                    await new Promise(resolve => setTimeout(resolve, (attempts + 1) * 2000));
                    attempts++;
                    continue;
                  }
                }
                
                return {
                  success: false,
                  message: errorMessage,
                  errorCode: response.status.toString(),
                  ...result
                };
              }

              // Success case
              clearTimeout(timeoutId);
              return {
                success: true,
                ...result
              };

            } catch (fetchError: any) {
              lastError = fetchError;
              attempts++;
              
              console.error(`❌ Frontend: Fetch error (attempt ${attempts}):`, fetchError.message);
              
              if (fetchError.name === 'AbortError') {
                return {
                  success: false,
                  message: "Error: La operación tardó demasiado tiempo. Verifica tu conexión e intenta nuevamente.",
                  errorCode: 'TIMEOUT'
                };
              }
              
              // For network errors, retry once
              if (attempts < maxAttempts && (fetchError.message.includes('fetch') || fetchError.message.includes('Failed to fetch'))) {
                console.log(`🔄 Frontend: Network error, retrying in ${attempts * 1000}ms...`);
                await new Promise(resolve => setTimeout(resolve, attempts * 1000));
                continue;
              }
              
              break; // Exit retry loop for non-network errors
            }
          }
          
          // If we get here, all attempts failed
          clearTimeout(timeoutId);
          
          if (lastError) {
            console.error("❌ Frontend: All attempts failed with error:", lastError);
            
            if (lastError.message.includes('fetch') || lastError.message.includes('Failed to fetch')) {
              return {
                success: false,
                message: "Error de conexión: No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente.",
                errorCode: 'CONNECTION_ERROR'
              };
            } else if (lastError.message.includes('network')) {
              return {
                success: false,
                message: "Error de red: Problema de conectividad. Verifica tu conexión e intenta nuevamente.",
                errorCode: 'NETWORK_ERROR'
              };
            }
            
            throw lastError;
          }
          
          // Fallback error
          return {
            success: false,
            message: "Error inesperado durante la comunicación con el servidor.",
            errorCode: 'UNKNOWN_FETCH_ERROR'
          };

        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError; // Will be handled by outer catch
        }

      } catch (error) {
        console.error("❌ Frontend: Complete addRole error:", error);
        
        let errorMessage = "Error al agregar el rol. ";
        let errorCode = 'UNKNOWN_ERROR';
        
        if (error instanceof Error) {
          if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
            errorMessage = "Error de conexión: No se pudo conectar con el servidor. Verifica tu conexión a internet.";
            errorCode = 'CONNECTION_ERROR';
          } else if (error.message.includes('network')) {
            errorMessage = "Error de red: Problema de conectividad. Intenta nuevamente.";
            errorCode = 'NETWORK_ERROR';
          } else if (error.message.includes('timeout')) {
            errorMessage = "Error: La operación tardó demasiado tiempo. Intenta nuevamente.";
            errorCode = 'TIMEOUT';
          } else if (error.message.includes('Sesión expirada') || error.message.includes('autorización')) {
            errorMessage = error.message; // Use the session-specific message
            errorCode = 'AUTH_ERROR';
          } else {
            errorMessage = `Error: ${error.message}`;
          }
        } else {
          errorMessage = "Error inesperado al procesar la solicitud.";
        }

        return {
          success: false,
          message: errorMessage,
          errorCode
        };
      }
    });
  }

  static async activateRole(userId: string, roleType: UserRole['role_type']): Promise<{ success: boolean; message: string }> {
    return ConnectionManager.executeWithLimit(async () => {
      try {
        console.log('🔄 Activating role:', { userId, roleType });

        // Use timeout approach instead of abortSignal
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Operation timeout')), 10000);
        });

        try {
          // First, deactivate all roles
          const deactivatePromise = supabase
            .from('user_roles')
            .update({ 
              is_active: false, 
              updated_at: new Date().toISOString() 
            })
            .eq('user_id', userId);

          const deactivateResult = await Promise.race([deactivatePromise, timeoutPromise]) as any;
          const { error: deactivateError } = deactivateResult;

          if (deactivateError) {
            throw new Error(`Error deactivating roles: ${deactivateError.message}`);
          }

          // Then activate the selected role
          const activatePromise = supabase
            .from('user_roles')
            .update({ 
              is_active: true, 
              updated_at: new Date().toISOString() 
            })
            .eq('user_id', userId)
            .eq('role_type', roleType)
            .eq('is_verified', true);

          const activateResult = await Promise.race([activatePromise, timeoutPromise]) as any;
          const { error: activateError } = activateResult;

          if (activateError) {
            throw new Error(`Error activating role: ${activateError.message}`);
          }

          console.log('✅ Role activated successfully');

          return {
            success: true,
            message: `Rol ${this.getRoleDisplayName(roleType)} activado correctamente`
          };

        } catch (dbError) {
          throw dbError;
        }

      } catch (error) {
        console.error("❌ Error activating role:", error);
        
        let message = "Error al activar el rol";
        if (error instanceof Error && error.message === 'Operation timeout') {
          message = "Error: La operación tardó demasiado tiempo";
        } else if (error instanceof Error && error.message.includes('no rows')) {
          message = "El rol seleccionado no existe o no está verificado";
        }
        
        return {
          success: false,
          message
        };
      }
    });
  }

  static async verifyRole(verificationToken: string): Promise<{ success: boolean; message: string; role?: UserRole }> {
    return ConnectionManager.executeWithLimit(async () => {
      try {
        // Use timeout approach with proper typing
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Operation timeout')), 12000);
        });

        try {
          // Find the role with this token
          const fetchPromise = supabase
            .from('user_roles')
            .select('*')
            .eq('verification_token', verificationToken)
            .single();

          const result = await Promise.race([fetchPromise, timeoutPromise]) as any;
          const { data: roleData, error: fetchError } = result;

          if (fetchError || !roleData) {
            return {
              success: false,
              message: "Token de verificación inválido o expirado"
            };
          }

          // Check if token hasn't expired
          if (roleData.verification_expires_at && new Date() > new Date(roleData.verification_expires_at)) {
            return {
              success: false,
              message: "El token de verificación ha expirado"
            };
          }

          // Mark as verified
          const updatePromise = supabase
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

          const updateResult = await Promise.race([updatePromise, timeoutPromise]) as any;
          const { data: updatedRole, error: updateError } = updateResult;

          if (updateError) {
            throw new Error(updateError.message);
          }

          // Try to create success notification (non-blocking)
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
            // Don't fail the whole operation for this
          }

          return {
            success: true,
            message: `¡Rol de ${this.getRoleDisplayName(roleData.role_type)} verificado correctamente!`,
            role: updatedRole as UserRole
          };

        } catch (dbError) {
          throw dbError;
        }

      } catch (error) {
        console.error("❌ Error verifying role:", error);
        
        let message = "Error al verificar el rol";
        if (error instanceof Error && error.message === 'Operation timeout') {
          message = "Error: La verificación tardó demasiado tiempo";
        }
        
        return {
          success: false,
          message
        };
      }
    });
  }

  static async removeRole(userId: string, roleType: UserRole['role_type']): Promise<{ success: boolean; message: string }> {
    return ConnectionManager.executeWithLimit(async () => {
      try {
        // Don't allow removing the last verified role
        const roles = await this.getUserRoles(userId);
        const verifiedRoles = roles.filter(r => r.is_verified);
        
        if (verifiedRoles.length <= 1) {
          return {
            success: false,
            message: "No puedes eliminar tu único rol verificado"
          };
        }

        // Use timeout approach instead of abortSignal
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Operation timeout')), 8000);
        });

        const deletePromise = supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role_type', roleType);

        const result = await Promise.race([deletePromise, timeoutPromise]) as any;
        const { error } = result;

        if (error) {
          throw new Error(error.message);
        }

        // If we removed the active role, activate another verified role
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
        console.error("❌ Error removing role:", error);
        return {
          success: false,
          message: "Error al eliminar el rol"
        };
      }
    });
  }

  static async removePendingRole(userId: string, roleType: UserRole['role_type']): Promise<{ success: boolean; message: string }> {
    return ConnectionManager.executeWithLimit(async () => {
      try {
        console.log('🗑️ Removing pending role:', { userId, roleType });

        // Use timeout approach with proper typing
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Operation timeout')), 10000);
        });

        const fetchPromise = supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .eq('role_type', roleType)
          .single();

        const result = await Promise.race([fetchPromise, timeoutPromise]) as any;
        const { data: roleData, error: fetchError } = result;

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

        // Delete the unverified role
        const deletePromise = supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role_type', roleType)
          .eq('is_verified', false);

        const deleteResult = await Promise.race([deletePromise, timeoutPromise]) as any;
        const { error: deleteError } = deleteResult;

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
    });
  }

  static async clearPendingVerifications(userId: string): Promise<{ success: boolean; message: string; removedCount?: number }> {
    return ConnectionManager.executeWithLimit(async () => {
      try {
        console.log('🧹 Starting clearPendingVerifications for user:', userId);

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

        // Use timeout approach instead of abortSignal
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Operation timeout')), 10000);
        });

        const deletePromise = supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('is_verified', false);

        const deleteResult = await Promise.race([deletePromise, timeoutPromise]) as any;
        const { error } = deleteResult;

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
    });
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
    return ConnectionManager.executeWithLimit(async () => {
      try {
        const roleRecord: UserRoleInsert = {
          user_id: userId,
          role_type: roleType,
          is_verified: false,
          is_active: false,
          role_specific_data: roleData || {}
        };

        // Use timeout approach instead of abortSignal
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Operation timeout')), 8000);
        });

        const insertPromise = supabase
          .from("user_roles")
          .insert(roleRecord)
          .select()
          .single();

        const result = await Promise.race([insertPromise, timeoutPromise]) as any;
        const { data, error } = result;

        if (error) throw error;

        return { success: true, data };
      } catch (error: any) {
        console.error("Error adding user role:", error);
        return { success: false, error: error.message };
      }
    });
  }

  static async verifyUserRole(userId: string, roleType: UserRole['role_type']) {
    return ConnectionManager.executeWithLimit(async () => {
      try {
        const updateData: UserRoleUpdate = { 
          is_verified: true,
          updated_at: new Date().toISOString()
        };

        // Use timeout approach instead of abortSignal
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Operation timeout')), 8000);
        });

        const updatePromise = supabase
          .from("user_roles")
          .update(updateData)
          .eq("user_id", userId)
          .eq("role_type", roleType)
          .select()
          .single();

        const result = await Promise.race([updatePromise, timeoutPromise]) as any;
        const { data, error } = result;

        if (error) throw error;

        return { success: true, data };
      } catch (error: any) {
        console.error("Error verifying role:", error);
        return { success: false, error: error.message };
      }
    });
  }
}

// Re-export UserRole type for convenience
export type { UserRole };