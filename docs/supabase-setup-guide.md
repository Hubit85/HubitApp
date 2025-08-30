
# HuBiT Supabase Setup Guide

## 📋 Requisitos previos
- Cuenta de Supabase activa
- Proyecto de Supabase creado
- Acceso al panel de administración de Supabase

## 🚀 Pasos para configurar la base de datos

### 1. Acceder al SQL Editor
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Navega a **SQL Editor** en el menú lateral
3. Crea una nueva consulta

### 2. Ejecutar el script de configuración
1. Copia todo el contenido del archivo `database-setup.sql`
2. Pégalo en el SQL Editor
3. Haz clic en **Run** para ejecutar el script

### 3. Verificar la instalación
Después de ejecutar el script, deberías ver estas tablas en **Table Editor**:
- `profiles` - Perfiles de usuario
- `properties` - Propiedades de los usuarios
- `budget_requests` - Solicitudes de presupuesto

### 4. Configurar autenticación
1. Ve a **Authentication > Settings**
2. En **Site URL** agrega: `http://localhost:3000`
3. En **Redirect URLs** agrega: `http://localhost:3000/dashboard`

### 5. Obtener credenciales
Las credenciales ya están configuradas en tu proyecto:
```
URL: https://djkrzbmgzfwagmripozi.supabase.co
ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔧 Funcionalidades habilitadas

### ✅ Autenticación completa
- Registro de usuarios
- Inicio de sesión
- Gestión de sesiones
- Perfiles de usuario automáticos

### ✅ Gestión de propiedades
- Crear propiedades (residencial, comercial, mixto)
- Ver lista de propiedades del usuario
- Información detallada de cada propiedad

### ✅ Solicitudes de presupuesto
- Crear solicitudes categorizadas
- Vincular solicitudes a propiedades
- Gestionar estados de solicitudes
- Rangos de presupuesto

### ✅ Seguridad implementada
- Row Level Security (RLS) habilitado
- Políticas de acceso por usuario
- Protección de datos sensibles

## 🧪 Probar la integración

1. **Registra un usuario nuevo**
   - Ve a `/auth/register`
   - Completa el formulario
   - Verifica que se cree el perfil automáticamente

2. **Crea una propiedad**
   - Ve al Dashboard > Propiedades
   - Crea tu primera propiedad
   - Verifica que aparezca en la lista

3. **Crea una solicitud de presupuesto**
   - Ve al Dashboard > Solicitudes
   - Crea una nueva solicitud
   - Vincula a una propiedad existente

## 🔍 Troubleshooting

### Error: "relation does not exist"
- Asegúrate de haber ejecutado todo el script SQL
- Verifica que las tablas aparezcan en Table Editor

### Error: "permission denied"
- Revisa que RLS esté configurado correctamente
- Verifica las políticas de seguridad

### Error de autenticación
- Confirma que las URLs de redirect estén configuradas
- Verifica las credenciales en `.env.local`

## 📊 Próximos pasos
Una vez configurada la base de datos, puedes:
1. Personalizar los formularios de propiedades
2. Agregar más categorías de servicios
3. Implementar sistema de notificaciones
4. Crear dashboard de analytics
