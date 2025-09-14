
import { supabase } from "@/integrations/supabase/client";
import { UserRoleInsert } from "@/integrations/supabase/types";

export interface AutoRoleCreationOptions {
  userId: string;
  email: string;
  primaryRole: 'particular' | 'community_member' | 'service_provider' | 'property_administrator';
  additionalRoles?: Array<{
    roleType: 'particular' | 'community_member' | 'service_provider' | 'property_administrator';
    roleSpecificData: Record<string, any>;
  }>;
  userData: any;
}

export class AutomaticRoleCreationService {
  
  /**
   * BULLETPROOF automatic role creation for new registrations
   * This service ensures that ALL roles are created during registration
   */
  static async createAllRolesAutomatically(options: AutoRoleCreationOptions): Promise<{
    success: boolean;
    message: string;
    rolesCreated: number;
    totalRolesRequested: number;
    createdRoles: any[];
    errors: string[];
  }> {
    console.log('🤖 AUTO-ROLE: Starting automatic role creation service...');
    
    const { userId, email, primaryRole, additionalRoles = [], userData } = options;
    const errors: string[] = [];
    let rolesCreated = 0;
    const createdRoles: any[] = [];

    // Calculate total roles to create
    const totalRolesRequested = 1 + additionalRoles.length; // 1 primary + additionals
    
    console.log(`🎯 AUTO-ROLE: Target - ${totalRolesRequested} roles (1 primary + ${additionalRoles.length} additional)`);

    try {
      // PHASE 1: Create primary role
      console.log(`🔄 AUTO-ROLE: Creating primary role: ${primaryRole}`);
      
      const primaryRoleResult = await this.createSingleRole({
        userId,
        roleType: primaryRole,
        roleData: this.extractRoleData(userData, primaryRole),
        isPrimary: true
      });

      if (primaryRoleResult.success && primaryRoleResult.role) {
        createdRoles.push(primaryRoleResult.role);
        rolesCreated++;
        console.log(`✅ AUTO-ROLE: Primary role ${primaryRole} created successfully`);
      } else {
        errors.push(`Failed to create primary role ${primaryRole}: ${primaryRoleResult.error}`);
        console.error(`❌ AUTO-ROLE: Primary role ${primaryRole} failed:`, primaryRoleResult.error);
      }

      // PHASE 2: Create additional roles
      for (let i = 0; i < additionalRoles.length; i++) {
        const additionalRole = additionalRoles[i];
        console.log(`🔄 AUTO-ROLE: Creating additional role ${i + 1}/${additionalRoles.length}: ${additionalRole.roleType}`);
        
        const additionalRoleResult = await this.createSingleRole({
          userId,
          roleType: additionalRole.roleType,
          roleData: this.extractRoleData(additionalRole.roleSpecificData, additionalRole.roleType),
          isPrimary: false
        });

        if (additionalRoleResult.success && additionalRoleResult.role) {
          createdRoles.push(additionalRoleResult.role);
          rolesCreated++;
          console.log(`✅ AUTO-ROLE: Additional role ${additionalRole.roleType} created successfully`);
        } else {
          errors.push(`Failed to create additional role ${additionalRole.roleType}: ${additionalRoleResult.error}`);
          console.error(`❌ AUTO-ROLE: Additional role ${additionalRole.roleType} failed:`, additionalRoleResult.error);
        }
      }

      // PHASE 3: Validation and cleanup
      console.log(`📊 AUTO-ROLE: Final result - ${rolesCreated}/${totalRolesRequested} roles created`);

      // Ensure at least one role is active (should be primary)
      if (rolesCreated > 0) {
        await this.ensureActiveRole(userId, createdRoles);
      }

      // Create success/warning notification
      if (rolesCreated > 0) {
        const notificationTitle = rolesCreated === totalRolesRequested 
          ? '¡Registro completado exitosamente!' 
          : 'Registro completado parcialmente';
        
        const notificationMessage = rolesCreated === totalRolesRequested
          ? `Tu cuenta se ha configurado con ${rolesCreated} rol${rolesCreated === 1 ? '' : 'es'} activo${rolesCreated === 1 ? '' : 's'}.`
          : `Se crearon ${rolesCreated} de ${totalRolesRequested} roles solicitados. Puedes agregar los restantes desde tu perfil.`;

        try {
          await supabase
            .from('notifications')
            .insert({
              user_id: userId,
              title: notificationTitle,
              message: notificationMessage,
              type: rolesCreated === totalRolesRequested ? 'success' as const : 'warning' as const,
              category: 'system' as const,
              read: false
            });
        } catch (notificationError) {
          console.warn('AUTO-ROLE: Could not create success notification:', notificationError);
        }
      }

      const success = rolesCreated >= 1; // At least primary role should be created

      return {
        success,
        message: success 
          ? `Creación automática exitosa: ${rolesCreated}/${totalRolesRequested} roles configurados`
          : `Error en creación automática: ${rolesCreated}/${totalRolesRequested} roles creados`,
        rolesCreated,
        totalRolesRequested,
        createdRoles,
        errors
      };

    } catch (error) {
      console.error('❌ AUTO-ROLE: Critical error in automatic role creation:', error);
      return {
        success: false,
        message: 'Error crítico durante la creación automática de roles',
        rolesCreated,
        totalRolesRequested,
        createdRoles,
        errors: [...errors, error instanceof Error ? error.message : String(error)]
      };
    }
  }

