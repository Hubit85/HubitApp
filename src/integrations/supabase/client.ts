import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Checks if Supabase is properly configured by verifying the presence and validity of environment variables.
 * @returns {boolean} `true` if configured, `false` otherwise.
 */
export function isSupabaseConfigured(): boolean {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return false;
  }

  // Check for default placeholder values.
  if (
    SUPABASE_URL.includes("your-project-url") ||
    SUPABASE_ANON_KEY.includes("your-anon-key")
  ) {
    return false;
  }

  // Check for placeholder values used in some environments.
  if (SUPABASE_URL.includes("placeholder-project")) {
    return false;
  }

  // Validate the URL format.
  try {
    const url = new URL(SUPABASE_URL);
    return url.protocol === "https:" && (url.hostname.endsWith(".supabase.co") || url.hostname.endsWith(".supabase.com"));
  } catch {
    return false;
  }
}

// Initialize Supabase client.
// If the config is invalid, provide dummy values to prevent the client from throwing an error,
// as the application should still be able to run in a "disconnected" state.
export const supabase = createClient<Database>(
  SUPABASE_URL || "http://localhost:54321",
  SUPABASE_ANON_KEY || "placeholder-key"
);

// Export additional utility functions for debugging
export const getSupabaseConfig = () => ({
  url: SUPABASE_URL,
  hasValidUrl: !!SUPABASE_URL && !SUPABASE_URL.includes("placeholder"),
  hasValidKey: !!SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes("placeholder"),
  isConfigured: isSupabaseConfigured()
});