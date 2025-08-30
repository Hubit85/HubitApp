
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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
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

    return () => subscription.unsubscribe();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      const { error } = await supabase
        .from("service_categories")
        .select("count(*)")
        .limit(1);

      if (!error) {
        setDatabaseConnected(true);
        return true;
      }
      
      console.warn("⚠️  Database tables not configured yet. Please run the setup script in Supabase SQL Editor.");
      console.warn("📋 Check docs/complete-database-setup.sql for the required SQL commands.");
      return false;
    } catch (error) {
      console.warn("Database connection check failed:", error);
      return false;
    }
  };

  const fetchUserData = async (userId: string, userObject: User) => {
    try {
      const isConnected = await checkDatabaseConnection();
      
      if (!isConnected) {
        // Create a temporary profile from user data
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
        setLoading(false);
        return;
      }

      // Fetch profile and roles in parallel
      const [profileResult, rolesResult] = await Promise.allSettled([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        SupabaseUserRoleService.getUserRoles(userId)
      ]);

      // Handle profile
      if (profileResult.status === 'fulfilled' && !profileResult.value.error) {
        setProfile(profileResult.value.data);
      } else {
        console.error("Error fetching profile:", profileResult);
      }

      // Handle roles
      if (rolesResult.status === 'fulfilled') {
        setUserRoles(rolesResult.value);
        
        // Set active role
        const activeRoleData = rolesResult.value.find(r => r.is_active) || null;
        setActiveRole(activeRoleData);
      } else {
        console.error("Error fetching roles:", rolesResult);
        setUserRoles([]);
        setActiveRole(null);
      }

    } catch (error) {
      console.error("Error fetching user data:", error);
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
      console.log("SupabaseAuth: Starting signUp process");
      
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

      if (data.user) {
        console.log("User created:", data.user.id, "Session:", !!data.session);
        
        // Check if we need email confirmation
        if (!data.session && !data.user.email_confirmed_at) {
          console.log("Email confirmation required");
          return { 
            message: "Por favor revisa tu email para confirmar tu cuenta antes de continuar." 
          };
        }

        // If we have a session, the user is immediately logged in
        if (data.session) {
          console.log("User immediately logged in");
          
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

          // Registration successful - return success immediately
          console.log("Registration successful, returning success");
          return { success: true };
        }
      }

      console.log("Registration completed but no user/session returned");
      return { error: "Error durante el registro. Por favor, inténtalo de nuevo." };
      
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
      return { success: false, message: "Usuario no autenticado" };
    }

    try {
      const result = await SupabaseUserRoleService.activateRole(user.id, roleType);
      
      if (result.success) {
        // Refresh roles after activation
        await refreshRoles();
      }
      
      return result;
    } catch (error) {
      console.error("Error activating role:", error);
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
