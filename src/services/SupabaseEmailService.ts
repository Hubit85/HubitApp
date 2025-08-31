import { supabase } from "@/integrations/supabase/client";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  template_type: 'confirm_signup' | 'reset_password' | 'magic_link' | 'invite_user';
  is_active: boolean;
  variables: string[];
  created_at: string;
  updated_at: string;
}

export interface EmailSendRequest {
  to: string;
  template_type: string;
  variables: Record<string, any>;
  subject?: string;
}

export class SupabaseEmailService {
  
  /**
   * Get all available email templates
   */
  static async getEmailTemplates() {
    try {
      // Note: This would typically fetch from a custom email_templates table
      // For now, we'll return predefined templates
      return {
        data: this.getDefaultTemplates(),
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }

  /**
   * Get a specific email template by type
   */
  static async getEmailTemplate(templateType: EmailTemplate['template_type']) {
    try {
      const templates = this.getDefaultTemplates();
      const template = templates.find(t => t.template_type === templateType);
      
      return {
        data: template || null,
        error: template ? null : "Template not found"
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }

  /**
   * Send email using Supabase Edge Function (would need to be implemented)
   */
  static async sendEmail(request: EmailSendRequest) {
    try {
      // This would call a Supabase Edge Function for email sending
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: request
      });

      if (error) {
        console.error("Email sending failed:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Email service error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to send email" 
      };
    }
  }

  /**
   * Test email configuration
   */
  static async testEmailConfiguration() {
    try {
      // Test basic connectivity
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        return {
          success: false,
          error: "Supabase authentication not configured properly"
        };
      }

      // Test email template retrieval
      const templatesResult = await this.getEmailTemplates();
      if (templatesResult.error) {
        return {
          success: false,
          error: "Email templates not accessible"
        };
      }

      return {
        success: true,
        message: "Email configuration test passed",
        templates_count: templatesResult.data?.length || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Configuration test failed"
      };
    }
  }

  /**
   * Get default email templates with HuBiT branding
   */
  private static getDefaultTemplates(): EmailTemplate[] {
    const baseUrl = "https://djkrzbmgzfwagmripozi.supabase.co";
    const logoUrl = `${baseUrl}/storage/v1/object/public/documents/logos/HuBiT-logo-white.svg`;
    
    return [
      {
        id: "confirm_signup",
        name: "Confirmación de Registro",
        subject: "¡Bienvenido a HuBiT! Confirma tu cuenta 🏡",
        template_type: "confirm_signup",
        is_active: true,
        variables: ["ConfirmationURL", "Email", "now.Year"],
        html_content: this.getSignupConfirmationTemplate(logoUrl),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "reset_password",
        name: "Recuperación de Contraseña",
        subject: "Restablecer tu contraseña de HuBiT 🔐",
        template_type: "reset_password",
        is_active: true,
        variables: ["ConfirmationURL", "Email", "now.Year"],
        html_content: this.getPasswordResetTemplate(logoUrl),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "magic_link",
        name: "Enlace Mágico de Acceso",
        subject: "Tu acceso rápido a HuBiT ✨",
        template_type: "magic_link",
        is_active: true,
        variables: ["ConfirmationURL", "Email", "now.Year"],
        html_content: this.getMagicLinkTemplate(logoUrl),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "invite_user",
        name: "Invitación de Usuario",
        subject: "Te han invitado a unirte a HuBiT 🎉",
        template_type: "invite_user",
        is_active: true,
        variables: ["ConfirmationURL", "Email", "InviterName", "now.Year"],
        html_content: this.getUserInviteTemplate(logoUrl),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private static getSignupConfirmationTemplate(logoUrl: string): string {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #ffffff, #f8fafc); padding: 40px 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border: 1px solid rgba(229, 231, 235, 0.6);">
          
          <!-- Header with enhanced logo -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 20px; border-radius: 20px; display: inline-block; margin-bottom: 24px; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);">
              <img src="${logoUrl}" alt="HuBiT" style="height: 60px; filter: brightness(0) invert(1);">
            </div>
            <h1 style="color: #1f2937; font-size: 32px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">
              ¡Bienvenido a HuBiT! 🏡
            </h1>
            <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #3b82f6, #8b5cf6); margin: 20px auto; border-radius: 2px;"></div>
          </div>

          <!-- Main message with enhanced styling -->
          <div style="margin-bottom: 40px;">
            <p style="color: #374151; font-size: 18px; line-height: 1.7; margin-bottom: 24px; font-weight: 300;">
              ¡Hola! Gracias por unirte a <strong style="color: #3b82f6;">HuBiT</strong>, la plataforma que conecta propietarios con los mejores profesionales de servicios.
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Para completar tu registro y comenzar a disfrutar de nuestra plataforma, confirma tu dirección de email:
            </p>
          </div>

          <!-- Enhanced confirmation button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="{{ .ConfirmationURL }}" 
               style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 18px 48px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); transition: all 0.3s ease; letter-spacing: 0.3px;">
              ✨ Confirmar mi cuenta
            </a>
          </div>

          <!-- Features highlight with modern design -->
          <div style="background: linear-gradient(135deg, #f1f5f9, #e2e8f0); padding: 30px; border-radius: 16px; margin: 30px 0; border: 1px solid rgba(148, 163, 184, 0.2);">
            <h3 style="color: #1f2937; font-size: 20px; margin-bottom: 20px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              🚀 ¿Qué puedes hacer en HuBiT?
            </h3>
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="background: #3b82f6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">📝</span>
                <span style="color: #374151; font-size: 15px; font-weight: 400;">Publicar solicitudes de presupuesto para tus proyectos</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="background: #10b981; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">🔍</span>
                <span style="color: #374151; font-size: 15px; font-weight: 400;">Encontrar profesionales verificados en tu área</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="background: #8b5cf6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">💬</span>
                <span style="color: #374151; font-size: 15px; font-weight: 400;">Comunicarte directamente con los proveedores</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="background: #f59e0b; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">⭐</span>
                <span style="color: #374151; font-size: 15px; font-weight: 400;">Ver reseñas y calificaciones verificadas</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="background: #ef4444; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">🚨</span>
                <span style="color: #374151; font-size: 15px; font-weight: 400;">Acceder a servicios de emergencia 24/7</span>
              </div>
            </div>
          </div>

          <!-- Enhanced footer -->
          <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid rgba(229, 231, 235, 0.6);">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px; font-weight: 300;">
              Si no creaste esta cuenta, puedes ignorar este email de forma segura.
            </p>
            <div style="background: linear-gradient(90deg, #f1f5f9, #e5e7eb, #f1f5f9); height: 1px; margin: 20px 0;"></div>
            <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0;">
              © {{ now.Year }} HuBiT. Todos los derechos reservados.<br>
              <strong style="color: #6b7280;">Conectamos hogares con profesionales de confianza</strong>
            </p>
          </div>

        </div>
      </div>
    `;
  }

  private static getPasswordResetTemplate(logoUrl: string): string {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #ffffff, #fef2f2); padding: 40px 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border: 1px solid rgba(252, 165, 165, 0.3);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 20px; border-radius: 20px; display: inline-block; margin-bottom: 24px; box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);">
              <img src="${logoUrl}" alt="HuBiT" style="height: 60px; filter: brightness(0) invert(1);">
            </div>
            <h1 style="color: #dc2626; font-size: 32px; margin: 0; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 12px;">
              🔐 Restablecer contraseña
            </h1>
            <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #dc2626, #ef4444); margin: 20px auto; border-radius: 2px;"></div>
          </div>

          <!-- Main message -->
          <div style="margin-bottom: 40px;">
            <p style="color: #374151; font-size: 18px; line-height: 1.7; margin-bottom: 24px; font-weight: 300;">
              Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong style="color: #dc2626;">HuBiT</strong>.
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Si solicitaste este cambio, haz clic en el botón de abajo para crear una nueva contraseña:
            </p>
          </div>

          <!-- Action button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="{{ .ConfirmationURL }}" 
               style="display: inline-block; background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 18px 48px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4); letter-spacing: 0.3px;">
              🔒 Crear nueva contraseña
            </a>
          </div>

          <!-- Security notice -->
          <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); padding: 25px; border-radius: 12px; border-left: 4px solid #dc2626; margin: 30px 0;">
            <h3 style="color: #dc2626; font-size: 18px; margin-bottom: 12px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              ⚠️ Importante
            </h3>
            <p style="color: #7f1d1d; font-size: 15px; line-height: 1.6; margin: 0;">
              Este enlace expirará en <strong>24 horas</strong> por seguridad. Si no solicitaste este cambio, puedes ignorar este email - tu cuenta permanecerá segura.
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid rgba(229, 231, 235, 0.6);">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
              ¿Necesitas ayuda? Contacta nuestro soporte en <a href="mailto:support@hubit.es" style="color: #dc2626; text-decoration: none;">support@hubit.es</a>
            </p>
            <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0;">
              © {{ now.Year }} HuBiT. Todos los derechos reservados.
            </p>
          </div>

        </div>
      </div>
    `;
  }

  private static getMagicLinkTemplate(logoUrl: string): string {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #ffffff, #f0f9f5); padding: 40px 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border: 1px solid rgba(167, 243, 208, 0.4);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #059669, #047857); padding: 20px; border-radius: 20px; display: inline-block; margin-bottom: 24px; box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);">
              <img src="${logoUrl}" alt="HuBiT" style="height: 60px; filter: brightness(0) invert(1);">
            </div>
            <h1 style="color: #059669; font-size: 32px; margin: 0; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 12px;">
              ✨ Tu acceso a HuBiT
            </h1>
            <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #059669, #10b981); margin: 20px auto; border-radius: 2px;"></div>
          </div>

          <!-- Main message -->
          <div style="margin-bottom: 40px;">
            <p style="color: #374151; font-size: 18px; line-height: 1.7; margin-bottom: 24px; font-weight: 300;">
              ¡Hola! Hemos recibido una solicitud para acceder a tu cuenta de <strong style="color: #059669;">HuBiT</strong>.
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Haz clic en el enlace mágico de abajo para iniciar sesión de forma segura:
            </p>
          </div>

          <!-- Access button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="{{ .ConfirmationURL }}" 
               style="display: inline-block; background: linear-gradient(135deg, #059669, #047857); color: white; padding: 18px 48px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 20px rgba(5, 150, 105, 0.4); letter-spacing: 0.3px;">
              🔐 Acceder a mi cuenta
            </a>
          </div>

          <!-- Information -->
          <div style="background: linear-gradient(135deg, #f0f9f5, #dcfce7); padding: 25px; border-radius: 12px; border-left: 4px solid #059669; margin: 30px 0;">
            <h3 style="color: #059669; font-size: 18px; margin-bottom: 12px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              ✅ Acceso rápido y seguro
            </h3>
            <p style="color: #065f46; font-size: 15px; line-height: 1.6; margin: 0;">
              Este enlace te permitirá acceder directamente sin necesidad de recordar tu contraseña. Expira en <strong>1 hora</strong> por seguridad.
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid rgba(229, 231, 235, 0.6);">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
              Si no solicitaste este acceso, puedes ignorar este email de forma segura.
            </p>
            <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0;">
              © {{ now.Year }} HuBiT. Todos los derechos reservados.
            </p>
          </div>

        </div>
      </div>
    `;
  }

  private static getUserInviteTemplate(logoUrl: string): string {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #ffffff, #faf5ff); padding: 40px 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border: 1px solid rgba(196, 181, 253, 0.4);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 20px; border-radius: 20px; display: inline-block; margin-bottom: 24px; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);">
              <img src="${logoUrl}" alt="HuBiT" style="height: 60px; filter: brightness(0) invert(1);">
            </div>
            <h1 style="color: #8b5cf6; font-size: 32px; margin: 0; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 12px;">
              🎉 Te han invitado a HuBiT
            </h1>
            <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #8b5cf6, #a855f7); margin: 20px auto; border-radius: 2px;"></div>
          </div>

          <!-- Main message -->
          <div style="margin-bottom: 40px;">
            <p style="color: #374151; font-size: 18px; line-height: 1.7; margin-bottom: 24px; font-weight: 300;">
              ¡Excelentes noticias! Has sido invitado a unirte a <strong style="color: #8b5cf6;">HuBiT</strong>, la plataforma líder que conecta propietarios con profesionales de confianza.
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Para activar tu cuenta y comenzar a disfrutar de todos nuestros servicios, acepta la invitación:
            </p>
          </div>

          <!-- Accept invitation button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="{{ .ConfirmationURL }}" 
               style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 18px 48px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4); letter-spacing: 0.3px;">
              🚀 Aceptar invitación
            </a>
          </div>

          <!-- Benefits -->
          <div style="background: linear-gradient(135deg, #faf5ff, #f3e8ff); padding: 30px; border-radius: 12px; margin: 30px 0;">
            <h3 style="color: #8b5cf6; font-size: 20px; margin-bottom: 20px; font-weight: 600; text-align: center;">
              🌟 Beneficios exclusivos te esperan
            </h3>
            <div style="display: grid; gap: 16px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="background: #8b5cf6; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">📝</span>
                <span style="color: #5b21b6; font-size: 15px; font-weight: 500;">Solicita presupuestos gratuitos para tus proyectos</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="background: #10b981; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">🔍</span>
                <span style="color: #5b21b6; font-size: 15px; font-weight: 500;">Accede a profesionales verificados y calificados</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="background: #f59e0b; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">⭐</span>
                <span style="color: #5b21b6; font-size: 15px; font-weight: 500;">Lee reseñas reales de otros usuarios</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="background: #ef4444; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">🚨</span>
                <span style="color: #5b21b6; font-size: 15px; font-weight: 500;">Servicios de emergencia disponibles 24/7</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid rgba(229, 231, 235, 0.6);">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
              Si no esperabas esta invitación, puedes ignorar este email de forma segura.
            </p>
            <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0;">
              © {{ now.Year }} HuBiT. Todos los derechos reservados.<br>
              <strong style="color: #6b7280;">Tu plataforma de confianza para servicios profesionales</strong>
            </p>
          </div>

        </div>
      </div>
    `;
  }
}

export default SupabaseEmailService;