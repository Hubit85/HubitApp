# 🔧 Especificaciones Detalladas de Refactoring

## 📋 Análisis Específico de Archivos Problemáticos

### 🚨 **NOTIFICATIONCENTER.TSX (1189 líneas) - ANÁLISIS CRÍTICO**

#### **Problemas Detectados:**
- **Monolito funcional**: Un solo componente maneja 5 tipos diferentes de notificaciones
- **Estado complejo**: 15+ estados locales diferentes con interdependencias
- **Lógica mezclada**: UI, lógica de negocio, llamadas API y manejo de estados en un solo lugar
- **Funciones gigantes**: `loadAllAdministratorData()` tiene 50+ líneas, `handleRespondToRequest()` 80+ líneas
- **Repetición de código**: Lógica similar para diferentes tipos de respuestas
- **Renderizado condicional complejo**: Múltiples niveles de condicionales para diferentes roles

#### **Plan de Refactoring Específico:**
```typescript
// Nueva estructura propuesta:
src/components/notifications/
├── NotificationCenter.tsx              // Componente principal (200 líneas)
├── NotificationLayout.tsx              // Layout y navegación (100 líneas)
├── sections/
│   ├── GeneralNotifications.tsx        // Notificaciones generales (250 líneas)
│   ├── AdministratorRequests.tsx       // Solicitudes administrador (300 líneas)
│   ├── AssignmentRequests.tsx          // Solicitudes asignación (300 líneas)
│   └── ManagedIncidents.tsx            // Incidencias gestionadas (200 líneas)
├── components/
│   ├── NotificationCard.tsx            // Tarjeta individual (150 líneas)
│   ├── RequestCard.tsx                 // Tarjeta de solicitud (200 líneas)
│   ├── ResponseDialog.tsx              // Diálogo respuesta (150 líneas)
│   ├── AssignmentDialog.tsx            // Diálogo asignación (150 líneas)
│   └── StatusBadge.tsx                 // Componente badge estado (50 líneas)
└── hooks/
    ├── useNotificationData.ts          // Hook datos notificaciones (100 líneas)
    ├── useAdministratorRequests.ts     // Hook solicitudes admin (120 líneas)
    ├── useRequestResponses.ts          // Hook respuestas (80 líneas)
    └── useNotificationFilters.ts       // Hook filtros (60 líneas)

// Hooks específicos propuestos:
export const useNotificationData = (userRole: string) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const loadNotifications = useCallback(async () => {
    // Lógica específica de carga por rol
  }, [userRole]);
  
  return { notifications, loading, loadNotifications, refresh: loadNotifications };
};

export const useRequestResponses = () => {
  const [responding, setResponding] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const respondToRequest = useCallback(async (requestId, response, message) => {
    // Lógica reutilizable de respuesta
  }, []);
  
  return { responding, error, success, respondToRequest };
};
```

### 🚨 **ENHANCEDBUDGETREQUESTFORM.TSX (1073 líneas) - ANÁLISIS CRÍTICO**

#### **Problemas Detectados:**
- **Formulario monolítico**: Un solo componente maneja wizard completo de 6+ pasos
- **Estado masivo**: 20+ estados locales con lógica compleja de sincronización
- **Upload de archivos mezclado**: Lógica de upload, preview y validación en componente principal
- **Validación inline**: Múltiples validaciones dispersas por todo el componente
- **Renderizado condicional pesado**: JSX complejo con múltiples niveles de anidación

