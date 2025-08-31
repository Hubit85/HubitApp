
import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
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
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData: Omit<ProfileInsert, 'id' | 'email'>) => Promise<{ error?: string; message?: string; success?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>;
  activateRole: (roleType: UserRole['role_type']) => Promise<{ success: boolean; message: string }>;
  refreshRoles: () => Promise<void>;
  retryConnection: () => Promise<boolean>;
  databaseConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Circuit breaker para evitar reconexiones excesivas
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  private readonly maxFailures = 3;
  private readonly resetTimeout = 30000; // 30 segundos
  private readonly failureTimeout = 10000; // 10 segundos

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.maxFailures) {
      this.state = 'open';
    }
  }

  isOpen() {
    return this.state === 'open';
  }
}

const connectionCircuitBreaker = new CircuitBreaker();

// Función optimizada para verificar conectividad
const checkBasicConnection = async (): Promise<boolean> => {
  try {
    return await connectionCircuitBreaker.call(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout

      try {
        const { error } = await supabase
          .from("profiles")
          .select("count", { count: 'exact' })
          .limit(0)
          .abortSignal(controller.signal);

        clearTimeout(timeoutId);
        return !error;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    });
  } catch (error) {
    console.warn("⚠️ Connection check failed:", error instanceof Error ? error.message : error);
    return false;
  }
};

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [databaseConnected, setDatabaseConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('reconnecting');

  // Referencias para evitar efectos duplicados
  const initializationRef = useRef(false);
  const userDataFetchRef = useRef<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const connectivityIntervalRef = useRef<NodeJS.Timeout>();

  // Función para intentar recuperar la conexión con throttling
  const retryConnection = async (): Promise<boolean> => {
    if (connectionCircuitBreaker.isOpen()) {
      console.log('🚫 Circuit breaker is open, skipping connection retry');
      return false;
    }

    setConnectionStatus('reconnecting');
    console.log('🔄 Connection retry initiated...');
    
    try {
      const isConnected = await checkBasicConnection();
      
      setDatabaseConnected(isConnected);
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      
      if (isConnected && user && userDataFetchRef.current !== user.id) {
        await fetchUserData(user);
      }
      
      return isConnected;
    } catch (error) {
      console.error('❌ Connection retry failed:', error);
      setConnectionStatus('disconnected');
      return false;
    }
  };

  useEffect(() => {
    // Evitar inicialización múltiple
    if (initializationRef.current) return;
    initializationRef.current = true;

    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("🚀 Initializing Supabase Auth...");
        setConnectionStatus('reconnecting');
        
        // Check database connectivity first
        const isConnected = await checkBasicConnection();
        setDatabaseConnected(isConnected);
        setConnectionStatus(isConnected ? 'connected' : 'disconnected');
        
        // Get current session con timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos
        
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          clearTimeout(timeoutId);
          
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
          
        } catch (sessionError) {
          clearTimeout(timeoutId);
          console.error("❌ Session fetch error:", sessionError);
          
          if (mounted) {
            setConnectionStatus('disconnected');
            setLoading(false);
          }
        }
        
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
        if (mounted) {
          setConnectionStatus('disconnected');
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
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
          userDataFetchRef.current = null;
        }
      }
    );

    // Monitoreo de conectividad con throttling
    connectivityIntervalRef.current = setInterval(async () => {
      if (connectionStatus === 'connected' && !connectionCircuitBreaker.isOpen()) {
        const isStillConnected = await checkBasicConnection();
        if (!isStillConnected && mounted) {
          console.log("🔗 Connection lost, updating status...");
          setConnectionStatus('disconnected');
          setDatabaseConnected(false);
          
          // Intentar reconectar después de un delay
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mounted) {
              retryConnection();
            }
          }, 5000);
        }
      }
    }, 45000); // Check cada 45 segundos (menos frecuente)

    return () => {
      mounted = false;
      subscription.unsubscribe();
      
      if (connectivityIntervalRef.current) {
        clearInterval(connectivityIntervalRef.current);
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const fetchUserData = async (userObject: User) => {
    // Evitar fetches duplicados
    if (userDataFetchRef.current === userObject.id) {
      console.log("⏭️ Skipping duplicate user data fetch for:", userObject.id);
      return;
    }
    
    userDataFetchRef.current = userObject.id;

    try {
      console.log("👤 Fetching user data for:", userObject.id);
      
      // Check connectivity first
      const isConnected = await checkBasicConnection();
      setDatabaseConnected(isConnected);
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      
      if (!isConnected) {
        console.log("📱 Database offline - creating temporary profile");
        
        // Create temporary profile from user metadata
        const tempProfile: Profile = {
          id: userObject.id,
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

      // Try to fetch profile from database
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos
        
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userObject.id)
          .abortSignal(controller.signal)
          .maybeSingle();

        clearTimeout(timeoutId);

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
            user_type: (userObject.user_metadata?.user_type as Profile['user_type']) || 'particular',
            phone: userObject.user_metadata?.phone || null,
            avatar_url: userObject.user_metadata?.avatar_url || null,
            country: 'Spain',
            language: 'es',
            timezone: 'Europe/Madrid',
          };

          try {
            const createController = new AbortController();
            const createTimeoutId = setTimeout(() => createController.abort(), 8000);
            
            const { data: createdProfile, error: createError } = await supabase
              .from("profiles")
              .insert(newProfileData)
              .select()
              .abortSignal(createController.signal)
              .single();

            clearTimeout(createTimeoutId);

            if (!createError && createdProfile) {
              setProfile(createdProfile);
              console.log("✅ Profile created successfully");
            } else {
              // Fallback to temporary profile
              const fallbackProfile: Profile = {
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
              
              setProfile(fallbackProfile);
              console.log("📱 Using fallback profile");
            }
          } catch (createError) {
            console.warn("⚠️ Profile creation failed:", createError);
            // Use fallback profile
            const fallbackProfile: Profile = {
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
            
            setProfile(fallbackProfile);
          }
        }

        // Load user roles with throttling
        try {
          console.log("🎭 Loading user roles...");
          const roles = await SupabaseUserRoleService.getUserRoles(userObject.id);
          
          setUserRoles(roles);
          
          const activeRoleData = roles.find(r => r.is_active) || null;
          setActiveRole(activeRoleData);
          
          console.log("✅ User roles loaded:", roles.length);
        } catch (rolesError) {
          console.warn("⚠️ Error loading roles:", rolesError);
          setUserRoles([]);
          setActiveRole(null);
        }

      } catch (fetchError) {
        console.error("❌ Error fetching user data:", fetchError);
        
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
      }

    } catch (error) {
      console.error("❌ Critical error in fetchUserData:", error);
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
      console.log("🔑 Starting sign in process...");
      
      // Check connectivity first
      const isConnected = await checkBasicConnection();
      if (!isConnected) {
        return { 
          error: "No se puede conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente." 
        };
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 segundos timeout
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      clearTimeout(timeoutId);

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
        } else if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
          userMessage = "Error de conexión. Verifica tu internet e intenta nuevamente.";
        }
        
        return { error: userMessage };
      }

      console.log("✅ Sign in successful");
      return {};

    } catch (error) {
      console.error("❌ Sign in exception:", error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        return { error: "La conexión tardó demasiado tiempo. Intenta nuevamente." };
      }
      
      return { error: "Error de conexión. Por favor intenta nuevamente." };
    }
  };

  const signUp = async (email: string, password: string, userData: Omit<ProfileInsert, 'id' | 'email'>) => {
    try {
      console.log("📝 Starting sign up process...");
      
      // Check connectivity first
      const isConnected = await checkBasicConnection();
      if (!isConnected) {
        return { 
          error: "No se puede conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente." 
        };
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      
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

      clearTimeout(timeoutId);

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
        
        // Try to create profile if database is connected
        const isStillConnected = await checkBasicConnection();
        if (isStillConnected) {
          try {
            const profileData: ProfileInsert = {
              id: data.user.id,
              email: data.user.email!,
              ...userData,
            };

            await supabase.from("profiles").insert(profileData);
            
            // Create initial role
            await supabase.from('user_roles').insert({
              user_id: data.user.id,
              role_type: userData.user_type,
              is_active: true,
              is_verified: true,
              verification_confirmed_at: new Date().toISOString(),
              role_specific_data: {}
            });
            
            console.log("✅ Profile and role created");
          } catch (profileError) {
            console.warn("⚠️ Profile creation failed but user was created:", profileError);
          }
        }

        return { success: true };
      }

      return { 
        message: "Cuenta creada. Por favor revisa tu email para confirmar antes de iniciar sesión." 
      };
      
    } catch (error) {
      console.error("❌ Sign up exception:", error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        return { error: "La conexión tardó demasiado tiempo. Intenta nuevamente." };
      }
      
      return { error: "Error inesperado durante el registro" };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      
      setProfile(null);
      setUserRoles([]);
      setActiveRole(null);
      userDataFetchRef.current = null;
    } catch (error) {
      console.error("❌ Sign out error:", error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: "No user logged in" };

    if (!databaseConnected) {
      return { error: "Database not available. Please try again later." };
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

    if (!databaseConnected) {
      return { success: false, message: "Base de datos no disponible. Intenta más tarde." };
    }

    try {
      const result = await SupabaseUserRoleService.activateRole(user.id, roleType);
      
      if (result.success) {
        await refreshRoles();
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
    connectionStatus,
    signIn,
    signUp,
    signOut,
    updateProfile,
    activateRole,
    refreshRoles,
    retryConnection,
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
