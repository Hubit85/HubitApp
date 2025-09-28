# 📚 Documentación Completa de API - HuBiT 9.0

## 🎯 **INTRODUCCIÓN A LA API**

### **Arquitectura General**
- **Framework**: Next.js API Routes
- **Base de Datos**: Supabase PostgreSQL
- **Autenticación**: Supabase Auth + JWT
- **Validación**: Zod schemas
- **Rate Limiting**: Implementación personalizada
- **Documentación**: OpenAPI 3.0 compatible

### **Base URL**
```
Production: https://hubit.app/api
Development: http://localhost:3000/api
```

### **Autenticación**
```typescript
// Headers requeridos para endpoints autenticados
Headers: {
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

## 🔐 **ENDPOINTS DE AUTENTICACIÓN**

### **POST /auth/login**
Autenticar usuario existente

#### **Request**
```typescript
interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}
```

#### **Response**
```typescript
interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    profile?: UserProfile;
    roles: UserRole[];
  };
  session?: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  message?: string;
}
```

#### **Ejemplo**
```bash
curl -X POST https://hubit.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

### **GET /auth/profile**
Obtener perfil del usuario autenticado

#### **Headers**
```
Authorization: Bearer <token>
```

#### **Response**
```typescript
interface ProfileResponse {
  success: boolean;
  profile?: {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    address?: string;
    user_type: 'particular' | 'service_provider' | 'property_administrator';
    created_at: string;
    updated_at: string;
  };
  roles?: UserRole[];
  message?: string;
}
```

## 👥 **ENDPOINTS DE USUARIOS**

### **GET /users**
Listar usuarios (solo administradores)

#### **Query Parameters**
```typescript
interface UsersQuery {
  page?: number;        // Default: 1
  limit?: number;       // Default: 20, Max: 100
  search?: string;      // Buscar por nombre o email
  role?: string;        // Filtrar por tipo de rol
  verified?: boolean;   // Filtrar por verificación
  active?: boolean;     // Filtrar por estado activo
}
```

#### **Response**
```typescript
interface UsersResponse {
  success: boolean;
  data?: {
    users: UserProfile[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  message?: string;
}
```

### **PUT /users/[id]**
Actualizar usuario específico

#### **Request**
```typescript
interface UpdateUserRequest {
  full_name?: string;
  phone?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  province?: string;
  preferences?: Record<string, any>;
}
```

## 🏢 **ENDPOINTS DE PROPIEDADES**

### **GET /properties**
Listar propiedades del usuario

#### **Query Parameters**
```typescript
interface PropertiesQuery {
  page?: number;
  limit?: number;
  type?: 'residential' | 'commercial' | 'industrial';
  status?: 'active' | 'inactive';
  city?: string;
  province?: string;
}
```

#### **Response**
```typescript
interface PropertiesResponse {
  success: boolean;
  data?: {
    properties: Property[];
    pagination: PaginationInfo;
  };
  message?: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  postal_code: string;
  city: string;
  province: string;
  property_type: string;
  units_count: number;
  owner_id: string;
  administrator_id?: string;
  created_at: string;
  updated_at: string;
}
```

### **POST /properties**
Crear nueva propiedad

#### **Request**
```typescript
interface CreatePropertyRequest {
  name: string;
  address: string;
  postal_code: string;
  city: string;
  province: string;
  property_type: 'residential' | 'commercial' | 'industrial';
  units_count: number;
  description?: string;
  contact_phone?: string;
  contact_email?: string;
}
```

#### **Response**
```typescript
interface CreatePropertyResponse {
  success: boolean;
  property?: Property;
  message?: string;
}
```

## 💰 **ENDPOINTS DE PRESUPUESTOS**

### **GET /budget-requests**
Listar solicitudes de presupuesto

#### **Query Parameters**
```typescript
interface BudgetRequestsQuery {
  page?: number;
  limit?: number;
  status?: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';
  category?: string;
  urgency?: 'low' | 'normal' | 'high' | 'urgent';
  property_id?: string;
  user_id?: string;
  created_after?: string; // ISO date
  created_before?: string; // ISO date
}
```

#### **Response**
```typescript
interface BudgetRequestsResponse {
  success: boolean;
  data?: {
    requests: BudgetRequest[];
    pagination: PaginationInfo;
    stats?: {
      total: number;
      by_status: Record<string, number>;
      by_category: Record<string, number>;
    };
  };
  message?: string;
}

interface BudgetRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  urgency: 'low' | 'normal' | 'high' | 'urgent';
  status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';
  budget_min?: number;
  budget_max?: number;
  preferred_date?: string;
  deadline?: string;
  property_id: string;
  user_id: string;
  attachments?: FileAttachment[];
  quotes_count: number;
  created_at: string;
  updated_at: string;
}
```

### **POST /budget-requests**
Crear nueva solicitud de presupuesto

#### **Request**
```typescript
interface CreateBudgetRequestRequest {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  urgency: 'low' | 'normal' | 'high' | 'urgent';
  budget_min?: number;
  budget_max?: number;
  preferred_date?: string;
  deadline?: string;
  property_id: string;
  location_details?: string;
  special_requirements?: string;
  attachments?: string[]; // File URLs
}
```

