
// Environment variable loader for server-side API routes
export class EnvLoader {
  private static envVars: Record<string, string> = {};
  private static loaded = false;

  static loadEnvVars(): void {
    if (this.loaded) return;

    console.log('🔧 Loading environment variables manually...');

    // Try multiple approaches to get environment variables
    const sources = [
      process.env,
      typeof window !== 'undefined' ? {} : require('fs').existsSync('.env.local') 
        ? this.parseEnvFile('.env.local') 
        : {}
    ];

    // Merge all sources
    sources.forEach(source => {
      if (source && typeof source === 'object') {
        Object.assign(this.envVars, source);
      }
    });

    // Manual fallback for known variables
    if (!this.envVars.RESEND_API_KEY && process.env.RESEND_API_KEY) {
      this.envVars.RESEND_API_KEY = process.env.RESEND_API_KEY;
    }

    console.log('📋 Environment variables loaded:', {
      RESEND_API_KEY_EXISTS: !!this.envVars.RESEND_API_KEY,
      RESEND_API_KEY_LENGTH: this.envVars.RESEND_API_KEY?.length || 0,
      RESEND_API_KEY_PREFIX: this.envVars.RESEND_API_KEY?.substring(0, 10) || 'not found'
    });

    this.loaded = true;
  }

  static getVar(key: string): string | undefined {
    this.loadEnvVars();
    return this.envVars[key] || process.env[key];
  }

  private static parseEnvFile(filePath: string): Record<string, string> {
    try {
      const fs = require('fs');
      const path = require('path');
      const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
      const vars: Record<string, string> = {};
      
      content.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#') && line.includes('=')) {
          const [key, ...valueParts] = line.split('=');
          const value = valueParts.join('=').trim();
          vars[key.trim()] = value;
        }
      });

      return vars;
    } catch (error) {
      console.warn('Could not parse env file:', error);
      return {};
    }
  }
}
