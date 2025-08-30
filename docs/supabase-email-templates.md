# Configuración de Plantillas de Email en Supabase

Esta guía te ayudará a configurar las plantillas de email personalizadas en Supabase para el proyecto HuBiT.

## 📋 Índice
- [Acceder a la configuración de Auth](#acceder-a-la-configuración-de-auth)
- [Plantillas disponibles](#plantillas-disponibles)
- [Configuración paso a paso](#configuración-paso-a-paso)
- [Variables disponibles](#variables-disponibles)
- [Plantillas HTML personalizadas](#plantillas-html-personalizadas)

## 🔧 Acceder a la configuración de Auth

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto HuBiT
3. En el menú lateral, ve a **Authentication** > **Email Templates**

## 📧 Plantillas disponibles

Supabase proporciona 4 tipos de plantillas de email que puedes personalizar:

### 1. **Confirmación de registro** (Confirm signup)
Enviado cuando un usuario se registra por primera vez.

### 2. **Invitación de usuario** (Invite user)  
Enviado when invites a new user to join.

### 3. **Link mágico** (Magic Link)
Enviado para autenticación sin contraseña.

### 4. **Recuperación de contraseña** (Reset Password)
Enviado cuando un usuario solicita restablecer su contraseña.

## ⚙️ Configuración paso a paso

### 1. Configurar la plantilla de confirmación de registro

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header con logo -->
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://djkrzbmgzfwagmripozi.supabase.co/storage/v1/object/public/documents/logos/HuBiT-logo-white.svg" 
           alt="HuBiT" style="height: 60px; margin-bottom: 20px;">
      <h1 style="color: #1f2937; font-size: 28px; margin: 0; font-weight: 600;">
        ¡Bienvenido a HuBiT! 🏡
      </h1>
    </div>

    <!-- Mensaje principal -->
    <div style="margin-bottom: 30px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        ¡Hola! Gracias por unirte a HuBiT, la plataforma que conecta propietarios con los mejores profesionales de servicios.
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
        Para completar tu registro y comenzar a utilizar nuestra plataforma, por favor confirma tu dirección de email haciendo clic en el botón de abajo:
      </p>
    </div>

    <!-- Botón de confirmación -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: all 0.3s ease;">
        Confirmar mi cuenta
      </a>
    </div>

    <!-- Información adicional -->
    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">
        ¿Qué puedes hacer en HuBiT?
      </h3>
      <ul style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 8px;">📝 Publicar solicitudes de presupuesto para tus proyectos</li>
        <li style="margin-bottom: 8px;">🔍 Encontrar profesionales verificados en tu área</li>
        <li style="margin-bottom: 8px;">💬 Comunicarte directamente con los proveedores</li>
        <li style="margin-bottom: 8px;">⭐ Ver reseñas y calificaciones reales</li>
        <li style="margin-bottom: 8px;">🚨 Acceder a servicios de emergencia 24/7</li>
      </ul>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
        Si no creaste esta cuenta, puedes ignorar este email.
      </p>
      <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
        © {{ now.Year }} HuBiT. Todos los derechos reservados.<br>
        Conectamos hogares con profesionales de confianza.
      </p>
    </div>

  </div>
</div>
```

### 2. Configurar la plantilla de recuperación de contraseña

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://djkrzbmgzfwagmripozi.supabase.co/storage/v1/object/public/documents/logos/HuBiT-logo-white.svg" 
           alt="HuBiT" style="height: 60px; margin-bottom: 20px;">
      <h1 style="color: #dc2626; font-size: 28px; margin: 0; font-weight: 600;">
        Restablecer contraseña 🔐
      </h1>
    </div>

    <!-- Mensaje principal -->
    <div style="margin-bottom: 30px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en HuBiT.
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
        Si solicitaste este cambio, haz clic en el botón de abajo para crear una nueva contraseña:
      </p>
    </div>

    <!-- Botón de acción -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Crear nueva contraseña
      </a>
    </div>

    <!-- Aviso de seguridad -->
    <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 25px 0;">
      <h3 style="color: #dc2626; font-size: 16px; margin-bottom: 10px;">
        ⚠️ Importante
      </h3>
      <p style="color: #7f1d1d; font-size: 14px; line-height: 1.6; margin: 0;">
        Este enlace expirará en 24 horas por seguridad. Si no solicitaste este cambio, puedes ignorar este email - tu cuenta permanecerá segura.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
        ¿Necesitas ayuda? Contacta nuestro soporte en support@hubit.es
      </p>
      <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
        © {{ now.Year }} HuBiT. Todos los derechos reservados.
      </p>
    </div>

  </div>
</div>
```

### 3. Configurar la plantilla de Magic Link

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://djkrzbmgzfwagmripozi.supabase.co/storage/v1/object/public/documents/logos/HuBiT-logo-white.svg" 
           alt="HuBiT" style="height: 60px; margin-bottom: 20px;">
      <h1 style="color: #059669; font-size: 28px; margin: 0; font-weight: 600;">
        Tu acceso a HuBiT ✨
      </h1>
    </div>

    <!-- Mensaje principal -->
    <div style="margin-bottom: 30px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        ¡Hola! Hemos recibido una solicitud para acceder a tu cuenta de HuBiT.
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
        Haz clic en el enlace mágico de abajo para iniciar sesión de forma segura:
      </p>
    </div>

    <!-- Botón de acceso -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; background: linear-gradient(135deg, #059669, #047857); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Acceder a mi cuenta
      </a>
    </div>

    <!-- Información -->
    <div style="background-color: #f0f9f5; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; margin: 25px 0;">
      <h3 style="color: #059669; font-size: 16px; margin-bottom: 10px;">
        ✅ Acceso rápido y seguro
      </h3>
      <p style="color: #065f46; font-size: 14px; line-height: 1.6; margin: 0;">
        Este enlace te permitirá acceder directamente sin necesidad de recordar tu contraseña. Expira en 1 hora por seguridad.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
        Si no solicitaste este acceso, puedes ignorar este email.
      </p>
      <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
        © {{ now.Year }} HuBiT. Todos los derechos reservados.
      </p>
    </div>

  </div>
</div>
```

## 🔧 Variables disponibles

Supabase proporciona estas variables que puedes usar en tus plantillas:

### Variables generales
- `{{ .ConfirmationURL }}` - URL de confirmación/acción
- `{{ .Token }}` - Token de confirmación
- `{{ .TokenHash }}` - Hash del token
- `{{ .SiteURL }}` - URL base de tu sitio
- `{{ .Email }}` - Email del usuario

### Variables de tiempo
- `{{ now.Year }}` - Año actual
- `{{ now.Month }}` - Mes actual
- `{{ now.Day }}` - Día actual

## 📱 Configuración adicional

### 1. Configurar URLs de redirección

En **Authentication** > **URL Configuration**:

```
Site URL: https://tu-dominio.vercel.app
Additional Redirect URLs: 
- https://tu-dominio.vercel.app/auth/callback
- https://localhost:3000/auth/callback
```

### 2. Configurar SMTP personalizado (Opcional)

Para usar tu propio servidor SMTP:

1. Ve a **Authentication** > **Settings** > **SMTP Settings**
2. Configura tu proveedor SMTP
3. Actualiza las plantillas con tu branding personalizado

## 🎨 Mejores prácticas

### 1. **Diseño responsive**
- Usa `max-width: 600px` para compatibilidad con todos los clientes de email
- Evita CSS complejo, usa estilos inline

### 2. **Branding consistente**
- Mantén los colores de tu marca: #3b82f6 (azul), #059669 (verde), #dc2626 (rojo)
- Usa tu logo y tipografías corporativas

### 3. **Seguridad**
- Los enlaces expiran automáticamente
- Incluye avisos sobre qué hacer si no se solicitó la acción

### 4. **Accesibilidad**
- Usa contraste adecuado
- Incluye texto alternativo en imágenes
- Estructura clara con encabezados

## 🧪 Testing

Para probar tus plantillas:

1. Registra un nuevo usuario de prueba
2. Solicita restablecer contraseña 
3. Verifica que los emails lleguen correctamente
4. Comprueba que los enlaces funcionen

## ⚡ Automatización con Webhooks

Para notificaciones avanzadas, configura webhooks en **Database** > **Webhooks**:

```sql
-- Ejemplo: Notificar cuando se crea una nueva solicitud de presupuesto
CREATE OR REPLACE FUNCTION notify_new_budget_request()
RETURNS trigger AS $$
BEGIN
  PERFORM
    net.http_post(
      url:='https://tu-dominio.vercel.app/api/webhooks/budget-request',
      headers:='{"Content-Type": "application/json"}'::jsonb,
      body:=json_build_object(
        'event', 'budget_request.created',
        'data', row_to_json(NEW)
      )::text
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_budget_request_created
  AFTER INSERT ON budget_requests
  FOR EACH ROW EXECUTE FUNCTION notify_new_budget_request();
```

¡Con esta configuración tendrás un sistema de emails profesional y personalizado para HuBiT! 🎉