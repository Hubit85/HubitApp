# 📧 Custom English Email Templates for HuBiT

## Supabase Dashboard Configuration

1. Go to your Supabase project: https://djkrzbmgzfwagmripozi.supabase.co
2. In the left panel, click **"Authentication"**
3. Go to the **"Email Templates"** tab
4. Customize each template as indicated below

---

## 1. 🎉 Signup Confirmation

**Subject:** Welcome to HuBiT! Confirm your account

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to HuBiT</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; }
        .logo { color: white; font-size: 32px; font-weight: bold; margin: 0; text-decoration: none; }
        .content { padding: 40px 30px; }
        .welcome { color: #1f2937; font-size: 28px; font-weight: bold; margin: 0 0 20px; text-align: center; }
        .message { color: #6b7280; font-size: 16px; margin-bottom: 30px; text-align: center; }
        .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white !important; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .button:hover { opacity: 0.9; }
        .features { margin: 40px 0; }
        .feature { display: flex; align-items: center; margin: 20px 0; }
        .feature-icon { background: #dbeafe; color: #3b82f6; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 18px; }
        .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer-text { color: #6b7280; font-size: 14px; margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">HuBiT</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Connecting property owners with quality services</p>
        </div>
        
        <div class="content">
            <h2 class="welcome">Welcome to HuBiT! 🎉</h2>
            <p class="message">
                You're one step away from accessing the platform that connects property owners and estate administrators with the best service providers.
            </p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    ✨ Confirm My Account
                </a>
            </div>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🏢</div>
                    <div>
                        <strong>Manage Your Properties</strong><br>
                        <span style="color: #6b7280; font-size: 14px;">Administrate all your properties from one single place</span>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">💰</div>
                    <div>
                        <strong>Request Quotes</strong><br>
                        <span style="color: #6b7280; font-size: 14px;">Receive competitive offers from verified service providers</span>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">⭐</div>
                    <div>
                        <strong>Rating System</strong><br>
                        <span style="color: #6b7280; font-size: 14px;">Find the best services based on real reviews</span>
                    </div>
                </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
                If you didn't create this account, you can safely ignore this email.
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text"><strong>HuBiT</strong> - The evolution in property management</p>
            <p class="footer-text">© 2025 HuBiT. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

---

## 2. 🔐 Password Recovery

**Subject:** Reset your HuBiT password

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Recovery - HuBiT</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center; }
        .logo { color: white; font-size: 32px; font-weight: bold; margin: 0; text-decoration: none; }
        .content { padding: 40px 30px; }
        .title { color: #1f2937; font-size: 24px; font-weight: bold; margin: 0 0 20px; text-align: center; }
        .message { color: #6b7280; font-size: 16px; margin-bottom: 30px; text-align: center; }
        .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white !important; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .security-note { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer-text { color: #6b7280; font-size: 14px; margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">HuBiT</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Connecting property owners with quality services</p>
        </div>
        
        <div class="content">
            <h2 class="title">🔐 Reset Your Password</h2>
            <p class="message">
                We received a request to reset the password for your HuBiT account.
            </p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    🔑 Create New Password
                </a>
            </div>
            
            <div class="security-note">
                <strong>🛡️ Security Note:</strong><br>
                This link will expire in 1 hour for your security. If you didn't request this change, ignore this email and your password will remain unchanged.
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
                If you're having trouble with the link, copy and paste this URL into your browser:<br>
                <span style="word-break: break-all;">{{ .ConfirmationURL }}</span>
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text"><strong>HuBiT</strong> - The evolution in property management</p>
            <p class="footer-text">© 2025 HuBiT. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

---

## 3. ✉️ Email Change Confirmation

**Subject:** Confirm your new email address on HuBiT

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm New Email - HuBiT</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 30px; text-align: center; }
        .logo { color: white; font-size: 32px; font-weight: bold; margin: 0; text-decoration: none; }
        .content { padding: 40px 30px; }
        .title { color: #1f2937; font-size: 24px; font-weight: bold; margin: 0 0 20px; text-align: center; }
        .message { color: #6b7280; font-size: 16px; margin-bottom: 30px; text-align: center; }
        .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white !important; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer-text { color: #6b7280; font-size: 14px; margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">HuBiT</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Connecting property owners with quality services</p>
        </div>
        
        <div class="content">
            <h2 class="title">✉️ Confirm New Email Address</h2>
            <p class="message">
                You've requested to change your email address on HuBiT. To complete the change, please confirm your new address.
            </p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    ✅ Confirm New Email
                </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
                If you didn't request this change, ignore this email and your current address will remain unchanged.
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text"><strong>HuBiT</strong> - The evolution in property management</p>
            <p class="footer-text">© 2025 HuBiT. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

---

## 4. 🔐 Magic Link Login

**Subject:** Your HuBiT access link

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Direct Access - HuBiT</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 40px 30px; text-align: center; }
        .logo { color: white; font-size: 32px; font-weight: bold; margin: 0; text-decoration: none; }
        .content { padding: 40px 30px; }
        .title { color: #1f2937; font-size: 24px; font-weight: bold; margin: 0 0 20px; text-align: center; }
        .message { color: #6b7280; font-size: 16px; margin-bottom: 30px; text-align: center; }
        .button { display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white !important; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer-text { color: #6b7280; font-size: 14px; margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">HuBiT</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Connecting property owners with quality services</p>
        </div>
        
        <div class="content">
            <h2 class="title">🔐 Direct Access to HuBiT</h2>
            <p class="message">
                Use this secure link to access your account directly without needing a password.
            </p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    🚀 Access HuBiT
                </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
                This link will expire in 1 hour for your security. If you didn't request this access, ignore this email.
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text"><strong>HuBiT</strong> - The evolution in property management</p>
            <p class="footer-text">© 2025 HuBiT. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

---

## 📋 Configuration Instructions

### Step 1: Access Email Templates
1. Go to https://djkrzbmgzfwagmripozi.supabase.co
2. Left panel → **Authentication**
3. Tab → **Email Templates**

### Step 2: Customize Each Template
1. Select **"Confirm signup"**
   - Copy and paste the **Subject** and **Body** from template 1
2. Select **"Reset password"**
   - Copy and paste the **Subject** and **Body** from template 2
3. Select **"Change email address"**
   - Copy and paste the **Subject** and **Body** from template 3
4. Select **"Magic Link"**
   - Copy and paste the **Subject** and **Body** from template 4

### Step 3: Save Changes
- Click **"Save"** on each template
- Changes will be applied immediately

### Step 4: Test
- Register a new user to test the confirmation email
- The new emails will have HuBiT branding and functionality

---

## ✅ Final Result

Users will receive professional emails that:
- ✨ Display HuBiT branding
- 🏢 Explain the platform's real functionality in English
- 🎨 Have modern and responsive design
- 🔒 Maintain all Supabase security features
- 📱 Look perfect on mobile and desktop