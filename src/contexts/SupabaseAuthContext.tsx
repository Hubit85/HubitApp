
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile, ProfileInsert } from "@/integrations/supabase/types";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData: Omit<ProfileInsert, 'id' | 'email'>) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>;
  databaseConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [databaseConnected, setDatabaseConnected] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        fetchProfile(session.user.id);
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
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
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

  const fetchProfile = async (userId: string) => {
    try {
      const isConnected = await checkDatabaseConnection();
      
      if (!isConnected) {
        // Create a temporary profile from user data
        if (user) {
          const tempProfile: Profile = {
            id: userId,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || null,
            user_type: (user.user_metadata?.user_type as Profile['user_type']) || 'particular',
            phone: user.user_metadata?.phone || null,
            avatar_url: user.user_metadata?.avatar_url || null,
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
            created_at: user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setProfile(tempProfile);
        }
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, this is normal for new users
          console.info("Profile not found, will be created automatically");
        } else {
          console.error("Error fetching profile:", error);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Omit<ProfileInsert, 'id' | 'email'>) => {
    setLoading(true);
    try {
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
        return { error: error.message };
      }

      if (data.user && databaseConnected) {
        try {
          // Try to create profile in database
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
            return { error: "Registration successful, but profile creation failed. Please contact support." };
          }
        } catch (profileError) {
          console.warn("Could not create profile in database, but user was created successfully:", profileError);
        }
      }

      return {};
    } catch (error) {
      return { error: "An unexpected error occurred during registration" };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      }
    } finally {
      setLoading(false);
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
      await fetchProfile(user.id);
      return {};
    } catch (error) {
      return { error: "An unexpected error occurred while updating profile" };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
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