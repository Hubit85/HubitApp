import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import * as fs from "fs";
import * as path from "path";

function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      const envLines = envContent.split("\n");
      
      let loadedCount = 0;
      
      envLines.forEach((line, _index) => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith("#") && trimmedLine.includes("=")) {
          const equalIndex = trimmedLine.indexOf("=");
          const key = trimmedLine.substring(0, equalIndex).trim();
          let value = trimmedLine.substring(equalIndex + 1).trim();

          if ((value.startsWith(`"`) && value.endsWith(`"`)) || (value.startsWith(`'`) && value.endsWith(`'`))) {
            value = value.substring(1, value.length - 1);
          }
          
          if (key && value) {
            process.env[key] = value;
            loadedCount++;
          }
        }
      });
      
      console.log(`Loaded ${loadedCount} variables from .env.local`);
    } else {
      console.warn(".env.local file not found at:", envPath);
    }
  } catch (error) {
    console.error("Error loading .env.local:", error);
  }
}

loadEnvFile();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Supabase server environment:", {
  hasUrl: !!SUPABASE_URL,
  hasServiceKey: !!SUPABASE_SERVICE_KEY
});

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing Supabase server environment variables.");
  console.error("SUPABASE_URL present:", !!SUPABASE_URL);
  console.error("SUPABASE_SERVICE_KEY present:", !!SUPABASE_SERVICE_KEY);
  
  throw new Error("Missing required Supabase server environment variables.");
}

const supabaseServer = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default supabaseServer;

export const addUserToRole = async (userId: string, role: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error } = await supabaseServer.from("user_roles").insert([{ user_id: userId, role_type: role }]);
  if (error) throw error;
  return data;
};

export const getUserRoles = async (userId: string) => {
  const { data, error } = await supabaseServer.from("user_roles").select().eq("user_id", userId);
  if (error) throw error;
  return data;
};
