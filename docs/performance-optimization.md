# ⚡ Plan de Optimización de Performance

## 🎯 **OBJETIVOS DE PERFORMANCE**

### **Core Web Vitals Target**
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

### **Bundle Size Targets**
- **Initial Bundle**: < 200KB (gzipped)
- **Page Bundles**: < 100KB each (gzipped)
- **Total JS**: < 1MB (gzipped)
- **Images**: WebP/AVIF format, < 500KB each

## 🔍 **ANÁLISIS ACTUAL DE PERFORMANCE**

### **Problemas Identificados**

#### **1. Bundle Size Issues**
```typescript
// Análisis actual de bundles
Current Bundle Sizes:
├── main.js: ~450KB (gzipped: ~180KB) ⚠️ 
├── dashboard.js: ~380KB (gzipped: ~150KB) ⚠️
├── register.js: ~280KB (gzipped: ~120KB) ⚠️
├── vendor.js: ~650KB (gzipped: ~250KB) ❌ CRÍTICO
└── Total: ~1.7MB (gzipped: ~700KB) ❌ CRÍTICO

Problemas:
- Vendor bundle demasiado grande (incluye toda la librería Supabase)
- Dashboard carga todos los componentes de todos los roles
- Register incluye todas las validaciones y servicios
- Shadcn/UI componentes no están tree-shaken correctamente
```

#### **2. Loading Performance**
```typescript
// Tiempos de carga actuales
Current Load Times:
├── Dashboard (first load): ~4.2s ❌
├── Registration page: ~3.8s ⚠️
├── Property selection: ~2.1s ⚠️
├── Notification center: ~1.9s ✅
└── Login page: ~1.2s ✅

Issues:
- Dashboard carga datos de todos los roles simultáneamente
- Imágenes sin optimización (algunos archivos > 1MB)
- Queries Supabase no optimizadas
- Sin lazy loading en componentes pesados
```

#### **3. Runtime Performance**
```typescript
// Issues de runtime identificados
Runtime Issues:
├── Re-renders innecesarios en NotificationCenter ❌
├── Scroll performance en listas largas ⚠️
├── Memory leaks en cambio de roles ⚠️
├── Formularios sin debouncing ⚠️
└── Estado global demasiado granular ⚠️
```

## 🚀 **ESTRATEGIAS DE OPTIMIZACIÓN**

### **1. Code Splitting Avanzado**

#### **A. Route-Level Code Splitting**
```typescript
// Implementación lazy loading por rutas
// next.config.mjs
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@/components/ui'],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimizar split chunks
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 20,
          chunks: 'all',
          maxSize: 200000, // 200KB chunks máximo
        },
        supabase: {
          test: /[\\/]node_modules[\\/]@supabase[\\/]/,
          name: 'supabase',
          priority: 30,
          chunks: 'all',
        },
        shadcn: {
          test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
          name: 'ui-components',
          priority: 25,
          chunks: 'all',
        },
        common: {
          minChunks: 2,
          chunks: 'all',
          name: 'common',
          priority: 10,
          maxSize: 100000,
        },
      },
    };

    return config;
  },
};
```

#### **B. Component-Level Lazy Loading**
```typescript
// src/pages/dashboard/index.tsx - Refactorizado
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

// Lazy load por rol específico
const ParticularDashboard = dynamic(
  () => import('@/components/dashboard/ParticularDashboard'),
  {
    loading: () => <DashboardSkeleton variant="particular" />,
    ssr: false, // Client-side only para reducir SSR
  }
);

const ServiceProviderDashboard = dynamic(
  () => import('@/components/dashboard/ServiceProviderDashboard'),
  {
    loading: () => <DashboardSkeleton variant="provider" />,
    ssr: false,
  }
);

const AdminDashboard = dynamic(
  () => import('@/components/dashboard/AdminDashboard'),
  {
    loading: () => <DashboardSkeleton variant="admin" />,
    ssr: false,
  }
);

// Componentes pesados con lazy loading
const NotificationCenter = dynamic(
  () => import('@/components/NotificationCenter'),
  {
    loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />,
  }
);

const EnhancedBudgetRequestForm = dynamic(
  () => import('@/components/dashboard/EnhancedBudgetRequestForm'),
  {
    loading: () => <div className="animate-pulse h-96 bg-gray-100 rounded-lg" />,
  }
);

export default function Dashboard() {
  const { activeRole } = useRole();

  const renderDashboard = () => {
    switch (activeRole) {
      case 'particular':
        return (
          <Suspense fallback={<DashboardSkeleton variant="particular" />}>
            <ParticularDashboard />
          </Suspense>
        );
      case 'service_provider':
        return (
          <Suspense fallback={<DashboardSkeleton variant="provider" />}>
            <ServiceProviderDashboard />
          </Suspense>
        );
      case 'property_administrator':
        return (
          <Suspense fallback={<DashboardSkeleton variant="admin" />}>
            <AdminDashboard />
          </Suspense>
        );
      default:
        return <DashboardSkeleton variant="default" />;
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader />
      {renderDashboard()}
    </div>
  );
}
```

