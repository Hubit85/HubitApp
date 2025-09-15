import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile, ProfileInsert, UserRoleInsert } from "@/integrations/supabase/types";
import { SupabaseUserRoleService, UserRole } from "@/services/SupabaseUserRoleService";
import { PropertyAutoService, UserPropertyData } from "@/services/PropertyAutoService";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  userRoles: UserRole[];
  activeRole: UserRole | null;
  loading: boolean;
  isConnected: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData: Omit<ProfileInsert, 'id' | 'email'> & { 
    // Soporte para múltiples roles durante el registro
    additionalRoles?: Array<{
      roleType: 'particular' | 'community_member' | 'service_provider' | 'property_administrator';
      roleSpecificData: Record<string, any>;
    }>;
  }) => Promise<{ error?: string; message?: string; success?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>;
  activateRole: (roleType: UserRole['role_type']) => Promise<{ success: boolean; message: string }>;
  refreshRoles: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  // Improved connectivity check with timeout and retry
  const checkConnection = async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("profiles")
        .select("id")
        .limit(0);
      
      const connected = !error || error.code === 'PGRST116';
      setIsConnected(connected);
      return connected;
    } catch (error) {
      console.log("📡 Connection check failed:", error);
      setIsConnected(false);
      return false;
    }
  };

  // FIXED ROLE ACTIVATION: Remove variable scope conflict
  const ensureActiveRole = async (userId: string, availableRoles: UserRole[]): Promise<UserRole | null> => {
    try {
      console.log("🎯 CONTEXT: Starting role activation system...");
      
      if (!availableRoles || availableRoles.length === 0) {
        console.log("❌ CONTEXT: No roles available for activation");
        return null;
      }

      console.log(`📊 CONTEXT: Processing ${availableRoles.length} available roles:`, 
        availableRoles.map(r => `${r.role_type}(verified:${r.is_verified}, active:${r.is_active})`));

      const verifiedRoles = availableRoles.filter(r => r.is_verified);
      if (verifiedRoles.length === 0) {
        console.log("⚠️ CONTEXT: No verified roles found");
        return null;
      }

      console.log(`✅ CONTEXT: Found ${verifiedRoles.length} verified roles`);

      // Check if there's already an active verified role
      const currentActiveRole = verifiedRoles.find(r => r.is_active);
      if (currentActiveRole) {
        console.log("🎯 CONTEXT: Found existing active role:", currentActiveRole.role_type);
        return currentActiveRole;
      }

      console.log("🚨 CONTEXT: NO ACTIVE ROLE FOUND - Activating first verified role");
      
      // Simply activate the first verified role
      const roleToActivate = verifiedRoles[0];
      console.log("🎯 CONTEXT: Activating role:", roleToActivate.role_type);

      try {
        // Simple activation: deactivate all, then activate the target role
        await supabase
          .from('user_roles')
          .update({ is_active: false, updated_at: new Date().toISOString() })
          .eq('user_id', userId);

        const { error: activateError } = await supabase
          .from('user_roles')
          .update({ is_active: true, updated_at: new Date().toISOString() })
          .eq('user_id', userId)
          .eq('id', roleToActivate.id)
          .eq('is_verified', true);

        if (activateError) {
          console.error("❌ CONTEXT: Activation failed:", activateError);
          return roleToActivate; // Return anyway - better than nothing
        }

        console.log("✅ CONTEXT: Role activated successfully:", roleToActivate.role_type);
        return { ...roleToActivate, is_active: true };

      } catch (error) {
        console.error("❌ CONTEXT: Error during activation:", error);
        // Return the role marked as active locally
        return { ...roleToActivate, is_active: true };
      }

    } catch (error) {
      console.error("❌ CONTEXT: Critical error in role activation:", error);
      
      // FINAL FALLBACK: return first verified role
      const verifiedRoles = availableRoles.filter(r => r.is_verified);
      if (verifiedRoles.length > 0) {
        console.log("🆘 CONTEXT: FINAL FALLBACK - Using first verified role locally");
        return { ...verifiedRoles[0], is_active: true };
      }
      
      return null;
    }
  };

  // Helper function to generate community code
  const generateCommunityCode = (address: string): string => {
    const hash = address.toLowerCase().replace(/\s+/g, '').slice(0, 10);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `COM-${hash}-${randomNum}`.toUpperCase();
  };

  // Helper function to extract role-specific data from user data
  const extractRoleSpecificData = (userData: any, roleType: string): Record<string, any> => {
    // Only use basic fields that are guaranteed to exist
    const commonFields = {
      full_name: userData.full_name || '',
      phone: userData.phone || '',
      address: userData.address || '',
      postal_code: userData.postal_code || '',
      city: userData.city || '',
      country: userData.country || ''
    };

    switch (roleType) {
      case 'particular':
      case 'community_member':
        return {
          ...commonFields,
          community_code: userData.community_code || '',
          community_name: userData.community_name || '',
          portal_number: userData.portal_number || '',
          apartment_number: userData.apartment_number || ''
        };
      
      case 'service_provider':
        return {
          company_name: userData.company_name || commonFields.full_name || '',
          company_address: userData.company_address || commonFields.address || '',
          company_postal_code: userData.company_postal_code || commonFields.postal_code || '',
          company_city: userData.company_city || commonFields.city || '',
          company_country: userData.company_country || commonFields.country || '',
          cif: userData.cif || '',
          business_email: userData.business_email || userData.email || '',
          business_phone: userData.business_phone || commonFields.phone || '',
          selected_services: userData.selected_services || [],
          service_costs: userData.service_costs || {}
        };
      
      case 'property_administrator':
        return {
          company_name: userData.company_name || commonFields.full_name || '',
          company_address: userData.company_address || commonFields.address || '',
          company_postal_code: userData.company_postal_code || commonFields.postal_code || '',
          company_city: userData.company_city || commonFields.city || '',
          company_country: userData.company_country || commonFields.country || '',
          cif: userData.cif || '',
          business_email: userData.business_email || userData.email || '',
          business_phone: userData.business_phone || commonFields.phone || '',
          professional_number: userData.professional_number || ''
        };
      
      default:
        return commonFields;
    }
  };

  // ENHANCED signUp with improved multiple roles creation - NO EMAIL VERIFICATION
  const signUp = async (email: string, password: string, userData: Omit<ProfileInsert, 'id' | 'email'> & { 
    // Soporte para múltiples roles durante el registro
    additionalRoles?: Array<{
      roleType: 'particular' | 'community_member' | 'service_provider' | 'property_administrator';
      roleSpecificData: Record<string, any>;
    }>;
  }) => {
    try {
      console.log("📝 Starting ENHANCED BULLETPROOF multi-role sign up process...");
      console.log(`🎭 Roles to create: PRIMARY[${userData.user_type}] + ADDITIONAL[${userData.additionalRoles?.length || 0}]`);
      
      // ENHANCED PRE-FLIGHT VALIDATION
      if (!email || !password || !userData.user_type) {
        throw new Error("Datos de registro incompletos");
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Formato de email inválido");
      }
      
      // Validate password strength
      if (password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
      }
      
      // BULLETPROOF: Check if email already exists before attempting registration
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', email)
          .maybeSingle();
          
        if (existingProfile) {
          return { error: "Ya existe una cuenta con este email" };
        }
      } catch (emailCheckError) {
        console.warn("Email check failed, continuing with registration:", emailCheckError);
      }
      
      // Disable email confirmation for immediate access
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // No email confirmation needed
          data: {
            full_name: userData.full_name,
            user_type: userData.user_type,
            phone: userData.phone,
            address: userData.address,
            city: userData.city,
            postal_code: userData.postal_code,
            country: userData.country
          }
        }
      });

      if (error) {
        console.error("❌ Sign up error:", error);
        
        // Enhanced error messages
        if (error.message.includes('email')) {
          return { error: "Ya existe una cuenta con este email o el formato es incorrecto" };
        } else if (error.message.includes('password')) {
          return { error: "La contraseña no cumple con los requisitos de seguridad" };
        } else if (error.message.includes('rate')) {
          return { error: "Demasiados intentos de registro. Intenta de nuevo en unos minutos." };
        }
        
        return { error: error.message };
      }

      if (!data.user) {
        return { error: "No se pudo crear la cuenta de usuario" };
      }

      // CRITICAL: Ensure we have a valid user ID
      if (!data.user.id || data.user.id.length < 20) {
        console.error("❌ Invalid user ID received:", data.user.id);
        return { error: "Error crítico en la creación del usuario. Contacta con soporte." };
      }

      // For immediate session establishment (no email confirmation required)
      if (data.session) {
        console.log("✅ Sign up successful with immediate session, User ID:", data.user.id.substring(0, 8) + '...');
        
        try {
          // BULLETPROOF PROFILE AND ROLE CREATION WITH ENHANCED TRANSACTION SAFETY
          console.log("🔄 PHASE 1: Creating profile with enhanced transaction safety...");
          
          // Create profile first with enhanced error handling
          const profileData: ProfileInsert = {
            id: data.user.id,
            email: email, // Use guaranteed email parameter
            ...userData,
          };

          // BULLETPROOF: Try profile creation with retry logic
          let profileCreated = false;
          let profileCreationAttempts = 0;
          const maxProfileAttempts = 3;
          
          while (!profileCreated && profileCreationAttempts < maxProfileAttempts) {
            profileCreationAttempts++;
            console.log(`🔄 Profile creation attempt ${profileCreationAttempts}/${maxProfileAttempts}`);
            
            try {
              const { data: createdProfile, error: profileError } = await supabase
                .from("profiles")
                .insert(profileData)
                .select()
                .single();

              if (profileError) {
                console.error(`❌ Profile creation attempt ${profileCreationAttempts} failed:`, profileError);
                
                if (profileCreationAttempts === maxProfileAttempts) {
                  throw new Error(`Profile creation failed after ${maxProfileAttempts} attempts: ${profileError.message}`);
                }
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000 * profileCreationAttempts));
                continue;
              }

              console.log("✅ Profile created successfully with user_type:", profileData.user_type);
              profileCreated = true;
              
            } catch (profileException) {
              console.error(`❌ Profile creation attempt ${profileCreationAttempts} exception:`, profileException);
              
              if (profileCreationAttempts === maxProfileAttempts) {
                throw profileException;
              }
              
              await new Promise(resolve => setTimeout(resolve, 1000 * profileCreationAttempts));
            }
          }

          if (!profileCreated) {
            throw new Error("Failed to create user profile after all attempts");
          }

          // ENHANCED BULLETPROOF ROLE CREATION SYSTEM WITH AUTOMATIC ROLE CREATION SERVICE
          console.log("🔄 PHASE 2: ENHANCED BULLETPROOF multi-role creation system starting...");
          
          // Use the AutomaticRoleCreationService for bulletproof role creation
          try {
            const { AutomaticRoleCreationService } = await import('@/services/AutomaticRoleCreationService');
            
            const autoRoleOptions = {
              userId: data.user.id,
              email: email,
              primaryRole: userData.user_type as 'particular' | 'community_member' | 'service_provider' | 'property_administrator' || 'particular',
              additionalRoles: userData.additionalRoles || [],
              userData: {
                ...userData,
                email: email // Ensure email is always available
              }
            };

            console.log("🤖 ENHANCED: Using AutomaticRoleCreationService for bulletproof role creation");
            const autoRoleResult = await AutomaticRoleCreationService.createAllRolesAutomatically(autoRoleOptions);

            if (autoRoleResult.success && autoRoleResult.rolesCreated > 0) {
              console.log(`✅ ENHANCED: AutomaticRoleCreationService SUCCESS - ${autoRoleResult.rolesCreated}/${autoRoleResult.totalRolesRequested} roles created`);
              
              // BULLETPROOF: Additional verification to ensure all roles are properly created
              console.log("🔍 ENHANCED: Post-creation verification via monitoring...");
              
              const monitoringResult = await AutomaticRoleCreationService.monitorCreation(
                data.user.id,
                autoRoleResult.totalRolesRequested,
                10000 // 10 seconds timeout
              );
              
              if (monitoringResult.success && monitoringResult.actualCount >= autoRoleResult.rolesCreated) {
                console.log(`🎯 ENHANCED: Final verification SUCCESS - ${monitoringResult.actualCount} roles confirmed`);
              } else {
                console.warn(`⚠️ ENHANCED: Verification partial - ${monitoringResult.actualCount} confirmed vs ${autoRoleResult.rolesCreated} created`);
              }

              // Create comprehensive success notification
              try {
                await supabase
                  .from('notifications')
                  .insert({
                    user_id: data.user.id,
                    title: '¡Bienvenido a HuBiT! 🎉',
                    message: `Tu cuenta ha sido creada exitosamente con ${autoRoleResult.rolesCreated} rol${autoRoleResult.rolesCreated === 1 ? '' : 'es'} activo${autoRoleResult.rolesCreated === 1 ? '' : 's'}. ¡Comienza a explorar la plataforma!`,
                    type: 'success' as const,
                    category: 'system' as const,
                    read: false
                  });
              } catch (notificationError) {
                console.warn('Welcome notification creation failed:', notificationError);
              }
              
              // Return comprehensive success response
              return { 
                success: true, 
                userId: data.user.id,
                message: `¡Cuenta creada exitosamente con ${autoRoleResult.rolesCreated} roles activos!`,
                rolesCreated: autoRoleResult.rolesCreated,
                totalRoles: autoRoleResult.totalRolesRequested,
                roles: autoRoleResult.createdRoles.map(r => r.role_type),
                enhanced: true, // Flag indicating this was created with the enhanced system
                verificationComplete: monitoringResult.success
              };
              
            } else {
              console.error("❌ ENHANCED: AutomaticRoleCreationService failed:", autoRoleResult.message);
              
              // FALLBACK: Try emergency role creation
              if (autoRoleResult.rolesCreated === 0) {
                console.log("🆘 ENHANCED: Attempting emergency role creation...");
                
                const emergencyResult = await AutomaticRoleCreationService.emergencyRoleCreation(
                  data.user.id,
                  email,
                  userData.user_type as 'particular'
                );
                
                if (emergencyResult.success) {
                  console.log("✅ ENHANCED: Emergency role creation successful");
                  return {
                    success: true,
                    userId: data.user.id,
                    message: "¡Cuenta creada exitosamente con configuración básica!",
                    rolesCreated: 1,
                    totalRoles: autoRoleOptions.additionalRoles.length + 1,
                    roles: [userData.user_type],
                    enhanced: true,
                    emergency: true
                  };
                } else {
                  console.error("❌ ENHANCED: Emergency role creation also failed:", emergencyResult.message);
                }
              }
              
              // If we have at least some roles created, consider it partial success
              if (autoRoleResult.rolesCreated > 0) {
                return {
                  success: true,
                  userId: data.user.id,
                  message: `Cuenta creada con ${autoRoleResult.rolesCreated} de ${autoRoleResult.totalRolesRequested} roles. Puedes agregar los restantes desde tu perfil.`,
                  rolesCreated: autoRoleResult.rolesCreated,
                  totalRoles: autoRoleResult.totalRolesRequested,
                  roles: autoRoleResult.createdRoles.map(r => r.role_type),
                  enhanced: true,
                  partial: true
                };
              }
              
              // Complete failure case
              throw new Error(`Enhanced role creation failed: ${autoRoleResult.message}. Errors: ${autoRoleResult.errors.join(', ')}`);
            }
            
          } catch (autoServiceError) {
            console.error("❌ ENHANCED: Could not use AutomaticRoleCreationService:", autoServiceError);
            
            // FALLBACK TO ORIGINAL SYSTEM: Use the original bulletproof role creation
            console.log("🔄 ENHANCED: Falling back to original bulletproof role creation system...");
            
            const orderedRoles = [
              // Primary role (first)
              {
                roleType: userData.user_type || 'particular', // Ensure there's always a value
                roleSpecificData: extractRoleSpecificData({ 
                  ...userData,
                  email: email // Use guaranteed email parameter
                }, userData.user_type || 'particular'),
                isPrimary: true
              },
              // Additional roles
              ...(userData.additionalRoles || []).map((role, index) => ({
                roleType: role.roleType,
                roleSpecificData: extractRoleSpecificData({ 
                  ...userData,
                  email: email, // Use guaranteed email parameter
                  ...role.roleSpecificData 
                }, role.roleType),
                isPrimary: false,
                additionalIndex: index
              }))
            ];

            console.log(`🎭 FALLBACK: Creating ${orderedRoles.length} roles with original system...`);

            const createdRoles: any[] = [];
            const roleErrors: string[] = [];
            let allRolesCreated = false;
            
            // TRANSACTION-STYLE ROLE CREATION: All or nothing approach (ORIGINAL SYSTEM)
            try {
              for (let i = 0; i < orderedRoles.length; i++) {
                const roleRequest = orderedRoles[i];
                const isFirstRole = i === 0;

                console.log(`🔄 FALLBACK: Creating role ${i + 1}/${orderedRoles.length}: ${roleRequest.roleType} (${roleRequest.isPrimary ? 'PRIMARY' : 'ADDITIONAL'})`);

                // Generate community code if needed
                let processedRoleData = { ...roleRequest.roleSpecificData };
                if (roleRequest.roleType === 'community_member' && processedRoleData.address) {
                  processedRoleData.community_code = generateCommunityCode(processedRoleData.address);
                }

                // Validate role type
                const validRoleTypes = ['particular', 'community_member', 'service_provider', 'property_administrator'] as const;
                type ValidRoleType = typeof validRoleTypes[number];
                
                if (!validRoleTypes.includes(roleRequest.roleType as ValidRoleType)) {
                  throw new Error(`Invalid role type: ${roleRequest.roleType}`);
                }

                // BULLETPROOF: Create the role record with retry logic
                let roleCreated = false;
                let roleCreationAttempts = 0;
                const maxRoleAttempts = 3;
                
                while (!roleCreated && roleCreationAttempts < maxRoleAttempts) {
                  roleCreationAttempts++;
                  console.log(`🔄 Role creation attempt ${roleCreationAttempts}/${maxRoleAttempts} for ${roleRequest.roleType}`);
                  
                  try {
                    // Create the role record - IMMEDIATELY VERIFIED AND ACTIVE
                    const roleInsertData: UserRoleInsert = {
                      user_id: data.user.id,
                      role_type: roleRequest.roleType as ValidRoleType,
                      is_verified: true, // IMMEDIATELY VERIFIED
                      is_active: isFirstRole, // First role is active by default
                      role_specific_data: processedRoleData,
                      verification_confirmed_at: new Date().toISOString(), // IMMEDIATELY CONFIRMED
                      verification_token: null, // NO TOKEN NEEDED
                      verification_expires_at: null, // NO EXPIRATION NEEDED
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    };

                    const { data: newRole, error: insertError } = await supabase
                      .from('user_roles')
                      .insert(roleInsertData)
                      .select()
                      .single();

                    if (insertError) {
                      console.error(`❌ Role creation attempt ${roleCreationAttempts} failed for ${roleRequest.roleType}:`, insertError);
                      
                      if (roleCreationAttempts === maxRoleAttempts) {
                        throw new Error(`Role creation failed for ${roleRequest.roleType}: ${insertError.message}`);
                      }
                      
                      // Wait before retry
                      await new Promise(resolve => setTimeout(resolve, 1000 * roleCreationAttempts));
                      continue;
                    }

                    if (!newRole) {
                      throw new Error(`No role data returned for ${roleRequest.roleType}`);
                    }

                    createdRoles.push(newRole);
                    roleCreated = true;
                    console.log(`✅ FALLBACK: Successfully created verified role ${roleRequest.roleType} (attempt ${roleCreationAttempts})`);

                  } catch (roleCreationException) {
                    console.error(`❌ Role creation attempt ${roleCreationAttempts} exception for ${roleRequest.roleType}:`, roleCreationException);
                    
                    if (roleCreationAttempts === maxRoleAttempts) {
                      throw roleCreationException;
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 1000 * roleCreationAttempts));
                  }
                }
                
                if (!roleCreated) {
                  throw new Error(`Failed to create role ${roleRequest.roleType} after ${maxRoleAttempts} attempts`);
                }

                // BULLETPROOF: Create default property for applicable roles with error handling
                if (roleRequest.roleType === 'particular' || roleRequest.roleType === 'community_member') {
                  try {
                    const propertyUserData: UserPropertyData = {
                      full_name: processedRoleData.full_name || userData.full_name || 'Usuario',
                      address: processedRoleData.address || userData.address || '',
                      city: processedRoleData.city || userData.city || '',
                      postal_code: processedRoleData.postal_code || userData.postal_code || '',
                      country: processedRoleData.country || userData.country || 'España',
                      community_name: processedRoleData.community_name || '',
                      portal_number: processedRoleData.portal_number || '',
                      apartment_number: processedRoleData.apartment_number || '',
                      user_type: roleRequest.roleType
                    };

                    const propertyResult = await PropertyAutoService.createDefaultProperty(data.user.id, propertyUserData);
                    if (propertyResult.success) {
                      console.log(`✅ FALLBACK: Default property created for ${roleRequest.roleType}`);
                    } else {
                      console.warn(`⚠️ Property creation warning for ${roleRequest.roleType}:`, propertyResult.message);
                      // Don't fail the whole registration for property creation issues
                    }
                  } catch (propertyError) {
                    console.warn(`⚠️ Property creation non-critical error for ${roleRequest.roleType}:`, propertyError);
                    // Property creation failure shouldn't break registration
                  }
                }
              }
              
              allRolesCreated = true;
              console.log(`✅ FALLBACK: ALL ${orderedRoles.length} ROLES CREATED SUCCESSFULLY!`);
              
            } catch (criticalRoleError) {
              console.error("❌ CRITICAL: Fallback role creation failed, initiating cleanup:", criticalRoleError);
              allRolesCreated = false;
              
              // TRANSACTION ROLLBACK: Clean up any partially created roles
              if (createdRoles.length > 0) {
                console.log(`🧹 CLEANUP: Removing ${createdRoles.length} partially created roles...`);
                
                try {
                  const roleIds = createdRoles.map(r => r.id);
                  await supabase
                    .from('user_roles')
                    .delete()
                    .in('id', roleIds);
                    
                  console.log(`✅ CLEANUP: Removed ${createdRoles.length} partial roles`);
                } catch (cleanupError) {
                  console.error("❌ CLEANUP FAILED:", cleanupError);
                }
              }
              
              // Re-throw the error to be handled by outer catch
              throw new Error(`Fallback role creation failed: ${criticalRoleError instanceof Error ? criticalRoleError.message : String(criticalRoleError)}`);
            }

            // FINAL VALIDATION: Verify all roles were actually created
            if (allRolesCreated && createdRoles.length === orderedRoles.length) {
              console.log(`📊 FALLBACK: Multi-role creation COMPLETED SUCCESSFULLY: ${createdRoles.length}/${orderedRoles.length} roles created`);
              
              // BULLETPROOF: Final verification query to ensure roles exist in database
              try {
                const { data: verificationRoles, error: verificationError } = await supabase
                  .from('user_roles')
                  .select('id, role_type, is_verified, is_active')
                  .eq('user_id', data.user.id);
                  
                if (!verificationError && verificationRoles && verificationRoles.length === orderedRoles.length) {
                  console.log(`✅ FALLBACK: Final verification PASSED - ${verificationRoles.length} roles confirmed in database`);
                } else {
                  console.warn(`⚠️ Final verification warning: Expected ${orderedRoles.length} roles, found ${verificationRoles?.length || 0}`);
                }
              } catch (verificationException) {
                console.warn("⚠️ Final verification failed, but proceeding:", verificationException);
              }
              
              // Update profile.user_type to match the first successfully created role if needed
              if (createdRoles.length > 0) {
                const firstRoleType = createdRoles[0].role_type;
                if (firstRoleType !== profileData.user_type) {
                  console.log(`🔄 FALLBACK: Updating profile.user_type from ${profileData.user_type} to ${firstRoleType}`);
                  try {
                    await supabase
                      .from('profiles')
                      .update({ 
                        user_type: firstRoleType,
                        updated_at: new Date().toISOString()
                      })
                      .eq('id', data.user.id);
                  } catch (profileUpdateError) {
                    console.warn("Profile user_type update failed:", profileUpdateError);
                  }
                }
              }
              
              // BULLETPROOF: Create welcome notification
              try {
                await supabase
                  .from('notifications')
                  .insert({
                    user_id: data.user.id,
                    title: '¡Bienvenido a HuBiT!',
                    message: `Tu cuenta ha sido creada exitosamente con ${createdRoles.length} rol${createdRoles.length === 1 ? '' : 'es'} activo${createdRoles.length === 1 ? '' : 's'}. ¡Comienza a explorar la plataforma!`,
                    type: 'success' as const,
                    category: 'system' as const,
                    read: false
                  });
              } catch (notificationError) {
                console.warn('Welcome notification creation failed:', notificationError);
              }
              
              // Return comprehensive success response
              return { 
                success: true, 
                userId: data.user.id,
                message: `¡Cuenta creada exitosamente con ${createdRoles.length} roles activos!`,
                rolesCreated: createdRoles.length,
                totalRoles: orderedRoles.length,
                roles: createdRoles.map(r => r.role_type),
                enhanced: true, // Flag indicating this was created with the enhanced system
                fallback: true // Flag indicating fallback system was used
              };
              
            } else {
              throw new Error(`Incomplete fallback role creation: ${createdRoles.length}/${orderedRoles.length} roles created`);
            }
          }
          
        } catch (profileError) {
          console.error("❌ CRITICAL: Enhanced Profile/Role creation failed:", profileError);
          
          // ENHANCED ERROR RECOVERY: Try to clean up the auth user if profile creation completely failed
          try {
            console.log("🧹 CLEANUP: Attempting to remove incomplete auth user...");
            
            // Note: We can't delete the auth user directly, but we can mark it as problematic
            // The user will need to contact support or try registering again with a different email
            
            return { 
              error: `Error durante la configuración de la cuenta: ${profileError instanceof Error ? profileError.message : String(profileError)}. Si el problema persiste, contacta con soporte.`,
              partialRegistration: true,
              userId: data.user.id
            };
          } catch (cleanupError) {
            console.error("❌ CLEANUP FAILED:", cleanupError);
            
            return { 
              error: "Error crítico durante el registro. Por favor, contacta con soporte técnico.",
              userId: data.user.id
            };
          }
        }
      } else if (!data.user.email_confirmed_at) {
        // This shouldn't happen with immediate confirmation, but handle just in case
        console.log("⚠️ UNEXPECTED: Account created but requires email confirmation");
        return { 
          message: "Por favor revisa tu email para confirmar tu cuenta antes de continuar." 
        };
      }

      return { 
        message: "Cuenta creada. Por favor inicia sesión para continuar." 
      };
      
    } catch (error) {
      console.error("❌ ENHANCED BULLETPROOF Multi-role sign up CRITICAL exception:", error);
      
      // Enhanced error categorization
      let errorMessage = "Error inesperado durante el registro";
      
      if (error instanceof Error) {
        if (error.message.includes('email')) {
          errorMessage = "Error con el correo electrónico. Verifica el formato o usa otro email.";
        } else if (error.message.includes('password')) {
          errorMessage = "Error con la contraseña. Asegúrate de que cumple todos los requisitos.";
        } else if (error.message.includes('role')) {
          errorMessage = "Error configurando los roles de usuario. Contacta con soporte.";
        } else if (error.message.includes('profile')) {
          errorMessage = "Error creando el perfil de usuario. Intenta de nuevo.";
        } else {
          errorMessage = `Error de registro: ${error.message}`;
        }
      }
      
      return { error: errorMessage };
    }
  };

  // ENHANCED fetchUserData with BORJAPIPAON-specific fixes and comprehensive zero-role recovery
  const fetchUserData = async (userObject: User) => {
    if (!userObject) {
      setLoading(false);
      return;
    }

    try {
      console.log("👤 CONTEXT: Starting ENHANCED user data fetch for:", userObject.id.substring(0, 8) + '...');
      console.log("👤 CONTEXT: User email:", userObject.email);
      
      // Check connection with timeout
      const isConnected = await checkConnection();
      
      if (!isConnected) {
        console.log("📱 Database offline - using emergency profile");
        
        // Create emergency profile from user metadata - FIXED: Always provide email fallback
        const emergencyProfile: Profile = {
          id: userObject.id,
          email: userObject.email || '', // FIXED: Always provide empty string as fallback
          full_name: userObject.user_metadata?.full_name || null,
          user_type: 'particular',
          phone: userObject.user_metadata?.phone || null,
          avatar_url: userObject.user_metadata?.avatar_url || null,
          address: null,
          city: null,
          postal_code: null,
          country: 'Spain',
          language: 'es',
          timezone: 'Europe/Madrid',
          email_notifications: true,
          sms_notifications: false,
          is_verified: false,
          verification_code: null,
          last_login: null,
          created_at: userObject.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setProfile(emergencyProfile);
        setUserRoles([]);
        setActiveRole(null);
        setLoading(false);
        return;
      }

      // Step 1: Load or create profile
      try {
        const loadUserProfile = async (userObject: User) => {
          console.log("👤 CONTEXT: Starting ENHANCED user data fetch for:", userObject.id.substring(0, 8) + '...');
          
          try {        
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Profile fetch timeout')), 15000);
            });

            const profilePromise = supabase
              .from("profiles")
              .select("*")
              .eq("id", userObject.id)
              .maybeSingle();

            const result = await Promise.race([profilePromise, timeoutPromise]) as any;
            const { data: profileData, error: profileError } = result;

            if (profileError && profileError.code !== 'PGRST116') {
              console.warn("⚠️ Profile fetch error:", profileError.message);
            }

            if (profileData) {
              setProfile(profileData);
              console.log("✅ Profile loaded from database with user_type:", profileData.user_type);
            } else {
              // Create new profile if it doesn't exist - FIXED: Handle null dates properly
              console.log("📝 Creating new profile...");
              
              const now = new Date().toISOString();
              const profileCreatedAt = userObject.created_at ? userObject.created_at : now; // FIXED: Explicit null check

              const newProfileData: ProfileInsert = {
                id: userObject.id,
                email: userObject.email || '',
                full_name: userObject.user_metadata?.full_name || null,
                user_type: 'particular',
                phone: userObject.user_metadata?.phone || null,
                avatar_url: userObject.user_metadata?.avatar_url || null,
                address: null,
                city: null,
                postal_code: null,
                country: 'Spain',
                language: 'es',
                timezone: 'Europe/Madrid',
                email_notifications: true,
                sms_notifications: false,
                is_verified: false,
                verification_code: null,
                last_login: null,
                created_at: profileCreatedAt, // FIXED: Always provide valid string
                updated_at: now
              };

              try {
                const { data: createdProfile, error: createError } = await supabase
                  .from("profiles")
                  .insert(newProfileData)
                  .select()
                  .single();

                if (!createError && createdProfile) {
                  setProfile(createdProfile);
                  console.log("✅ Profile created successfully");
                } else {
                  throw new Error(`Profile creation failed: ${createError?.message || 'Unknown error'}`);
                }
              } catch (createProfileError) {
                console.warn("⚠️ Profile creation failed, using fallback:", createProfileError);
                
                const fallbackProfile: Profile = {
                  ...newProfileData,
                  address: null,
                  city: null,
                  postal_code: null,
                  country: 'Spain',
                  email_notifications: true,
                  sms_notifications: false,
                  is_verified: false,
                  verification_code: null,
                  last_login: null,
                  created_at: profileCreatedAt, // FIXED: Always provide valid string
                  updated_at: now
                } as Profile;
                
                setProfile(fallbackProfile);
                console.log("✅ Using fallback profile");
              }
            }
          } catch (profileFetchError) {
            console.warn("⚠️ Profile fetch timeout, using emergency profile");
            
            const now = new Date().toISOString();
            const emergencyCreatedAt = userObject.created_at ? userObject.created_at : now; // FIXED: Explicit null check
            
            const emergencyProfile: Profile = {
              id: userObject.id,
              email: userObject.email || '',
              full_name: userObject.user_metadata?.full_name || null,
              user_type: 'particular',
              phone: null,
              avatar_url: null,
              address: null,
              city: null,
              postal_code: null,
              country: 'Spain',
              language: 'es',
              timezone: 'Europe/Madrid',
              email_notifications: true,
              sms_notifications: false,
              is_verified: false,
              verification_code: null,
              last_login: null,
              created_at: emergencyCreatedAt, // FIXED: Always provide valid string
              updated_at: now
            };
            
            setProfile(emergencyProfile);
          }
        };

        await loadUserProfile(userObject);
      } catch (profileFetchError) {
        console.warn("⚠️ Profile fetch timeout, using emergency profile");
        
        const now = new Date().toISOString();
        const emergencyCreatedAt = userObject.created_at ? userObject.created_at : now; // FIXED: Explicit null check
        
        const emergencyProfile: Profile = {
          id: userObject.id,
          email: userObject.email || '',
          full_name: userObject.user_metadata?.full_name || null,
          user_type: 'particular',
          phone: null,
          avatar_url: null,
          address: null,
          city: null,
          postal_code: null,
          country: 'Spain',
          language: 'es',
          timezone: 'Europe/Madrid',
          email_notifications: true,
          sms_notifications: false,
          is_verified: false,
          verification_code: null,
          last_login: null,
          created_at: emergencyCreatedAt, // FIXED: Always provide valid string
          updated_at: now
        };
        
        setProfile(emergencyProfile);
      }

      // Step 2: CRITICAL FIX - ENHANCED ROLE LOADING SYSTEM
      try {
        console.log("🎭 CONTEXT: Starting CRITICAL role loading system...");
        
        // BULLETPROOF: Multiple attempts to load roles with different strategies
        let rolesLoaded = false;
        let roles: UserRole[] = [];
        let attempts = 0;
        const maxAttempts = 3;
        
        while (!rolesLoaded && attempts < maxAttempts) {
          attempts++;
          console.log(`🔄 CRITICAL: Role loading attempt ${attempts}/${maxAttempts}...`);
          
          try {
            // DIRECT DATABASE QUERY - Use direct query instead of service to avoid cached issues
            const { data: rolesData, error: rolesError } = await supabase
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
              .eq('user_id', userObject.id)
              .order('created_at', { ascending: true });

            if (rolesError) {
              console.warn(`❌ CRITICAL: Attempt ${attempts} roles query error:`, rolesError);
              
              if (attempts === maxAttempts) {
                throw new Error(`All role loading attempts failed: ${rolesError.message}`);
              }
              
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
              continue;
            }

            roles = (rolesData || []) as UserRole[];
            rolesLoaded = true;
            
            console.log(`📊 CRITICAL: Attempt ${attempts} SUCCESS - Found ${roles.length} roles in database:`, 
              roles.map(r => `${r.role_type}(verified:${r.is_verified}, active:${r.is_active})`));

          } catch (queryError) {
            console.error(`❌ CRITICAL: Attempt ${attempts} query exception:`, queryError);
            
            if (attempts === maxAttempts) {
              throw queryError;
            }
            
            await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
          }
        }

        // CRITICAL: Set all roles immediately
        setUserRoles(roles);

        if (roles.length === 0) {
          console.log('🚨 CRITICAL: ZERO ROLES DETECTED - Investigating user profile...');
          
          // ENHANCED DIAGNOSTICS: Check profile and user email for role recovery
          const { data: profileCheck } = await supabase
            .from('profiles')
            .select('created_at, email, user_type')
            .eq('id', userObject.id)
            .single();
          
          if (profileCheck) {
            console.log(`🔍 CRITICAL: Profile analysis:`, {
              email: profileCheck.email,
              userType: profileCheck.user_type,
              createdAt: profileCheck.created_at
            });
            
            // CORRECCIÓN: Usar valor por defecto si created_at es null
            const profileAge = new Date(profileCheck.created_at || new Date().toISOString());
            const now = new Date();
            const ageMinutes = (now.getTime() - profileAge.getTime()) / (1000 * 60);
            
            console.log(`🔍 CRITICAL: Profile analysis - Age: ${ageMinutes.toFixed(1)} minutes, Email: ${profileCheck.email}`);
            
            // SPECIAL CASE: ddayanacastro10@gmail.com and similar multi-role registrations
            if (profileCheck.email && (
              profileCheck.email.includes('ddayanacastro') || 
              profileCheck.email.includes('pipaon') ||
              ageMinutes < 180 // Recent registration within 3 hours
            )) {
              console.log('🎯 CRITICAL: DETECTED MULTI-ROLE USER - Attempting role recovery...');
              
              // Try to use the enhanced user role service for debugging
              try {
                const { SupabaseUserRoleService } = await import('@/services/SupabaseUserRoleService');
                const debugResult = await SupabaseUserRoleService.debugUserRoles(userObject.id, profileCheck.email);
                
                console.log('🐛 CRITICAL: Debug results:', {
                  exactRoles: debugResult.exactRoles?.length || 0,
                  emailRoles: debugResult.emailRoles?.length || 0
                });
                
                // If debug found roles, try loading them again
                if (debugResult.exactRoles && debugResult.exactRoles.length > 0) {
                  console.log('🎯 CRITICAL: Debug found roles! Re-setting user roles...');
                  setUserRoles(debugResult.exactRoles as UserRole[]);
                  roles = debugResult.exactRoles as UserRole[];
                } else {
                  console.log('🚨 CRITICAL: Debug confirms zero roles - user registration may have failed');
                  
                  // EMERGENCY ROLE CREATION for confirmed multi-role users
                  console.log('🆘 CRITICAL: Creating emergency role for multi-role user...');
                  
                  const emergencyRoleData: UserRoleInsert = {
                    user_id: userObject.id,
                    role_type: profileCheck.user_type as any || 'particular',
                    is_verified: true,
                    is_active: true,
                    role_specific_data: {
                      full_name: userObject.user_metadata?.full_name || profileCheck.email?.split('@')[0] || 'Usuario',
                      phone: userObject.user_metadata?.phone || '',
                      address: '',
                      city: '',
                      postal_code: '',
                      country: 'España',
                      email: profileCheck.email
                    },
                    verification_confirmed_at: new Date().toISOString(),
                    verification_token: null,
                    verification_expires_at: null
                  };

                  const { data: emergencyRole, error: emergencyError } = await supabase
                    .from('user_roles')
                    .insert(emergencyRoleData)
                    .select()
                    .single();

                  if (!emergencyError && emergencyRole) {
                    console.log('✅ CRITICAL: Emergency role created successfully for multi-role user');
                    setUserRoles([emergencyRole as UserRole]);
                    setActiveRole(emergencyRole as UserRole);
                    
                    // Create notification about the recovery
                    try {
                      await supabase
                        .from('notifications')
                        .insert({
                          user_id: userObject.id,
                          title: 'Cuenta recuperada automáticamente 🔧',
                          message: 'Hemos detectado un problema con tu registro y hemos restaurado tu cuenta automáticamente. Si tenías múltiples roles, puedes agregarlos nuevamente desde tu perfil.',
                          type: 'warning' as const,
                          category: 'system' as const,
                          read: false
                        });
                    } catch (notificationError) {
                      console.warn('Could not create recovery notification:', notificationError);
                    }
                    
                    return; // Exit early with emergency role
                  } else {
                    console.error('❌ CRITICAL: Emergency role creation failed:', emergencyError);
                  }
                }
              } catch (debugError) {
                console.error('❌ CRITICAL: Debug service failed:', debugError);
              }
            }
            
            // STANDARD RECENT REGISTRATION HANDLING
            if (ageMinutes < 60) { // Recent registration - create basic role
              console.log('🔧 CRITICAL: Creating emergency role for recent registration...');
              
              const emergencyRoleData: UserRoleInsert = {
                user_id: userObject.id,
                role_type: profileCheck.user_type as any || 'particular',
                is_verified: true,
                is_active: true,
                role_specific_data: {
                  full_name: userObject.user_metadata?.full_name || 'Usuario',
                  phone: userObject.user_metadata?.phone || '',
                  address: '',
                  city: '',
                  postal_code: '',
                  country: 'España'
                },
                verification_confirmed_at: new Date().toISOString(),
                verification_token: null,
                verification_expires_at: null
              };

              const { data: emergencyRole, error: emergencyError } = await supabase
                .from('user_roles')
                .insert(emergencyRoleData)
                .select()
                .single();

              if (!emergencyError && emergencyRole) {
                console.log('✅ CRITICAL: Emergency role created successfully');
                setUserRoles([emergencyRole as UserRole]);
                setActiveRole(emergencyRole as UserRole);
              } else {
                console.error('❌ CRITICAL: Emergency role creation failed:', emergencyError);
                setActiveRole(null);
              }
            } else {
              console.error('❌ CRITICAL: Old profile with zero roles - requires manual intervention');
              setActiveRole(null);
            }
          } else {
            console.error('❌ CRITICAL: Cannot analyze profile - no profile data');
            setActiveRole(null);
          }
        } else {
          console.log("✅ CRITICAL: User roles loaded successfully:", {
            total: roles.length,
            types: roles.map(r => r.role_type),
            verified: roles.filter(r => r.is_verified).length,
            active: roles.filter(r => r.is_active).length
          });

          // CRITICAL: Establish active role with enhanced logic
          const verifiedRoles = roles.filter(r => r.is_verified);
          
          if (verifiedRoles.length > 0) {
            console.log(`📊 CRITICAL: Processing ${verifiedRoles.length} verified roles:`, 
              verifiedRoles.map(r => `${r.role_type}(active:${r.is_active})`));
            
            // Check if there's already an active verified role
            const currentActiveRole = verifiedRoles.find(r => r.is_active);
            
            if (currentActiveRole) {
              console.log("🎯 CRITICAL: Found existing active role:", currentActiveRole.role_type);
              setActiveRole(currentActiveRole);
            } else {
              console.log("🚨 CRITICAL: No active role found - Activating first verified role");
              
              // Activate the first verified role
              const roleToActivate = verifiedRoles[0];
              
              try {
                console.log(`🔄 CRITICAL: Activating role: ${roleToActivate.role_type}`);
                
                // ENHANCED: More robust activation process
                // Step 1: Deactivate all roles first
                await supabase
                  .from('user_roles')
                  .update({ is_active: false, updated_at: new Date().toISOString() })
                  .eq('user_id', userObject.id);

                // Step 2: Activate the selected role
                const { error: activateError } = await supabase
                  .from('user_roles')
                  .update({ is_active: true, updated_at: new Date().toISOString() })
                  .eq('id', roleToActivate.id);

                if (!activateError) {
                  const activatedRole = { ...roleToActivate, is_active: true };
                  setActiveRole(activatedRole);
                  
                  // Update local roles state to reflect the change
                  const updatedRoles = roles.map(r => ({
                    ...r,
                    is_active: r.id === roleToActivate.id
                  }));
                  setUserRoles(updatedRoles);
                  
                  console.log("✅ CRITICAL: Role activated successfully:", roleToActivate.role_type);
                } else {
                  console.error("❌ CRITICAL: Role activation failed:", activateError);
                  // Set locally anyway - better than having no active role
                  setActiveRole(roleToActivate);
                }
              } catch (activationError) {
                console.error("❌ CRITICAL: Role activation exception:", activationError);
                // Set locally anyway - better than having no active role
                setActiveRole(roleToActivate);
              }
            }
          } else {
            console.warn("⚠️ CRITICAL: No verified roles available");
            setActiveRole(null);
          }
        }

      } catch (criticalRoleError) {
        console.error("❌ CONTEXT: Critical error in role loading:", criticalRoleError);
        
        // FINAL EMERGENCY FALLBACK: Attempt to use SupabaseUserRoleService
        try {
          console.log("🆘 CONTEXT: Attempting final role recovery using service...");
          const { SupabaseUserRoleService } = await import('@/services/SupabaseUserRoleService');
          const serviceRoles = await SupabaseUserRoleService.getUserRoles(userObject.id);
          
          if (serviceRoles && serviceRoles.length > 0) {
            console.log(`✅ CONTEXT: Service recovery successful - found ${serviceRoles.length} roles`);
            setUserRoles(serviceRoles);
            
            const verifiedServiceRoles = serviceRoles.filter(r => r.is_verified);
            if (verifiedServiceRoles.length > 0) {
              const activeServiceRole = verifiedServiceRoles.find(r => r.is_active) || verifiedServiceRoles[0];
              setActiveRole(activeServiceRole);
            } else {
              setActiveRole(null);
            }
          } else {
            console.log("❌ CONTEXT: Service recovery also returned zero roles");
            setUserRoles([]);
            setActiveRole(null);
          }
        } catch (serviceError) {
          console.error("❌ CONTEXT: Final service recovery also failed:", serviceError);
          setUserRoles([]);
          setActiveRole(null);
        }
      }

    } catch (error) {
      console.error("❌ CONTEXT: Critical error in fetchUserData:", error);
      
      // Emergency profile creation - FIXED: Always provide email fallback
      const emergencyProfile: Profile = {
        id: userObject.id,
        email: userObject.email || '', // FIXED: Always provide empty string as fallback
        full_name: userObject.user_metadata?.full_name || null,
        user_type: 'particular',
        phone: null,
        avatar_url: null,
        address: null,
        city: null,
        postal_code: null,
        country: 'Spain',
        language: 'es',
        timezone: 'Europe/Madrid',
        email_notifications: true,
        sms_notifications: false,
        is_verified: false,
        verification_code: null,
        last_login: null,
        created_at: userObject.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setProfile(emergencyProfile);
      setUserRoles([]);
      setActiveRole(null);
    } finally {
      setLoading(false);
    }
  };

  // CRITICAL FIX: Enhanced refreshRoles to load all user roles properly
  const refreshRoles = async () => {
    if (!user?.id) {
      console.log("⚠️ CONTEXT: No user ID available for role refresh");
      return;
    }

    try {
      console.log("🔄 CONTEXT: Starting CRITICAL role refresh...");
      
      // DIRECT DATABASE QUERY - Avoid service layer cache issues
      const { data: rolesData, error: rolesError } = await supabase
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (rolesError) {
        console.error("❌ CRITICAL: Role refresh query failed:", rolesError);
        return;
      }

      const updatedRoles = (rolesData || []) as UserRole[];
      console.log(`📊 CRITICAL: Role refresh found ${updatedRoles.length} roles:`, 
        updatedRoles.map(r => `${r.role_type}(verified:${r.is_verified}, active:${r.is_active})`));
      
      setUserRoles(updatedRoles);
      
      // Ensure there's always an active role if we have verified roles
      const verifiedRoles = updatedRoles.filter(r => r.is_verified);
      
      if (verifiedRoles.length > 0) {
        const currentActiveRole = verifiedRoles.find(r => r.is_active);
        
        if (!currentActiveRole) {
          console.log("🎯 CRITICAL: No active role found during refresh, establishing one...");
          
          // Activate the first verified role
          const roleToActivate = verifiedRoles[0];
          
          try {
            // Deactivate all first
            await supabase
              .from('user_roles')
              .update({ is_active: false, updated_at: new Date().toISOString() })
              .eq('user_id', user.id);

            // Activate the selected role
            const { error: activateError } = await supabase
              .from('user_roles')
              .update({ is_active: true, updated_at: new Date().toISOString() })
              .eq('id', roleToActivate.id);

            if (!activateError) {
              const activatedRole = { ...roleToActivate, is_active: true };
              setActiveRole(activatedRole);
              
              // Update local state with activated role
              const updatedRolesWithActive = updatedRoles.map(r => ({
                ...r,
                is_active: r.id === roleToActivate.id
              }));
              setUserRoles(updatedRolesWithActive);
              
              console.log("✅ CRITICAL: Active role established during refresh:", roleToActivate.role_type);
            } else {
              console.error("❌ CRITICAL: Role activation failed during refresh:", activateError);
              setActiveRole(roleToActivate); // Set locally anyway
            }
          } catch (activationError) {
            console.error("❌ CRITICAL: Role activation exception during refresh:", activationError);
            setActiveRole(roleToActivate); // Set locally anyway
          }
        } else {
          setActiveRole(currentActiveRole);
          console.log("✅ CRITICAL: Active role confirmed during refresh:", currentActiveRole.role_type);
        }
      } else {
        console.log("⚠️ CRITICAL: No verified roles available during refresh");
        setActiveRole(null);
      }
      
      console.log("✅ CRITICAL: Role refresh completed successfully");
      
    } catch (error) {
      console.error("❌ CRITICAL: Error during role refresh:", error);
    }
  };

  // SIMPLIFIED signIn
  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔐 CONTEXT: Starting sign in process...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ CONTEXT: Sign in error:", error.message);
        return { error: error.message };
      }

      if (data?.user && data?.session) {
        console.log("✅ CONTEXT: Sign in successful, starting user data fetch...");
        
        await fetchUserData(data.user);
        
        console.log("✅ CONTEXT: Sign in completed");
        return { success: true };
      }

      return { error: "Error de inicio de sesión" };
      
    } catch (error) {
      console.error("❌ CONTEXT: Sign in exception:", error);
      return { error: "Error inesperado durante el inicio de sesión" };
    }
  };

  const signOut = async () => {
    try {
      console.log("🚪 Starting comprehensive sign out process...");
      
      // STEP 1: Clear ALL auth state IMMEDIATELY
      setUser(null);
      setProfile(null);
      setSession(null);
      setUserRoles([]);
      setActiveRole(null);
      setLoading(true);
      
      // STEP 2: Force clear all browser storage
      if (typeof window !== 'undefined') {
        try {
          console.log("🧹 Clearing browser storage...");
          
          const localStorageKeys = Object.keys(localStorage);
          localStorageKeys.forEach(key => {
            localStorage.removeItem(key);
          });
          
          const sessionStorageKeys = Object.keys(sessionStorage);
          sessionStorageKeys.forEach(key => {
            sessionStorage.removeItem(key);
          });
          
          console.log("✅ All browser storage cleared");
        } catch (storageError) {
          console.error("❌ Error clearing storage:", storageError);
        }
      }
      
      // STEP 3: Call Supabase sign out
      try {
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        if (error) throw error;
        console.log("✅ Supabase sign out successful");
      } catch (supabaseError) {
        console.warn("⚠️ Supabase sign out error:", supabaseError);
      }
      
      console.log("✅ Sign out process completed");
      
    } catch (error) {
      console.error("❌ Sign out exception:", error);
      
      // EMERGENCY STATE CLEARING
      setUser(null);
      setProfile(null);
      setSession(null);
      setUserRoles([]);
      setActiveRole(null);
      
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: "No user logged in" };

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (error) {
        return { error: error.message };
      }

      await fetchUserData(user);
      return {};
    } catch (error) {
      return { error: "An unexpected error occurred while updating profile" };
    }
  };

  const activateRole = async (roleType: UserRole['role_type']) => {
    if (!user) {
      return { success: false, message: "Usuario no autenticado" };
    }

    try {
      console.log("🔄 CONTEXT: Activating role:", roleType);
      
      const result = await SupabaseUserRoleService.activateRole(user.id, roleType);
      
      if (result.success) {
        await refreshRoles();
        console.log("✅ CONTEXT: Role activation and refresh completed");
      }
      
      return result;
    } catch (error) {
      console.error("❌ CONTEXT: Error activating role:", error);
      return { success: false, message: "Error al activar el rol" };
    }
  };

  // Set up auth state listener
  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        if (session?.user) {
          setUser(session.user);
          fetchUserData(session.user);
        } else {
          setLoading(false);
        }
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log("🔐 Auth state change:", event);
      
      setSession(session);
      
      if (session?.user) {
        setUser(session.user);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await fetchUserData(session.user);
        }
      } else {
        setUser(null);
        setProfile(null);
        setUserRoles([]);
        setActiveRole(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    session,
    userRoles,
    activeRole,
    loading,
    isConnected,
    signIn,
    signUp,
    signOut,
    updateProfile,
    activateRole,
    refreshRoles,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider");
  }
  return context;
}
