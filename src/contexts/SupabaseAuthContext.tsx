
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile, ProfileInsert } from "@/integrations/supabase/types";
import { SupabaseUserRoleService, UserRole } from "@/services/SupabaseUserRoleService";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  userRoles: UserRole[];
  activeRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData: Omit<ProfileInsert, 'id' | 'email'>) => Promise<{ error?: string; message?: string; success?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>;
  activateRole: (roleType: UserRole['role_type']) => Promise<{ success: boolean; message: string }>;
  refreshRoles: () => Promise<void>;
  databaseConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [databaseConnected, setDatabaseConnected] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error("Error getting session:", error);
        setLoading(false);
        return;
      }

      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        fetchUserData(session.user.id, session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log("Auth state change:", event, !!session);
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserData(session.user.id, session.user);
        } else {
          setProfile(null);
          setUserRoles([]);
          setActiveRole(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkDatabaseConnection = async (retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔗 Database connection attempt ${attempt}/${retries}`);
        
        // Intentar una consulta simple que no requiere autenticación
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos timeout
        
        const { data, error } = await supabase
          .from("service_categories")
          .select("id")
          .limit(1)
          .abortSignal(controller.signal);

        clearTimeout(timeoutId);

        if (!error && data !== null) {
          console.log("✅ Database connection successful");
          setDatabaseConnected(true);
          return true;
        }
        
        if (error) {
          console.warn(`⚠️ Database connection attempt ${attempt} failed:`, error.message);
          
          // Si es un error de red, puede ser temporal
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            console.log(`🔄 Network error detected, will retry...`);
          } else if (error.message.includes('PGRST116')) {
            console.warn("📋 Table 'service_categories' doesn't exist - database needs setup");
            setDatabaseConnected(false);
            return false;
          }
        }
        
      } catch (error) {
        console.warn(`🔄 Connection attempt ${attempt} exception:`, error);
        
        // Manejar timeout específicamente
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn(`⏱️ Connection attempt ${attempt} timed out`);
        }
        
        // Si es el último intento, marcar como desconectado
        if (attempt === retries) {
          console.warn("⚠️ Database connection failed after all retries");
          setDatabaseConnected(false);
          return false;
        }
        
        // Esperar antes del siguiente intento (backoff exponencial)
        const delayMs = Math.min(Math.pow(2, attempt) * 1000, 5000); // Max 5 segundos
        console.log(`⏸️ Waiting ${delayMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    setDatabaseConnected(false);
    return false;
  };

  const fetchUserData = async (userId: string, userObject: User, retries = 2) => {
    try {
      console.log("🔄 Fetching user data with enhanced error handling...");
      
      // Verificar conectividad de base de datos con timeout más corto
      const isConnected = await checkDatabaseConnection(2);
      
      if (!isConnected) {
        console.log("📱 Database offline - creating temporary profile");
        // Crear perfil temporal desde datos del usuario
        const tempProfile: Profile = {
          id: userId,
          email: userObject.email || '',
          full_name: userObject.user_metadata?.full_name || null,
          user_type: (userObject.user_metadata?.user_type as Profile['user_type']) || 'particular',
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
        setProfile(tempProfile);
        setUserRoles([]);
        setActiveRole(null);
        setLoading(false);
        return;
      }

      // Aguardar un momento para que la sesión de auth se establezca completamente
      await new Promise(resolve => setTimeout(resolve, 300));

      // Obtener perfil con lógica de reintentos mejorada
      let profileData: Profile | null = null;
      
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`🔍 Profile fetch attempt ${attempt}/${retries} for user ID: ${userId}`);
          
          // Crear timeout controller para cada intento
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 7000); // 7 segundos timeout
          
          const { data: profilesData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .abortSignal(controller.signal)
            .single();

          clearTimeout(timeoutId);

          if (!profileError && profilesData) {
            profileData = profilesData;
            console.log("✅ Profile found and loaded successfully");
            break;
          }
          
          if (profileError) {
            console.warn(`Profile fetch attempt ${attempt} failed:`, profileError.message);
            
            // Errores que no vale la pena reintentar
            if (profileError.message.includes('JWT') || 
                profileError.message.includes('Invalid API key') ||
                profileError.message.includes('invalid_api_key')) {
              console.error("🔑 Authentication error detected, stopping profile fetch");
              break;
            }
            
            // Para errores de red, continuar reintentando
            if (attempt < retries && 
                (profileError.message.includes('Failed to fetch') || 
                 profileError.message.includes('NetworkError'))) {
              console.log(`🔄 Network error, will retry in ${attempt * 1000}ms...`);
              await new Promise(resolve => setTimeout(resolve, attempt * 1000));
              continue;
            }
            
            if (attempt === retries) {
              console.error("All profile fetch attempts failed, will create new profile");
            }
          }
          
        } catch (fetchException) {
          console.warn(`Profile fetch attempt ${attempt} exception:`, fetchException);
          
          // Manejar timeout específicamente
          if (fetchException instanceof Error && fetchException.name === 'AbortError') {
            console.warn(`⏱️ Profile fetch attempt ${attempt} timed out`);
          }
          
          if (attempt < retries) {
            console.log(`🔄 Exception occurred, will retry in ${attempt * 1000}ms...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          } else {
            console.error("All profile fetch attempts failed with exceptions");
          }
        }
      }

      if (!profileData) {
        // El perfil no existe, crear uno desde metadatos del usuario
        console.log("📝 No profile found, creating from user metadata");
        
        const newProfileData: ProfileInsert = {
          id: userId,
          email: userObject.email || '',
          full_name: userObject.user_metadata?.full_name || null,
          user_type: (userObject.user_metadata?.user_type as Profile['user_type']) || 'particular',
          phone: userObject.user_metadata?.phone || null,
          avatar_url: userObject.user_metadata?.avatar_url || null,
          country: 'Spain',
          language: 'es',
          timezone: 'Europe/Madrid',
        };

        try {
          // Intentar crear el perfil con timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);

          const { data: createdProfile, error: createError } = await supabase
            .from("profiles")
            .insert(newProfileData)
            .select()
            .abortSignal(controller.signal)
            .single();

          clearTimeout(timeoutId);

          if (createError) {
            console.error("Profile creation failed:", createError);
            // Crear perfil temporal como fallback
            profileData = {
              ...newProfileData,
              address: null,
              city: null,
              postal_code: null,
              email_notifications: true,
              sms_notifications: false,
              is_verified: false,
              verification_code: null,
              last_login: null,
              created_at: userObject.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString()
            } as Profile;
          } else {
            profileData = createdProfile;
            console.log("✅ Profile created successfully");
          }
        } catch (createException) {
          console.error("Profile creation exception:", createException);
          // Crear perfil temporal como último recurso
          profileData = {
            ...newProfileData,
            address: null,
            city: null,
            postal_code: null,
            email_notifications: true,
            sms_notifications: false,
            is_verified: false,
            verification_code: null,
            last_login: null,
            created_at: userObject.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as Profile;
        }
      }

      setProfile(profileData);

      // Cargar roles con manejo de errores mejorado
      try {
        console.log("🎭 Loading user roles with enhanced error handling...");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const rolesResult = await SupabaseUserRoleService.getUserRoles(userId);
        
        // 🔄 SINCRONIZACIÓN AUTOMÁTICA: Si no hay roles pero hay user_type, crear el rol
        if (rolesResult.length === 0 && profileData && profileData.user_type) {
          console.log(`🔄 No roles found but user_type is "${profileData.user_type}". Creating missing role...`);
          
          try {
            // Crear rol con timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const { error: createRoleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: userId,
                role_type: profileData.user_type,
                is_active: true,
                is_verified: true, // Auto-verificado al venir de perfil existente
                verification_confirmed_at: new Date().toISOString(),
                role_specific_data: {}
              })
              .abortSignal(controller.signal);

            clearTimeout(timeoutId);

            if (createRoleError) {
              console.error("❌ Error creating missing role:", createRoleError);
            } else {
              console.log(`✅ Successfully created missing "${profileData.user_type}" role`);
              
              // Recargar roles después de crear el faltante
              try {
                const updatedRoles = await SupabaseUserRoleService.getUserRoles(userId);
                setUserRoles(updatedRoles);
                
                // Establecer el rol recién creado como activo
                const activeRoleData = updatedRoles.find(r => r.is_active) || null;
                setActiveRole(activeRoleData);
                
                console.log("✅ Roles synchronized successfully");
                return; // Salir temprano ya que hemos establecido los roles
              } catch (reloadError) {
                console.warn("⚠️ Could not reload roles after creation:", reloadError);
              }
            }
          } catch (syncError) {
            console.error("❌ Error in role synchronization:", syncError);
          }
        }
        
        setUserRoles(rolesResult);
        
        // Establecer rol activo
        const activeRoleData = rolesResult.find(r => r.is_active) || null;
        setActiveRole(activeRoleData);
        console.log("✅ User roles loaded successfully:", rolesResult.length, "roles found");
      } catch (rolesError) {
        console.error("❌ Error loading user roles:", rolesError);
        setUserRoles([]);
        setActiveRole(null);
        
        // Si hay errores de red, no fallar completamente
        if (rolesError instanceof Error && 
            (rolesError.message.includes('Failed to fetch') || rolesError.message.includes('NetworkError'))) {
          console.warn("🌐 Network error loading roles, continuing with empty roles");
        }
      }

    } catch (error) {
      console.error("❌ Critical error in fetchUserData:", error);
      
      // Crear perfil de emergencia
      const emergencyProfile: Profile = {
        id: userId,
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: "An unexpected error occurred during sign in" };
    }
  };

  const signUp = async (email: string, password: string, userData: Omit<ProfileInsert, 'id' | 'email'>) => {
    try {
      console.log("Starting signUp process for:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            user_type: userData.user_type,
            phone: userData.phone,
          }
        }
      });

      if (error) {
        console.error("Supabase signUp error:", error);
        return { error: error.message };
      }

      console.log("SignUp response:", {
        hasUser: !!data.user,
        hasSession: !!data.session,
        emailConfirmed: data.user?.email_confirmed_at
      });

      if (!data.user) {
        return { error: "No se pudo crear la cuenta" };
      }

      // Check if we need email confirmation
      if (!data.session && !data.user.email_confirmed_at) {
        console.log("Email confirmation required");
        return { 
          message: "Por favor revisa tu email para confirmar tu cuenta antes de continuar." 
        };
      }

      // If we have a session, the user is immediately logged in
      if (data.session) {
        console.log("User immediately logged in, creating profile...");
        
        try {
          // Check database connection first
          const isConnected = await checkDatabaseConnection();
          
          if (isConnected) {
            // Create profile
            const profileData: ProfileInsert = {
              id: data.user.id,
              email: data.user.email!,
              ...userData,
            };

            const { error: profileError } = await supabase
              .from("profiles")
              .insert(profileData);

            if (profileError) {
              console.warn("Could not create profile in database:", profileError);
            } else {
              console.log("Profile created successfully");
            }

            // Create the initial role in user_roles table
            try {
              const { error: roleError } = await supabase
                .from('user_roles')
                .insert({
                  user_id: data.user.id,
                  role_type: userData.user_type,
                  is_active: true,
                  is_verified: true, // First role is automatically verified
                  verification_confirmed_at: new Date().toISOString(),
                  role_specific_data: {}
                });

              if (roleError) {
                console.warn("Could not create initial user role:", roleError);
              } else {
                console.log("Initial user role created successfully");
              }
            } catch (roleError) {
              console.warn("Error creating initial role:", roleError);
            }

          } else {
            console.log("Database not connected, skipping profile creation");
          }
        } catch (profileError) {
          console.warn("Profile creation failed, but user was created successfully:", profileError);
        }

        // Registration successful - return success
        return { success: true };
      }

      console.log("Registration completed but no immediate session");
      return { 
        message: "Cuenta creada. Por favor revisa tu email para confirmar antes de iniciar sesión." 
      };
      
    } catch (error) {
      console.error("Unexpected signup error:", error);
      return { error: "Error inesperado durante el registro" };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      }
      
      // Clear local state
      setProfile(null);
      setUserRoles([]);
      setActiveRole(null);
    } catch (error) {
      console.error("Unexpected error during signOut:", error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: "No user logged in" };

    if (!databaseConnected) {
      return { error: "Database not configured yet. Please run the setup script." };
    }

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

      // Refresh profile data
      await fetchUserData(user.id, user);
      return {};
    } catch (error) {
      return { error: "An unexpected error occurred while updating profile" };
    }
  };

  const activateRole = async (roleType: UserRole['role_type']) => {
    if (!user) {
      console.error("❌ activateRole: No user authenticated");
      return { success: false, message: "Usuario no autenticado" };
    }

    console.log("🔄 SupabaseAuthContext: Starting activateRole", { userId: user.id, roleType });

    try {
      // Llamar al servicio de roles con mejores logs
      console.log("📞 Calling SupabaseUserRoleService.activateRole...");
      const result = await SupabaseUserRoleService.activateRole(user.id, roleType);
      
      console.log("📡 SupabaseUserRoleService.activateRole result:", result);
      
      if (result.success) {
        console.log("✅ Role activated successfully, refreshing roles...");
        
        // Refresh roles after activation - with retry logic
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait a bit for DB to update
            await refreshRoles();
            
            // Verify the role was actually activated
            const activeRoleData = userRoles.find(r => r.is_active && r.role_type === roleType);
            if (activeRoleData || retryCount === maxRetries - 1) {
              console.log("✅ Roles refreshed successfully");
              break;
            }
            
            retryCount++;
            console.log(`🔄 Retry ${retryCount}/${maxRetries} - roles not updated yet`);
            
          } catch (refreshError) {
            console.warn(`⚠️ Retry ${retryCount + 1} failed:`, refreshError);
            retryCount++;
            
            if (retryCount >= maxRetries) {
              console.error("❌ Max retries exceeded for refreshRoles");
              break;
            }
          }
        }
        
        return { success: true, message: result.message };
      } else {
        console.error("❌ Failed to activate role:", result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("❌ Error in activateRole:", error);
      
      let errorMessage = "Error al activar el rol";
      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Error de conexión al activar el rol. Verifica tu internet.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "La operación tardó demasiado tiempo. Inténtalo de nuevo.";
        } else if (error.message.includes('401') || error.message.includes('403')) {
          errorMessage = "Error de permisos. Tu sesión puede haber expirado.";
        } else {
          errorMessage = `Error al activar el rol: ${error.message}`;
        }
      }
      
      return { success: false, message: errorMessage };
    }
  };

  const value = {
    user,
    profile,
    session,
    userRoles,
    activeRole,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    activateRole,
    refreshRoles,
    databaseConnected,
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