#### **Plan de Refactoring Específico:**
```typescript
// Nueva estructura propuesta:
src/components/budget/
├── BudgetRequestWizard.tsx             // Componente principal (200 líneas)
├── steps/
│   ├── BasicInfoStep.tsx               // Información básica (200 líneas)
│   ├── LocationStep.tsx                // Ubicación y propiedades (180 líneas)
│   ├── BudgetTimingStep.tsx            // Presupuesto y fechas (150 líneas)
│   ├── FileUploadStep.tsx              // Upload de archivos (250 líneas)
│   ├── ProviderPreviewStep.tsx         // Vista previa proveedores (200 líneas)
│   └── PublicationOptionsStep.tsx      // Opciones publicación (150 líneas)
├── components/
│   ├── ServiceCategorySelect.tsx       // Selector categorías (100 líneas)
│   ├── UrgencySelect.tsx               // Selector urgencia (80 líneas)
│   ├── PropertySelector.tsx            // Selector propiedades (120 líneas)
│   ├── FileUploader.tsx                // Componente upload (200 líneas)
│   ├── FilePreview.tsx                 // Preview archivos (100 líneas)
│   ├── ProviderPreview.tsx             // Preview proveedores (150 líneas)
│   └── ProgressIndicator.tsx           // Indicador progreso (80 líneas)
├── dialogs/
│   ├── ConfirmPublishDialog.tsx        // Diálogo confirmación (150 líneas)
│   └── PreviewDialog.tsx               // Diálogo preview (120 líneas)
└── hooks/
    ├── useBudgetRequestForm.ts         // Hook formulario principal (150 líneas)
    ├── useFileUpload.ts                // Hook upload archivos (100 líneas)
    ├── useProviderPreview.ts           // Hook preview proveedores (80 líneas)
    ├── useFormValidation.ts            // Hook validación (120 líneas)
    └── useWizardNavigation.ts          // Hook navegación wizard (60 líneas)

// Hook principal propuesto:
export const useBudgetRequestForm = (prefilledData?: any) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear related errors
    clearRelatedErrors(updates);
  }, []);
  
  const validateCurrentStep = useCallback(() => {
    // Validación específica por paso
  }, [currentStep, formData]);
  
  return {
    currentStep,
    formData,
    errors,
    updateFormData,
    nextStep: () => setCurrentStep(prev => prev + 1),
    prevStep: () => setCurrentStep(prev => prev - 1),
    validateCurrentStep,
    isValid: validateCurrentStep()
  };
};
```

### 🚨 **SUPABASEUSERROLESERVICE.TS (1027 líneas) - ANÁLISIS CRÍTICO**

#### **Problemas Detectados:**
- **Servicio monolítico**: Maneja autenticación, roles, verificación, recovery en un solo archivo
- **Funciones gigantes**: `getUserRoles()` tiene 200+ líneas, `attemptIdRecovery()` 150+ líneas
- **Lógica compleja anidada**: Try-catch anidados con múltiples niveles de recuperación
- **Responsabilidades mezcladas**: CRUD, validación, notificaciones, recovery en mismo servicio
- **ConnectionManager**: Lógica de concurrencia mezclada con lógica de negocio

#### **Plan de Refactoring Específico:**
```typescript
// Nueva estructura propuesta:
src/services/user-roles/
├── UserRoleService.ts                  // Servicio principal (200 líneas)
├── UserRoleRepository.ts               // Acceso a datos (150 líneas)
├── RoleValidationService.ts            // Validaciones (100 líneas)
├── RoleRecoveryService.ts              // Recuperación de roles (200 líneas)
├── RoleVerificationService.ts          // Verificación de roles (150 líneas)
├── RoleActivationService.ts            // Activación de roles (100 líneas)
└── utils/
    ├── ConnectionManager.ts            // Gestión conexiones (80 líneas)
    ├── RoleTypeUtils.ts               // Utilidades tipos (60 líneas)
    └── ErrorHandling.ts               // Manejo errores (70 líneas)

// Ejemplo de servicio refactorizado:
export class UserRoleRepository {
  static async findByUserId(userId: string): Promise<UserRole[]> {
    return ConnectionManager.executeWithLimit(async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw new RepositoryError('Failed to fetch user roles', error);
      return data || [];
    });
  }
  
  static async activateRole(userId: string, roleType: string): Promise<void> {
    return ConnectionManager.executeWithLimit(async () => {
      // Lógica específica de activación
    });
  }
}

export class RoleRecoveryService {
  static async attemptRecovery(email: string, userId: string): Promise<RecoveryResult> {
    // Lógica específica de recuperación extraída
  }
  
  static async diagnoseZeroRoles(userId: string, email: string): Promise<DiagnosisResult> {
    // Diagnóstico específico para casos como borjapipaon
  }
}
```

## 🎯 **HOOKS PERSONALIZADOS - ESTRATEGIAS DE EXTRACCIÓN**

### **1. Hooks de Formularios**

