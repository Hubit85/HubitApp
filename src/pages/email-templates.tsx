import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import EmailTemplateManager from '@/components/EmailTemplateManager';
import ResendDiagnostic from '@/components/ResendDiagnostic';

export default function EmailTemplatesPage() {
  return (
    <LanguageProvider>
      <SupabaseAuthProvider>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Gestión de Email Templates</h1>
            <p className="text-gray-600">
              Configura y gestiona las plantillas de email para HuBiT
            </p>
          </div>

          <div className="grid gap-8">
            {/* Diagnóstico de Resend */}
            <div>
              <ResendDiagnostic />
            </div>

            {/* Email Template Manager */}
            <div>
              <EmailTemplateManager />
            </div>
          </div>
        </div>
      </SupabaseAuthProvider>
    </LanguageProvider>
  );
}