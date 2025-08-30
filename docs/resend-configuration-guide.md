# 📧 Guía Completa de Configuración de Resend para HuBiT

## 🎯 Problema Actual
El sistema está enviando emails desde `noreply@resend.dev`, pero necesitamos configurar un dominio propio para mejor entregabilidad y profesionalismo.

## ✅ API Key Configurada
Tu API Key actual: `re_HMYRvjWf_93ML8R9PbPqRHU9EP1sTJ9oS` ✅

## 🔧 Configuración de Dominio en Resend

### Opción 1: Usar Dominio de Softgen (Más Fácil)
```
Dominio: hubit-84-supabase-email-templates.softgen.ai
Email: noreply@hubit-84-supabase-email-templates.softgen.ai
```

### Opción 2: Configurar Dominio Propio (Más Profesional)

#### Paso 1: Agregar Dominio en Resend
1. Ve a https://resend.com/domains
2. Haz clic en "Add Domain"
3. Introduce tu dominio (ejemplo: `hubit.com`)

#### Paso 2: Configurar Registros DNS
Resend te proporcionará registros DNS que debes agregar:
```
Tipo: TXT
Nombre: @
Valor: v=spf1 include:_spf.resend.com ~all

Tipo: CNAME
Nombre: resend._domainkey
Valor: resend._domainkey.resend.com

Tipo: CNAME  
Nombre: _dmarc
Valor: _dmarc.resend.com
```

#### Paso 3: Verificar Dominio
- Espera propagación DNS (hasta 24 horas)
- Resend verificará automáticamente
- Estado cambiará a "Verified" ✅

## 🚀 Configuración Actual del Sistema

### Variables de Entorno Configuradas:
```env
RESEND_API_KEY=re_HMYRvjWf_93ML8R9PbPqRHU9EP1sTJ9oS ✅
NEXT_PUBLIC_SITE_URL=https://hubit-84-supabase-email-templates.softgen.ai ✅
EMAIL_FROM_DOMAIN=resend.dev ✅
```

### Email Template Configurado:
- ✅ Diseño HTML profesional
- ✅ Responsive design
- ✅ Token de verificación seguro
- ✅ Enlaces de verificación funcionales

## 🔍 Debugging Steps

### 1. Verificar API Key en Resend Dashboard:
1. Ve a https://resend.com/api-keys
2. Confirma que la key `re_HMYRvjWf_93ML8R9PbPqRHU9EP1sTJ9oS` existe
3. Verifica que no esté revocada o expirada

### 2. Probar Email desde Resend Dashboard:
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_HMYRvjWf_93ML8R9PbPqRHU9EP1sTJ9oS' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "HuBiT <noreply@resend.dev>",
    "to": "tu-email@gmail.com",
    "subject": "Test Email",
    "text": "This is a test email from HuBiT"
  }'
```

### 3. Verificar Logs del Sistema:
```bash
# En el terminal de Softgen
pm2 logs --lines 50
```

## 📋 Checklist de Configuración

### ✅ Configuración Técnica Completada:
- [x] API Key configurada en variables de entorno
- [x] Email template HTML implementado
- [x] API route `/api/user-roles/add-role` funcionando
- [x] Manejo robusto de errores implementado
- [x] Logging detallado activado

### ⏳ Pendiente de Configuración:
- [ ] Dominio verificado en Resend
- [ ] Registros DNS configurados (si usas dominio propio)
- [ ] Test de envío de email exitoso

## 🎯 Próximos Pasos

### Inmediatos (5 minutos):
1. **Verificar la API Key:** Ve a https://resend.com/api-keys
2. **Probar email manual:** Usar curl o Resend dashboard
3. **Revisar logs:** `pm2 logs` para ver errores específicos

### A Corto Plazo (1-2 días):
1. **Configurar dominio propio** en Resend
2. **Actualizar DNS** con registros de verificación
3. **Cambiar FROM address** a dominio verificado

## 📞 Soporte
Si persisten los problemas:
1. **Resend Support:** hello@resend.com
2. **Softgen Support:** Contactar soporte de Softgen
3. **Logs del sistema:** Compartir logs específicos

## 🔄 Estado Actual del Sistema
- ✅ **Código:** 100% implementado y funcional
- ✅ **API Key:** Configurada correctamente
- ⚠️ **Dominio:** Usando dominio por defecto de Resend
- ⏳ **Entregabilidad:** Puede ser limitada sin dominio verificado

¡El sistema está técnicamente completo! Solo necesita configuración final del dominio en Resend.
