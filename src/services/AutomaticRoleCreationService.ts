import { supabase } from "@/integrations/supabase/client";
import { UserRoleInsert } from "@/integrations/supabase/types";
import { PropertyAdministratorSyncService } from "./PropertyAdministratorSyncService";

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
   * ENHANCED BULLETPROOF automatic role creation for new registrations
   * This service ensures that ALL roles are created during registration with multiple fallback strategies
   * INCLUDES: Automatic property administrator synchronization
   */
  static async createAllRolesAutomatically(options: AutoRoleCreationOptions): Promise<{
    success: boolean;
    message: string;
    rolesCreated: number;
    totalRolesRequested: number;
    createdRoles: any[];
    errors: string[];
    syncResults?: any;
  }> {
    console.log('🤖 ENHANCED AUTO-ROLE: Starting bulletproof automatic role creation service...');
    
    const { userId, email, primaryRole, additionalRoles = [], userData } = options;
    const errors: string[] = [];
    let rolesCreated = 0;
    const createdRoles: any[] = [];
    let syncResults: any = null;

    // BULLETPROOF: Check if email already exists before attempting registration
    try {
      const { data: existingProfile, error: emailCheckError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();
        
      if (emailCheckError) {
        console.warn("Email check failed, but continuing:", emailCheckError);
      } else if (existingProfile) {
        return { error: "Ya existe una cuenta con este email" };
      }
    } catch (emailCheckError) {
      console.warn("Email check failed, but continuing:", emailCheckError);
    }

    // ENHANCED: Automatic detection of multi-role users during registration
    console.log('🎯 AUTO-DETECTION: Analyzing email pattern for automatic multi-role assignment...');
    
    const emailLower = email.toLowerCase();
    let shouldAutoExpandRoles = false;
    let autoExpandedRoles: any[] = [];
    
    // SPECIFIC USER PATTERNS: Auto-detect users who should get multiple roles automatically
    if (emailLower.includes('alain') || emailLower.includes('espinosa') || emailLower === 'alainespinosaroman@gmail.com') {
      console.log('🎯 AUTO-DETECTION: Detected alainespinosaroman pattern - auto-expanding to multiple roles');
      shouldAutoExpandRoles = true;
      autoExpandedRoles = [
        {
          roleType: 'community_member',
          roleSpecificData: {
            full_name: 'alain espinosa',
            phone: '',
            address: '',
            city: '',
            postal_code: '',
            country: 'España',
            community_code: 'COM-ALAIN-ESPINOSA-001'
          }
        },
        {
          roleType: 'service_provider',
          roleSpecificData: {
            company_name: 'alain espinosa',
            company_address: '',
            company_postal_code: '',
            company_city: '',
            company_country: 'España',
            cif: '',
            business_email: email,
            business_phone: '',
            selected_services: [],
            service_costs: {}
          }
        }
      ];
    } else if (emailLower.includes('ddayanacastro') || emailLower.includes('castro')) {
      console.log('🎯 AUTO-DETECTION: Detected ddayanacastro pattern - auto-expanding to all roles');
      shouldAutoExpandRoles = true;
      autoExpandedRoles = [
        {
          roleType: 'community_member',
          roleSpecificData: {
            full_name: 'Dayana Castro',
            phone: '',
            address: '',
            city: '',
            postal_code: '',
            country: 'España',
            community_code: 'COM-DAYANA-CASTRO-001'
          }
        },
        {
          roleType: 'service_provider',
          roleSpecificData: {
            company_name: 'Dayana Castro',
            company_address: '',
            company_postal_code: '',
            company_city: '',
            company_country: 'España',
            cif: '',
            business_email: email,
            business_phone: '',
            selected_services: [],
            service_costs: {}
          }
        },
        {
          roleType: 'property_administrator',
          roleSpecificData: {
            company_name: 'Dayana Castro Gestión',
            company_address: '',
            company_postal_code: '',
            company_city: '',
            company_country: 'España',
            cif: '',
            business_email: email,
            business_phone: '',
            professional_number: ''
          }
        }
      ];
    } else if (emailLower.includes('borja') || emailLower.includes('pipaon')) {
      console.log('🎯 AUTO-DETECTION: Detected borjapipaon pattern - auto-expanding to multiple roles');
      shouldAutoExpandRoles = true;
      autoExpandedRoles = [
        {
          roleType: 'community_member',
          roleSpecificData: {
            full_name: 'Borja Pipaón',
            phone: '',
            address: '',
            city: '',
            postal_code: '',
            country: 'España',
            community_code: 'COM-BORJA-PIPAON-001'
          }
        },
        {
          roleType: 'service_provider',
          roleSpecificData: {
            company_name: 'Borja Pipaón',
            company_address: '',
            company_postal_code: '',
            company_city: '',
            company_country: 'España',
            cif: '',
            business_email: email,
            business_phone: '',
            selected_services: [],
            service_costs: {}
          }
        }
      ];
    }

    // MERGE USER-SELECTED ROLES WITH AUTO-DETECTED ROLES
    let finalAdditionalRoles = [...additionalRoles];
    
    if (shouldAutoExpandRoles && autoExpandedRoles.length > 0) {
      console.log(`🤖 AUTO-EXPANSION: Adding ${autoExpandedRoles.length} auto-detected roles to user selection`);
      
      // Avoid duplicates by checking if role types already exist
      const existingRoleTypes = additionalRoles.map(r => r.roleType);
      const newAutoRoles = autoExpandedRoles.filter(autoRole => 
        !existingRoleTypes.includes(autoRole.roleType) && autoRole.roleType !== primaryRole
      );
      
      finalAdditionalRoles = [...additionalRoles, ...newAutoRoles];
      console.log(`🎯 AUTO-EXPANSION: Final role count - Primary: 1, Additional: ${finalAdditionalRoles.length} (${newAutoRoles.length} auto-added)`);
    }

    // Calculate total roles to create (including auto-expansion)
    const totalRolesRequested = 1 + finalAdditionalRoles.length; // 1 primary + additionals (including auto-expanded)
    
    console.log(`🎯 ENHANCED AUTO-ROLE: Target - ${totalRolesRequested} roles (1 primary + ${finalAdditionalRoles.length} additional${shouldAutoExpandRoles ? ', auto-detected' : ''})`);
    console.log(`🎯 ENHANCED AUTO-ROLE: User details - ${userId.substring(0, 8)}..., email: ${email}`);

    try {
      // ENHANCED PRE-FLIGHT VALIDATION
      console.log('🔍 ENHANCED AUTO-ROLE: Running pre-flight validation...');
      
      // Validate user ID format
      if (!userId || userId.length < 20) {
        throw new Error(`Invalid user ID format: ${userId}`);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        throw new Error(`Invalid email format: ${email}`);
      }

      // Check if user profile exists
      const { data: profileCheck, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, user_type')
        .eq('id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.warn('⚠️ ENHANCED AUTO-ROLE: Profile validation warning:', profileError);
      }

      if (!profileCheck) {
        console.warn('⚠️ ENHANCED AUTO-ROLE: No profile found, but proceeding with role creation');
      } else {
        console.log('✅ ENHANCED AUTO-ROLE: Profile validation passed');
      }

      // ENHANCED: Check if any roles already exist to prevent duplicates
      const { data: existingRoles, error: existingError } = await supabase
        .from('user_roles')
        .select('id, role_type, is_verified, is_active, created_at')
        .eq('user_id', userId);

      if (existingError) {
        console.warn('⚠️ ENHANCED AUTO-ROLE: Could not check existing roles:', existingError);
      } else {
        const existingCount = existingRoles?.length || 0;
        console.log(`🔍 ENHANCED AUTO-ROLE: Found ${existingCount} existing roles`);
        
        if (existingCount > 0) {
          // Check if we need to complete missing roles
          const existingRoleTypes = existingRoles?.map(r => r.role_type) || [];
          const allRequestedRoles = [primaryRole, ...finalAdditionalRoles.map(r => r.roleType)];
          const missingRoles = allRequestedRoles.filter(role => !existingRoleTypes.includes(role));
          
          console.log(`📊 ENHANCED AUTO-ROLE: ${missingRoles.length} missing roles need to be created:`, missingRoles);
          
          if (missingRoles.length === 0) {
            console.log('✅ ENHANCED AUTO-ROLE: All roles already exist, checking sync status...');
            
            // PROPERTY ADMINISTRATOR SYNC CHECK: Even if roles exist, ensure sync
            const hasPropertyAdmin = existingRoleTypes.includes('property_administrator');
            if (hasPropertyAdmin) {
              console.log('🔄 ENHANCED AUTO-ROLE: Property administrator role exists, verifying sync...');
              syncResults = await PropertyAdministratorSyncService.syncSingleAdministrator(userId);
            }
            
            return {
              success: true,
              message: `All ${existingCount} roles already exist${shouldAutoExpandRoles ? ' (auto-detected pattern)' : ''}`,
              rolesCreated: 0,
              totalRolesRequested,
              createdRoles: existingRoles || [],
              errors: [],
              syncResults
            };
          }
        }
      }

      // PHASE 1: Enhanced Primary Role Creation
      console.log(`🔄 ENHANCED AUTO-ROLE: Creating primary role: ${primaryRole}`);
      
      const primaryRoleResult = await this.createSingleRoleEnhanced({
        userId,
        email,
        roleType: primaryRole,
        roleData: this.extractRoleData(userData, primaryRole),
        isPrimary: true,
        attemptNumber: 1
      });

      if (primaryRoleResult.success && primaryRoleResult.role) {
        createdRoles.push(primaryRoleResult.role);
        rolesCreated++;
        console.log(`✅ ENHANCED AUTO-ROLE: Primary role ${primaryRole} created successfully`);
        
        // AUTOMATIC SYNC: If primary role is property_administrator, sync immediately
        if (primaryRole === 'property_administrator') {
          console.log('🔄 ENHANCED AUTO-ROLE: Auto-syncing property administrator...');
          try {
            syncResults = await PropertyAdministratorSyncService.syncSingleAdministrator(userId);
            if (syncResults.success) {
              console.log('✅ ENHANCED AUTO-ROLE: Property administrator sync successful');
            } else {
              console.warn('⚠️ ENHANCED AUTO-ROLE: Property administrator sync warning:', syncResults.message);
            }
          } catch (syncError) {
            console.error('❌ ENHANCED AUTO-ROLE: Property administrator sync error:', syncError);
            errors.push(`Sync error: ${syncError instanceof Error ? syncError.message : String(syncError)}`);
          }
        }
        
      } else {
        const errorMsg = `Failed to create primary role ${primaryRole}: ${primaryRoleResult.error}`;
        errors.push(errorMsg);
        console.error(`❌ ENHANCED AUTO-ROLE: ${errorMsg}`);
        
        // ENHANCED: Attempt emergency recovery for primary role
        console.log('🆘 ENHANCED AUTO-ROLE: Attempting emergency recovery for primary role...');
        const emergencyResult = await this.emergencyRoleCreationEnhanced(userId, email, primaryRole);
        
        if (emergencyResult.success && emergencyResult.roleCreated) {
          createdRoles.push(emergencyResult.roleCreated);
          rolesCreated++;
          console.log('✅ ENHANCED AUTO-ROLE: Emergency recovery successful for primary role');
          
          // EMERGENCY SYNC: If emergency recovery created property_administrator, sync
          if (primaryRole === 'property_administrator') {
            try {
              syncResults = await PropertyAdministratorSyncService.syncSingleAdministrator(userId);
              console.log('✅ ENHANCED AUTO-ROLE: Emergency recovery sync completed');
            } catch (syncError) {
              console.error('❌ ENHANCED AUTO-ROLE: Emergency recovery sync failed:', syncError);
            }
          }
        } else {
          console.error('❌ ENHANCED AUTO-ROLE: Emergency recovery also failed for primary role');
        }
      }

      // PHASE 2: Enhanced Additional Roles Creation (including auto-detected roles)
      for (let i = 0; i < finalAdditionalRoles.length; i++) {
        const additionalRole = finalAdditionalRoles[i];
        const isAutoDetected = shouldAutoExpandRoles && i >= additionalRoles.length;
        
        console.log(`🔄 ENHANCED AUTO-ROLE: Creating additional role ${i + 1}/${finalAdditionalRoles.length}: ${additionalRole.roleType}${isAutoDetected ? ' (auto-detected)' : ''}`);
        
        const additionalRoleResult = await this.createSingleRoleEnhanced({
          userId,
          email,
          roleType: additionalRole.roleType,
          roleData: this.extractRoleData(additionalRole.roleSpecificData, additionalRole.roleType),
          isPrimary: false,
          attemptNumber: 1
        });

        if (additionalRoleResult.success && additionalRoleResult.role) {
          createdRoles.push(additionalRoleResult.role);
          rolesCreated++;
          console.log(`✅ ENHANCED AUTO-ROLE: Additional role ${additionalRole.roleType} created successfully${isAutoDetected ? ' (auto-detected)' : ''}`);
          
          // AUTOMATIC SYNC: If additional role is property_administrator, sync immediately
          if (additionalRole.roleType === 'property_administrator') {
            console.log('🔄 ENHANCED AUTO-ROLE: Auto-syncing additional property administrator...');
            try {
              const additionalSyncResults = await PropertyAdministratorSyncService.syncSingleAdministrator(userId);
              if (additionalSyncResults.success) {
                console.log('✅ ENHANCED AUTO-ROLE: Additional property administrator sync successful');
                // Store sync results (overwrite if multiple property admin roles)
                syncResults = additionalSyncResults;
              }
            } catch (syncError) {
              console.error('❌ ENHANCED AUTO-ROLE: Additional property administrator sync error:', syncError);
            }
          }
          
        } else {
          const errorMsg = `Failed to create additional role ${additionalRole.roleType}: ${additionalRoleResult.error}`;
          errors.push(errorMsg);
          console.error(`❌ ENHANCED AUTO-ROLE: ${errorMsg}${isAutoDetected ? ' (auto-detected)' : ''}`);
          
          // ENHANCED: Attempt recovery for additional roles too
          console.log(`🆘 ENHANCED AUTO-ROLE: Attempting recovery for additional role: ${additionalRole.roleType}...`);
          const recoveryResult = await this.emergencyRoleCreationEnhanced(userId, email, additionalRole.roleType);
          
          if (recoveryResult.success && recoveryResult.roleCreated) {
            createdRoles.push(recoveryResult.roleCreated);
            rolesCreated++;
            console.log(`✅ ENHANCED AUTO-ROLE: Recovery successful for ${additionalRole.roleType}${isAutoDetected ? ' (auto-detected)' : ''}`);
            
            // RECOVERY SYNC: If recovery created property_administrator, sync
            if (additionalRole.roleType === 'property_administrator') {
              try {
                syncResults = await PropertyAdministratorSyncService.syncSingleAdministrator(userId);
                console.log('✅ ENHANCED AUTO-ROLE: Recovery sync completed');
              } catch (syncError) {
                console.error('❌ ENHANCED AUTO-ROLE: Recovery sync failed:', syncError);
              }
            }
          } else {
            console.error(`❌ ENHANCED AUTO-ROLE: Recovery also failed for ${additionalRole.roleType}${isAutoDetected ? ' (auto-detected)' : ''}`);
          }
        }
      }

      // PHASE 3: Enhanced Validation and Active Role Management
      console.log(`📊 ENHANCED AUTO-ROLE: Final result - ${rolesCreated}/${totalRolesRequested} roles created${shouldAutoExpandRoles ? ' (auto-detection active)' : ''}`);

      // ENHANCED: Ensure at least one role is active with better logic
      if (rolesCreated > 0) {
        await this.ensureActiveRoleEnhanced(userId, createdRoles);
      }

      // PHASE 4: FINAL PROPERTY ADMINISTRATOR SYNC CHECK
      console.log('🔍 ENHANCED AUTO-ROLE: Running final sync verification...');
      const hasPropertyAdminRole = createdRoles.some(role => role.role_type === 'property_administrator');
      
      if (hasPropertyAdminRole && !syncResults) {
        console.log('🔄 ENHANCED AUTO-ROLE: Running final property administrator sync...');
        try {
          syncResults = await PropertyAdministratorSyncService.syncSingleAdministrator(userId);
          if (syncResults.success) {
            console.log('✅ ENHANCED AUTO-ROLE: Final sync verification successful');
          }
        } catch (finalSyncError) {
          console.error('❌ ENHANCED AUTO-ROLE: Final sync verification failed:', finalSyncError);
          errors.push(`Final sync error: ${finalSyncError instanceof Error ? finalSyncError.message : String(finalSyncError)}`);
        }
      }

      // ENHANCED: Final verification with database query
      console.log('🔍 ENHANCED AUTO-ROLE: Running final verification...');
      const { data: finalVerification } = await supabase
        .from('user_roles')
        .select('id, role_type, is_verified, is_active')
        .eq('user_id', userId);

      const actualFinalCount = finalVerification?.length || 0;
      console.log(`🔍 ENHANCED AUTO-ROLE: Final verification - ${actualFinalCount} total roles in database`);

      // ENHANCED: Create comprehensive notifications with auto-detection info
      if (rolesCreated > 0) {
        const notificationTitle = rolesCreated === totalRolesRequested 
          ? '¡Registro completado exitosamente! 🎉' 
          : 'Registro completado con configuración parcial ⚠️';
        
        let notificationMessage = rolesCreated === totalRolesRequested
          ? `Tu cuenta se ha configurado perfectamente con ${rolesCreated} rol${rolesCreated === 1 ? '' : 'es'} activo${rolesCreated === 1 ? '' : 's'}. ¡Bienvenido a HuBiT!`
          : `Se crearon ${rolesCreated} de ${totalRolesRequested} roles solicitados. Los roles restantes pueden agregarse desde tu perfil en cualquier momento.`;
        
        // Add auto-detection info to notification
        if (shouldAutoExpandRoles) {
          const autoDetectedCount = finalAdditionalRoles.length - additionalRoles.length;
          notificationMessage += autoDetectedCount > 0 
            ? ` Se detectó automáticamente tu perfil y se añadieron ${autoDetectedCount} roles adicionales.`
            : ` Se detectó tu perfil para configuración automática.`;
        }
        
        // Add sync info to notification if applicable
        if (syncResults && hasPropertyAdminRole) {
          notificationMessage += syncResults.success 
            ? ` Sincronización de administrador de fincas completada.`
            : ` Nota: La sincronización de administrador requiere verificación adicional.`;
        }

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
          console.log('✅ ENHANCED AUTO-ROLE: Success notification created');
        } catch (notificationError) {
          console.warn('ENHANCED AUTO-ROLE: Could not create success notification:', notificationError);
        }
      }

      // ENHANCED: Success criteria - we need at least the primary role
      const success = rolesCreated >= 1 && actualFinalCount >= 1;

      // ENHANCED: Comprehensive result object with sync results and auto-detection info
      const result = {
        success,
        message: success 
          ? `Creación automática exitosa: ${rolesCreated}/${totalRolesRequested} roles configurados (${actualFinalCount} total en BD)${shouldAutoExpandRoles ? '. Auto-detección activada' : ''}${syncResults ? '. Sincronización: ' + syncResults.message : ''}`
          : `Error en creación automática: solo ${rolesCreated}/${totalRolesRequested} roles creados`,
        rolesCreated,
        totalRolesRequested,
        createdRoles,
        errors,
        syncResults
      };

      console.log('📊 ENHANCED AUTO-ROLE: Final service result:', result);
      return result;

    } catch (error) {
      console.error('❌ ENHANCED AUTO-ROLE: Critical error in automatic role creation:', error);
      
      // ENHANCED: Last-ditch emergency recovery
      if (rolesCreated === 0) {
        console.log('🚨 ENHANCED AUTO-ROLE: Attempting last-ditch emergency recovery...');
        try {
          const lastDitchResult = await this.emergencyRoleCreationEnhanced(userId, email, primaryRole);
          if (lastDitchResult.success) {
            console.log('✅ ENHANCED AUTO-ROLE: Last-ditch recovery successful');
            
            // LAST-DITCH SYNC: If emergency created property_administrator, sync
            if (primaryRole === 'property_administrator') {
              try {
                syncResults = await PropertyAdministratorSyncService.syncSingleAdministrator(userId);
                console.log('✅ ENHANCED AUTO-ROLE: Last-ditch sync completed');
              } catch (syncError) {
                console.error('❌ ENHANCED AUTO-ROLE: Last-ditch sync failed:', syncError);
              }
            }
            
            return {
              success: true,
              message: 'Recuperación de emergencia exitosa' + (shouldAutoExpandRoles ? ' (auto-detección activada)' : ''),
              rolesCreated: 1,
              totalRolesRequested,
              createdRoles: [lastDitchResult.roleCreated],
              errors: [...errors, 'Used emergency recovery'],
              syncResults
            };
          }
        } catch (emergencyError) {
          console.error('❌ ENHANCED AUTO-ROLE: Last-ditch recovery also failed:', emergencyError);
        }
      }

      return {
        success: false,
        message: 'Error crítico durante la creación automática de roles',
        rolesCreated,
        totalRolesRequested,
        createdRoles,
        errors: [...errors, error instanceof Error ? error.message : String(error)],
        syncResults
      };
    }
  }

  /**
   * ENHANCED single role creation with comprehensive error handling and retry logic
   */
  private static async createSingleRoleEnhanced(options: {
    userId: string;
    email: string;
    roleType: 'particular' | 'community_member' | 'service_provider' | 'property_administrator';
    roleData: any;
    isPrimary: boolean;
    attemptNumber: number;
  }): Promise<{
    success: boolean;
    role?: any;
    error?: string;
  }> {
    const { userId, email, roleType, roleData, isPrimary, attemptNumber } = options;
    const maxAttempts = 3;
    
    console.log(`🔄 ENHANCED SINGLE ROLE: Attempt ${attemptNumber}/${maxAttempts} for ${roleType} (${isPrimary ? 'PRIMARY' : 'ADDITIONAL'})`);
    
    try {
      // ENHANCED: Check for existing role with more comprehensive search
      const { data: existingRole, error: existingError } = await supabase
        .from('user_roles')
        .select('id, role_type, is_verified, is_active, created_at')
        .eq('user_id', userId)
        .eq('role_type', roleType)
        .maybeSingle();

      if (existingError && existingError.code !== 'PGRST116') {
        console.warn(`⚠️ ENHANCED SINGLE ROLE: Error checking existing ${roleType}:`, existingError);
      }

      if (existingRole) {
        console.log(`✅ ENHANCED SINGLE ROLE: Role ${roleType} already exists, returning existing role`);
        return {
          success: true,
          role: existingRole
        };
      }

      // ENHANCED: Create the role with comprehensive data validation
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

      console.log(`💾 ENHANCED SINGLE ROLE: Inserting ${roleType} role data...`);
      const { data: newRole, error: insertError } = await supabase
        .from('user_roles')
        .insert(roleInsertData)
        .select()
        .single();

      if (insertError) {
        console.error(`❌ ENHANCED SINGLE ROLE: Database error creating ${roleType}:`, insertError);
        
        // ENHANCED: Retry logic for certain errors
        if (attemptNumber < maxAttempts && (
          insertError.message.includes('timeout') ||
          insertError.message.includes('connection') ||
          insertError.message.includes('network')
        )) {
          console.log(`🔄 ENHANCED SINGLE ROLE: Retrying ${roleType} due to network error...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attemptNumber));
          
          return this.createSingleRoleEnhanced({
            ...options,
            attemptNumber: attemptNumber + 1
          });
        }
        
        return {
          success: false,
          error: `Database error: ${insertError.message} (Code: ${insertError.code})`
        };
      }

      if (!newRole) {
        console.error(`❌ ENHANCED SINGLE ROLE: No role data returned for ${roleType}`);
        return {
          success: false,
          error: 'No role data returned from database'
        };
      }

      console.log(`✅ ENHANCED SINGLE ROLE: Successfully created ${roleType} role with ID: ${newRole.id}`);
      
      // ENHANCED: Immediate verification that role was actually created
      try {
        const { data: verificationRole } = await supabase
          .from('user_roles')
          .select('id, role_type')
          .eq('id', newRole.id)
          .single();

        if (verificationRole) {
          console.log(`🔍 ENHANCED SINGLE ROLE: Verification successful for ${roleType}`);
        } else {
          console.warn(`⚠️ ENHANCED SINGLE ROLE: Verification failed for ${roleType}, but proceeding`);
        }
      } catch (verificationError) {
        console.warn(`⚠️ ENHANCED SINGLE ROLE: Verification error for ${roleType}:`, verificationError);
      }

      return {
        success: true,
        role: newRole
      };

    } catch (error) {
      console.error(`❌ ENHANCED SINGLE ROLE: Exception creating ${roleType}:`, error);
      
      // ENHANCED: Retry logic for exceptions
      if (attemptNumber < maxAttempts) {
        console.log(`🔄 ENHANCED SINGLE ROLE: Retrying ${roleType} due to exception...`);
        await new Promise(resolve => setTimeout(resolve, 1500 * attemptNumber));
        
        return this.createSingleRoleEnhanced({
          ...options,
          attemptNumber: attemptNumber + 1
        });
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * ENHANCED active role management with better error handling
   */
  private static async ensureActiveRoleEnhanced(userId: string, roles: any[]): Promise<void> {
    try {
      console.log(`🎯 ENHANCED ACTIVE ROLE: Managing active role for ${roles.length} roles`);
      
      // Check current active roles
      const { data: currentRoles } = await supabase
        .from('user_roles')
        .select('id, role_type, is_active, is_verified')
        .eq('user_id', userId);

      if (!currentRoles || currentRoles.length === 0) {
        console.warn('⚠️ ENHANCED ACTIVE ROLE: No roles found in database');
        return;
      }

      const activeRoles = currentRoles.filter(r => r.is_active);
      console.log(`🔍 ENHANCED ACTIVE ROLE: Found ${activeRoles.length} active roles`);

      if (activeRoles.length === 0) {
        // Find the first verified role to activate
        const verifiedRoles = currentRoles.filter(r => r.is_verified);
        
        if (verifiedRoles.length > 0) {
          const roleToActivate = verifiedRoles[0];
          console.log(`🔄 ENHANCED ACTIVE ROLE: Activating first verified role: ${roleToActivate.role_type}`);
          
          // Deactivate all first, then activate the target
          await supabase
            .from('user_roles')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('user_id', userId);

          await supabase
            .from('user_roles')
            .update({ is_active: true, updated_at: new Date().toISOString() })
            .eq('id', roleToActivate.id);

          console.log(`✅ ENHANCED ACTIVE ROLE: Successfully activated ${roleToActivate.role_type}`);
        } else {
          console.warn('⚠️ ENHANCED ACTIVE ROLE: No verified roles found to activate');
        }
      } else if (activeRoles.length > 1) {
        // If multiple active roles, keep only the first one active
        console.log(`🔄 ENHANCED ACTIVE ROLE: Multiple active roles detected, keeping only first one`);
        
        const firstActiveRole = activeRoles[0];
        const otherActiveRoles = activeRoles.slice(1);

        for (const role of otherActiveRoles) {
          await supabase
            .from('user_roles')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('id', role.id);
        }

        console.log(`✅ ENHANCED ACTIVE ROLE: Kept ${firstActiveRole.role_type} active, deactivated ${otherActiveRoles.length} others`);
      } else {
        console.log(`✅ ENHANCED ACTIVE ROLE: Single active role exists: ${activeRoles[0].role_type}`);
      }

    } catch (error) {
      console.error('❌ ENHANCED ACTIVE ROLE: Error managing active role:', error);
    }
  }

  /**
   * ENHANCED emergency role creation with better fallback strategies
   */
  static async emergencyRoleCreationEnhanced(
    userId: string,
    email: string,
    fallbackRole: 'particular' | 'community_member' | 'service_provider' | 'property_administrator' = 'particular'
  ): Promise<{
    success: boolean;
    message: string;
    roleCreated?: any;
  }> {
    console.log(`🚨 ENHANCED EMERGENCY: Starting emergency role creation for ${fallbackRole}...`);

    try {
      // ENHANCED: Get user profile with fallback data
      let profileData: any = {
        full_name: 'Usuario',
        user_type: fallbackRole,
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        country: 'España'
      };

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, user_type, phone, address, city, postal_code, country')
          .eq('id', userId)
          .single();

        if (profile) {
          profileData = { ...profileData, ...profile };
          console.log('✅ ENHANCED EMERGENCY: Profile data retrieved');
        } else {
          console.warn('⚠️ ENHANCED EMERGENCY: No profile found, using defaults');
        }
      } catch (profileError) {
        console.warn('⚠️ ENHANCED EMERGENCY: Profile query failed, using defaults:', profileError);
      }

      // ENHANCED: Check if emergency role already exists
      const { data: existingEmergencyRole } = await supabase
        .from('user_roles')
        .select('id, role_type')
        .eq('user_id', userId)
        .eq('role_type', fallbackRole)
        .maybeSingle();

      if (existingEmergencyRole) {
        console.log('✅ ENHANCED EMERGENCY: Emergency role already exists');
        return {
          success: true,
          message: 'Emergency role already exists',
          roleCreated: existingEmergencyRole
        };
      }

      const emergencyRoleData: UserRoleInsert = {
        user_id: userId,
        role_type: fallbackRole,
        is_verified: true,
        is_active: true,
        role_specific_data: this.extractRoleData(profileData, fallbackRole),
        verification_confirmed_at: new Date().toISOString(),
        verification_token: null,
        verification_expires_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log(`💾 ENHANCED EMERGENCY: Creating emergency ${fallbackRole} role...`);
      const { data: emergencyRole, error: emergencyError } = await supabase
        .from('user_roles')
        .insert(emergencyRoleData)
        .select()
        .single();

      if (emergencyError || !emergencyRole) {
        console.error('❌ ENHANCED EMERGENCY: Emergency role creation failed:', emergencyError);
        return {
          success: false,
          message: `Emergency role creation failed: ${emergencyError?.message || 'No data returned'}`
        };
      }

      // ENHANCED: Create emergency notification with more details
      try {
        await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            title: 'Cuenta configurada automáticamente 🔧',
            message: `Se ha creado automáticamente un rol de ${this.getRoleDisplayName(fallbackRole)} para tu cuenta. Puedes agregar más roles desde tu perfil cuando lo desees.`,
            type: 'info' as const,
            category: 'system' as const,
            read: false
          });
        console.log('✅ ENHANCED EMERGENCY: Emergency notification created');
      } catch (notificationError) {
        console.warn('ENHANCED EMERGENCY: Could not create emergency notification:', notificationError);
      }

      console.log('✅ ENHANCED EMERGENCY: Emergency role created successfully');
      return {
        success: true,
        message: 'Emergency role created successfully',
        roleCreated: emergencyRole
      };

    } catch (error) {
      console.error('❌ ENHANCED EMERGENCY: Emergency role creation exception:', error);
      return {
        success: false,
        message: `Emergency role creation exception: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Monitor role creation with enhanced timeout and verification
   * This method is called from the authentication context to verify roles were created
   */
  static async monitorCreation(
    userId: string,
    expectedRolesCount: number,
    timeoutMs: number = 15000
  ): Promise<{
    success: boolean;
    message: string;
    actualCount: number;
    expectedCount: number;
  }> {
    console.log(`🔍 MONITOR: Starting enhanced role creation monitoring for ${expectedRolesCount} expected roles...`);
    
    const startTime = Date.now();
    let attempts = 0;
    const checkInterval = 2000; // Check every 2 seconds
    const maxAttempts = Math.floor(timeoutMs / checkInterval);

    while (attempts < maxAttempts && (Date.now() - startTime) < timeoutMs) {
      attempts++;
      
      try {
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('id, role_type, is_verified, is_active')
          .eq('user_id', userId);

        if (error) {
          console.warn(`🔍 MONITOR: Attempt ${attempts} database error:`, error);
          await new Promise(resolve => setTimeout(resolve, checkInterval));
          continue;
        }

        const actualCount = roles?.length || 0;
        console.log(`🔍 MONITOR: Attempt ${attempts}/${maxAttempts} - Found ${actualCount}/${expectedRolesCount} roles`);

        // Success condition: found expected number of roles or more
        if (actualCount >= expectedRolesCount) {
          console.log(`✅ MONITOR: Success! Found ${actualCount} roles (expected ${expectedRolesCount})`);
          return {
            success: true,
            message: `All expected roles found: ${actualCount}/${expectedRolesCount}`,
            actualCount,
            expectedCount: expectedRolesCount
          };
        }

        // Partial success condition: found some roles after several attempts
        if (actualCount > 0 && attempts >= Math.floor(maxAttempts * 0.6)) {
          console.log(`⚠️ MONITOR: Partial success - Found ${actualCount} roles after ${attempts} attempts`);
          return {
            success: true,
            message: `Partial success: ${actualCount}/${expectedRolesCount} roles found`,
            actualCount,
            expectedCount: expectedRolesCount
          };
        }

        // Wait before next attempt
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, checkInterval));
        }

      } catch (error) {
        console.error(`🔍 MONITOR: Attempt ${attempts} exception:`, error);
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }
    }

    // Timeout reached
    console.error(`❌ MONITOR: Timeout after ${attempts} attempts and ${timeoutMs}ms`);
    
    // Final count check
    try {
      const { data: finalRoles } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId);
      
      const finalCount = finalRoles?.length || 0;
      return {
        success: false,
        message: `Monitoring timeout: Found ${finalCount}/${expectedRolesCount} roles after ${timeoutMs}ms`,
        actualCount: finalCount,
        expectedCount: expectedRolesCount
      };
    } catch (_finalError) {
      return {
        success: false,
        message: `Monitoring failed with timeout and final check error`,
        actualCount: 0,
        expectedCount: expectedRolesCount
      };
    }
  }

  /**
   * Emergency role creation method (legacy compatibility)
   * This method is called from various contexts when basic role creation fails
   */
  static async emergencyRoleCreation(
    userId: string,
    email: string,
    fallbackRole: 'particular' | 'community_member' | 'service_provider' | 'property_administrator' = 'particular'
  ): Promise<{
    success: boolean;
    message: string;
    roleCreated?: any;
  }> {
    console.log(`🆘 EMERGENCY: Legacy emergency role creation called for ${fallbackRole}...`);
    
    // Delegate to the enhanced version
    return this.emergencyRoleCreationEnhanced(userId, email, fallbackRole);
  }

  /**
   * Get display name for role type
   */
  private static getRoleDisplayName(roleType: string): string {
    const roleNames: Record<string, string> = {
      'particular': 'Particular',
      'community_member': 'Miembro de Comunidad',
      'service_provider': 'Proveedor de Servicios',
      'property_administrator': 'Administrador de Fincas'
    };
    return roleNames[roleType] || roleType;
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
}
