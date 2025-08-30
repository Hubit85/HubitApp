
# Supabase Email Templates Configuration (English)

Complete guide to configure custom email templates in Supabase for the HuBiT project.

## 📧 Available Templates

### 1. **User Registration Confirmation** (Confirm signup)

```html
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);">
  <div style="background-color: white; padding: 40px 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border: 1px solid rgba(229, 231, 235, 0.6);">
    
    <!-- Header with logo -->
    <div style="text-align: center; margin-bottom: 35px;">
      <div style="display: inline-block; position: relative; margin-bottom: 25px;">
        <h1 style="color: #1e293b; font-size: 42px; margin: 0; font-weight: 800; background: linear-gradient(135deg, #3b82f6, #1d4ed8, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          HuBiT
        </h1>
        <div style="position: absolute; top: -8px; right: -12px; width: 16px; height: 16px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; animation: bounce 2s infinite;"></div>
      </div>
      <h2 style="color: #334155; font-size: 28px; margin: 0; font-weight: 600; line-height: 1.3;">
        Welcome to HuBiT! 🏡✨
      </h2>
    </div>

    <!-- Main message -->
    <div style="margin-bottom: 35px;">
      <p style="color: #475569; font-size: 18px; line-height: 1.7; margin-bottom: 20px; font-weight: 300;">
        Hello! Thank you for joining HuBiT, the platform that connects property owners with the best service professionals.
      </p>
      
      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
        To complete your registration and start using our platform, please confirm your email address by clicking the button below:
      </p>
    </div>

    <!-- Confirmation button -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%); color: white; padding: 18px 45px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 18px; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3); transition: all 0.3s ease; border: 1px solid rgba(59, 130, 246, 0.2);">
        Confirm My Account
      </a>
    </div>

    <!-- Features section -->
    <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #3b82f6;">
      <h3 style="color: #1e293b; font-size: 20px; margin-bottom: 18px; font-weight: 600; display: flex; align-items: center;">
        <span style="margin-right: 10px;">🚀</span> What can you do on HuBiT?
      </h3>
      <div style="display: grid; gap: 12px;">
        <div style="display: flex; align-items: center; color: #475569; font-size: 15px; line-height: 1.5;">
          <span style="margin-right: 12px; font-size: 18px;">📝</span>
          <span>Post budget requests for your projects</span>
        </div>
        <div style="display: flex; align-items: center; color: #475569; font-size: 15px; line-height: 1.5;">
          <span style="margin-right: 12px; font-size: 18px;">🔍</span>
          <span>Find verified professionals in your area</span>
        </div>
        <div style="display: flex; align-items: center; color: #475569; font-size: 15px; line-height: 1.5;">
          <span style="margin-right: 12px; font-size: 18px;">💬</span>
          <span>Communicate directly with service providers</span>
        </div>
        <div style="display: flex; align-items: center; color: #475569; font-size: 15px; line-height: 1.5;">
          <span style="margin-right: 12px; font-size: 18px;">⭐</span>
          <span>View real reviews and ratings</span>
        </div>
        <div style="display: flex; align-items: center; color: #475569; font-size: 15px; line-height: 1.5;">
          <span style="margin-right: 12px; font-size: 18px;">🚨</span>
          <span>Access 24/7 emergency services</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 45px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 14px; margin-bottom: 15px; font-style: italic;">
        If you didn't create this account, you can safely ignore this email.
      </p>
      <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 0;">
        © {{ now.Year }} HuBiT. All rights reserved.<br>
        <strong>Connecting homes with trusted professionals.</strong>
      </p>
    </div>

  </div>
</div>
```

### 2. **Role Verification Email** (Custom Template)

```html
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
          Role Type: <strong>{{ .RoleType }}</strong>
        </p>
      </div>
      
      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
        To verify and activate this new role, please click the button below. This will allow you to switch between your different roles within the platform.
      </p>
    </div>

    <!-- Verification button -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="{{ .ConfirmationURL }}" 
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
        © {{ now.Year }} HuBiT. All rights reserved.<br>
        <strong>Empowering multiple professional identities.</strong>
      </p>
    </div>

  </div>
</div>
```

### 3. **Password Reset Email**