### **POST /budget-requests/[id]/publish**
Publicar solicitud de presupuesto

#### **Request**
```typescript
interface PublishBudgetRequestRequest {
  notify_providers?: boolean; // Default: true
  max_quotes?: number;        // Default: 10
  auto_select?: boolean;      // Default: false
}
```

#### **Response**
```typescript
interface PublishBudgetRequestResponse {
  success: boolean;
  data?: {
    request: BudgetRequest;
    providers_notified: number;
    estimated_quotes: number;
  };
  message?: string;
}
```

## 💼 **ENDPOINTS DE PRESUPUESTOS (PROVEEDORES)**

### **GET /quotes**
Listar presupuestos enviados por el proveedor

#### **Query Parameters**
```typescript
interface QuotesQuery {
  page?: number;
  limit?: number;
  status?: 'pending' | 'accepted' | 'rejected' | 'expired';
  budget_request_id?: string;
  created_after?: string;
  created_before?: string;
}
```

### **POST /quotes**
Enviar presupuesto para una solicitud

#### **Request**
```typescript
interface CreateQuoteRequest {
  budget_request_id: string;
  total_amount: number;
  description: string;
  breakdown?: QuoteBreakdownItem[];
  estimated_duration: number; // en días
  start_date?: string;
  warranty_period?: number; // en meses
  terms_and_conditions?: string;
  attachments?: string[];
}

interface QuoteBreakdownItem {
  concept: string;
  quantity: number;
  unit_price: number;
  total: number;
}
```

### **GET /quotes/[id]/accept**
Aceptar presupuesto (solo propietarios)

## 📋 **ENDPOINTS DE CONTRATOS**

### **GET /contracts**
Listar contratos

#### **Query Parameters**
```typescript
interface ContractsQuery {
  page?: number;
  limit?: number;
  status?: 'draft' | 'pending_signature' | 'signed' | 'in_progress' | 'completed' | 'cancelled';
  role?: 'client' | 'provider';
}
```

### **POST /contracts**
Crear nuevo contrato

#### **Request**
```typescript
interface CreateContractRequest {
  quote_id: string;
  terms: ContractTerms;
  payment_schedule?: PaymentSchedule[];
  milestones?: ContractMilestone[];
}
```

### **POST /contracts/[id]/sign**
Firmar contrato

#### **Request**
```typescript
interface SignContractRequest {
  signature: string; // Base64 signature image
  ip_address?: string;
  user_agent?: string;
}
```

## 📊 **ENDPOINTS DE NOTIFICACIONES**

### **GET /notifications**
Obtener notificaciones del usuario

#### **Query Parameters**
```typescript
interface NotificationsQuery {
  page?: number;
  limit?: number;
  type?: 'budget_request' | 'quote' | 'contract' | 'payment' | 'system';
  status?: 'unread' | 'read' | 'archived';
  created_after?: string;
}
```

#### **Response**
```typescript
interface NotificationsResponse {
  success: boolean;
  data?: {
    notifications: Notification[];
    pagination: PaginationInfo;
    unread_count: number;
  };
  message?: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  user_id: string;
  created_at: string;
}
```

### **PUT /notifications/[id]/read**
Marcar notificación como leída

### **PUT /notifications/mark-all-read**
Marcar todas las notificaciones como leídas

## 💳 **ENDPOINTS DE PAGOS**

### **GET /payments**
Listar pagos del usuario

#### **Response**
```typescript
interface PaymentsResponse {
  success: boolean;
  data?: {
    payments: Payment[];
    pagination: PaginationInfo;
    total_amount: number;
  };
  message?: string;
}

interface Payment {
  id: string;
  contract_id: string;
  amount: number;
  currency: 'EUR';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  payment_method: 'stripe' | 'paypal' | 'bank_transfer';
  stripe_payment_intent_id?: string;
  paypal_order_id?: string;
  created_at: string;
  processed_at?: string;
}
```

### **POST /payments/intent**
Crear intención de pago

#### **Request**
```typescript
interface CreatePaymentIntentRequest {
  contract_id: string;
  amount: number;
  currency: 'EUR';
  payment_method: 'stripe' | 'paypal';
  description?: string;
}
```

### **POST /payments/confirm**
Confirmar pago

#### **Request**
```typescript
interface ConfirmPaymentRequest {
  payment_intent_id: string;
  payment_method_id?: string; // Para Stripe
  paypal_order_id?: string;   // Para PayPal
}
```

## 📈 **ENDPOINTS DE ANALYTICS**

### **GET /analytics/dashboard**
Obtener datos del dashboard analítico

#### **Query Parameters**
```typescript
interface DashboardAnalyticsQuery {
  period?: '7d' | '30d' | '90d' | '1y';
  role?: string;
  include_comparison?: boolean;
}
```

#### **Response**
```typescript
interface DashboardAnalyticsResponse {
  success: boolean;
  data?: {
    summary: {
      total_requests: number;
      total_quotes: number;
      total_contracts: number;
      total_revenue: number;
      growth_percentage: number;
    };
    charts: {
      requests_by_date: ChartDataPoint[];
      quotes_by_status: ChartDataPoint[];
      revenue_by_month: ChartDataPoint[];
      categories_distribution: ChartDataPoint[];
    };
    recent_activity: ActivityItem[];
  };
  message?: string;
}
```

