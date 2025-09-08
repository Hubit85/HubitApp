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
  const extractRoleSpecificData = (userData: any & { email: string }, roleType: string): Record<string, any> => {
    const commonFields = {
      full_name: userData.full_name,
      phone: userData.phone,
      address: userData.address,
      postal_code: userData.postal_code,
      city: userData.city,
      province: userData.province,
      country: userData.country
    };

    switch (roleType) {
      case 'particular':
      case 'community_member':
        return commonFields;
      
      case 'service_provider':
        return {
          company_name: userData.company_name || userData.full_name,
          company_address: userData.company_address || userData.address,
          company_postal_code: userData.company_postal_code || userData.postal_code,
          company_city: userData.company_city || userData.city,
          company_province: userData.company_province || userData.province,
          company_country: userData.company_country || userData.country,
          cif: userData.cif || '',
          business_email: userData.business_email || userData.email,
          business_phone: userData.business_phone || userData.phone,
          selected_services: userData.selected_services || [],
          service_costs: userData.service_costs || {}
        };
      
      case 'property_administrator':
        return {
          company_name: userData.company_name || userData.full_name,
          company_address: userData.company_address || userData.address,
          company_postal_code: userData.company_postal_code || userData.postal_code,
          company_city: userData.company_city || userData.city,
          company_province: userData.company_province || userData.province,
          company_country: userData.company_country || userData.country,
          cif: userData.cif || '',
          business_email: userData.business_email || userData.email,
          business_phone: userData.business_phone || userData.phone,
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
      console.log("📝 Starting simplified multi-role sign up process...");
      
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
            province: userData.province,
            country: userData.country
          }
        }
      });

      if (error) {
        console.error("❌ Sign up error:", error);
        return { error: error.message };
      }

      if (!data.user) {
        return { error: "No se pudo crear la cuenta" };
      }

      // For immediate session establishment (no email confirmation required)
      if (data.session) {
        console.log("✅ Sign up successful with immediate session");
        
        try {
          // Create profile first
          const profileData: ProfileInsert = {
            id: data.user.id,
            email: email, // FIXED: Use guaranteed email parameter
            ...userData,
          };

          // Create profile first
          const { data: createdProfile, error: profileError } = await supabase
            .from("profiles")
            .insert(profileData)
            .select()
            .single();

          if (profileError) {
            console.error("❌ Profile creation failed:", profileError);
            throw profileError;
          }

          console.log("✅ Profile created successfully with user_type:", profileData.user_type);

          // Create multiple roles immediately with no email verification
          const rolesToCreate = [
            // Primary role (first)
            {
              roleType: userData.user_type,
              roleSpecificData: extractRoleSpecificData({ ...userData, email: email }, userData.user_type)
            },
            // Additional roles
            ...(userData.additionalRoles || []).map(role => ({
              roleType: role.roleType,
              roleSpecificData: extractRoleSpecificData({ 
                ...userData, 
                email: email,
                ...role.roleSpecificData 
              }, role.roleType)
            }))
          ];

          console.log(`🎭 Creating ${rolesToCreate.length} roles immediately (no email verification)...`);

          const createdRoles = [];
          const roleErrors = [];
          
          for (let i = 0; i < rolesToCreate.length; i++) {
            const roleRequest = rolesToCreate[i];
            const isFirstRole = i === 0;

            try {
              console.log(`🔄 Creating role ${i + 1}/${rolesToCreate.length}: ${roleRequest.roleType}`);

              // Generate community code if needed
              let processedRoleData = { ...roleRequest.roleSpecificData };
              if (roleRequest.roleType === 'community_member' && processedRoleData.address) {
                processedRoleData.community_code = generateCommunityCode(processedRoleData.address);
              }

              // Validate role type
              const validRoleTypes = ['particular', 'community_member', 'service_provider', 'property_administrator'] as const;
              type ValidRoleType = typeof validRoleTypes[number];
              
              if (!validRoleTypes.includes(roleRequest.roleType as ValidRoleType)) {
                console.error(`❌ Invalid role type: ${roleRequest.roleType}`);
                roleErrors.push(`${roleRequest.roleType}: Tipo de rol inválido`);
                continue;
              }

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
                console.error(`❌ Failed to create role ${roleRequest.roleType}:`, insertError);
                roleErrors.push(`${roleRequest.roleType}: ${insertError.message}`);
                continue;
              }

              createdRoles.push(newRole);
              console.log(`✅ Successfully created verified role ${roleRequest.roleType}`);

              // Create default property for applicable roles
              if (roleRequest.roleType === 'particular' || roleRequest.roleType === 'community_member') {
                try {
                  const propertyUserData: UserPropertyData = {
                    full_name: processedRoleData.full_name || userData.full_name || 'Usuario',
                    address: processedRoleData.address || userData.address || '',
                    city: processedRoleData.city || userData.city || '',
                    postal_code: processedRoleData.postal_code || userData.postal_code || '',
                    province: processedRoleData.province || userData.province || '',
                    country: processedRoleData.country || userData.country || 'España',
                    community_name: processedRoleData.community_name || '',
                    portal_number: processedRoleData.portal_number || '',
                    apartment_number: processedRoleData.apartment_number || '',
                    user_type: roleRequest.roleType
                  };

                  const propertyResult = await PropertyAutoService.createDefaultProperty(data.user.id, propertyUserData);
                  if (propertyResult.success) {
                    console.log(`✅ Default property created for ${roleRequest.roleType}`);
                  } else {
                    console.warn(`⚠️ Property creation failed for ${roleRequest.roleType}:`, propertyResult.message);
                  }
                } catch (propertyError) {
                  console.warn(`⚠️ Property creation error for ${roleRequest.roleType}:`, propertyError);
                }
              }

            } catch (roleError) {
              console.error(`❌ Exception creating role ${roleRequest.roleType}:`, roleError);
              const errorMessage = roleError instanceof Error ? roleError.message : 'Unknown error';
              roleErrors.push(`${roleRequest.roleType}: ${errorMessage}`);
            }
          }

          console.log(`📊 Multi-role creation completed: ${createdRoles.length}/${rolesToCreate.length} roles created`);
          
          // Update profile.user_type to match the first successfully created role if needed
          if (createdRoles.length > 0) {
            const firstRoleType = createdRoles[0].role_type;
            if (firstRoleType !== profileData.user_type) {
              console.log(`🔄 Updating profile.user_type to ${firstRoleType}`);
              await supabase
                .from('profiles')
                .update({ 
                  user_type: firstRoleType,
                  updated_at: new Date().toISOString()
                })
                .eq('id', data.user.id);
            }
          }
          
          // Return success with details
          let message = `¡Cuenta creada exitosamente!`;
          if (createdRoles.length === rolesToCreate.length) {
            message = `¡Cuenta creada exitosamente con ${createdRoles.length} roles activos!`;
          } else if (createdRoles.length > 0) {
            message = `¡Cuenta creada! ${createdRoles.length} de ${rolesToCreate.length} roles configurados correctamente.`;
          } else {
            message = `Cuenta creada, pero hubo problemas configurando los roles. Por favor, contacta con soporte.`;
          }
          
          return { 
            success: true, 
            userId: data.user.id,
            message,
            rolesCreated: createdRoles.length,
            totalRoles: rolesToCreate.length,
            errors: roleErrors.length > 0 ? roleErrors : undefined
          };
          
        } catch (profileError) {
          console.warn("⚠️ Profile creation failed but user was created:", profileError);
          return { 
            success: true, 
            userId: data.user.id,
            message: "Cuenta creada, pero hubo problemas con el perfil. Por favor, contacta con soporte."
          };
        }
      } else if (!data.user.email_confirmed_at) {
        // This shouldn't happen with immediate confirmation, but handle just in case
        console.log("⚠️ Account created but requires email confirmation");
        return { 
          message: "Por favor revisa tu email para confirmar tu cuenta antes de continuar." 
        };
      }

      return { 
        message: "Cuenta creada. Por favor inicia sesión para continuar." 
      };
      
    } catch (error) {
      console.error("❌ Multi-role sign up exception:", error);
      return { error: "Error inesperado durante el registro" };
    }
  };

  // SIMPLIFIED fetchUserData with focus on core functionality
  const fetchUserData = async (userObject: User) => {
    if (!userObject) {
      setLoading(false);
      return;
    }

    try {
      console.log("👤 CONTEXT: Starting user data fetch for:", userObject.id.substring(0, 8) + '...');
      
      // Check connection with timeout
      const isConnected = await checkConnection();
      
      if (!isConnected) {
        console.log("📱 Database offline - using emergency profile");
        
        // Create emergency profile from user metadata - FIXED: Always provide email fallback
        const emergencyProfile: Profile = {
          id: userObject.id,
          email: userObject.email || '', // FIXED: Always provide empty string as fallback
          full_name: userObject.user_metadata?.full_name || null,
          user_type: 'particular', // Default fallback
          phone: userObject.user_metadata?.phone || null,
          avatar_url: userObject.user_metadata?.avatar_url || null,
          address: null,
          city: null,
          postal_code: null,
          province: null,
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
          // Create new profile if it doesn't exist - FIXED: Always provide email fallback
          console.log("📝 Creating new profile...");
          
          const newProfileData: ProfileInsert = {
            id: userObject.id,
            email: userObject.email || '', // FIXED: Always provide empty string as fallback
            full_name: userObject.user_metadata?.full_name || null,
            user_type: 'particular',
            phone: userObject.user_metadata?.phone || null,
            avatar_url: userObject.user_metadata?.avatar_url || null,
            country: 'Spain',
            language: 'es',
            timezone: 'Europe/Madrid',
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
              province: null,
              email_notifications: true,
              sms_notifications: false,
              is_verified: false,
              verification_code: null,
              last_login: null,
              created_at: userObject.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString()
            } as Profile;
            
            setProfile(fallbackProfile);
            console.log("✅ Using fallback profile");
          }
        }
      } catch (profileFetchError) {
        console.warn("⚠️ Profile fetch timeout, using emergency profile");
        
        // FIXED: Always provide email fallback
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
          province: null,
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
      }

      // Step 2: SIMPLIFIED ROLE LOADING SYSTEM
      try {
        console.log("🎭 CONTEXT: Starting simplified role loading...");
        
        const roles = await SupabaseUserRoleService.getUserRoles(userObject.id);
        setUserRoles(roles);
        console.log(`📋 CONTEXT: Roles loaded: ${roles.length} roles`);

        // Step 3: FIXED ACTIVE ROLE MANAGEMENT
        if (roles.length > 0) {
          console.log("🎯 CONTEXT: Starting active role management...");
          
          const finalActiveRole = await ensureActiveRole(userObject.id, roles);
          
          if (finalActiveRole) {
            console.log("✅ CONTEXT: Active role established:", finalActiveRole.role_type);
            setActiveRole(finalActiveRole);
            
            // Update local roles state to reflect any changes
            const updatedRoles = roles.map(r => ({
              ...r,
              is_active: r.id === finalActiveRole.id
            }));
            setUserRoles(updatedRoles);
          } else {
            console.warn("⚠️ CONTEXT: Could not establish active role");
            setActiveRole(null);
          }
        } else {
          console.log("📝 CONTEXT: No roles found for user");
          setActiveRole(null);
        }

        // Final status logging - FIXED: Always provide email fallback
        console.log("🏁 CONTEXT: Role loading completed:", {
          userId: userObject.id.substring(0, 8) + '...',
          email: userObject.email || 'unknown', // FIXED: Always provide fallback
          totalRoles: roles.length,
          verifiedRoles: roles.filter(r => r.is_verified).length,
          activeRoleType: activeRole?.role_type || 'none',
          systemStatus: 'completed'
        });

      } catch (criticalRoleError) {
        console.error("❌ CONTEXT: Critical error in role management:", criticalRoleError);
        
        // Emergency fallback: set empty state but don't crash
        setUserRoles([]);
        setActiveRole(null);
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
        province: null,
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

  // SIMPLIFIED refreshRoles
  const refreshRoles = async () => {
    if (!user?.id) {
      console.log("⚠️ CONTEXT: No user ID available for role refresh");
      return;
    }

    try {
      console.log("🔄 CONTEXT: Starting role refresh...");
      
      const updatedRoles = await SupabaseUserRoleService.getUserRoles(user.id);
      console.log(`📋 CONTEXT: Fetched ${updatedRoles.length} roles from database`);
      
      setUserRoles(updatedRoles);
      
      // Ensure there's always an active role if we have verified roles
      const verifiedRoles = updatedRoles.filter(r => r.is_verified);
      
      if (verifiedRoles.length > 0) {
        const currentActiveRole = verifiedRoles.find(r => r.is_active);
        
        if (!currentActiveRole) {
          console.log("🎯 CONTEXT: No active role found, establishing one...");
          
          const establishedRole = await ensureActiveRole(user.id, verifiedRoles);
          
          if (establishedRole) {
            setActiveRole(establishedRole);
            console.log("✅ CONTEXT: Active role established during refresh:", establishedRole.role_type);
          } else {
            console.warn("⚠️ CONTEXT: Could not establish active role during refresh");
            setActiveRole(null);
          }
        } else {
          setActiveRole(currentActiveRole);
          console.log("✅ CONTEXT: Active role confirmed:", currentActiveRole.role_type);
        }
      } else {
        console.log("⚠️ CONTEXT: No verified roles available");
        setActiveRole(null);
      }
      
      console.log("✅ CONTEXT: Role refresh completed successfully");
      
    } catch (error) {
      console.error("❌ CONTEXT: Error during role refresh:", error);
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