```html
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);">
  <div style="background-color: white; padding: 40px 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border: 1px solid rgba(252, 165, 165, 0.6);">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 35px;">
      <div style="display: inline-block; position: relative; margin-bottom: 25px;">
        <h1 style="color: #1e293b; font-size: 42px; margin: 0; font-weight: 800; background: linear-gradient(135deg, #dc2626, #b91c1c, #991b1b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          HuBiT
        </h1>
        <div style="position: absolute; top: -8px; right: -12px; width: 16px; height: 16px; background: linear-gradient(135deg, #f87171, #dc2626); border-radius: 50%;"></div>
      </div>
      <h2 style="color: #7f1d1d; font-size: 28px; margin: 0; font-weight: 600; line-height: 1.3;">
        Reset Your Password 🔐
      </h2>
    </div>

    <!-- Main message -->
    <div style="margin-bottom: 35px;">
      <p style="color: #475569; font-size: 18px; line-height: 1.7; margin-bottom: 20px;">
        We received a request to reset the password for your HuBiT account.
      </p>
      
      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
        If you requested this change, click the button below to create a new password:
      </p>
    </div>

    <!-- Reset button -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%); color: white; padding: 18px 45px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 18px; box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);">
        Create New Password
      </a>
    </div>

    <!-- Security warning -->
    <div style="background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #dc2626; margin: 25px 0;">
      <h3 style="color: #7f1d1d; font-size: 16px; margin-bottom: 12px; font-weight: 600; display: flex; align-items: center;">
        <span style="margin-right: 8px;">⚠️</span> Security Notice
      </h3>
      <ul style="color: #7f1d1d; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 8px;">This link expires in <strong>24 hours</strong> for security</li>
        <li style="margin-bottom: 8px;">If you didn't request this change, you can safely ignore this email</li>
        <li style="margin-bottom: 8px;">Your account will remain secure and unchanged</li>
        <li>Consider using a strong, unique password</li>
      </ul>
    </div>

    <!-- Additional help -->
    <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); padding: 20px; border-radius: 12px; margin: 25px 0;">
      <h3 style="color: #334155; font-size: 16px; margin-bottom: 12px; font-weight: 600;">
        💡 Password Tips
      </h3>
      <ul style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 6px;">Use at least 8 characters</li>
        <li style="margin-bottom: 6px;">Include uppercase and lowercase letters</li>
        <li style="margin-bottom: 6px;">Add numbers and special characters</li>
        <li>Avoid common words or personal information</li>
      </ul>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 45px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">
        Need help? Contact our support at <a href="mailto:support@hubit.com" style="color: #dc2626; text-decoration: none;">support@hubit.com</a>
      </p>
      <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 0;">
        © {{ now.Year }} HuBiT. All rights reserved.<br>
        <strong>Keeping your account secure.</strong>
      </p>
    </div>

  </div>
</div>
```

### 4. **Magic Link Email**

```html
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);">
  <div style="background-color: white; padding: 40px 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border: 1px solid rgba(187, 247, 208, 0.6);">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 35px;">
      <div style="display: inline-block; position: relative; margin-bottom: 25px;">
        <h1 style="color: #1e293b; font-size: 42px; margin: 0; font-weight: 800; background: linear-gradient(135deg, #22c55e, #16a34a, #15803d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          HuBiT
        </h1>
        <div style="position: absolute; top: -8px; right: -12px; width: 16px; height: 16px; background: linear-gradient(135deg, #4ade80, #22c55e); border-radius: 50%; animation: pulse 2s infinite;"></div>
      </div>
      <h2 style="color: #15803d; font-size: 28px; margin: 0; font-weight: 600; line-height: 1.3;">
        Your HuBiT Access Link ✨
      </h2>
    </div>

    <!-- Main message -->
    <div style="margin-bottom: 35px;">
      <p style="color: #475569; font-size: 18px; line-height: 1.7; margin-bottom: 20px;">
        Hello! We received a request to access your HuBiT account.
      </p>
      
      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
        Click the magic link below to sign in securely without entering your password:
      </p>
    </div>

    <!-- Magic link button -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%); color: white; padding: 18px 45px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 18px; box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);">
        Access My Account
      </a>
    </div>

    <!-- Information section -->
    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #22c55e; margin: 25px 0;">
      <h3 style="color: #15803d; font-size: 16px; margin-bottom: 12px; font-weight: 600; display: flex; align-items: center;">
        <span style="margin-right: 8px;">✅</span> Quick & Secure Access
      </h3>
      <ul style="color: #166534; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 8px;">This link allows direct access without remembering your password</li>
        <li style="margin-bottom: 8px;">Expires in <strong>1 hour</strong> for security</li>
        <li style="margin-bottom: 8px;">Can only be used once</li>
        <li>Works on any device or browser</li>
      </ul>
    </div>

    <!-- Features reminder -->
    <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 20px; border-radius: 12px; margin: 25px 0;">
      <h3 style="color: #334155; font-size: 16px; margin-bottom: 15px; font-weight: 600; display: flex; align-items: center;">
        <span style="margin-right: 8px;">🚀</span> Ready to get started?
      </h3>
      <div style="display: grid; gap: 8px;">
        <div style="display: flex; align-items: center; color: #475569; font-size: 14px;">
          <span style="margin-right: 10px;">📋</span>
          <span>Manage your projects and requests</span>
        </div>
        <div style="display: flex; align-items: center; color: #475569; font-size: 14px;">
          <span style="margin-right: 10px;">👥</span>
          <span>Switch between your different roles</span>
        </div>
        <div style="display: flex; align-items: center; color: #475569; font-size: 14px;">
          <span style="margin-right: 10px;">💬</span>
          <span>Connect with service professionals</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 45px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">
        If you didn't request this access, you can safely ignore this email.
      </p>
      <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 0;">
        © {{ now.Year }} HuBiT. All rights reserved.<br>
        <strong>Seamless access, maximum security.</strong>
      </p>
    </div>

  </div>
</div>
```

