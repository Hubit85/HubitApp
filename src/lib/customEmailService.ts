
import { supabase } from "@/integrations/supabase/client";

// Plantilla HTML para verificación de roles (ya en inglés)
const ROLE_VERIFICATION_TEMPLATE = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);">
  <div style="background-color: white; padding: 40px 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border: 1px solid rgba(186, 230, 253, 0.6);">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 35px;">
      <div style="display: inline-block; position: relative; margin-bottom: 25px;">
        <h1 style="color: #1e293b; font-size: 42px; margin: 0; font-weight: 800; background: linear-gradient(135deg, #0ea5e9, #0284c7, #0369a1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          HuBiT
        </h1>
        <div style="position: absolute; top: -8px; right: -12px; width: 16px; height: 16px; background: linear-gradient(135deg, #06b6d4, #0891b2); border-radius: 50%;"></div>
      </div>
      <h2 style="color: #0f172a; font-size: 28px; margin: 0; font-weight: 600; line-height: 1.3;">
        Verify Your New Role 🎯
      </h2>
    </div>

    <!-- Main message -->
    <div style="margin-bottom: 35px;">
      <p style="color: #475569; font-size: 18px; line-height: 1.7; margin-bottom: 20px;">
        Hello! You've requested to add a new role to your HuBiT account.
      </p>
      
      <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #3b82f6;">
        <h3 style="color: #1e40af; font-size: 18px; margin-bottom: 12px; font-weight: 600; display: flex; align-items: center;">
          <span style="margin-right: 10px;">👤</span> New Role Request
        </h3>
        <p style="color: #1e40af; font-size: 16px; margin: 0; font-weight: 500;">
          Role Type: <strong>{{ROLE_TYPE}}</strong>
        </p>
      </div>
      
      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
        To verify and activate this new role, please click the button below. This will allow you to switch between your different roles within the platform.
      </p>
    </div>

    <!-- Verification button -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="{{VERIFICATION_URL}}" 
         style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%); color: white; padding: 18px 45px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 18px; box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3); transition: all 0.3s ease;">
        Verify Role
      </a>
    </div>

    <!-- Security notice -->
    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #f59e0b; margin: 25px 0;">
      <h3 style="color: #92400e; font-size: 16px; margin-bottom: 12px; font-weight: 600; display: flex; align-items: center;">
        <span style="margin-right: 8px;">⚡</span> Important Information
      </h3>
      <ul style="color: #92400e; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 8px;">This verification link expires in <strong>24 hours</strong> for security</li>
        <li style="margin-bottom: 8px;">Once verified, you can switch between roles in your dashboard</li>
        <li style="margin-bottom: 8px;">Each role may have different permissions and features</li>
        <li>If you didn't request this role, please ignore this email</li>
      </ul>
    </div>

    <!-- Role benefits -->
    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #22c55e;">
      <h3 style="color: #15803d; font-size: 18px; margin-bottom: 15px; font-weight: 600; display: flex; align-items: center;">
        <span style="margin-right: 10px;">✨</span> Multi-Role Benefits
      </h3>
      <div style="display: grid; gap: 10px;">
        <div style="display: flex; align-items: center; color: #166534; font-size: 14px;">
          <span style="margin-right: 10px;">🔄</span>
          <span>Switch between roles instantly</span>
        </div>
        <div style="display: flex; align-items: center; color: #166534; font-size: 14px;">
          <span style="margin-right: 10px;">🎯</span>
          <span>Access role-specific features</span>
        </div>
        <div style="display: flex; align-items: center; color: #166534; font-size: 14px;">
          <span style="margin-right: 10px;">📊</span>
          <span>Manage different types of projects</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 45px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">
        Need help? Contact our support at <a href="mailto:support@hubit.com" style="color: #0ea5e9; text-decoration: none;">support@hubit.com</a>
      </p>
      <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 0;">
        © {{CURRENT_YEAR}} HuBiT. All rights reserved.<br>
        <strong>Empowering multiple professional identities.</strong>
      </p>
    </div>

  </div>
