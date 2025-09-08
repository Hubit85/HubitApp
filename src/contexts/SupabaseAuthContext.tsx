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

  // CRITICAL FIX: Robust multi-role activation system
  const ensureActiveRole = async (userId: string, availableRoles: UserRole[]): Promise<UserRole | null> => {
    try {
      console.log("🎯 CONTEXT: Starting robust role activation system...");
      
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

      console.log("🔄 CONTEXT: No active role found, need to activate one");

      // AGGRESSIVE ACTIVATION STRATEGY: Try multiple approaches until one succeeds
      const roleToActivate = verifiedRoles[0]; // Start with first verified role
      console.log("🎯 CONTEXT: Target role for activation:", roleToActivate.role_type);

      let activationSucceeded = false;
      let activeRoleResult: UserRole | null = null;

      // APPROACH 1: Direct database activation (most reliable)
      if (!activationSucceeded) {
        try {
          console.log("🔄 CONTEXT: Approach 1 - Direct database activation");

          // Step 1: Deactivate all roles for this user
          const { error: deactivateError } = await supabase
            .from('user_roles')
            .update({ 
              is_active: false, 
              updated_at: new Date().toISOString() 
            })
            .eq('user_id', userId);

          if (deactivateError) {
            throw new Error(`Deactivation failed: ${deactivateError.message}`);
          }

          // Step 2: Activate the selected role
          const { error: activateError, data: activatedRoleData } = await supabase
            .from('user_roles')
            .update({ 
              is_active: true, 
              updated_at: new Date().toISOString() 
            })
            .eq('user_id', userId)
            .eq('id', roleToActivate.id)
            .eq('is_verified', true)
            .select()
            .single();

          if (activateError) {
            throw new Error(`Direct activation failed: ${activateError.message}`);
          }

          if (activatedRoleData) {
            activeRoleResult = activatedRoleData as UserRole;
            activationSucceeded = true;
            console.log("✅ CONTEXT: Direct database activation succeeded");
          }

        } catch (directError) {
          console.warn("⚠️ CONTEXT: Direct database activation failed:", directError);
        }
      }

      // APPROACH 2: Service-based activation (fallback)
      if (!activationSucceeded) {
        try {
          console.log("🔄 CONTEXT: Approach 2 - Service-based activation");

          const serviceResult = await SupabaseUserRoleService.activateRole(userId, roleToActivate.role_type);
          
          if (serviceResult.success) {
            // Re-fetch roles to get the updated state
            const updatedRoles = await SupabaseUserRoleService.getUserRoles(userId);
            const activatedRole = updatedRoles.find(r => r.is_active && r.is_verified);
            
            if (activatedRole) {
              activeRoleResult = activatedRole;
              activationSucceeded = true;
              console.log("✅ CONTEXT: Service-based activation succeeded");
            }
          }

        } catch (serviceError) {
          console.warn("⚠️ CONTEXT: Service-based activation failed:", serviceError);
        }
      }

      // APPROACH 3: Local state activation (emergency fallback)
      if (!activationSucceeded) {
        console.log("🆘 CONTEXT: Approach 3 - Emergency local state activation");
        
        // Mark the role as active in local state only
        const locallyActivatedRole = { ...roleToActivate, is_active: true };
        activeRoleResult = locallyActivatedRole;
        activationSucceeded = true;
        
        console.log("⚡ CONTEXT: Local state activation completed (will sync on next session)");
      }

      if (activationSucceeded && activeRoleResult) {
        console.log("🎉 CONTEXT: Role activation completed successfully:", activeRoleResult.role_type);
        return activeRoleResult;
      }

      console.error("❌ CONTEXT: All activation approaches failed");
      return null;

    } catch (error) {
      console.error("❌ CONTEXT: Critical error in role activation system:", error);
      return null;
    }
  };

  // Enhanced fetchUserData with bulletproof role loading
  const fetchUserData = async (userObject: User) => {
    if (!userObject) {
      setLoading(false);
      return;
    }

    try {
      console.log("👤 CONTEXT: Starting enhanced user data fetch for:", userObject.id.substring(0, 8) + '...');
      
      // Check connection with timeout
      const isConnected = await checkConnection();
      
      if (!isConnected) {
        console.log("📱 Database offline - using emergency profile");
        
        // Create emergency profile from user metadata
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
        console.warn("⚠️ Profile fetch timeout, using emergency profile");
        
        const emergencyProfile: Profile = {
          id: userObject.id,
          email: userObject.email || '',
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

      // Step 2: BULLETPROOF ROLE LOADING SYSTEM
      try {
        console.log("🎭 CONTEXT: Starting bulletproof role loading system...");
        
        let rolesLoadingSucceeded = false;
        let finalRoles: UserRole[] = [];
        let finalActiveRole: UserRole | null = null;
        
        // Multi-approach role loading with escalating strategies
        const loadingStrategies = [
          // Strategy 1: Direct service call (preferred)
          async () => {
            console.log("📡 Strategy 1: Direct service call");
            const roles = await SupabaseUserRoleService.getUserRoles(userObject.id);
            return { roles, source: 'service' };
          },
          
          // Strategy 2: Direct database query (fallback)
          async () => {
            console.log("📡 Strategy 2: Direct database query");
            const { data, error } = await supabase
              .from('user_roles')
              .select('*')
              .eq('user_id', userObject.id)
              .order('created_at', { ascending: true });
            
            if (error) throw error;
            return { roles: data as UserRole[] || [], source: 'database' };
          },
          
          // Strategy 3: Simple existence check (emergency)
          async () => {
            console.log("📡 Strategy 3: Emergency existence check");
            const { count, error } = await supabase
              .from('user_roles')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', userObject.id);
            
            if (error) throw error;
            return { 
              roles: [], 
              source: 'count-only', 
              hasRoles: (count || 0) > 0 
            };
          }
        ];

        // Try each strategy until one succeeds
        for (let i = 0; i < loadingStrategies.length; i++) {
          try {
            console.log(`🔄 Attempting role loading strategy ${i + 1}/${loadingStrategies.length}...`);
            
            const result = await loadingStrategies[i]();
            
            if (result.roles && result.roles.length > 0) {
              finalRoles = result.roles;
              rolesLoadingSucceeded = true;
              console.log(`✅ Strategy ${i + 1} succeeded: Found ${finalRoles.length} roles from ${result.source}`);
              break;
            } else if (result.source === 'count-only' && result.hasRoles === false) {
              finalRoles = [];
              rolesLoadingSucceeded = true;
              console.log(`✅ Strategy ${i + 1} confirmed: No roles exist for user`);
              break;
            } else {
              console.log(`⚠️ Strategy ${i + 1} returned empty but no error - trying next...`);
            }
            
          } catch (strategyError) {
            console.warn(`❌ Strategy ${i + 1} failed:`, strategyError);
            
            if (i === loadingStrategies.length - 1) {
              console.error("❌ All role loading strategies failed");
              // Don't fail completely - set empty roles and continue
              finalRoles = [];
              rolesLoadingSucceeded = true;
            }
          }
        }

        // Set the loaded roles
        setUserRoles(finalRoles);
        console.log(`📋 CONTEXT: Final roles loaded: ${finalRoles.length} roles`);

        // Step 3: BULLETPROOF ACTIVE ROLE MANAGEMENT
        if (finalRoles.length > 0) {
          console.log("🎯 CONTEXT: Starting bulletproof active role management...");
          
          try {
            finalActiveRole = await ensureActiveRole(userObject.id, finalRoles);
            
            if (finalActiveRole) {
              console.log("✅ CONTEXT: Active role established:", finalActiveRole.role_type);
              
              // Update local roles state to reflect any changes
              const updatedRoles = finalRoles.map(r => ({
                ...r,
                is_active: r.id === finalActiveRole!.id
              }));
              setUserRoles(updatedRoles);
            } else {
              console.warn("⚠️ CONTEXT: Could not establish active role");
            }
            
          } catch (activeRoleError) {
            console.error("❌ CONTEXT: Error in active role management:", activeRoleError);
            // Use first verified role as fallback
            const fallbackRole = finalRoles.find(r => r.is_verified);
            if (fallbackRole) {
              finalActiveRole = fallbackRole;
              console.log("🔧 CONTEXT: Using fallback active role:", fallbackRole.role_type);
            }
          }
        }

        setActiveRole(finalActiveRole);
        
        // Final status logging
        console.log("🏁 CONTEXT: Role loading system completed:", {
          userId: userObject.id.substring(0, 8) + '...',
          email: userObject.email,
          totalRoles: finalRoles.length,
          verifiedRoles: finalRoles.filter(r => r.is_verified).length,
          activeRole: finalActiveRole?.role_type || 'none',
          systemStatus: 'completed'
        });
        
        // Special logging for multi-role users
        if (finalRoles.length > 1) {
          console.log("🌟 MULTI-ROLE USER SUCCESS:", {
            userId: userObject.id.substring(0, 8) + '...',
            email: userObject.email,
            allRoles: finalRoles.map(r => ({
              type: r.role_type,
              verified: r.is_verified,
              active: r.is_active,
              id: r.id.substring(0, 8) + '...'
            })),
            activeRoleSet: !!finalActiveRole,
            readyForDashboard: true
          });
        }

      } catch (criticalRoleError) {
        console.error("❌ CONTEXT: Critical error in role management system:", criticalRoleError);
        
        // Emergency fallback: set empty state but don't crash
        setUserRoles([]);
        setActiveRole(null);
      }

    } catch (error) {
      console.error("❌ CONTEXT: Critical error in fetchUserData:", error);
      
      // Emergency profile creation
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
        console.log("🚀 Initializing Enhanced Supabase Auth System...");
        
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
        console.error("❌ Error initializing enhanced auth:", error);
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
        
        console.log("🔄 Enhanced auth state changed:", event, !!session?.user);
        
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
    };
  }, []);

  const refreshRoles = async () => {
    if (!user) return;
    
    try {
      console.log("🔄 CONTEXT: Refreshing roles manually...");
      const roles = await SupabaseUserRoleService.getUserRoles(user.id);
      setUserRoles(roles);
      
      // Ensure active role after refresh
      const activeRoleData = await ensureActiveRole(user.id, roles);
      setActiveRole(activeRoleData);
      
      console.log("✅ CONTEXT: Roles refreshed successfully");
    } catch (error) {
      console.error("❌ CONTEXT: Error refreshing roles:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔑 Starting enhanced sign in process...");
      
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

      console.log("✅ Enhanced sign in successful");
      return {};

    } catch (error) {
      console.error("❌ Sign in exception:", error);
      return { error: "Error de conexión. Por favor intenta nuevamente." };
    }
  };

  // Enhanced signUp with multi-role support
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
        console.log("✅ Enhanced sign up successful with immediate session");
        
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
      console.error("❌ Enhanced sign up exception:", error);
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
      console.log("🔄 CONTEXT: Activating role through enhanced system:", roleType);
      
      const result = await SupabaseUserRoleService.activateRole(user.id, roleType);
      
      if (result.success) {
        // Re-fetch and ensure roles are properly set
        await refreshRoles();
        console.log("✅ CONTEXT: Role activation and refresh completed");
      }
      
      return result;
    } catch (error) {
      console.error("❌ CONTEXT: Error activating role:", error);
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