## 🔧 Implementation Steps in Supabase

### Step 1: Access Email Templates
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your HuBiT project
3. Navigate to **Authentication** → **Email Templates**

### Step 2: Configure Each Template
1. **Confirm signup**: Use Template #1 above
2. **Magic Link**: Use Template #4 above  
3. **Reset Password**: Use Template #3 above
4. **Invite user**: Use Template #1 above (modify as needed)

### Step 3: Custom Role Verification Template
For the role verification email (Template #2), you'll need to create a custom email service since Supabase doesn't have a built-in template for this. Add this to your email service:

```typescript
// In your SupabaseEmailService.ts
export async function sendRoleVerificationEmail(
  userId: string, 
  roleType: string, 
  verificationToken: string,
  userEmail: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-role?token=${verificationToken}`;
  
  // Use the HTML template above and replace variables
  const emailHtml = roleVerificationTemplate
    .replace('{{ .ConfirmationURL }}', verificationUrl)
    .replace('{{ .RoleType }}', roleType)
    .replace('{{ now.Year }}', new Date().getFullYear().toString());
  
  // Send via your preferred email service (SendGrid, Mailgun, etc.)
  return await sendEmail({
    to: userEmail,
    subject: `Verify Your New Role - HuBiT`,
    html: emailHtml
  });
}
```

### Step 4: Configure Site URLs
In **Authentication** → **URL Configuration**:
```
Site URL: https://your-domain.vercel.app
Additional Redirect URLs:
- https://your-domain.vercel.app/auth/callback
- https://your-domain.vercel.app/auth/verify-role
- https://localhost:3000/auth/callback (for development)
```

### Step 5: Test Your Templates
1. Register a new test user
2. Request password reset
3. Try magic link login
4. Test role verification (through your custom service)

## 🎨 Customization Options

### Brand Colors Used:
- **Primary Blue**: `#3b82f6` (Registration, main CTAs)
- **Cyan**: `#0ea5e9` (Role verification) 
- **Red**: `#dc2626` (Password reset, security)
- **Green**: `#22c55e` (Magic link, success states)

### Typography:
- **Headings**: Segoe UI, 600-800 weight
- **Body**: Segoe UI, 300-400 weight  
- **Accent**: Gradient text effects for brand name

### Responsive Design:
- Max-width: 600px for email client compatibility
- Inline CSS for broad support
- Mobile-friendly padding and typography

## 📊 Advanced Features

### Email Analytics
Track email performance in Supabase Dashboard under **Authentication** → **Users**

### Custom SMTP (Optional)
To use your own email service:
1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Configure your provider (SendGrid, Mailgun, etc.)
3. Update templates with your custom branding

### Webhook Integration
Set up webhooks for advanced email triggers:

```sql
-- Example: Trigger email when role is verified
CREATE OR REPLACE FUNCTION notify_role_verified()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_verified = true AND OLD.is_verified = false THEN
    PERFORM net.http_post(
      url := 'https://your-domain.vercel.app/api/webhooks/role-verified',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := json_build_object(
        'user_id', NEW.user_id,
        'role_type', NEW.role_type,
        'verified_at', NEW.verification_confirmed_at
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_role_verified
  AFTER UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION notify_role_verified();
```

## 🚀 Ready to Deploy!

Copy and paste these templates into your Supabase Email Templates configuration. The modern, professional design will provide an excellent user experience for your HuBiT platform users.

**Key Features:**
- ✅ Modern, responsive design
- ✅ Consistent branding
- ✅ Security-focused messaging
- ✅ Clear call-to-actions
- ✅ Professional typography
- ✅ Cross-email-client compatibility

Your users will love the polished email experience! 🎉