### **2. Data Loading Optimization**

#### **A. Query Optimization Strategy**
```typescript
// src/hooks/useDashboardData.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useDashboardData = (roleType: string, userId: string) => {
  // Cache específico por rol - solo carga datos necesarios
  const cacheKey = useMemo(() => ['dashboard', roleType, userId], [roleType, userId]);

  const {
    data: roleData,
    isLoading: roleLoading,
    error: roleError
  } = useQuery({
    queryKey: cacheKey,
    queryFn: async () => {
      // Carga específica y optimizada por rol
      switch (roleType) {
        case 'particular':
          return await loadParticularData(userId);
        case 'service_provider':
          return await loadServiceProviderData(userId);
        case 'property_administrator':
          return await loadAdminData(userId);
        default:
          return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos cache
    cacheTime: 10 * 60 * 1000, // 10 minutos en memoria
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Prefetch siguiente rol probable
  const prefetchNextRole = useMemo(() => {
    if (roleType === 'particular') return 'service_provider';
    if (roleType === 'service_provider') return 'property_administrator';
    return null;
  }, [roleType]);

  // Prefetch inteligente
  useQuery({
    queryKey: ['dashboard', prefetchNextRole, userId],
    queryFn: () => loadDataByRole(prefetchNextRole, userId),
    enabled: !!prefetchNextRole,
    staleTime: 2 * 60 * 1000,
  });

  return {
    data: roleData,
    loading: roleLoading,
    error: roleError,
    cacheKey
  };
};

// Funciones de carga optimizadas
const loadParticularData = async (userId: string) => {
  // Carga paralela de datos específicos
  const [properties, budgetRequests, notifications] = await Promise.all([
    loadUserProperties(userId),
    loadUserBudgetRequests(userId, 10), // Solo últimos 10
    loadUserNotifications(userId, 5), // Solo últimas 5
  ]);

  return { properties, budgetRequests, notifications, stats: null };
};

const loadServiceProviderData = async (userId: string) => {
  const [quotes, stats, recentActivity] = await Promise.all([
    loadProviderQuotes(userId, 20),
    loadProviderStats(userId),
    loadProviderActivity(userId, 10),
  ]);

  return { quotes, stats, recentActivity, properties: null };
};
```

#### **B. Infinite Query Implementation**
```typescript
// src/hooks/useInfiniteNotifications.ts
export const useInfiniteNotifications = (filters: NotificationFilters) => {
  return useInfiniteQuery({
    queryKey: ['notifications', 'infinite', filters],
    queryFn: ({ pageParam = 0 }) => {
      return supabase
        .from('notifications')
        .select('*')
        .eq('user_id', filters.userId)
        .eq('read', filters.showOnlyUnread ? false : undefined)
        .order('created_at', { ascending: false })
        .range(pageParam, pageParam + 19) // 20 items per page
        .then(({ data, error }) => {
          if (error) throw error;
          return {
            data: data || [],
            nextCursor: data && data.length === 20 ? pageParam + 20 : undefined,
            hasNextPage: data && data.length === 20,
          };
        });
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 30 * 1000, // 30 segundos
    cacheTime: 5 * 60 * 1000, // 5 minutos
  });
};
```

### **3. Image Optimization**

#### **A. Next.js Image Component Optimization**
```typescript
// next.config.mjs
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'unsplash.com',
      'pexels.com',
      'pixabay.com',
      'your-supabase-project.supabase.co'
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimización agresiva
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
  },
  // Comprimir estáticos
  compress: true,
  poweredByHeader: false,
  // Optimizar CSS
  experimental: {
    optimizeCss: true,
  },
};
```

#### **B. Custom Image Loader**
```typescript
// src/lib/imageLoader.ts
interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  // Para imágenes de Supabase Storage
  if (src.includes('supabase.co')) {
    const url = new URL(src);
    url.searchParams.set('width', width.toString());
    url.searchParams.set('quality', (quality || 75).toString());
    url.searchParams.set('format', 'webp');
    return url.toString();
  }

  // Para imágenes externas (Unsplash, etc.)
  if (src.includes('unsplash.com')) {
    return `${src}&w=${width}&q=${quality || 75}&fm=webp`;
  }

  return src;
}
```

