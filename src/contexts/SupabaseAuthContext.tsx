
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

// Función de diagnóstico mejorada para detectar problemas de conectividad
const diagnoseConnectivityIssues = async () => {
  console.log("🔍 Running comprehensive connectivity diagnosis...");
  
  const issues = [];
  
  // 1. Verificar configuración básica
  try {
    const url = supabase.supabaseUrl;
    const key = supabase.supabaseKey;
    
    if (!url || url === 'invalid_supabase_url' || url.includes('invalid')) {
      issues.push("Invalid Supabase URL configuration");
    }
    
    if (!key || key === 'invalid_anon_key' || key.includes('invalid')) {
      issues.push("Invalid Supabase anon key configuration");
    }
    
    console.log("📍 Supabase config check:", { 
      hasValidUrl: url && !url.includes('invalid'),
      hasValidKey: key && !key.includes('invalid'),
      urlPreview: url ? url.substring(0, 30) + '...' : 'missing'
    });
    
  } catch (configError) {
    console.error("Config check failed:", configError);
    issues.push("Supabase client configuration error");
  }
  
  // 2. Test básico de conectividad de red
  try {
    const networkTest = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors'
    });
    console.log("🌐 Basic network connectivity: OK");
  } catch (networkError) {
    console.error("❌ Network connectivity failed:", networkError);
    issues.push("No internet connectivity");
  }
  
  // 3. Test específico de Supabase con múltiples métodos
  try {
    const supabaseUrl = supabase.supabaseUrl;
    
    // Método 1: Ping directo al dominio
    if (supabaseUrl && !supabaseUrl.includes('invalid')) {
      try {
        const pingTest = await fetch(supabaseUrl + '/rest/v1/', {
          method: 'HEAD',
          mode: 'no-cors'
        });
        console.log("🏓 Supabase domain ping: OK");
      } catch (pingError) {
        console.warn("⚠️ Supabase domain unreachable:", pingError);
        issues.push("Supabase server unreachable");
      }
    }
    
  } catch (supabaseError) {
    console.error("❌ Supabase connectivity test failed:", supabaseError);
    issues.push("Supabase connectivity issues");
  }
  
  return issues;
};