</div>
`;

// Mapa de nombres de roles en inglés
const ROLE_DISPLAY_NAMES = {
  'particular': 'Individual User',
  'community_member': 'Community Member', 
  'service_provider': 'Service Provider',
  'property_administrator': 'Property Administrator'
} as const;

export interface EmailConfig {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class CustomEmailService {
  
  /**
   * Envía email de verificación de rol personalizado
   */
  static async sendRoleVerificationEmail(
    userId: string,
    userEmail: string,
    roleType: 'particular' | 'community_member' | 'service_provider' | 'property_administrator',
    verificationToken: string
  ): Promise<{ success: boolean; message: string; error?: string }> {
    
    try {
      // Obtener la URL del sitio
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                     (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
      
      const verificationUrl = `${siteUrl}/auth/verify-role?token=${verificationToken}`;
      
      // Log de debug
      console.log('🔗 Generating verification email:', {
        userEmail,
        roleType,
        verificationUrl: verificationUrl.substring(0, 50) + '...',
        siteUrl
      });
      
      // Reemplazar variables en la plantilla
      const emailHtml = ROLE_VERIFICATION_TEMPLATE
        .replace(/{{VERIFICATION_URL}}/g, verificationUrl)
        .replace(/{{ROLE_TYPE}}/g, ROLE_DISPLAY_NAMES[roleType] || roleType)
        .replace(/{{CURRENT_YEAR}}/g, new Date().getFullYear().toString());

      const emailConfig: EmailConfig = {
        to: userEmail,
        subject: `Verify Your New ${ROLE_DISPLAY_NAMES[roleType]} Role - HuBiT`,
        html: emailHtml,
        from: 'HuBiT Platform <noreply@hubit.com>'
      };

      console.log('📧 Sending email to:', userEmail);

      // Enviar email via API
      const response = await fetch('/api/email/send-custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailConfig)
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Email API error:', result);
        throw new Error(result.error || 'Error sending email');
      }

      console.log('✅ Email sent successfully:', {
        to: userEmail,
        messageId: result.messageId
      });

      // Crear notificación en el sistema
      await this.createNotification(userId, roleType);

      return {
        success: true,
        message: `Verification email sent successfully to ${userEmail}`
      };

    } catch (error) {
      console.error('❌ Error sending role verification email:', error);
      return {
        success: false,
        message: 'Failed to send verification email',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Crea notificación interna del sistema
   */
  private static async createNotification(userId: string, roleType: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: `Role Verification Required`,
          message: `Please check your email to verify your new ${ROLE_DISPLAY_NAMES[roleType as keyof typeof ROLE_DISPLAY_NAMES]} role.`,
          type: 'info',
          category: 'role_verification',
          is_read: false
        });

      if (error) {
        console.warn('Could not create notification:', error);
      } else {
        console.log('📬 Notification created successfully');
      }
    } catch (error) {
      console.warn('Could not create notification:', error);
      // No lanzamos error porque la notificación es secundaria
    }
  }

  /**
   * Valida configuración de email
   */
  static validateEmailConfig(): { isValid: boolean; missingVars: string[] } {
    const requiredVars = ['RESEND_API_KEY'];
    const missingVars: string[] = [];

    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    });

    console.log('🔧 Email config validation:', {
      isValid: missingVars.length === 0,
      missingVars,
      hasResendKey: !!process.env.RESEND_API_KEY
    });

    return {
      isValid: missingVars.length === 0,
      missingVars
    };
  }

  /**
   * Formatea el nombre del rol para mostrar
   */
  static getRoleDisplayName(roleType: string): string {
    return ROLE_DISPLAY_NAMES[roleType as keyof typeof ROLE_DISPLAY_NAMES] || roleType;
  }
}

export default CustomEmailService;