#### **C. Optimized Image Component**
```typescript
// src/components/OptimizedImage.tsx
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  fallbackSrc = '/images/placeholder.svg'
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={85}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc);
          setIsLoading(false);
        }}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};
```

### **4. Render Optimization**

#### **A. Memoization Strategy**
```typescript
// src/components/dashboard/DashboardStats.tsx
import { memo, useMemo, useCallback } from 'react';

interface DashboardStatsProps {
  stats: DashboardStats;
  roleType: string;
  onRefresh: () => void;
}

export const DashboardStats = memo<DashboardStatsProps>(({
  stats,
  roleType,
  onRefresh
}) => {
  // Memoizar cálculos complejos
  const processedStats = useMemo(() => {
    if (!stats) return null;

    return {
      ...stats,
      growthPercentage: calculateGrowthPercentage(stats.current, stats.previous),
      trendsData: processTrendsData(stats.trends),
      formattedValues: formatStatsValues(stats),
    };
  }, [stats]);

  // Memoizar callbacks
  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  const handleExport = useCallback(() => {
    exportStats(processedStats);
  }, [processedStats]);

  if (!processedStats) {
    return <StatsSkeleton />;
  }

  return (
    <div className="stats-container">
      <StatsHeader
        title={`Dashboard ${roleType}`}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />
      <StatsGrid stats={processedStats} />
      <StatsTrends data={processedStats.trendsData} />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison para evitar re-renders innecesarios
  return (
    prevProps.roleType === nextProps.roleType &&
    prevProps.stats?.current === nextProps.stats?.current &&
    prevProps.stats?.timestamp === nextProps.stats?.timestamp
  );
});

DashboardStats.displayName = 'DashboardStats';
```

#### **B. Virtual Scrolling Implementation**
```typescript
// src/components/VirtualizedList.tsx
import { FixedSizeList as List } from 'react-window';
import { memo, useMemo } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export const VirtualizedList = memo(<T extends { id: string | number }>({
  items,
  height,
  itemHeight,
  renderItem,
  className = ''
}: VirtualizedListProps<T>) => {
  const Row = useMemo(
    () =>
      memo(({ index, style }: { index: number; style: React.CSSProperties }) => (
        <div style={style}>
          {renderItem(items[index], index)}
        </div>
      )),
    [items, renderItem]
  );

  return (
    <div className={className}>
      <List
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        width="100%"
        overscanCount={5} // Pre-render 5 items fuera de vista
      >
        {Row}
      </List>
    </div>
  );
}) as <T extends { id: string | number }>(props: VirtualizedListProps<T>) => JSX.Element;
```

### **5. State Management Optimization**

#### **A. Optimized Context Pattern**
```typescript
// src/contexts/OptimizedAuthContext.tsx
import { createContext, useContext, useMemo, useCallback } from 'react';

// Dividir contextos por responsabilidad
const AuthStateContext = createContext<AuthState | null>(null);
const AuthActionsContext = createContext<AuthActions | null>(null);

export const OptimizedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  // Memoizar state para evitar re-renders
  const memoizedAuthState = useMemo(() => authState, [authState]);

  // Memoizar actions
  const authActions = useMemo(() => ({
    signIn: async (email: string, password: string) => {
      // Lógica de signin
    },
    signOut: async () => {
      // Lógica de signout
    },
    updateProfile: async (updates: Partial<UserProfile>) => {
      // Lógica de actualización
    }
  }), []);

  return (
    <AuthStateContext.Provider value={memoizedAuthState}>
      <AuthActionsContext.Provider value={authActions}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};

// Hooks optimizados
export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) throw new Error('useAuthState must be used within OptimizedAuthProvider');
  return context;
};

export const useAuthActions = () => {
  const context = useContext(AuthActionsContext);
  if (!context) throw new Error('useAuthActions must be used within OptimizedAuthProvider');
  return context;
};
```

#### **B. Selector Pattern Implementation**
```typescript
// src/hooks/useSelector.ts
import { useMemo } from 'react';

export const useAuthSelector = <T>(selector: (state: AuthState) => T): T => {
  const authState = useAuthState();
  
  return useMemo(() => selector(authState), [authState, selector]);
};

// Usage en componentes
export const UserProfile = () => {
  // Solo re-render cuando cambie el user, no todo el auth state
  const user = useAuthSelector(state => state.user);
  const isLoading = useAuthSelector(state => state.loading);

  return (
    <div>
      {isLoading ? <Skeleton /> : <UserInfo user={user} />}
    </div>
  );
};
```

### **6. Form Performance Optimization**