// Función para intentar reconectar con Supabase
const attemptReconnection = async (maxAttempts = 3) => {
  console.log("🔄 Attempting Supabase reconnection...");
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🔄 Reconnection attempt ${attempt}/${maxAttempts}`);
      
      // Intentar una consulta muy básica
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (!error) {
        console.log("✅ Reconnection successful!");
        setDatabaseConnected(true);
        return true;
      } else {
        console.warn(`Reconnection attempt ${attempt} failed:`, error.message);
      }
      
    } catch (reconnectError) {
      console.warn(`Reconnection attempt ${attempt} exception:`, reconnectError);
    }
    
    if (attempt < maxAttempts) {
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.error("❌ All reconnection attempts failed");
  return false;
};

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
    console.log(`🔗 Enhanced database connection check starting (${retries} retries)`);
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔄 Connection attempt ${attempt}/${retries}`);
        
        // Crear un timeout más corto para detectar problemas rápidamente
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.warn(`⏱️ Connection attempt ${attempt} timed out`);
          controller.abort();
        }, 6000); // 6 segundos timeout
        
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
          console.warn(`⚠️ Connection attempt ${attempt} error:`, error.message);
          
          // Análisis específico de errores
          if (error.message.includes('Failed to fetch')) {
            console.log("🚨 Network fetch failure detected");
            
            if (attempt === 1) {
              // En el primer intento, ejecutar diagnóstico
              const issues = await diagnoseConnectivityIssues();
              if (issues.length > 0) {
                console.error("🚨 Connectivity issues detected:", issues);
              }
            }
          } else if (error.message.includes('PGRST116')) {
            console.warn("📋 Table 'service_categories' doesn't exist - database setup needed");
            setDatabaseConnected(false);
            return false;
          } else if (error.message.includes('401') || error.message.includes('403')) {
            console.error("🔑 Authentication/authorization error");
            setDatabaseConnected(false);
            return false;
          }
        }
        
      } catch (connectionError) {
        console.warn(`🔄 Connection attempt ${attempt} exception:`, connectionError);
        
        // Manejo específico de diferentes tipos de excepciones
        if (connectionError instanceof Error) {
          if (connectionError.name === 'AbortError') {
            console.warn(`⏱️ Connection attempt ${attempt} was aborted (timeout)`);
          } else if (connectionError.message.includes('NetworkError')) {
            console.warn(`🌐 Network error on attempt ${attempt}`);
          } else if (connectionError.message.includes('Failed to fetch')) {
            console.warn(`🚨 Fetch failed on attempt ${attempt}`);
            
            // Si es el primer intento de fetch fallido, intentar reconexión
            if (attempt === 1) {
              console.log("🔄 Attempting automatic reconnection...");
              const reconnected = await attemptReconnection(2);
              if (reconnected) {
                continue; // Retry the connection check
              }
            }
          }
        }
        
        // Si es el último intento, marcar como desconectado
        if (attempt === retries) {
          console.error("❌ All database connection attempts exhausted");
          setDatabaseConnected(false);
          return false;
        }
        
        // Calcular delay con backoff exponencial, máximo 8 segundos
        const delayMs = Math.min(Math.pow(2, attempt) * 1000, 8000);
        console.log(`⏸️ Waiting ${delayMs}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    console.error("❌ Database connection check completed - all attempts failed");
    setDatabaseConnected(false);
    return false;
  };

  const fetchUserData = async (userId: string, userObject: User, retries = 2) => {
    try {
      console.log("🔄 Enhanced fetchUserData starting...");
      
      // Verificar conectividad con diagnóstico rápido
      const isConnected = await checkDatabaseConnection(2);
      
      if (!isConnected) {
        console.log("📱 Database offline - creating enhanced temporary profile");
        
        // Crear perfil temporal más robusto desde datos del usuario
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
        
        console.log("📱 Temporary profile created successfully");
        return;
      }

      // Dar tiempo para que las conexiones se estabilicen
      await new Promise(resolve => setTimeout(resolve, 500));

      // Obtener perfil con lógica de reintentos mejorada
      let profileData: Profile | null = null;
      
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`🔍 Enhanced profile fetch attempt ${attempt}/${retries} for user ID: ${userId}`);
          
          // Timeout más conservador para perfiles
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            console.warn(`Profile fetch attempt ${attempt} timeout`);
            controller.abort();
          }, 8000); // 8 segundos
          
          const { data: profilesData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .abortSignal(controller.signal)
            .single();

          clearTimeout(timeoutId);

          if (!profileError && profilesData) {
            profileData = profilesData;
            console.log("✅ Profile loaded successfully");
            break;
          }
          
          if (profileError) {
            console.warn(`Profile fetch attempt ${attempt} failed:`, profileError.message);
            
            // Análisis de errores específicos
            if (profileError.message.includes('JWT') || 
                profileError.message.includes('Invalid API key') ||
                profileError.message.includes('invalid_api_key')) {
              console.error("🔑 Authentication error detected, stopping profile fetch");
              break;
            }
            
            if (profileError.message.includes('Failed to fetch') || 
                profileError.message.includes('NetworkError')) {
              console.log(`🌐 Network error on attempt ${attempt}, will retry...`);
              
              if (attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, attempt * 1500));
                continue;
              }
            }
            
            if (attempt === retries) {
              console.warn("All profile fetch attempts failed, will create new profile");
            }
          }
          
        } catch (fetchException) {
          console.warn(`Profile fetch attempt ${attempt} exception:`, fetchException);
          
          if (fetchException instanceof Error) {
            if (fetchException.name === 'AbortError') {
              console.warn(`⏱️ Profile fetch attempt ${attempt} timed out`);
            } else if (fetchException.message.includes('Failed to fetch')) {
              console.warn(`🚨 Network fetch failed on attempt ${attempt}`);
            }
          }
          
          if (attempt < retries) {
            console.log(`🔄 Will retry profile fetch in ${attempt * 1500}ms...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 1500));
          } else {
            console.error("All profile fetch attempts failed with exceptions");
          }
        }
      }

      if (!profileData) {
        console.log("📝 Creating new profile from user metadata with enhanced data");
        
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
          console.log("🔧 Attempting to create profile in database...");
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);

          const { data: createdProfile, error: createError } = await supabase
            .from("profiles")
            .insert(newProfileData)
            .select()
            .abortSignal(controller.signal)
            .single();

          clearTimeout(timeoutId);

          if (createError) {
            console.error("Profile creation failed:", createError);
            // Fallback con perfil más completo
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
            console.log("📱 Using enhanced fallback profile");
          } else {
            profileData = createdProfile;
            console.log("✅ Profile created successfully in database");
          }
        } catch (createException) {
          console.error("Profile creation exception:", createException);
          
          // Crear perfil temporal robusto como último recurso
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
          console.log("📱 Using emergency profile as last resort");
        }
      }

      setProfile(profileData);

      // Cargar roles con manejo de errores ultra-robusto
      try {
        console.log("🎭 Loading user roles with enhanced error handling...");
        await new Promise(resolve => setTimeout(resolve, 700));
        
        const rolesResult = await SupabaseUserRoleService.getUserRoles(userId);
        
        // Sincronización automática mejorada con validación
        if (rolesResult.length === 0 && profileData && profileData.user_type) {
          console.log(`🔄 No roles found but user_type is "${profileData.user_type}". Auto-creating role...`);
          
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const { error: createRoleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: userId,
                role_type: profileData.user_type,
                is_active: true,
                is_verified: true,
                verification_confirmed_at: new Date().toISOString(),
                role_specific_data: {}
              })
              .abortSignal(controller.signal);

            clearTimeout(timeoutId);

            if (createRoleError) {
              console.error("❌ Auto role creation failed:", createRoleError);
            } else {
              console.log(`✅ Auto-created "${profileData.user_type}" role successfully`);
              
              try {
                const updatedRoles = await SupabaseUserRoleService.getUserRoles(userId);
                setUserRoles(updatedRoles);
                const activeRoleData = updatedRoles.find(r => r.is_active) || null;
                setActiveRole(activeRoleData);
                console.log("✅ Roles synchronized and loaded successfully");
                return;
              } catch (reloadError) {
                console.warn("⚠️ Could not reload roles after auto-creation:", reloadError);
              }
            }
          } catch (syncError) {
            console.error("❌ Error in auto role synchronization:", syncError);
          }
        }
        
        setUserRoles(rolesResult);
        const activeRoleData = rolesResult.find(r => r.is_active) || null;
        setActiveRole(activeRoleData);
        console.log("✅ User roles loaded successfully:", rolesResult.length, "roles found");
        
      } catch (rolesError) {
        console.error("❌ Error loading user roles:", rolesError);
        setUserRoles([]);
        setActiveRole(null);
        
        if (rolesError instanceof Error && 
            (rolesError.message.includes('Failed to fetch') || 
             rolesError.message.includes('NetworkError'))) {
          console.warn("🌐 Network error loading roles - continuing with empty roles");
        }
      }

    } catch (error) {
      console.error("❌ Critical error in enhanced fetchUserData:", error);
      
      // Crear perfil de emergencia ultra-robusto
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
      console.log("📱 Emergency profile created due to critical error");
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