#### **useFormWizard.ts**
```typescript
export const useFormWizard = <T>(
  steps: string[],
  initialData: T,
  validation?: Record<string, (data: T) => boolean>
) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<T>(initialData);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const updateFormData = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  }, []);

  const validateStep = useCallback((step: number) => {
    if (!validation || !validation[steps[step]]) return true;
    return validation[steps[step]](formData);
  }, [formData, steps, validation]);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1 && validateStep(currentStep)) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      setVisitedSteps(prev => new Set([...prev, nextIndex]));
    }
  }, [currentStep, steps.length, validateStep]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length && visitedSteps.has(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  }, [steps.length, visitedSteps]);

  return {
    currentStep,
    formData,
    errors,
    visitedSteps,
    updateFormData,
    nextStep,
    prevStep: () => setCurrentStep(prev => Math.max(0, prev - 1)),
    goToStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    canGoNext: validateStep(currentStep),
    progress: ((currentStep + 1) / steps.length) * 100
  };
};
```

#### **useFileUpload.ts**
```typescript
interface UploadOptions {
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: Record<string, string>;
  bucketName?: string;
}

export const useFileUpload = (options: UploadOptions = {}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const {
    maxFiles = 5,
    maxFileSize = 10 * 1024 * 1024,
    acceptedTypes = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'application/pdf': '.pdf'
    },
    bucketName = 'uploads'
  } = options;

  const validateFile = useCallback((file: File): string | null => {
    if (!Object.keys(acceptedTypes).includes(file.type)) {
      return `Tipo de archivo no permitido: ${file.name}`;
    }
    if (file.size > maxFileSize) {
      return `Archivo demasiado grande: ${file.name}`;
    }
    if (files.length >= maxFiles) {
      return `Máximo ${maxFiles} archivos permitidos`;
    }
    return null;
  }, [acceptedTypes, maxFileSize, maxFiles, files.length]);

  const uploadFiles = useCallback(async (filesToUpload: FileList | File[]) => {
    setUploading(true);
    setErrors([]);
    
    const fileArray = Array.from(filesToUpload);
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    // Validate all files first
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setUploading(false);
      return { success: false, errors: newErrors };
    }

    try {
      const uploadPromises = validFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        // Track upload progress (if supported by storage provider)
        setProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            onUploadProgress: (progress) => {
              const percentage = (progress.loaded / progress.total) * 100;
              setProgress(prev => ({ ...prev, [file.name]: percentage }));
            }
          });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);

        return {
          name: file.name,
          size: file.size,
          type: file.type,
          url: publicUrl,
          storageKey: fileName
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFiles(prev => [...prev, ...uploadedFiles]);
      
      return { success: true, files: uploadedFiles };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error uploading files';
      setErrors([errorMsg]);
      return { success: false, errors: [errorMsg] };
    } finally {
      setUploading(false);
      setProgress({});
    }
  }, [validateFile, bucketName]);

  const removeFile = useCallback(async (index: number) => {
    const file = files[index];
    if (file.storageKey) {
      await supabase.storage.from(bucketName).remove([file.storageKey]);
    }
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, [files, bucketName]);

  return {
    files,
    uploading,
    progress,
    errors,
    uploadFiles,
    removeFile,
    canUploadMore: files.length < maxFiles
  };
};
```

### **2. Hooks de Datos y Estado**

#### **useAsyncData.ts**
```typescript
interface AsyncDataOptions<T> {
  refetchInterval?: number;
  dependencies?: any[];
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
}

export const useAsyncData = <T>(
  fetchFn: () => Promise<T>,
  options: AsyncDataOptions<T> = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const {
    refetchInterval,
    dependencies = [],
    onError,
    onSuccess
  } = options;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      setLastFetch(new Date());
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onError, onSuccess]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Initial fetch and dependency-based refetch
  useEffect(() => {
    fetchData();
  }, [...dependencies, fetchData]);

  // Interval-based refetch
  useEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [refetchInterval, fetchData]);

  return {
    data,
    loading,
    error,
    lastFetch,
    refresh,
    isStale: lastFetch && refetchInterval 
      ? Date.now() - lastFetch.getTime() > refetchInterval 
      : false
  };
};
```

