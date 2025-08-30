import { supabase } from "@/integrations/supabase/client";
import { Profile, ProfileInsert, ProfileUpdate } from "@/integrations/supabase/types";

export class SupabaseAuthService {
  static async signUp(email: string, password: string, userData: Omit<ProfileInsert, 'id' | 'email'>) {
    try {
      // First, create the user account
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
        throw new Error(error.message);
      }

      // The profile will be created automatically by the database trigger
      // We don't need to manually create it here

      return { 
        user: data.user, 
        session: data.session,
        needsEmailConfirmation: !data.session 
      };
    } catch (error) {
      throw error;
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Update last login
      if (data.user) {
        await this.updateLastLogin(data.user.id);
      }

      return { user: data.user, session: data.session };
    } catch (error) {
      throw error;
    }
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  static async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist yet
        return null;
      }
      throw new Error(error.message);
    }

    return data;
  }

  static async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateLastLogin(userId: string) {
    try {
      await supabase
        .from("profiles")
        .update({ 
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);
    } catch (error) {
      // Silent fail for last_login update
      console.warn("Could not update last_login:", error);
    }
  }

  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  static async updateEmail(newEmail: string) {
    const { error } = await supabase.auth.updateUser({
      email: newEmail
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  static async verifyOtp(email: string, token: string, type: 'signup' | 'recovery' | 'email_change') {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Profile management helpers
  static async checkUserType(userId: string): Promise<Profile['user_type'] | null> {
    const profile = await this.getProfile(userId);
    return profile?.user_type || null;
  }

  static async isUserVerified(userId: string): Promise<boolean> {
    const profile = await this.getProfile(userId);
    return profile?.is_verified || false;
  }

  static async getUserLanguage(userId: string): Promise<string> {
    const profile = await this.getProfile(userId);
    return profile?.language || 'es';
  }

  static async updateUserPreferences(userId: string, preferences: {
    language?: string;
    timezone?: string;
    email_notifications?: boolean;
    sms_notifications?: boolean;
  }) {
    return this.updateProfile(userId, {
      ...preferences,
      updated_at: new Date().toISOString()
    });
  }
}