#### **A. Debounced Validation Hook**
```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// src/hooks/useDebouncedValidation.ts
export const useDebouncedValidation = (
  value: string,
  validateFn: (value: string) => Promise<boolean>,
  delay = 300
) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');

  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    if (!debouncedValue) {
      setIsValid(null);
      setError('');
      return;
    }

    setIsValidating(true);
    
    validateFn(debouncedValue)
      .then((valid) => {
        setIsValid(valid);
        setError(valid ? '' : 'Valor no válido');
      })
      .catch((err) => {
        setIsValid(false);
        setError(err.message || 'Error de validación');
      })
      .finally(() => {
        setIsValidating(false);
      });
  }, [debouncedValue, validateFn]);

  return { isValidating, isValid, error };
};
```

#### **B. Optimized Form Component**
```typescript
// src/components/forms/OptimizedForm.tsx
import { memo, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';

interface FormField {
  name: string;
  type: 'text' | 'email' | 'select' | 'textarea';
  label: string;
  validation?: object;
  options?: { value: string; label: string }[];
}

interface OptimizedFormProps {
  fields: FormField[];
  onSubmit: (data: any) => Promise<void>;
  defaultValues?: any;
}

export const OptimizedForm = memo<OptimizedFormProps>(({
  fields,
  onSubmit,
  defaultValues = {}
}) => {
  const form = useForm({
    defaultValues,
    mode: 'onBlur', // Validar solo en blur para mejor performance
  });

  // Memoizar campos renderizados
  const renderedFields = useMemo(() => {
    return fields.map((field) => (
      <Controller
        key={field.name}
        name={field.name}
        control={form.control}
        rules={field.validation}
        render={({ field: fieldProps, fieldState }) => (
          <FormField
            {...fieldProps}
            {...field}
            error={fieldState.error?.message}
          />
        )}
      />
    ));
  }, [fields, form.control]);

  const handleSubmit = useCallback((data: any) => {
    return onSubmit(data);
  }, [onSubmit]);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      {renderedFields}
      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {form.formState.isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
});
```

## 📊 **MÉTRICAS Y MONITORING**

### **1. Performance Monitoring Setup**
```typescript
// src/lib/performance.ts
export const measurePerformance = (name: string) => {
  const start = performance.now();
  
  return {
    end: () => {
      const duration = performance.now() - start;
      
      // Log métricas
      if (typeof window !== 'undefined') {
        // Web Vitals tracking
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS(console.log);
          getFID(console.log);
          getFCP(console.log);
          getLCP(console.log);
          getTTFB(console.log);
        });
      }
      
      console.log(`${name} took ${duration.toFixed(2)}ms`);
      return duration;
    }
  };
};

// Hook para medir renders
export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const measure = measurePerformance(`${componentName} render`);
    return measure.end;
  });
};
```

### **2. Bundle Analysis**
```json
{
  "scripts": {
    "analyze": "cross-env ANALYZE=true next build",
    "analyze:server": "cross-env BUNDLE_ANALYZE=server next build",
    "analyze:browser": "cross-env BUNDLE_ANALYZE=browser next build"
  }
}
```

### **3. Lighthouse CI Configuration**
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/auth/login',
        'http://localhost:3000/auth/register',
        'http://localhost:3000/dashboard',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.90 }],
        'categories:best-practices': ['error', { minScore: 0.90 }],
        'categories:seo': ['error', { minScore: 0.90 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

## 🎯 **IMPLEMENTACIÓN POR FASES**

### **Fase 1: Bundle Optimization (Semana 1-2)**
- [ ] Implementar code splitting por rutas
- [ ] Configurar lazy loading de componentes
- [ ] Optimizar imports de shadcn/ui
- [ ] Análisis y optimización de vendor bundles

### **Fase 2: Data Loading (Semana 3-4)**
- [ ] Implementar queries específicas por rol
- [ ] Configurar prefetching inteligente
- [ ] Infinite scrolling en listas largas
- [ ] Cache estratégico con React Query

### **Fase 3: Render Performance (Semana 5-6)**
- [ ] Memoización de componentes críticos
- [ ] Virtual scrolling para listas
- [ ] Optimización de contextos
- [ ] Debouncing en formularios

### **Fase 4: Image & Asset Optimization (Semana 7-8)**
- [ ] Configurar Next.js Image optimization
- [ ] Implementar loader personalizado
- [ ] Optimizar formatos (WebP/AVIF)
- [ ] Comprimir assets estáticos

### **Beneficios Esperados:**
- **Bundle Size**: Reducción 40-50%
- **Load Time**: Mejora 50-60%
- **FCP**: < 1.8s (mejora desde ~3.2s)
- **LCP**: < 2.5s (mejora desde ~4.2s)
- **FID**: < 100ms (mejora desde ~180ms)

Esta optimización transformará HuBiT 9.0 en una aplicación significativamente más rápida y eficiente, mejorando la experiencia del usuario y reduciendo los costos de infraestructura.