#### **useNotificationCenter.ts**
```typescript
export const useNotificationCenter = (userRole: string) => {
  const [activeSection, setActiveSection] = useState('general');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: 'all'
  });

  const {
    data: generalNotifications,
    loading: generalLoading,
    refresh: refreshGeneral
  } = useAsyncData(() => loadGeneralNotifications(), {
    refetchInterval: 30000, // 30 seconds
    dependencies: [userRole]
  });

  const {
    data: adminRequests,
    loading: adminLoading,
    refresh: refreshAdmin
  } = useAsyncData(
    () => userRole === 'property_administrator' ? loadAdminRequests() : Promise.resolve([]),
    {
      refetchInterval: 60000, // 1 minute
      dependencies: [userRole]
    }
  );

  const refreshAll = useCallback(() => {
    refreshGeneral();
    if (userRole === 'property_administrator') {
      refreshAdmin();
    }
  }, [refreshGeneral, refreshAdmin, userRole]);

  const filteredNotifications = useMemo(() => {
    // Apply filters to notifications
    return generalNotifications?.filter(notification => {
      if (filters.status !== 'all' && notification.read !== (filters.status === 'read')) {
        return false;
      }
      // Add more filter logic
      return true;
    }) || [];
  }, [generalNotifications, filters]);

  return {
    // Data
    generalNotifications: filteredNotifications,
    adminRequests,
    
    // Loading states
    loading: generalLoading || adminLoading,
    
    // Actions
    refreshAll,
    
    // UI state
    activeSection,
    setActiveSection,
    filters,
    setFilters,
    
    // Computed values
    unreadCount: filteredNotifications.filter(n => !n.read).length,
    pendingRequestCount: adminRequests?.filter(r => r.status === 'pending').length || 0
  };
};
```

### **3. Hooks de UI y Interacción**

#### **useDialog.ts**
```typescript
interface DialogState {
  isOpen: boolean;
  data?: any;
}

export const useDialog = <T = any>() => {
  const [state, setState] = useState<DialogState>({ isOpen: false });

  const openDialog = useCallback((data?: T) => {
    setState({ isOpen: true, data });
  }, []);

  const closeDialog = useCallback(() => {
    setState({ isOpen: false, data: undefined });
  }, []);

  const toggleDialog = useCallback((data?: T) => {
    setState(prev => ({
      isOpen: !prev.isOpen,
      data: prev.isOpen ? undefined : data
    }));
  }, []);

  return {
    isOpen: state.isOpen,
    data: state.data as T | undefined,
    openDialog,
    closeDialog,
    toggleDialog
  };
};
```

#### **useConfirmation.ts**
```typescript
interface ConfirmationOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export const useConfirmation = () => {
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    options: ConfirmationOptions;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    options: {}
  });

  const showConfirmation = useCallback((
    options: ConfirmationOptions,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => {
    setConfirmation({
      isOpen: true,
      options: {
        title: 'Confirmar acción',
        message: '¿Estás seguro?',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        ...options
      },
      onConfirm,
      onCancel
    });
  }, []);

  const hideConfirmation = useCallback(() => {
    setConfirmation(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    confirmation.onConfirm?.();
    hideConfirmation();
  }, [confirmation.onConfirm, hideConfirmation]);

  const handleCancel = useCallback(() => {
    confirmation.onCancel?.();
    hideConfirmation();
  }, [confirmation.onCancel, hideConfirmation]);

  return {
    confirmation,
    showConfirmation,
    hideConfirmation,
    handleConfirm,
    handleCancel
  };
};
```

## 📈 **BENEFICIOS ESPERADOS DEL REFACTORING**

### **Mantenibilidad**
- ✅ Archivos < 300 líneas cada uno
- ✅ Responsabilidad única por archivo
- ✅ Hooks reutilizables en toda la app
- ✅ Separación clara UI/lógica de negocio
- ✅ Testing granular y específico

### **Performance**
- ✅ Lazy loading de componentes pesados
- ✅ Memoización en hooks personalizados
- ✅ Reducción de re-renders innecesarios
- ✅ Mejor tree-shaking
- ✅ Bundle splitting automático

### **Developer Experience**
- ✅ Código más legible y comprensible
- ✅ Debugging más sencillo
- ✅ Reutilización de lógica común
- ✅ IntelliSense más preciso
- ✅ Menor curva de aprendizaje

### **Escalabilidad**
- ✅ Nuevas funcionalidades más rápidas de implementar
- ✅ Componentes totalmente reutilizables
- ✅ Arquitectura extensible
- ✅ Patrones consistentes
- ✅ Documentación granular

Este refactoring transformará la base de código de HuBiT 9.0 en una arquitectura moderna, mantenible y escalable, facilitando el desarrollo futuro y mejorando significativamente la experiencia del desarrollador.