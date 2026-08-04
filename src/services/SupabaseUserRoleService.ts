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
  
  // ENHANCED ID recovery and role loading methods
  static async attemptIdRecovery(email: string, providedUserId: string): Promise<{
    recovered: boolean;
    correctedId?: string;
    issue?: string;
  }> {
    try {
      console.log('🔧 ENHANCED ID RECOVERY for:', { email, providedUserId: providedUserId.substring(0, 8) + '...' });

      // FIXED: Remove auth admin access completely as it's not available
      console.log('ℹ️ Skipping auth admin access - using direct database methods only');
      
      // Strategy 1: Look up user by email in profiles
      const { data: profileByEmail, error: emailError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', email)
        .maybeSingle();
      
      if (emailError && emailError.code !== 'PGRST116') {
        console.log('❌ Profile lookup by email failed:', emailError);
        return { recovered: false, issue: 'Profile lookup failed' };
      }
      
      if (profileByEmail) {
        console.log('📧 Profile found by email:', {
          foundId: profileByEmail.id.substring(0, 8) + '...',
          providedId: providedUserId.substring(0, 8) + '...',
          idsMatch: profileByEmail.id === providedUserId,
          fullName: profileByEmail.full_name
        });
        
        if (profileByEmail.id === providedUserId) {
          // IDs match but still no roles - this is a different issue
          console.log('🤔 IDs match but no roles found - checking role creation during registration');
          
          // Check if this might be a timing issue - roles created but not yet visible
          const { data: recentRoles, error: recentError } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', providedUserId)
            .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Last 5 minutes
          
          if (!recentError && recentRoles && recentRoles.length > 0) {
            console.log('🎯 FOUND RECENT ROLES - this was a timing/caching issue:', recentRoles.length);
            return {
              recovered: true,
              correctedId: providedUserId
            };
          }
          
          return { recovered: false, issue: 'IDs match but no roles exist' };
        }
        
        // Strategy 2: Check if the correct ID has roles
        const { data: rolesWithCorrectId, error: rolesError } = await supabase
          .from('user_roles')
          .select('id, role_type, is_verified, is_active')
          .eq('user_id', profileByEmail.id);
        
        if (rolesError) {
          console.log('❌ Error checking roles with correct ID:', rolesError);
          return { recovered: false, issue: 'Error checking roles with correct ID' };
        }
        
        if (rolesWithCorrectId && rolesWithCorrectId.length > 0) {
          console.log('🎯 FOUND ROLES WITH CORRECT ID:', {
            correctId: profileByEmail.id.substring(0, 8) + '...',
            rolesFound: rolesWithCorrectId.length,
            roles: rolesWithCorrectId.map(r => `${r.role_type}(${r.is_verified ? 'verified' : 'unverified'})`)
          });
          
          return {
            recovered: true,
            correctedId: profileByEmail.id
          };
        }
      }
      
      // FIXED: Strategy 3 - Use safe queries only, no LIKE operators on JSONB or UUID
      console.log('🔄 Strategy 3: Searching by exact matches only...');
      
      // Try to find any user_roles for users with the same email domain
      const emailDomain = email.split('@')[1];
      if (emailDomain) {
        try {
          // Find all profiles with the same domain
          const { data: domainProfiles, error: domainError } = await supabase
            .from('profiles')
            .select('id, email')
            .ilike('email', `%@${emailDomain}`); // Safe ILIKE on email text field
          
          if (!domainError && domainProfiles && domainProfiles.length > 0) {
            console.log(`🔍 Found ${domainProfiles.length} profiles with domain ${emailDomain}`);
            
            // Check each profile for roles
            for (const domainProfile of domainProfiles) {
              if (domainProfile.email === email) {
                const { data: domainRoles, error: domainRolesError } = await supabase
                  .from('user_roles')
                  .select('*')
                  .eq('user_id', domainProfile.id);
                
                if (!domainRolesError && domainRoles && domainRoles.length > 0) {
                  console.log('🎯 FOUND ROLES WITH DOMAIN MATCH:', domainRoles.length);
                  return {
                    recovered: true,
                    correctedId: domainProfile.id
                  };
                }
              }
            }
          }
        } catch (domainError) {
          console.warn('Domain search failed:', domainError);
        }
      }
      
      console.log('❌ No roles found with any recovery strategy');
      return { recovered: false, issue: 'No roles found with any ID' };
      
    } catch (recoveryError) {
      console.error('❌ Enhanced ID recovery failed:', recoveryError);
      return { recovered: false, issue: 'Enhanced recovery process failed' };
    }
  }

  // ENHANCED getUserRoles method with better error handling and recovery
  static async getUserRoles(userId: string): Promise<UserRole[]> {
    return ConnectionManager.executeWithLimit(async () => {
      try {
        console.log(`🔍 getUserRoles STARTING for user:`, userId.substring(0, 8) + '...');
        console.log(`🔍 Full userId:`, userId);
        
        // CRITICAL FIX: Verify user ID format first
        if (!userId || userId.length < 20 || userId.includes('@')) {
          console.error('❌ CRITICAL ERROR: Invalid user ID format!', { receivedValue: userId });
          throw new Error('Invalid user ID format: must be a valid UUID');
        }
        
        // STEP 1: Direct database query with comprehensive error handling
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
          dataLength: data?.length || 0,
          error: error?.message || 'none',
          errorCode: error?.code || 'none'
        });

        if (error) {
          console.warn(`❌ getUserRoles SUPABASE ERROR:`, {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          
          // For BORJAPIPAON case - don't give up on first error
          if (error.code === 'PGRST116' || error.message.includes('no rows')) {
            console.log('📝 No roles found with direct query - attempting recovery for user');
            
            // Try to get user's email for recovery
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('email')
                .eq('id', userId)
                .single();
              
              if (profile?.email) {
                console.log('🔧 Attempting recovery with email:', profile.email);
                const recovery = await this.attemptIdRecovery(profile.email, userId);
                
                if (recovery.recovered && recovery.correctedId) {
                  console.log('🎯 RECOVERY SUCCESSFUL - retrying with corrected ID');
                  return this.getUserRoles(recovery.correctedId);
                }
              }
            } catch (recoveryError) {
              console.warn('Recovery attempt failed:', recoveryError);
            }
            
            console.log('✅ No roles found (confirmed after recovery attempt)');
            return [];
          }
          
          throw new Error(`Error fetching user roles: ${error.message} (Code: ${error.code})`);
        }

        const roles = (data || []) as UserRole[];
        console.log(`✅ getUserRoles SUCCESSFUL, found ${roles.length} roles:`, 
          roles.map(r => `${r.role_type}(${r.is_verified ? 'verified' : 'pending'}${r.is_active ? ', active' : ''})`).join(', ')
        );
        
        // SPECIFIC ISSUE DETECTION for BORJAPIPAON type cases
        if (roles.length === 0) {
          // Enhanced diagnostics for zero-role users
          console.log('🚨 ZERO ROLES DETECTED - Running enhanced diagnostics...');
          
          try {
            // Check if user exists in profiles
            const { data: profile } = await supabase
              .from('profiles')
              .select('email, created_at, user_type')
              .eq('id', userId)
              .single();
            
            if (profile) {
              console.log('📊 Enhanced diagnostics:', {
                userExists: true,
                email: profile.email,
                userType: profile.user_type,
                profileAge: profile.created_at
              });
              
              // Check if this user just registered recently
              if (profile.created_at) {
                const profileAge = new Date(profile.created_at);
                const now = new Date();
                const ageMinutes = (now.getTime() - profileAge.getTime()) / (1000 * 60);
                
                if (ageMinutes < 30) { // Recently created
                  console.log('🕐 RECENT REGISTRATION detected - this might be a timing issue');
                  console.log('💡 RECOMMENDATION: Try refreshing or logging out and back in');
                  
                  // Try one more direct search for very recent roles
                  const { data: veryRecentRoles } = await supabase
                    .from('user_roles')
                    .select('*')
                    .eq('user_id', userId)
                    .gte('created_at', profile.created_at);
                  
                  if (veryRecentRoles && veryRecentRoles.length > 0) {
                    console.log('🎯 FOUND VERY RECENT ROLES:', veryRecentRoles.length);
                    return veryRecentRoles as UserRole[];
                  }
                }
              } else {
                console.log('🕐 No creation date available for profile');
              }
              
              // BORJAPIPAON specific case
              if (profile.email?.includes('borjapipaon') || profile.email?.includes('pipaon')) {
                console.log('🎯 BORJAPIPAON SPECIFIC CASE detected');
                console.log('This user should have multiple roles from registration');
                console.log('Possible causes:');
                console.log('1. Registration failed to create roles');
                console.log('2. User ID mismatch between auth and database');
                console.log('3. Roles were created but database query is failing');
                console.log('4. User is using different account than registered');
                
                // CRITICAL FIX: Check for ID mismatch between auth and profiles
                const { data: userProfile } = await supabase
                  .from('profiles')
                  .select('id, email')
                  .eq('email', profile.email)
                  .single();

                if (userProfile) {
                  console.log('✅ User profile found:', {
                    userId: userProfile.id.substring(0, 8) + '...',
                    email: userProfile.email
                  });

                  // CRITICAL FIX: Check for ID mismatch between auth and profiles
                  if (userProfile.id !== userId) {
                    console.log('🔍 ID MISMATCH DETECTED:', {
                      providedId: userId.substring(0, 8) + '...',
                      actualId: userProfile.id.substring(0, 8) + '...',
                      email: userProfile.email
                    });
                    
                    // Attempt automatic recovery using the correct ID
                    const recoveryResult = await this.attemptIdRecovery(userProfile.email, userId);
                    if (recoveryResult.recovered && recoveryResult.correctedId) {
                      console.log('🔄 RETRYING with corrected ID:', recoveryResult.correctedId.substring(0, 8) + '...');
                      return await this.getUserRoles(recoveryResult.correctedId);
                    }
                  }
                }
                
                // FIXED: Remove problematic like queries that cause operator errors
                console.log('🔍 Alternative search methods (safe)');
                
                // Try direct exact matches instead of LIKE queries
                try {
                  // Method 1: Search by exact email match in profiles
                  const { data: profileMatches, error: profileError } = await supabase
                    .from('profiles')
                    .select('id, email')
                    .eq('email', profile.email);
                  
                  if (!profileError && profileMatches && profileMatches.length > 0) {
                    console.log(`📋 Found ${profileMatches.length} profile matches`);
                    
                    for (const profileMatch of profileMatches) {
                      if (profileMatch.id !== userId) {
                        console.log('🔍 Checking roles for profile match:', profileMatch.id.substring(0, 8) + '...');
                        
                        const { data: altRoles } = await supabase
                          .from('user_roles')
                          .select('*')
                          .eq('user_id', profileMatch.id);
                        
                        if (altRoles && altRoles.length > 0) {
                          console.log('🎯 FOUND ROLES WITH ALTERNATIVE ID:', altRoles.length);
                          return altRoles as UserRole[];
                        }
                      }
                    }
                  }
                } catch (altError) {
                  console.warn('Alternative search method failed:', altError);
                }
              }
            } else {
              console.log('❌ User profile not found - this is a critical issue');
            }
          } catch (diagError) {
            console.log('❌ Diagnostic queries failed:', diagError);
          }
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

        const withTimeout = async <T,>(operation: PromiseLike<T>, label: string): Promise<T> => {
          let timeoutId: ReturnType<typeof setTimeout> | undefined;
          try {
            return await Promise.race([
              Promise.resolve(operation),
              new Promise<T>((_, reject) => {
                timeoutId = setTimeout(() => reject(new Error(`Operation timeout: ${label}`)), 10000);
              })
            ]);
          } finally {
            if (timeoutId) clearTimeout(timeoutId);
          }
        };

        const { data: currentRoles, error: currentRolesError } = await withTimeout(
          supabase
            .from('user_roles')
            .select('id, role_type, is_active, is_verified')
            .eq('user_id', userId),
          'load roles'
        ) as any;

        if (currentRolesError) {
          throw new Error(`Error loading roles: ${currentRolesError.message}`);
        }

        const targetRole = (currentRoles || []).find(
          (role: UserRole) => role.role_type === roleType && role.is_verified
        );

        if (!targetRole) {
          return {
            success: false,
            message: "El rol seleccionado no existe o no está verificado"
          };
        }

        if (targetRole.is_active) {
          // Still clear any stale extra active flags.
          await withTimeout(
            supabase
              .from('user_roles')
              .update({
                is_active: false,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', userId)
              .neq('id', targetRole.id),
            'clear stale active roles'
          );
          return {
            success: true,
            message: `Rol ${this.getRoleDisplayName(roleType)} ya está activo`
          };
        }

        // Activate target FIRST so a later failure cannot leave the user with zero active roles.
        const { data: activatedRoles, error: activateError } = await withTimeout(
          supabase
            .from('user_roles')
            .update({ 
              is_active: true, 
              updated_at: new Date().toISOString() 
            })
            .eq('id', targetRole.id)
            .eq('user_id', userId)
            .eq('is_verified', true)
            .select('id'),
          'activate role'
        ) as any;

        if (activateError) {
          throw new Error(`Error activating role: ${activateError.message}`);
        }

        if (!activatedRoles || activatedRoles.length === 0) {
          return {
            success: false,
            message: "El rol seleccionado no existe o no está verificado"
          };
        }

        // Then deactivate every other role for this user.
        const { error: deactivateError } = await withTimeout(
          supabase
            .from('user_roles')
            .update({ 
              is_active: false, 
              updated_at: new Date().toISOString() 
            })
            .eq('user_id', userId)
            .neq('id', targetRole.id),
          'deactivate other roles'
        ) as any;

        if (deactivateError) {
          throw new Error(`Error deactivating roles: ${deactivateError.message}`);
        }

        console.log('✅ Role activated successfully');

        return {
          success: true,
          message: `Rol ${this.getRoleDisplayName(roleType)} activado correctamente`
        };

      } catch (error) {
        console.error("❌ Error activating role:", error);
        
        let message = "Error al activar el rol";
        if (error instanceof Error && error.message.startsWith('Operation timeout')) {
          message = "Error: La operación tardó demasiado tiempo";
        } else if (error instanceof Error && error.message.includes('no está verificado')) {
          message = error.message;
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

  /**
   * Enhanced debug method to diagnose zero-role users
   * This is used specifically for troubleshooting users like borjapipaon who should have multiple roles
   */
  static async debugUserRoles(userId: string, email: string): Promise<{
    exactRoles: any[] | null;
    emailRoles: any[] | null;
  }> {
    console.log('🐛 DEBUG STARTED for:', { userId: userId.substring(0, 8) + '...', email });
    
    try {
      // 1. Verify connection to the table
      const { count: totalRoles } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });
      
      console.log('📊 Total roles en sistema:', totalRoles);

      // 2. Buscar roles por user_id exacto
      const { data: exactRoles, error: exactError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);

      console.log('🎯 Roles con user_id exacto:', {
        count: exactRoles?.length || 0,
        error: exactError?.message,
        roles: exactRoles?.map(r => r.role_type) || []
      });

      // 3. Buscar por email en role_specific_data (ENHANCED SEARCH)
      let emailRoles: any[] | null = null;
      
      try {
        // Search for roles that might have the email in their specific data
        const { data: searchRoles, error: searchError } = await supabase
          .from('user_roles')
          .select('user_id, role_specific_data, role_type')
          .contains('role_specific_data', { email: email });

        if (!searchError && searchRoles) {
          emailRoles = searchRoles;
          console.log('📧 Roles con email en role_specific_data:', {
            count: searchRoles.length,
            roles: searchRoles.map(r => ({ roleType: r.role_type, userId: r.user_id?.substring(0, 8) + '...' }))
          });
        } else if (searchError) {
          console.warn('📧 Email search in role_specific_data failed:', searchError);
        }
      } catch (emailSearchError) {
        console.warn('📧 Email search failed with exception:', emailSearchError);
      }

      // 4. Alternative search strategies if needed
      if ((!exactRoles || exactRoles.length === 0) && email) {
        console.log('🔍 ENHANCED DEBUG: Attempting alternative search strategies...');
        
        // Try to find profiles with this email
        const { data: profileMatches } = await supabase
          .from('profiles')
          .select('id, email, user_type, created_at')
          .eq('email', email);

        if (profileMatches && profileMatches.length > 0) {
          console.log('👤 PROFILES FOUND with this email:', {
            count: profileMatches.length,
            profiles: profileMatches.map(p => ({
              id: p.id.substring(0, 8) + '...',
              userType: p.user_type,
              createdAt: p.created_at
            }))
          });

          // Check roles for each matching profile
          for (const profile of profileMatches) {
            if (profile.id !== userId) {
              const { data: altRoles } = await supabase
                .from('user_roles')
                .select('*')
                .eq('user_id', profile.id);

              if (altRoles && altRoles.length > 0) {
                console.log('🎯 FOUND ROLES with alternative profile ID:', {
                  profileId: profile.id.substring(0, 8) + '...',
                  rolesCount: altRoles.length,
                  roles: altRoles.map(r => r.role_type)
                });
              }
            }
          }
        }
      }

      return { exactRoles, emailRoles };
      
    } catch (error) {
      console.error('❌ DEBUG ERROR:', error);
      return { exactRoles: null, emailRoles: null };
    }
  }
}

// Re-export UserRole type for convenience
export type { UserRole };