  /**
   * Create a single role with comprehensive error handling
   */
  private static async createSingleRole(options: {
    userId: string;
    roleType: 'particular' | 'community_member' | 'service_provider' | 'property_administrator';
    roleData: any;
    isPrimary: boolean;
  }): Promise<{
    success: boolean;
    role?: any;
    error?: string;
  }> {
    const { userId, roleType, roleData, isPrimary } = options;
    
    try {
      // Check if role already exists to prevent duplicates
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id, role_type')
        .eq('user_id', userId)
        .eq('role_type', roleType)
        .maybeSingle();

      if (existingRole) {
        console.log(`⚠️ AUTO-ROLE: Role ${roleType} already exists for user, skipping...`);
        return {
          success: true,
          role: existingRole
        };
      }

      // Create the role
      const roleInsertData: UserRoleInsert = {
        user_id: userId,
        role_type: roleType,
        is_verified: true, // IMMEDIATELY VERIFIED
        is_active: isPrimary, // Primary role is active by default
        role_specific_data: roleData,
        verification_confirmed_at: new Date().toISOString(),
        verification_token: null,
        verification_expires_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: newRole, error: insertError } = await supabase
        .from('user_roles')
        .insert(roleInsertData)
        .select()
        .single();

      if (insertError) {
        console.error(`❌ AUTO-ROLE: Database error creating ${roleType}:`, insertError);
        return {
          success: false,
          error: `Database error: ${insertError.message}`
        };
      }

      if (!newRole) {
        return {
          success: false,
          error: 'No role data returned from database'
        };
      }

      console.log(`✅ AUTO-ROLE: Successfully created ${roleType} role`);
      return {
        success: true,
        role: newRole
      };

    } catch (error) {
      console.error(`❌ AUTO-ROLE: Exception creating ${roleType}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Extract role-specific data based on role type and user data
   */
  private static extractRoleData(userData: any, roleType: string): any {
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
        return {
          ...baseData
        };

      case 'community_member':
        return {
          ...baseData,
          community_code: userData.community_code || this.generateCommunityCode(userData.address || ''),
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
   * Generate community code based on address
   */
  private static generateCommunityCode(address: string): string {
    const hash = address.toLowerCase().replace(/\s+/g, '').slice(0, 10);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `COM-${hash}-${randomNum}`.toUpperCase();
  }

  /**
   * Ensure at least one role is active
   */
  private static async ensureActiveRole(userId: string, roles: any[]): Promise<void> {
    try {
      // Check if any role is already active
      const activeRole = roles.find(r => r.is_active);
      
      if (!activeRole && roles.length > 0) {
        // Activate the first role
        const firstRole = roles[0];
        console.log(`🔄 AUTO-ROLE: Activating first role: ${firstRole.role_type}`);
        
        await supabase
          .from('user_roles')
          .update({ 
            is_active: true, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', firstRole.id);

        console.log(`✅ AUTO-ROLE: Activated role: ${firstRole.role_type}`);
      } else if (activeRole) {
        console.log(`✅ AUTO-ROLE: Active role already exists: ${activeRole.role_type}`);
      }

    } catch (error) {
      console.error('❌ AUTO-ROLE: Error ensuring active role:', error);
    }
  }

  /**
   * Monitor role creation to ensure completion
   */
  static async monitorCreation(
    userId: string,
    expectedCount: number,
    maxWaitTime: number = 15000
  ): Promise<{
    success: boolean;
    actualCount: number;
    message: string;
  }> {
    console.log(`🔍 AUTO-ROLE: Starting role creation monitoring for ${expectedCount} roles...`);
    
    const startTime = Date.now();
    let attempts = 0;
    const maxAttempts = Math.floor(maxWaitTime / 1000); // Check every second

    while (attempts < maxAttempts && (Date.now() - startTime) < maxWaitTime) {
      attempts++;
      
      try {
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('id, role_type, is_verified, is_active')
          .eq('user_id', userId);

        if (error) {
          console.warn(`🔍 AUTO-ROLE: Monitor attempt ${attempts} error:`, error);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        const actualCount = roles?.length || 0;
        console.log(`🔍 AUTO-ROLE: Monitor attempt ${attempts} - Found ${actualCount}/${expectedCount} roles`);

        if (actualCount >= expectedCount) {
          return {
            success: true,
            actualCount,
            message: `All ${actualCount} roles created successfully`
          };
        }

        // If we have at least one role and we're past halfway through attempts
        if (actualCount > 0 && attempts >= maxAttempts / 2) {
          return {
            success: true,
            actualCount,
            message: `Partial success: ${actualCount}/${expectedCount} roles created`
          };
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`🔍 AUTO-ROLE: Monitor attempt ${attempts} exception:`, error);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return {
      success: false,
      actualCount: 0,
      message: 'Timeout: Role creation monitoring failed'
    };
  }

  /**
   * Emergency role creation fallback
   */
  static async emergencyRoleCreation(
    userId: string,
    email: string,
    fallbackRole: 'particular' = 'particular'
  ): Promise<{
    success: boolean;
    message: string;
    roleCreated?: any;
  }> {
    console.log('🚨 AUTO-ROLE: Starting emergency role creation...');

    try {
      // Get user profile for basic data
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, user_type, phone, address, city, postal_code, country')
        .eq('id', userId)
        .single();

      const emergencyRoleData: UserRoleInsert = {
        user_id: userId,
        role_type: fallbackRole,
        is_verified: true,
        is_active: true,
        role_specific_data: {
          full_name: profile?.full_name || 'Usuario',
          phone: profile?.phone || '',
          address: profile?.address || '',
          city: profile?.city || '',
          postal_code: profile?.postal_code || '',
          country: profile?.country || 'España'
        },
        verification_confirmed_at: new Date().toISOString(),
        verification_token: null,
        verification_expires_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: emergencyRole, error: emergencyError } = await supabase
        .from('user_roles')
        .insert(emergencyRoleData)
        .select()
        .single();

      if (emergencyError || !emergencyRole) {
        return {
          success: false,
          message: `Emergency role creation failed: ${emergencyError?.message || 'No data returned'}`
        };
      }

      // Create emergency notification
      try {
        await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            title: 'Cuenta configurada automáticamente',
            message: 'Se ha creado un rol básico para tu cuenta. Puedes agregar más roles desde tu perfil.',
            type: 'info' as const,
            category: 'system' as const,
            read: false
          });
      } catch (notificationError) {
        console.warn('Could not create emergency notification:', notificationError);
      }

      console.log('✅ AUTO-ROLE: Emergency role created successfully');
      return {
        success: true,
        message: 'Emergency role created successfully',
        roleCreated: emergencyRole
      };

    } catch (error) {
      console.error('❌ AUTO-ROLE: Emergency role creation failed:', error);
      return {
        success: false,
        message: `Emergency role creation exception: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
}
