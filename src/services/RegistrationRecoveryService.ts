
import { supabase } from "@/integrations/supabase/client";
import { UserRoleInsert } from "@/integrations/supabase/types";

export interface RegistrationRecoveryOptions {
  userId: string;
  email: string;
  expectedRoles: string[];
  userData: any;
}

export class RegistrationRecoveryService {
  
  /**
   * Comprehensive recovery system for failed registrations
   */
  static async recoverFailedRegistration(options: RegistrationRecoveryOptions): Promise<{
    success: boolean;
    message: string;
    rolesCreated: number;
    errors: string[];
  }> {
    console.log('🔄 RECOVERY: Starting comprehensive registration recovery...');
    
    const { userId, email, expectedRoles, userData } = options;
    const errors: string[] = [];
    let rolesCreated = 0;

    try {
      // Step 1: Verify user exists in auth and profiles
      const profileVerification = await this.verifyUserProfile(userId, email, userData);
      if (!profileVerification.success) {
        errors.push(profileVerification.error || 'Profile verification failed');
      }

      // Step 2: Check current roles
      const { data: existingRoles } = await supabase
        .from('user_roles')
        .select('role_type, is_verified, is_active')
        .eq('user_id', userId);

      const existingRoleTypes = existingRoles?.map(r => r.role_type) || [];
      console.log(`🔍 RECOVERY: Found ${existingRoles?.length || 0} existing roles:`, existingRoleTypes);

      // Step 3: Create missing roles
      for (const roleType of expectedRoles) {
        if (!existingRoleTypes.includes(roleType as any)) {
          console.log(`🔄 RECOVERY: Creating missing role: ${roleType}`);
          
          try {
            const roleData = this.extractRoleSpecificData(userData, roleType);
            const success = await this.createRecoveryRole(userId, roleType as any, roleData);
            
            if (success) {
              rolesCreated++;
              console.log(`✅ RECOVERY: Successfully created ${roleType}`);
            } else {
              errors.push(`Failed to create ${roleType} role`);
            }
          } catch (roleError) {
            console.error(`❌ RECOVERY: Error creating ${roleType}:`, roleError);
            errors.push(`Error creating ${roleType}: ${roleError instanceof Error ? roleError.message : String(roleError)}`);
          }
        } else {
          console.log(`✅ RECOVERY: Role ${roleType} already exists`);
        }
      }

      // Step 4: Ensure at least one role is active
      await this.ensureActiveRole(userId);

      // Step 5: Create recovery notification
      if (rolesCreated > 0) {
        try {
          await supabase
            .from('notifications')
            .insert({
              user_id: userId,
              title: 'Configuración de cuenta completada',
              message: `Se han configurado ${rolesCreated} rol${rolesCreated === 1 ? '' : 'es'} adicional${rolesCreated === 1 ? '' : 'es'} automáticamente.`,
              type: 'success' as const,
              category: 'system' as const,
              read: false
            });
        } catch (notificationError) {
          console.warn('Could not create recovery notification:', notificationError);
        }
      }

      const finalRolesCount = existingRoles?.length || 0 + rolesCreated;
      const success = finalRolesCount >= expectedRoles.length;

      return {
        success,
        message: success 
          ? `Recuperación exitosa: ${finalRolesCount} roles configurados`
          : `Recuperación parcial: ${finalRolesCount}/${expectedRoles.length} roles configurados`,
        rolesCreated,
        errors
      };

    } catch (error) {
      console.error('❌ RECOVERY: Critical error in registration recovery:', error);
      return {
        success: false,
        message: 'Error crítico durante la recuperación',
        rolesCreated,
        errors: [...errors, error instanceof Error ? error.message : String(error)]
      };
    }
  }

