# 📧 Templates de Email Personalizados para HuBiT

## Configuración en Supabase Dashboard

1. Ve a tu proyecto Supabase: https://djkrzbmgzfwagmripozi.supabase.co
2. En el panel izquierdo, haz clic en **"Authentication"**
3. Ve a la pestaña **"Email Templates"**
4. Personaliza cada template como se indica a continuación

---

## 1. 🎉 Confirmación de Registro (Signup Confirmation)

**Subject:** ¡Bienvenido a HuBiT! Confirma tu cuenta

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a HuBiT</title>
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
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Conectando propietarios con servicios de calidad</p>
        </div>
        
        <div class="content">
            <h2 class="welcome">¡Bienvenido a HuBiT! 🎉</h2>
            <p class="message">
                Estás a un paso de acceder a la plataforma que conecta propietarios y administradores de fincas con los mejores proveedores de servicios.
            </p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    ✨ Confirmar mi cuenta
                </a>
            </div>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🏢</div>
                    <div>
                        <strong>Gestiona tus propiedades</strong><br>
                        <span style="color: #6b7280; font-size: 14px;">Administra todas tus propiedades desde un solo lugar</span>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">💰</div>
                    <div>
                        <strong>Solicita presupuestos</strong><br>
                        <span style="color: #6b7280; font-size: 14px;">Recibe ofertas competitivas de proveedores verificados</span>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">⭐</div>
                    <div>
                        <strong>Sistema de valoraciones</strong><br>
                        <span style="color: #6b7280; font-size: 14px;">Encuentra los mejores servicios basados en reseñas reales</span>
                    </div>
                </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
                Si no creaste esta cuenta, puedes ignorar este email con total seguridad.
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text"><strong>HuBiT</strong> - La evolución en gestión de propiedades</p>
            <p class="footer-text">© 2025 HuBiT. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
```

---

## 2. 🔐 Recuperación de Contraseña (Password Recovery)

**Subject:** Recupera tu contraseña de HuBiT

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar Contraseña - HuBiT</title>
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
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Conectando propietarios con servicios de calidad</p>
        </div>
        
        <div class="content">
            <h2 class="title">🔐 Recuperar Contraseña</h2>
            <p class="message">
                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta HuBiT.
            </p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    🔑 Crear Nueva Contraseña
                </a>
            </div>
            
            <div class="security-note">
                <strong>🛡️ Nota de seguridad:</strong><br>
                Este enlace expirará en 1 hora por tu seguridad. Si no solicitaste este cambio, ignora este email y tu contraseña permanecerá sin cambios.
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
                Si tienes problemas con el enlace, copia y pega esta URL en tu navegador:<br>
                <span style="word-break: break-all;">{{ .ConfirmationURL }}</span>
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text"><strong>HuBiT</strong> - La evolución en gestión de propiedades</p>
            <p class="footer-text">© 2025 HuBiT. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
```

---

## 3. ✉️ Cambio de Email (Email Change)

**Subject:** Confirma tu nuevo email en HuBiT

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmar Nuevo Email - HuBiT</title>
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
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Conectando propietarios con servicios de calidad</p>
        </div>
        
        <div class="content">
            <h2 class="title">✉️ Confirmar Nuevo Email</h2>
            <p class="message">
                Has solicitado cambiar tu dirección de email en HuBiT. Para completar el cambio, confirma tu nueva dirección.
            </p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    ✅ Confirmar Nuevo Email
                </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
                Si no solicitaste este cambio, ignora este email y tu dirección actual permanecerá sin cambios.
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text"><strong>HuBiT</strong> - La evolución en gestión de propiedades</p>
            <p class="footer-text">© 2025 HuBiT. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
```

---

## 4. 🔐 Login Mágico (Magic Link)

**Subject:** Tu enlace de acceso a HuBiT

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso Directo - HuBiT</title>
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
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Conectando propietarios con servicios de calidad</p>
        </div>
        
        <div class="content">
            <h2 class="title">🔐 Acceso Directo a HuBiT</h2>
            <p class="message">
                Usa este enlace seguro para acceder directamente a tu cuenta sin necesidad de contraseña.
            </p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    🚀 Acceder a HuBiT
                </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
                Este enlace expirará en 1 hora por tu seguridad. Si no solicitaste este acceso, ignora este email.
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text"><strong>HuBiT</strong> - La evolución en gestión de propiedades</p>
            <p class="footer-text">© 2025 HuBiT. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
```

---

## 📋 Instrucciones de Configuración

### Paso 1: Acceder a Email Templates
1. Ve a https://djkrzbmgzfwagmripozi.supabase.co
2. Panel izquierdo → **Authentication**
3. Pestaña → **Email Templates**

### Paso 2: Personalizar cada Template
1. Selecciona **"Confirm signup"**
   - Copia y pega el **Subject** y **Body** del template 1
2. Selecciona **"Reset password"**
   - Copia y pega el **Subject** y **Body** del template 2
3. Selecciona **"Change email address"**
   - Copia y pega el **Subject** y **Body** del template 3
4. Selecciona **"Magic Link"**
   - Copia y pega el **Subject** y **Body** del template 4

### Paso 3: Guardar Cambios
- Haz clic en **"Save"** en cada template
- Los cambios se aplicarán inmediatamente

### Paso 4: Probar
- Registra un nuevo usuario para probar el email de confirmación
- Los nuevos emails tendrán el branding y funcionalidad de HuBiT

---

## ✅ Resultado Final

Los usuarios recibirán emails profesionales que:
- ✨ Muestran el branding de HuBiT
- 🏢 Explican las funcionalidades reales de la plataforma
- 🎨 Tienen diseño moderno y responsive
- 🔒 Mantienen toda la seguridad de Supabase
- 📱 Se ven perfectos en móvil y desktop