## 🔧 **ENDPOINTS DE SISTEMA**

### **GET /debug/env-status**
Verificar estado del entorno (desarrollo)

### **GET /debug/supabase-config**
Verificar configuración de Supabase

### **GET /test/supabase-connection**
Probar conexión con Supabase

## 📄 **SCHEMAS DE VALIDACIÓN**

### **Zod Schemas Principales**
```typescript
// User Profile Schema
export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+34\d{9}$/).optional(),
  address: z.string().max(255).optional(),
  postal_code: z.string().regex(/^\d{5}$/).optional(),
  city: z.string().max(100).optional(),
  province: z.string().max(100).optional(),
  user_type: z.enum(['particular', 'service_provider', 'property_administrator']),
});

// Budget Request Schema
export const BudgetRequestSchema = z.object({
  title: z.string().min(10).max(200),
  description: z.string().min(50).max(2000),
  category: z.string().min(1),
  urgency: z.enum(['low', 'normal', 'high', 'urgent']),
  budget_min: z.number().positive().optional(),
  budget_max: z.number().positive().optional(),
  property_id: z.string().uuid(),
  preferred_date: z.string().datetime().optional(),
  deadline: z.string().datetime().optional(),
}).refine(data => {
  if (data.budget_min && data.budget_max) {
    return data.budget_max >= data.budget_min;
  }
  return true;
}, {
  message: "Budget max must be greater than or equal to budget min",
});

// Quote Schema
export const QuoteSchema = z.object({
  budget_request_id: z.string().uuid(),
  total_amount: z.number().positive(),
  description: z.string().min(50).max(2000),
  estimated_duration: z.number().positive(),
  start_date: z.string().datetime().optional(),
  warranty_period: z.number().positive().optional(),
});
```

## 🚨 **MANEJO DE ERRORES**

### **Códigos de Error Estándar**
```typescript
// Error Response Format
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Common Error Codes
enum ErrorCodes {
  // Authentication
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  AUTH_INSUFFICIENT_PERMISSIONS = 'AUTH_INSUFFICIENT_PERMISSIONS',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Business Logic
  BUDGET_REQUEST_NOT_FOUND = 'BUDGET_REQUEST_NOT_FOUND',
  QUOTE_ALREADY_EXISTS = 'QUOTE_ALREADY_EXISTS',
  CONTRACT_ALREADY_SIGNED = 'CONTRACT_ALREADY_SIGNED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  
  // System
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
}
```

### **Ejemplos de Respuestas de Error**
```typescript
// 400 Bad Request
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos proporcionados no son válidos",
    "details": {
      "email": ["Email format is invalid"],
      "phone": ["Phone number must start with +34"]
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}

// 401 Unauthorized
{
  "success": false,
  "error": {
    "code": "AUTH_TOKEN_EXPIRED",
    "message": "Token de acceso ha expirado"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}

// 403 Forbidden
{
  "success": false,
  "error": {
    "code": "AUTH_INSUFFICIENT_PERMISSIONS",
    "message": "No tienes permisos para realizar esta acción"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}

// 429 Rate Limited
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Demasiadas solicitudes. Intenta de nuevo en 60 segundos"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔒 **SEGURIDAD Y MEJORES PRÁCTICAS**

### **Rate Limiting**
```typescript
// Rate limits por endpoint
const RATE_LIMITS = {
  '/auth/login': { requests: 5, window: '15m' },
  '/budget-requests': { requests: 10, window: '1h' },
  '/quotes': { requests: 20, window: '1h' },
  '/notifications': { requests: 100, window: '1h' },
  default: { requests: 60, window: '1h' }
};
```

### **Validación de Entrada**
- Todos los endpoints validan entrada con Zod schemas
- Sanitización automática de datos
- Prevención de SQL injection
- Validación de tipos de archivo en uploads

### **Autenticación y Autorización**
- JWT tokens con expiración configurable
- Refresh tokens para renovación automática
- Role-based access control (RBAC)
- Verificación de permisos por endpoint

### **Logging y Monitoring**
- Log de todas las requests con metadata
- Tracking de errores con stack traces
- Métricas de performance por endpoint
- Alertas automáticas para errores críticos

## 📋 **TESTING DE API**

### **Collection de Postman/Insomnia**
```json
{
  "name": "HuBiT API",
  "requests": [
    {
      "name": "Login",
      "method": "POST",
      "url": "{{base_url}}/auth/login",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "email": "test@example.com",
        "password": "password123"
      }
    }
  ]
}
```

### **Scripts de Testing Automatizado**
```bash
# Ejecutar tests de API
npm run test:api

# Testing con diferentes entornos
npm run test:api:dev
npm run test:api:staging
npm run test:api:production
```

Esta documentación API completa proporciona toda la información necesaria para integrar con HuBiT 9.0, incluyendo endpoints, schemas, manejo de errores y mejores prácticas de seguridad.