  /**
   * Verify user profile exists and create if missing
   */
  private static async verifyUserProfile(userId: string, email: string, userData: any): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, email, user_type')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        return { success: false, error: `Profile check failed: ${error.message}` };
      }

      if (!profile) {
        console.log('🔄 RECOVERY: Creating missing profile...');
        
        const profileData = {
          id: userId,
          email: email,
          full_name: userData.full_name || 'Usuario',
          user_type: userData.user_type || 'particular',
          phone: userData.phone || null,
          address: userData.address || null,
          city: userData.city || null,
          postal_code: userData.postal_code || null,
          country: userData.country || 'España',
          language: 'es',
          timezone: 'Europe/Madrid',
        };

        const { error: createError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (createError) {
          return { success: false, error: `Profile creation failed: ${createError.message}` };
        }

        console.log('✅ RECOVERY: Profile created successfully');
      }

      return { success: true };

    } catch (error) {
      return { success: false, error: `Profile verification exception: ${error instanceof Error ? error.message : String(error)}` };
    }
  }

  /**
   * Create a recovery role with proper error handling
   */
  private static async createRecoveryRole(
    userId: string, 
    roleType: 'particular' | 'community_member' | 'service_provider' | 'property_administrator', 
    roleData: any
  ): Promise<boolean> {
    try {
      const roleInsertData: UserRoleInsert = {
        user_id: userId,
        role_type: roleType,
        is_verified: true,
        is_active: false, // Will be set active by ensureActiveRole if needed
        role_specific_data: roleData,
        verification_confirmed_at: new Date().toISOString(),
        verification_token: null,
        verification_expires_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_roles')
        .insert(roleInsertData)
        .select()
        .single();

      if (error) {
        console.error(`❌ RECOVERY: Role creation failed for ${roleType}:`, error);
        return false;
      }

      if (!data) {
        console.error(`❌ RECOVERY: No data returned for ${roleType}`);
        return false;
      }

      return true;

    } catch (error) {
      console.error(`❌ RECOVERY: Exception creating ${roleType}:`, error);
      return false;
    }
  }

  /**
   * Ensure at least one role is active
   */
  private static async ensureActiveRole(userId: string): Promise<void> {
    try {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('id, role_type, is_active, is_verified')
        .eq('user_id', userId)
        .eq('is_verified', true);

      if (!roles || roles.length === 0) {
        console.warn('⚠️ RECOVERY: No verified roles found');
        return;
      }

      const activeRole = roles.find(r => r.is_active);
      if (!activeRole) {
        console.log('🔄 RECOVERY: No active role found, activating first verified role');
        
        const firstRole = roles[0];
        await supabase
          .from('user_roles')
          .update({ is_active: true, updated_at: new Date().toISOString() })
          .eq('id', firstRole.id);

        console.log(`✅ RECOVERY: Activated role: ${firstRole.role_type}`);
      }

    } catch (error) {
      console.error('❌ RECOVERY: Error ensuring active role:', error);
    }
  }

  /**
   * Extract role-specific data based on role type
   */
  private static extractRoleSpecificData(userData: any, roleType: string): any {
    const baseData = {
      full_name: userData.full_name || 'Usuario',
      phone: userData.phone || '',
      address: userData.address || '',
      city: userData.city || '',
      postal_code: userData.postal_code || '',
      country: userData.country || 'España'
    };

    switch (roleType) {
      case 'particular':
      case 'community_member':
        return {
          ...baseData,
          community_code: userData.community_code || '',
          community_name: userData.community_name || '',
          portal_number: userData.portal_number || '',
          apartment_number: userData.apartment_number || ''
        };

      case 'service_provider':
        return {
          company_name: userData.company_name || baseData.full_name,
          company_address: userData.company_address || baseData.address,
          company_postal_code: userData.company_postal_code || baseData.postal_code,
          company_city: userData.company_city || baseData.city,
          company_country: userData.company_country || baseData.country,
          cif: userData.cif || '',
          business_email: userData.business_email || userData.email || '',
          business_phone: userData.business_phone || baseData.phone,
          selected_services: userData.selected_services || [],
          service_costs: userData.service_costs || {}
        };

      case 'property_administrator':
        return {
          company_name: userData.company_name || baseData.full_name,
          company_address: userData.company_address || baseData.address,
          company_postal_code: userData.company_postal_code || baseData.postal_code,
          company_city: userData.company_city || baseData.city,
          company_country: userData.company_country || baseData.country,
          cif: userData.cif || '',
          business_email: userData.business_email || userData.email || '',
          business_phone: userData.business_phone || baseData.phone,
          professional_number: userData.professional_number || ''
        };

      default:
        return baseData;
    }
  }

  /**
   * Monitor role creation with timeout and retry logic
   */
  static async monitorRoleCreation(
    userId: string,
    expectedRolesCount: number,
    timeoutMs: number = 30000
  ): Promise<{
    success: boolean;
    rolesFound: number;
    message: string;
  }> {
    console.log('🔍 MONITORING: Starting role creation monitoring...');
    
    const startTime = Date.now();
    let attempts = 0;
    const maxAttempts = Math.floor(timeoutMs / 2000); // Check every 2 seconds

    while (attempts < maxAttempts && (Date.now() - startTime) < timeoutMs) {
      attempts++;
      
      try {
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('id, role_type, is_verified')
          .eq('user_id', userId);

        if (error) {
          console.warn(`🔍 MONITORING: Attempt ${attempts} error:`, error);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }

        const rolesFound = roles?.length || 0;
        console.log(`🔍 MONITORING: Attempt ${attempts} - Found ${rolesFound}/${expectedRolesCount} roles`);

        if (rolesFound >= expectedRolesCount) {
          return {
            success: true,
            rolesFound,
            message: `All ${rolesFound} expected roles found`
          };
        }

        if (rolesFound > 0 && attempts >= maxAttempts / 2) {
          // Partial success after half the attempts
          return {
            success: true,
            rolesFound,
            message: `Partial success: ${rolesFound}/${expectedRolesCount} roles found`
          };
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`🔍 MONITORING: Attempt ${attempts} exception:`, error);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return {
      success: false,
      rolesFound: 0,
      message: 'Timeout: Role creation monitoring failed'
    };
  }
}
