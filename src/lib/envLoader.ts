
import fs from "fs";
import path from "path";

export class EnvLoader {
  private static envVars: Record<string, string | undefined> = {};
  private static isLoaded = false;
  private static isLoading = false;

  private static parseEnvFile(filePath: string): Record<string, string> {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const vars: Record<string, string> = {};
      
      content.split("\n").forEach((line: string) => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith("#") && trimmedLine.includes("=")) {
          const [key, ...valueParts] = trimmedLine.split("=");
          const value = valueParts.join("=").trim();
          
          if (key) {
              const cleanedKey = key.trim();
              let cleanedValue = value;
              
              // Remover comillas si existen
              if (cleanedValue.startsWith('"') && cleanedValue.endsWith('"')) {
                cleanedValue = cleanedValue.slice(1, -1);
              } else if (cleanedValue.startsWith("'") && cleanedValue.endsWith("'")) {
                cleanedValue = cleanedValue.slice(1, -1);
              }
              
              vars[cleanedKey] = cleanedValue;
          }
        }
      });

      return vars;
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code !== "ENOENT") {
        console.warn(`Could not parse env file at ${filePath}:`, error.message);
      }
      return {};
    }
  }

  public static loadEnvVars(): void {
    if (this.isLoaded || this.isLoading) {
      return;
    }
    this.isLoading = true;

    console.log("🔄 Loading environment variables from .env.local...");
    
    let combinedVars: Record<string, string | undefined> = { ...process.env };

    const localEnvPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(localEnvPath)) {
      try {
        const localVars = this.parseEnvFile(localEnvPath);
        combinedVars = { ...combinedVars, ...localVars };
        console.log(`✅ Loaded ${Object.keys(localVars).length} variables from .env.local`);
      } catch (e) {
        console.error("Error loading .env.local", e);
      }
    } else {
        console.log("ℹ️ .env.local not found, skipping.");
    }

    this.envVars = combinedVars;
    this.isLoaded = true;
    this.isLoading = false;
    console.log("👍 Environment variables loading complete.");
  }

  public static getVar(key: string): string | undefined {
    if (!this.isLoaded) {
      this.loadEnvVars();
    }
    return this.envVars[key];
  }
}

// Auto-load on import to ensure variables are available
EnvLoader.loadEnvVars();
