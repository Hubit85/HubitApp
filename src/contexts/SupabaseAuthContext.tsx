import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile, ProfileInsert } from "@/integrations/supabase/types";
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
  signUp: (email: string, password: string, userData: Omit<ProfileInsert, 'id' | 'email'>) => Promise<{ error?: string; message?: string; success?: boolean }>;
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
      // Use a simple query that doesn't depend on RLS
      const { error } = await supabase
        .from("profiles")
        .select("id")
        .limit(0);
      
      const connected = !error || error.code === 'PGRST116'; // PGRST116 is "no rows found" which is fine
      setIsConnected(connected);
      return connected;
    } catch (error) {
      console.log("📡 Connection check failed:", error);
      setIsConnected(false);
      return false;
    }
  };

  // Debounced role refresh to prevent rapid consecutive calls
  let roleRefreshTimeout: NodeJS.Timeout | null = null;
  const debouncedRoleRefresh = async (userId: string) => {
    if (roleRefreshTimeout) {
      clearTimeout(roleRefreshTimeout);
    }
    
    roleRefreshTimeout = setTimeout(async () => {
      try {
        console.log("🎭 CONTEXT: Loading user roles for", userId.substring(0, 8) + '...');
        
        // CRITICAL FIX: Direct service call with better error handling
        const roles = await SupabaseUserRoleService.getUserRoles(userId);
        
        console.log("🎭 CONTEXT: Roles loaded successfully:", {
          userId: userId.substring(0, 8) + '...',
          rolesCount: roles.length,
          roles: roles.map(r => ({
            role_type: r.role_type,
            is_verified: r.is_verified,
            is_active: r.is_active
          }))
        });
        
        setUserRoles(roles);
        
        // Find active role or set the first verified role as active
        let activeRoleData = roles.find(r => r.is_active);
        if (!activeRoleData && roles.length > 0) {
          // If no active role but we have verified roles, activate the first one
          const verifiedRoles = roles.filter(r => r.is_verified);
          if (verifiedRoles.length > 0) {
            console.log("🎭 CONTEXT: No active role found, activating first verified role:", verifiedRoles[0].role_type);
            
            // Try to activate the first verified role
            try {
              const activateResult = await SupabaseUserRoleService.activateRole(userId, verifiedRoles[0].role_type);
              if (activateResult.success) {
                // Reload roles to get updated state
                const updatedRoles = await SupabaseUserRoleService.getUserRoles(userId);
                setUserRoles(updatedRoles);
                activeRoleData = updatedRoles.find(r => r.is_active);
                console.log("🎭 CONTEXT: First verified role activated successfully");
              }
            } catch (activateError) {
              console.warn("🎭 CONTEXT: Could not auto-activate first verified role:", activateError);
              activeRoleData = verifiedRoles[0]; // Use first verified role without activation
            }
          }
        }
        
        setActiveRole(activeRoleData || null);
        
        console.log("✅ CONTEXT: User roles loaded and synced successfully");
        
      } catch (rolesError) {
        console.error("❌ CONTEXT: Error loading roles:", rolesError);
        
        // Set empty state but don't completely fail
        setUserRoles([]);
        setActiveRole(null);
        
        // For specific debugging user, provide more info
        if (userId === 'f9192183-4d0f-43f4-98e0-37b1ae77cadc') { // ddayanacastro10@gmail.com
          console.error("🚨 CONTEXT: Critical error for target user ddayanacastro10@gmail.com:", {
            userId,
            error: rolesError instanceof Error ? rolesError.message : String(rolesError),
            stack: rolesError instanceof Error ? rolesError.stack : 'No stack trace'
          });
        }
      }
    }, 300); // Reduced debounce time for faster response
  };

  // Mejorar la función fetchUserData para manejar correctamente múltiples roles
  const fetchUserData = async (userObject: User) => {
    if (!userObject) {
      setLoading(false);
      return;
    }

    try {
      console.log("👤 Fetching user data for:", userObject.id);
      
      // Check connection with timeout
      const isConnected = await checkConnection();
      
      if (!isConnected) {
        console.log("📱 Database offline - using user metadata");
        
        // Create profile from user metadata
        const tempProfile: Profile = {
          id: userObject.id,
          email: userObject.email || '',
          full_name: userObject.user_metadata?.full_name || null,
          user_type: 'particular', // Default fallback - will be overridden by role system
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
        
        setProfile(tempProfile);
        setUserRoles([]);
        setActiveRole(null);
        setLoading(false);
        return;
      }

      // Try to fetch profile from database with timeout
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
          console.log("✅ Profile loaded from database");
        } else {
          // Create new profile if it doesn't exist
          console.log("📝 Creating new profile...");
          
          const newProfileData: ProfileInsert = {
            id: userObject.id,
            email: userObject.email || '',
            full_name: userObject.user_metadata?.full_name || null,
            user_type: 'particular', // Default - will be managed by role system
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
            
            // Use fallback profile instead of failing
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
        console.warn("⚠️ Profile fetch timeout or error:", profileFetchError);
        
        // Use emergency profile from metadata
        const emergencyProfile: Profile = {
          id: userObject.id,
          email: userObject.email || '',
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
        console.log("✅ Using emergency profile due to fetch timeout");
      }

      // CRITICAL: Load and manage user roles properly
      try {
        console.log("🎭 CONTEXT: Starting comprehensive role loading...");
        
        // Give a small delay to ensure profile is set
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let rolesLoaded = false;
        let roles: UserRole[] = [];
        let attempts = 0;
        const maxAttempts = 5;
        
        // Special handling for debugging
        if (userObject.email === 'ddayanacastro10@gmail.com' || userObject.email === 'dvillaher@hotmail.com') {
          console.log(`🎯 SPECIAL HANDLING for ${userObject.email}`);
        }
        
        while (!rolesLoaded && attempts < maxAttempts) {
          try {
            attempts++;
            console.log(`🔄 CONTEXT: Role loading attempt ${attempts}/${maxAttempts} for user ${userObject.id.substring(0, 8)}...`);
            
            if (attempts > 1) {
              const delay = Math.min(1000 * attempts, 3000);
              console.log(`⏳ CONTEXT: Waiting ${delay}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
            
            // Direct database query for roles
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
              console.warn(`❌ CONTEXT: Direct database query error (attempt ${attempts}):`, rolesError);
              
              if (rolesError.code === 'PGRST116') {
                console.log('✅ CONTEXT: No roles found - empty result confirmed');
                roles = [];
                rolesLoaded = true;
              } else if (attempts >= maxAttempts) {
                console.error('❌ CONTEXT: All role loading attempts exhausted');
                roles = [];
                rolesLoaded = true;
              } else {
                continue;
              }
            } else {
              roles = (rolesData || []) as UserRole[];
              rolesLoaded = true;
              
              console.log(`✅ CONTEXT: Successfully loaded ${roles.length} roles on attempt ${attempts}:`, {
                userId: userObject.id.substring(0, 8) + '...',
                userEmail: userObject.email,
                roles: roles.map(r => ({
                  role_type: r.role_type,
                  is_verified: r.is_verified,
                  is_active: r.is_active,
                  created: r.created_at?.substring(0, 10)
                }))
              });
            }
          } catch (attemptError) {
            console.error(`❌ CONTEXT: Role loading attempt ${attempts} failed:`, attemptError);
            
            if (attempts >= maxAttempts) {
              console.error('❌ CONTEXT: All role loading attempts failed with errors');
              roles = [];
              rolesLoaded = true;
            }
          }
        }
        
        // CRITICAL: Set roles and manage active role properly
        setUserRoles(roles);
        console.log(`📋 CONTEXT: Set ${roles.length} roles in context state`);
        
        // IMPROVED: Active role management for multiple roles
        let activeRoleData: UserRole | null = null;
        
        if (roles.length > 0) {
          // First, look for any role marked as active
          const currentActiveRole = roles.find(r => r.is_active && r.is_verified);
          
          if (currentActiveRole) {
            // We have an active role, use it
            activeRoleData = currentActiveRole;
            console.log("✅ CONTEXT: Found existing active role:", activeRoleData.role_type);
          } else {
            // No active role found - need to activate one
            const verifiedRoles = roles.filter(r => r.is_verified);
            
            if (verifiedRoles.length > 0) {
              console.log(`🎭 CONTEXT: No active role found among ${verifiedRoles.length} verified roles, activating first one...`);
              
              // CRITICAL FIX: Use a more robust role activation strategy
              const roleToActivate = verifiedRoles[0]; // Take the first verified role
              console.log("🎯 CONTEXT: Attempting to activate role:", roleToActivate.role_type);
              
              let activationSucceeded = false;
              let activationAttempts = 0;
              const maxActivationAttempts = 3;
              
              while (!activationSucceeded && activationAttempts < maxActivationAttempts) {
                try {
                  activationAttempts++;
                  console.log(`🔄 CONTEXT: Role activation attempt ${activationAttempts}/${maxActivationAttempts} for ${roleToActivate.role_type}`);
                  
                  // First deactivate all roles
                  const { error: deactivateError } = await supabase
                    .from('user_roles')
                    .update({ 
                      is_active: false, 
                      updated_at: new Date().toISOString() 
                    })
                    .eq('user_id', userObject.id);

                  if (deactivateError) {
                    throw new Error(`Deactivation failed: ${deactivateError.message}`);
                  }

                  // Then activate the selected role
                  const { error: activateError, data: activatedRoleData } = await supabase
                    .from('user_roles')
                    .update({ 
                      is_active: true, 
                      updated_at: new Date().toISOString() 
                    })
                    .eq('user_id', userObject.id)
                    .eq('role_type', roleToActivate.role_type)
                    .eq('is_verified', true)
                    .select()
                    .single();

                  if (activateError) {
                    throw new Error(`Activation failed: ${activateError.message}`);
                  }

                  // Update local state to reflect the change
                  const updatedRoles = roles.map(r => ({
                    ...r,
                    is_active: r.id === roleToActivate.id
                  }));
                  
                  setUserRoles(updatedRoles);
                  activeRoleData = updatedRoles.find(r => r.is_active) || activatedRoleData;
                  activationSucceeded = true;
                  
                  console.log("✅ CONTEXT: Role activated successfully:", activeRoleData.role_type);
                  
                } catch (activateError) {
                  console.warn(`⚠️ CONTEXT: Role activation attempt ${activationAttempts} failed:`, activateError);
                  
                  if (activationAttempts < maxActivationAttempts) {
                    // Wait before retry with exponential backoff
                    const waitTime = Math.min(1000 * Math.pow(2, activationAttempts - 1), 3000);
                    console.log(`⏳ CONTEXT: Waiting ${waitTime}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                  }
                }
              }
              
              // If activation failed after all attempts, use the role without DB activation
              if (!activationSucceeded) {
                console.warn("⚠️ CONTEXT: All role activation attempts failed, using role locally:", roleToActivate.role_type);
                activeRoleData = roleToActivate;
                
                // Update local state to show this role as active (UI-only)
                const updatedRoles = roles.map(r => ({
                  ...r,
                  is_active: r.id === roleToActivate.id
                }));
                setUserRoles(updatedRoles);
                
                console.log("🔧 CONTEXT: Using role locally without DB activation - user can switch roles manually from dashboard");
              }
            }
          }
        }
        
        setActiveRole(activeRoleData);
        console.log("🎯 CONTEXT: Final active role set:", activeRoleData?.role_type || 'none');
        
        // Special debugging for multi-role users
        if (roles.length > 1) {
          console.log("🔍 MULTI-ROLE USER FINAL STATE:", {
            userId: userObject.id.substring(0, 8) + '...',
            userEmail: userObject.email,
            totalRoles: roles.length,
            verifiedRoles: roles.filter(r => r.is_verified).length,
            activeRole: activeRoleData?.role_type || 'none',
            allRoles: roles.map(r => ({
              type: r.role_type,
              verified: r.is_verified,
              active: r.is_active,
              id: r.id.substring(0, 8) + '...'
            }))
          });
          
          // If user has multiple verified roles but no active role, this is a critical issue
          if (roles.filter(r => r.is_verified).length > 1 && !activeRoleData) {
            console.error("🚨 CRITICAL: Multi-role user with no active role - this should not happen!");
            
            // Emergency fallback: manually set the first verified role as active in local state only
            const firstVerified = roles.find(r => r.is_verified);
            if (firstVerified) {
              console.log("🆘 CONTEXT: Emergency fallback - using first verified role locally:", firstVerified.role_type);
              
              const emergencyUpdatedRoles = roles.map(r => ({
                ...r,
                is_active: r.id === firstVerified.id
              }));
              
              setUserRoles(emergencyUpdatedRoles);
              setActiveRole(firstVerified);
              
              console.log("⚡ CONTEXT: Emergency active role set:", firstVerified.role_type);
            }
          }
        }
        
      } catch (roleLoadError) {
        console.error("❌ CONTEXT: Critical role loading error:", roleLoadError);
        setUserRoles([]);
        setActiveRole(null);
      }

    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      
      // Create emergency fallback profile
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

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("🚀 Initializing Supabase Auth...");
        
        // Check connection first
        await checkConnection();
        
        // Get current session with timeout
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error("❌ Error getting session:", error);
          setLoading(false);
          return;
        }

        console.log("📱 Session status:", !!session);
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserData(session.user);
        } else {
          setLoading(false);
        }
        
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
        if (mounted) {
          setLoading(false);
          setIsConnected(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes with improved error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log("🔄 Auth state changed:", event, !!session?.user);
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserData(session.user);
        } else {
          setProfile(null);
          setUserRoles([]);
          setActiveRole(null);
          setLoading(false);
        }
      }
    );

    // Periodic connection check every 30 seconds
    const connectionCheckInterval = setInterval(async () => {
      if (mounted && user) {
        await checkConnection();
      }
    }, 30000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearInterval(connectionCheckInterval);
      if (roleRefreshTimeout) {
        clearTimeout(roleRefreshTimeout);
      }
    };
  }, []);

  const refreshRoles = async () => {
    if (!user) return;
    
    try {
      const roles = await SupabaseUserRoleService.getUserRoles(user.id);
      setUserRoles(roles);
      
      const activeRoleData = roles.find(r => r.is_active) || null;
      setActiveRole(activeRoleData);
    } catch (error) {
      console.error("Error refreshing roles:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔑 Starting sign in process...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Sign in error:", error.message);
        
        // Provide user-friendly error messages
        let userMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          userMessage = "Credenciales incorrectas. Verifica tu email y contraseña.";
        } else if (error.message.includes('Email not confirmed')) {
          userMessage = "Por favor confirma tu email antes de iniciar sesión.";
        } else if (error.message.includes('Too many requests')) {
          userMessage = "Demasiados intentos. Espera unos minutos antes de intentar de nuevo.";
        }
        
        return { error: userMessage };
      }

      console.log("✅ Sign in successful");
      return {};

    } catch (error) {
      console.error("❌ Sign in exception:", error);
      return { error: "Error de conexión. Por favor intenta nuevamente." };
    }
  };

  // En la función signUp, mejorar la creación de roles múltiples y propiedades automáticas
  const signUp = async (email: string, password: string, userData: Omit<ProfileInsert, 'id' | 'email'>) => {
    try {
      console.log("📝 Starting enhanced sign up process...");
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
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

      // Check if immediate session or needs confirmation
      if (!data.session && !data.user.email_confirmed_at) {
        return { 
          message: "Por favor revisa tu email para confirmar tu cuenta antes de continuar." 
        };
      }

      if (data.session) {
        console.log("✅ Sign up successful with immediate session");
        
        // Try to create profile
        try {
          const profileData: ProfileInsert = {
            id: data.user.id,
            email: data.user.email!,
            ...userData,
          };

          await supabase.from("profiles").insert(profileData);
          
          // Create the primary role with enhanced role-specific data
          const roleSpecificData: any = {};
          
          if (userData.user_type === 'particular' || userData.user_type === 'community_member') {
            roleSpecificData.full_name = userData.full_name;
            roleSpecificData.phone = userData.phone;
            roleSpecificData.address = userData.address;
            roleSpecificData.postal_code = userData.postal_code;
            roleSpecificData.city = userData.city;
            roleSpecificData.province = userData.province;
            roleSpecificData.country = userData.country;
            
            // Additional fields for community members
            if (userData.user_type === 'community_member') {
              roleSpecificData.community_name = (userData as any).community_name || '';
              roleSpecificData.portal_number = (userData as any).portal_number || '';
              roleSpecificData.apartment_number = (userData as any).apartment_number || '';
              
              // Generate community code if not provided
              if (!roleSpecificData.community_name && userData.address) {
                roleSpecificData.community_code = generateCommunityCode(userData.address);
              }
            }
          }
          
          // CRITICAL FIX: Ensure user_type is defined and valid before creating role
          const validUserType = userData.user_type;
          if (!validUserType || !['particular', 'community_member', 'service_provider', 'property_administrator'].includes(validUserType)) {
            console.error('❌ Invalid user_type for role creation:', validUserType);
            return { error: "Tipo de usuario inválido para crear el rol" };
          }
          
          await supabase.from('user_roles').insert({
            user_id: data.user.id,
            role_type: validUserType,
            is_active: true,
            is_verified: true,
            verification_confirmed_at: new Date().toISOString(),
            role_specific_data: roleSpecificData
          });
          
          console.log("✅ Profile and primary role created with enhanced data");

          // Create default property for roles that need it
          if (userData.user_type === 'particular' || userData.user_type === 'community_member') {
            console.log("🏠 Creating default property for user with role:", userData.user_type);
            
            const propertyUserData: UserPropertyData = {
              full_name: userData.full_name || 'Usuario',
              address: userData.address || '',
              city: userData.city || '',
              postal_code: userData.postal_code || '',
              province: userData.province || '',
              country: userData.country || 'España',
              community_name: (userData as any).community_name || '',
              portal_number: (userData as any).portal_number || '',
              apartment_number: (userData as any).apartment_number || '',
              user_type: userData.user_type
            };

            try {
              const propertyResult = await PropertyAutoService.createDefaultProperty(data.user.id, propertyUserData);
              if (propertyResult.success) {
                console.log("✅ Default property created successfully:", propertyResult.message);
              } else {
                console.warn("⚠️ Property creation failed:", propertyResult.message);
                // No fallar completamente el registro por esto
              }
            } catch (propertyError) {
              console.warn("⚠️ Property creation error (non-critical):", propertyError);
              // No fallar el registro por errores de propiedad
            }
          }
          
        } catch (profileError) {
          console.warn("⚠️ Profile creation failed but user was created:", profileError);
        }

        return { success: true, userId: data.user.id };
      }

      return { 
        message: "Cuenta creada. Por favor revisa tu email para confirmar antes de iniciar sesión." 
      };
      
    } catch (error) {
      console.error("❌ Sign up exception:", error);
      return { error: "Error inesperado durante el registro" };
    }
  };

  // Helper function to generate community code
  const generateCommunityCode = (address: string): string => {
    const hash = address.toLowerCase().replace(/\s+/g, '').slice(0, 10);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `COM-${hash}-${randomNum}`.toUpperCase();
  };

  const signOut = async () => {
    try {
      console.log("🚪 Starting comprehensive sign out process...");
      
      // STEP 1: Clear ALL auth state IMMEDIATELY and AGGRESSIVELY
      setUser(null);
      setProfile(null);
      setSession(null);
      setUserRoles([]);
      setActiveRole(null);
      setLoading(true);
      
      // STEP 2: Force clear all browser storage IMMEDIATELY
      if (typeof window !== 'undefined') {
        try {
          console.log("🧹 Clearing ALL browser storage comprehensively...");
          
          // Clear localStorage completely
          const localStorageKeys = Object.keys(localStorage);
          console.log(`Found ${localStorageKeys.length} localStorage keys to clear`);
          localStorageKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log(`🗑️ Cleared localStorage key: ${key}`);
          });
          
          // Clear sessionStorage completely
          const sessionStorageKeys = Object.keys(sessionStorage);
          sessionStorageKeys.forEach(key => {
            sessionStorage.removeItem(key);
            console.log(`🗑️ Cleared sessionStorage key: ${key}`);
          });
          
          // Force clear any potential IndexedDB Supabase data
          try {
            const indexedDBKeys = await indexedDB.databases();
            indexedDBKeys.forEach(db => {
              if (db.name && db.name.includes('supabase')) {
                indexedDB.deleteDatabase(db.name);
                console.log(`🗑️ Deleted IndexedDB: ${db.name}`);
              }
            });
          } catch (idbError) {
            console.warn("IndexedDB clear warning:", idbError);
          }
          
          console.log("✅ All browser storage cleared completely");
        } catch (storageError) {
          console.error("❌ Error clearing storage:", storageError);
        }
      }
      
      // STEP 3: Call Supabase sign out with timeout
      const supabaseSignOut = async () => {
        try {
          const { error } = await supabase.auth.signOut({ scope: 'global' });
          if (error) throw error;
          console.log("✅ Supabase global sign out successful");
        } catch (supabaseError) {
          console.warn("⚠️ Supabase sign out error:", supabaseError);
        }
      };
      
      // Execute with timeout
      try {
        await Promise.race([
          supabaseSignOut(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
        ]);
      } catch (timeoutError) {
        console.warn("⚠️ Supabase sign out timed out, proceeding anyway");
      }
      
      // STEP 4: Multiple cleanup passes to ensure nothing survives
      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Force state clearing again
        setUser(null);
        setProfile(null);
        setSession(null);
        setUserRoles([]);
        setActiveRole(null);
        
        // Clear storage again
        if (typeof window !== 'undefined') {
          try {
            Object.keys(localStorage).forEach(key => {
              if (key.includes('supabase') || key.includes('sb-') || key.includes('auth')) {
                localStorage.removeItem(key);
              }
            });
            Object.keys(sessionStorage).forEach(key => {
              if (key.includes('supabase') || key.includes('sb-') || key.includes('auth')) {
                sessionStorage.removeItem(key);
              }
            });
          } catch (e) {
            console.warn(`Cleanup pass ${i + 1} error:`, e);
          }
        }
      }
      
      // STEP 5: Final state reset
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log("✅ Complete comprehensive sign out process finished");
      
    } catch (error) {
      console.error("❌ Sign out exception:", error);
      
      // EMERGENCY STATE CLEARING - Even if there's an error, ensure local state is cleared
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
      const result = await SupabaseUserRoleService.activateRole(user.id, roleType);
      
      if (result.success) {
        // Use debounced refresh to prevent rapid calls
        await debouncedRoleRefresh(user.id);
      }
      
      return result;
    } catch (error) {
      console.error("❌ Error activating role:", error);
      return { success: false, message: "Error al activar el rol" };
    }
  };

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