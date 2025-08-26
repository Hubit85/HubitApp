
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  user_type: 'particular' | 'community_member' | 'service_provider' | 'property_administrator';
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileInsert {
  id?: string;
  email: string;
  full_name?: string | null;
  user_type: 'particular' | 'community_member' | 'service_provider' | 'property_administrator';
  phone?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData: Omit<ProfileInsert, 'id' | 'email'>) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // Check if the error is because the table doesn't exist
        if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
          console.warn("⚠️  Database tables not configured yet. Please run the setup script in Supabase SQL Editor.");
          console.warn("📋 Check docs/database-setup.sql for the required SQL commands.");
          
          // Create a temporary profile from user data
          if (user) {
            const tempProfile: Profile = {
              id: userId,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || null,
              user_type: user.user_metadata?.user_type || 'particular',
              phone: user.user_metadata?.phone || null,
              avatar_url: user.user_metadata?.avatar_url || null,
              created_at: user.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setProfile(tempProfile);
          }
        } else {
          console.error("Error fetching profile:", error);
        }
      } else {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
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
      return { error: "An unexpected error occurred" };
    }
  };

  const signUp = async (email: string, password: string, userData: Omit<ProfileInsert, 'id' | 'email'>) => {
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

      if (data.user) {
        try {
          // Try to create profile in database
          const profileData = {
            id: data.user.id,
            email: data.user.email!,
            ...userData,
          };

          const { error: profileError } = await supabase
            .from("profiles")
            .insert(profileData);

          if (profileError && profileError.code === '42P01') {
            console.warn("⚠️  Database tables not configured yet. User registered but profile will be temporary until database is setup.");
          } else if (profileError) {
            return { error: profileError.message };
          }
        } catch (profileError) {
          console.warn("Could not create profile in database, but user was created successfully:", profileError);
        }
      }

      return {};
    } catch (error) {
      return { error: "An unexpected error occurred" };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: "No user logged in" };

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) {
        if (error.code === '42P01') {
          return { error: "Database not configured yet. Please run the setup script." };
        }
        return { error: error.message };
      }

      // Refresh profile data
      await fetchProfile(user.id);
      return {};
    } catch (error) {
      return { error: "An unexpected error occurred" };
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