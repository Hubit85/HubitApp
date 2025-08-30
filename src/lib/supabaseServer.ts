import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import * as fs from "fs";
import * as path from "path";

// Función mejorada para cargar manualmente las variables del .env.local
function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      const envLines = envContent.split("\n");
      
      let loadedCount = 0;
      envLines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith("#") && trimmedLine.includes("=")) {
          const equalIndex = trimmedLine.indexOf("=");
          const key = trimmedLine.substring(0, equalIndex).trim();
          let value = trimmedLine.substring(equalIndex + 1).trim();

          // Manejar valores entre comillas
          if ((value.startsWith(`"`) && value.endsWith(`"`)) || (value.startsWith(`'`) && value.endsWith(`'`))) {
            value = value.substring(1, value.length - 1);
          }
          
          if (key && value) {
            process.env[key] = value;
            loadedCount++;
          }
        }
      });
      
      console.log(`✅ ${loadedCount} variables cargadas/actualizadas desde .env.local`);
    } else {
      console.warn("⚠️ Archivo .env.local no encontrado en:", envPath);
    }
  } catch (error) {
    console.error("❌ Error cargando .env.local:", error);
  }
}

// Cargar variables manualmente primero
loadEnvFile();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Faltan las variables de entorno de Supabase en el servidor.");
  console.error("SUPABASE_URL presente:", !!SUPABASE_URL);
  console.error("SUPABASE_SERVICE_KEY presente:", !!SUPABASE_SERVICE_KEY);
  
  throw new Error("Faltan las variables de entorno de Supabase requeridas en el servidor.");
}

console.log("🔧 Configurando Supabase Server...");

const supabaseServer = createClient&lt;Database&gt;(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

console.log("✅ Supabase Server configurado.");

export default supabaseServer;
