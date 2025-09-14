import { supabase } from "@/integrations/supabase/client";
import { UserRole, UserRoleInsert, UserRoleUpdate } from "@/integrations/supabase/types";

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
        console.log(`🔍 getUserRoles STARTING for user:`, userId);
        console.log(`🔍 Full userId:`, userId);
        
        // CRITICAL FIX: Verify user ID consistency first
        if (userId === 'ddayanacastro10@gmail.com' || userId === 'borjapipaon@gmail.com' || userId.includes('@')) {
          console.error('❌ CRITICAL ERROR: Email passed instead of User ID!', { receivedValue: userId });
          throw new Error('Invalid user ID format: received email instead of UUID');
        }
        
        // Add connection test first
        const { data: connectionTest, error: connectionError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
        
        if (connectionError) {
          console.warn('❌ Connection test failed:', connectionError);
          throw new Error(`Connection failed: ${connectionError.message}`);
        }
        
        console.log('✅ Connection test passed');
        
        // ENHANCED: Verify the user ID exists and get email for cross-reference
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('id', userId)
          .maybeSingle();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.warn('❌ Profile lookup failed:', profileError);
        }
        
        if (userProfile) {
          console.log('✅ User profile found:', {
            userId: userProfile.id.substring(0, 8) + '...',
            email: userProfile.email
          });
          
          // Special handling for the problematic user
          if (userProfile.email === 'borjapipaon@gmail.com') {
            console.log('🎯 SPECIAL HANDLING for borjapipaon@gmail.com');
            console.log('🔍 EXECUTING DIRECT QUERY with exact userId:', userProfile.id);
          }
        } else {
          console.warn('⚠️ No profile found for userId:', userId);
          
          // ENHANCED RECOVERY: Try to find by email if available
          console.log('🔍 Attempting email-based recovery...');
          
          // This is a more complex recovery that might be needed
          // We'll skip it for now to avoid infinite loops, but log the issue
          console.warn('⚠️ USER ID NOT FOUND IN PROFILES TABLE');
          console.warn('This suggests either:');
          console.warn('1. User was deleted');
          console.warn('2. Profile creation failed during registration'); 
          console.warn('3. User ID mismatch between auth and database');
        }
        
        const { data, error } = await supabase
          .from('user_roles')
          .select(`
            id,
            user_id,
            role_type,
            is_verified,
            is_active,
            role_specific_data,
            verification_token,
            verification_expires_at,
            verification_confirmed_at,
            created_at,
            updated_at
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        console.log(`🔍 getUserRoles QUERY RESULT:`, {
          userId: userId.substring(0, 8) + '...',
          userEmail: userProfile?.email || 'unknown',
          dataLength: data?.length || 0,
          error: error?.message || 'none',
          errorCode: error?.code || 'none',
          data: data ? data.map(r => ({
            id: r.id.substring(0, 8) + '...',
            role_type: r.role_type,
            is_verified: r.is_verified,
            is_active: r.is_active,
            created_at: r.created_at
          })) : null
        });

        if (error) {
          console.warn(`❌ getUserRoles SUPABASE ERROR:`, {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          
          // Return empty array for certain non-critical errors
          if (error.code === 'PGRST116' || error.message.includes('no rows')) {
            console.log('✅ No roles found (empty result) - this is normal for new users');
            return [];
          }
          
          throw new Error(`Error fetching user roles: ${error.message} (Code: ${error.code})`);
        }

        const roles = (data || []) as UserRole[];
        console.log(`✅ getUserRoles SUCCESSFUL, found ${roles.length} roles:`, 
          roles.map(r => `${r.role_type}(${r.is_verified ? 'verified' : 'pending'}${r.is_active ? ', active' : ''})`).join(', ')
        );
        
        // CRITICAL: Enhanced issue detection for borjapipaon case
        if (roles.length === 0 && userProfile?.email === 'borjapipaon@gmail.com') {
          console.log('🚨 ZERO ROLES DETECTED FOR KNOWN USER - Running enhanced diagnosis...');
          
          // Check if there are ANY roles with this email in the system
          try {
            const { data: allRoles } = await supabase
              .from('user_roles')
              .select('user_id, role_type')
              .limit(5);
              
            console.log('📊 Sample of roles in system:', allRoles?.slice(0, 3));
            
            console.log('📊 Basic system diagnosis completed');
            
          } catch (diagError) {
            console.log('❌ Diagnosis query failed:', diagError);
          }
          
          console.log('💡 RECOMMENDATIONS:');
          console.log('1. Check if roles were created with different user_id during registration');
          console.log('2. Verify that registration process completed successfully');
          console.log('3. Check auth.users table for user existence');
          console.log('4. Consider running manual role creation for this user');
        }
        
        return roles;
        
      } catch (networkError) {
        console.error(`❌ getUserRoles NETWORK/EXCEPTION ERROR:`, {
          error: networkError,
          message: networkError instanceof Error ? networkError.message : String(networkError),
          userId: userId.substring(0, 8) + '...'
        });
        
        // For network errors, return empty array to prevent app breaking
        console.error("getUserRoles failed completely, returning empty array to prevent UI crash");
        return [];
      }
    });
  }
  
  // NEW METHOD: Attempt to recover correct user ID when there's a mismatch
  static async attemptIdRecovery(email: string, providedUserId: string): Promise<{
    recovered: boolean;
    correctedId?: string;
    issue?: string;
  }> {
    try {
      console.log('🔧 ATTEMPTING ID RECOVERY for:', { email, providedUserId: providedUserId.substring(0, 8) + '...' });
      
      // Step 1: Look up user by email in profiles
      const { data: profileByEmail, error: emailError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();
      
      if (emailError || !profileByEmail) {
        console.log('❌ No profile found by email:', email);
        return { recovered: false, issue: 'No profile found by email' };
      }
      
      console.log('📧 Profile found by email:', {
        foundId: profileByEmail.id.substring(0, 8) + '...',
        providedId: providedUserId.substring(0, 8) + '...',
        idsMatch: profileByEmail.id === providedUserId
      });
      
      if (profileByEmail.id === providedUserId) {
        console.log('✅ IDs already match - this is not an ID mismatch issue');
        return { recovered: false, issue: 'IDs match but no roles found' };
      }
      
      // Step 2: Check if the correct ID has roles
      const { data: rolesWithCorrectId, error: rolesError } = await supabase
        .from('user_roles')
        .select('id, role_type, is_verified')
        .eq('user_id', profileByEmail.id);
      
      if (rolesError) {
        console.log('❌ Error checking roles with correct ID:', rolesError);
        return { recovered: false, issue: 'Error checking roles with correct ID' };
      }
      
      if (rolesWithCorrectId && rolesWithCorrectId.length > 0) {
        console.log('🎯 FOUND ROLES WITH CORRECT ID:', {
          correctId: profileByEmail.id.substring(0, 8) + '...',
          rolesFound: rolesWithCorrectId.length,
          roles: rolesWithCorrectId.map(r => r.role_type)
        });
        
        return {
          recovered: true,
          correctedId: profileByEmail.id
        };
      }
      
      console.log('❌ No roles found even with correct ID');
      return { recovered: false, issue: 'No roles found with any ID' };
      
    } catch (recoveryError) {
      console.error('❌ ID recovery failed:', recoveryError);
      return { recovered: false, issue: 'Recovery process failed' };
    }
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
    const roleNames: Record<string, string> = {
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
          is_verified: true, // IMMEDIATELY VERIFIED - NO EMAIL VERIFICATION NEEDED
          is_active: false,
          role_specific_data: roleData || {},
          verification_confirmed_at: new Date().toISOString(), // IMMEDIATELY CONFIRMED
          verification_token: null, // NO TOKEN NEEDED
          verification_expires_at: null, // NO EXPIRATION NEEDED
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

  static async updateRoleSpecificData(
    userId: string,
    roleType: UserRole['role_type'],
    data: Record<string, any>
  ): Promise<{ success: boolean; message: string }> {
    return ConnectionManager.executeWithLimit(async () => {
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Operation timeout')), 10000);
        });

        const updatePromise = supabase
          .from('user_roles')
          .update({
            role_specific_data: data,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('role_type', roleType);

        const result = await Promise.race([updatePromise, timeoutPromise]) as any;
        const { error } = result;

        if (error) {
          throw new Error(`Failed to update role data: ${error.message}`);
        }

        return {
          success: true,
          message: "Datos del rol actualizados correctamente"
        };

      } catch (error) {
        console.error("❌ Error updating role specific data:", error);
        return {
          success: false,
          message: error instanceof Error ? error.message : "Error al actualizar datos del rol"
        };
      }
    });
  }
}

// Re-export UserRole type for convenience
export type { UserRole };