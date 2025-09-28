# 🧪 Estrategia de Testing para HuBiT 9.0

## 🎯 **OBJETIVOS DE TESTING**

### **Cobertura de Código Target: 70%**
- **Unit Tests**: 80% cobertura en servicios y hooks
- **Integration Tests**: 60% cobertura en flujos completos
- **E2E Tests**: 90% cobertura en user journeys críticos

### **Principios de Testing**
1. **Test First Mindset**: Escribir tests antes de refactorizar
2. **User-Centric Testing**: Enfocar en comportamiento del usuario
3. **Fast Feedback Loop**: Tests rápidos para desarrollo ágil
4. **Reliable & Deterministic**: Tests que no fallen aleatoriamente
5. **Maintainable**: Tests fáciles de mantener y actualizar

## 🏗️ **ARQUITECTURA DE TESTING**

### **1. Testing Stack Tecnológico**

#### **Unit & Integration Testing**
```json
{
  "frameworks": ["Jest", "@testing-library/react", "@testing-library/jest-dom"],
  "utilities": ["@testing-library/user-event", "jest-environment-jsdom"],
  "mocking": ["MSW (Mock Service Worker)", "jest.mock()"],
  "coverage": ["Jest Coverage", "Codecov"]
}
```

#### **E2E Testing**
```json
{
  "framework": "Cypress",
  "plugins": ["@cypress/code-coverage", "cypress-axe"],
  "utilities": ["cypress-real-events", "cypress-file-upload"]
}
```

#### **Visual Regression Testing**
```json
{
  "framework": "Chromatic",
  "integration": "Storybook",
  "browsers": ["Chrome", "Firefox", "Safari"]
}
```

### **2. Test Environment Setup**

#### **Jest Configuration**
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/test-setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/cypress/',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/api/**/*',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
    '!src/types/**/*',
    '!src/integrations/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    './src/services/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/hooks/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testTimeout: 10000,
  maxWorkers: '50%',
};
```

#### **Test Setup File**
```typescript
// __tests__/setup/test-setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';
import { cleanup } from '@testing-library/react';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
    storage: {
      from: jest.fn(),
    },
  },
}));

// MSW setup
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());

// Console error handling
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

### **3. Mock Service Worker Configuration**

#### **API Mocks**
```typescript
// __tests__/setup/mocks/handlers.ts
import { rest } from 'msw';
import { mockUsers, mockProfiles, mockBudgetRequests } from './data';

export const handlers = [
  // Auth endpoints
  rest.post('/auth/v1/signup', (req, res, ctx) => {
    return res(ctx.json({ user: mockUsers.newUser, session: null }));
  }),

  rest.post('/auth/v1/token', (req, res, ctx) => {
    return res(ctx.json({ 
      access_token: 'mock-token',
      user: mockUsers.authenticatedUser 
    }));
  }),

  // Supabase REST API
  rest.get('/rest/v1/profiles', (req, res, ctx) => {
    const userId = req.url.searchParams.get('id');
    if (userId) {
      const profile = mockProfiles.find(p => p.id === userId);
      return res(ctx.json([profile]));
    }
    return res(ctx.json(mockProfiles));
  }),

  rest.get('/rest/v1/user_roles', (req, res, ctx) => {
    const userId = req.url.searchParams.get('user_id');
    const mockRoles = [
      {
        id: '1',
        user_id: userId,
        role_type: 'particular',
        is_verified: true,
        is_active: true,
      },
    ];
    return res(ctx.json(mockRoles));
  }),

  rest.get('/rest/v1/budget_requests', (req, res, ctx) => {
    return res(ctx.json(mockBudgetRequests));
  }),

  // Fallback for unhandled requests
  rest.all('*', (req, res, ctx) => {
    console.warn(`Unhandled ${req.method} request to ${req.url}`);
    return res(ctx.status(404));
  }),
];
```

#### **Mock Data**
```typescript
// __tests__/setup/mocks/data.ts
export const mockUsers = {
  newUser: {
    id: 'test-user-id',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
  },
  authenticatedUser: {
    id: 'auth-user-id',
    email: 'auth@example.com',
    created_at: new Date().toISOString(),
  },
};

export const mockProfiles = [
  {
    id: 'test-user-id',
    email: 'test@example.com',
    full_name: 'Test User',
    user_type: 'particular',
    phone: '+34600000000',
    created_at: new Date().toISOString(),
  },
];

export const mockBudgetRequests = [
  {
    id: 'budget-1',
    title: 'Test Budget Request',
    description: 'Test description',
    category: 'plumbing',
    urgency: 'normal',
    status: 'published',
    user_id: 'test-user-id',
    created_at: new Date().toISOString(),
  },
];
```

## 📋 **ESTRUCTURA DETALLADA DE TESTS**

### **1. Unit Tests**

#### **Services Testing**
```typescript
// __tests__/unit/services/BudgetService.test.ts
import { SupabaseBudgetService } from '@/services/SupabaseBudgetService';
import { supabase } from '@/integrations/supabase/client';

jest.mock('@/integrations/supabase/client');
const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('SupabaseBudgetService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBudgetRequest', () => {
    it('should create a budget request successfully', async () => {
      const mockRequest = {
        title: 'Test Request',
        description: 'Test Description',
        category: 'plumbing',
        user_id: 'test-user',
      };

      const mockResponse = { data: { id: 'new-id', ...mockRequest }, error: null };
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue(mockResponse),
          }),
        }),
      } as any);

      const result = await SupabaseBudgetService.createBudgetRequest(mockRequest);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(expect.objectContaining(mockRequest));
      expect(mockSupabase.from).toHaveBeenCalledWith('budget_requests');
    });

    it('should handle creation errors gracefully', async () => {
      const mockRequest = {
        title: 'Test Request',
        description: 'Test Description',
        category: 'plumbing',
        user_id: 'test-user',
      };

      const mockError = { message: 'Database error' };
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      } as any);

      const result = await SupabaseBudgetService.createBudgetRequest(mockRequest);

      expect(result.success).toBe(false);
      expect(result.message).toContain('error');
    });
  });

  describe('publishBudgetRequest', () => {
    it('should publish and notify providers', async () => {
      const requestId = 'test-request-id';
      
      // Mock successful update
      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: {}, error: null }),
        }),
      } as any);

      // Mock provider search
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [{ id: 'provider-1' }, { id: 'provider-2' }],
              error: null,
            }),
          }),
        }),
      } as any);

      const result = await SupabaseBudgetService.publishBudgetRequest(requestId);

      expect(result.success).toBe(true);
      expect(result.notificationsSent).toBe(2);
    });
  });
});
```

#### **Hooks Testing**
```typescript
// __tests__/unit/hooks/useFormWizard.test.ts
import { renderHook, act } from '@testing-library/react';
import { useFormWizard } from '@/hooks/useFormWizard';

describe('useFormWizard', () => {
  const steps = ['step1', 'step2', 'step3'];
  const initialData = { name: '', email: '' };

  it('should initialize with correct values', () => {
    const { result } = renderHook(() => useFormWizard(steps, initialData));

    expect(result.current.currentStep).toBe(0);
    expect(result.current.formData).toEqual(initialData);
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);
    expect(result.current.progress).toBe(100/3);
  });

  it('should navigate between steps correctly', () => {
    const { result } = renderHook(() => useFormWizard(steps, initialData));

    act(() => {
      result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.isFirstStep).toBe(false);
    expect(result.current.isLastStep).toBe(false);

    act(() => {
      result.current.prevStep();
    });

    expect(result.current.currentStep).toBe(0);
  });

  it('should update form data correctly', () => {
    const { result } = renderHook(() => useFormWizard(steps, initialData));

    act(() => {
      result.current.updateFormData({ name: 'John Doe' });
    });

    expect(result.current.formData.name).toBe('John Doe');
    expect(result.current.formData.email).toBe('');
  });

  it('should validate steps when provided', () => {
    const validation = {
      step1: (data: any) => data.name.length > 0,
      step2: (data: any) => data.email.includes('@'),
    };

    const { result } = renderHook(() => useFormWizard(steps, initialData, validation));

    expect(result.current.canGoNext).toBe(false);

    act(() => {
      result.current.updateFormData({ name: 'John' });
    });

    expect(result.current.canGoNext).toBe(true);
  });
});
```

#### **Component Testing**
```typescript
// __tests__/unit/components/auth/LoginForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/auth/LoginForm';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

jest.mock('@/contexts/SupabaseAuthContext');
const mockUseSupabaseAuth = useSupabaseAuth as jest.MockedFunction<typeof useSupabaseAuth>;

describe('LoginForm', () => {
  const mockSignIn = jest.fn();

  beforeEach(() => {
    mockUseSupabaseAuth.mockReturnValue({
      signIn: mockSignIn,
      loading: false,
      user: null,
      profile: null,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form correctly', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('should handle form submission with valid data', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({ success: true });

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should display error message on failed login', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({ success: false, error: 'Invalid credentials' });

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('should disable submit button while loading', async () => {
    mockUseSupabaseAuth.mockReturnValue({
      signIn: mockSignIn,
      loading: true,
      user: null,
      profile: null,
    } as any);

    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /iniciando/i });
    expect(submitButton).toBeDisabled();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Trigger blur event

    await waitFor(() => {
      expect(screen.getByText(/formato de email inválido/i)).toBeInTheDocument();
    });
  });
});
```

### **2. Integration Tests**

#### **Full User Flow Testing**
```typescript
// __tests__/integration/auth-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import { LoginPage } from '@/pages/auth/login';
import { Dashboard } from '@/pages/dashboard';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <SupabaseAuthProvider>
        {component}
      </SupabaseAuthProvider>
    </BrowserRouter>
  );
};

describe('Authentication Flow Integration', () => {
  it('should complete full login to dashboard flow', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />);

    // Fill login form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Wait for redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText(/bienvenido/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify dashboard elements are present
    expect(screen.getByText(/panel de control/i)).toBeInTheDocument();
    expect(screen.getByText(/mis propiedades/i)).toBeInTheDocument();
  });

  it('should handle role switching in dashboard', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Dashboard />);

    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText(/rol activo/i)).toBeInTheDocument();
    });

    // Switch role
    const roleSelector = screen.getByRole('combobox', { name: /rol activo/i });
    await user.click(roleSelector);
    
    const serviceProviderOption = screen.getByText(/proveedor de servicios/i);
    await user.click(serviceProviderOption);

    // Verify role-specific content appears
    await waitFor(() => {
      expect(screen.getByText(/gestionar presupuestos/i)).toBeInTheDocument();
    });
  });
});
```

#### **API Integration Testing**
```typescript
// __tests__/integration/budget-workflow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../setup/mocks/server';
import { rest } from 'msw';
import { BudgetRequestForm } from '@/components/budget/BudgetRequestForm';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';

describe('Budget Request Workflow Integration', () => {
  it('should create and publish budget request', async () => {
    const user = userEvent.setup();

    // Mock successful creation
    server.use(
      rest.post('/rest/v1/budget_requests', (req, res, ctx) => {
        return res(ctx.json([{
          id: 'new-budget-id',
          title: 'Test Budget Request',
          description: 'Test Description',
          status: 'published',
        }]));
      }),

      rest.get('/rest/v1/service_providers', (req, res, ctx) => {
        return res(ctx.json([
          { id: 'provider-1', company_name: 'Test Provider 1' },
          { id: 'provider-2', company_name: 'Test Provider 2' },
        ]));
      })
    );

    render(
      <SupabaseAuthProvider>
        <BudgetRequestForm />
      </SupabaseAuthProvider>
    );

    // Fill form
    await user.type(screen.getByLabelText(/título/i), 'Test Budget Request');
    await user.type(screen.getByLabelText(/descripción/i), 'Test Description');
    
    // Select category
    await user.click(screen.getByText(/categoría/i));
    await user.click(screen.getByText(/fontanería/i));

    // Submit form
    await user.click(screen.getByRole('button', { name: /publicar/i }));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/solicitud creada exitosamente/i)).toBeInTheDocument();
    });

    // Verify providers were notified
    expect(screen.getByText(/se ha notificado a 2 proveedores/i)).toBeInTheDocument();
  });

  it('should handle form validation errors', async () => {
    const user = userEvent.setup();

    render(
      <SupabaseAuthProvider>
        <BudgetRequestForm />
      </SupabaseAuthProvider>
    );

    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /publicar/i }));

    // Verify validation messages
    await waitFor(() => {
      expect(screen.getByText(/título es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/descripción es requerida/i)).toBeInTheDocument();
    });
  });
});
```

### **3. E2E Tests (Cypress)**

#### **User Registration Journey**
```typescript
// cypress/e2e/user-registration.cy.ts
describe('User Registration Flow', () => {
  beforeEach(() => {
    cy.visit('/auth/register');
  });

  it('should complete multi-role registration successfully', () => {
    // Step 1: Select roles
    cy.get('[data-testid="role-particular"]').click();
    cy.get('[data-testid="role-service-provider"]').click();
    cy.get('[data-testid="confirm-roles"]').click();

    // Step 2: Fill particular information
    cy.get('[data-testid="full-name"]').type('Juan Pérez García');
    cy.get('[data-testid="phone"]').type('+34600123456');
    cy.get('[data-testid="address"]').type('Calle Mayor 123');
    cy.get('[data-testid="postal-code"]').type('28001');
    cy.get('[data-testid="city"]').type('Madrid');
    cy.get('[data-testid="province"]').type('Madrid');
    cy.get('[data-testid="next-role"]').click();

    // Step 3: Fill service provider information
    cy.get('[data-testid="company-name"]').type('Servicios Juan S.L.');
    cy.get('[data-testid="business-email"]').type('juan@servicios.com');
    cy.get('[data-testid="business-phone"]').type('+34900123456');
    cy.get('[data-testid="company-address"]').type('Calle Industria 456');
    cy.get('[data-testid="company-postal-code"]').type('28046');
    cy.get('[data-testid="company-city"]').type('Madrid');
    cy.get('[data-testid="company-province"]').type('Madrid');
    cy.get('[data-testid="cif"]').type('B12345678');
    cy.get('[data-testid="verify-cif"]').click();

    // Wait for CIF verification
    cy.get('[data-testid="cif-verified"]', { timeout: 10000 }).should('be.visible');

    // Select services
    cy.get('[data-testid="service-plumbing"]').click();
    cy.get('[data-testid="service-electrical"]').click();
    cy.get('[data-testid="continue-password"]').click();

    // Step 4: Set password
    cy.get('[data-testid="email"]').type('juan.test@example.com');
    cy.get('[data-testid="password"]').type('SecurePass123!');
    cy.get('[data-testid="confirm-password"]').type('SecurePass123!');

    // Submit registration
    cy.get('[data-testid="create-account"]').click();

    // Verify success and redirection
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('contain', 'Bienvenido');
    cy.get('[data-testid="roles-created"]').should('contain', '2 roles activos');
  });

  it('should handle CIF validation errors', () => {
    // Navigate to service provider step
    cy.get('[data-testid="role-service-provider"]').click();
    cy.get('[data-testid="confirm-roles"]').click();

    // Fill required fields
    cy.get('[data-testid="company-name"]').type('Test Company');
    cy.get('[data-testid="business-email"]').type('test@company.com');
    cy.get('[data-testid="business-phone"]').type('+34900000000');
    cy.get('[data-testid="company-address"]').type('Test Address');
    cy.get('[data-testid="company-postal-code"]').type('28001');
    cy.get('[data-testid="company-city"]').type('Madrid');
    cy.get('[data-testid="company-province"]').type('Madrid');
    
    // Enter invalid CIF
    cy.get('[data-testid="cif"]').type('INVALID123');
    cy.get('[data-testid="verify-cif"]').click();

    // Verify error message
    cy.get('[data-testid="cif-error"]').should('contain', 'CIF no válido');
    cy.get('[data-testid="continue-password"]').should('be.disabled');
  });
});
```

#### **Dashboard Navigation & Role Switching**
```typescript
// cypress/e2e/dashboard-navigation.cy.ts
describe('Dashboard Navigation & Role Switching', () => {
  beforeEach(() => {
    // Login with test user that has multiple roles
    cy.login('multi-role@test.com', 'password123');
    cy.visit('/dashboard');
  });

  it('should navigate between different sections correctly', () => {
    // Verify default overview section
    cy.get('[data-testid="section-overview"]').should('be.visible');
    cy.get('[data-testid="quick-actions"]').should('be.visible');

    // Navigate to properties
    cy.get('[data-testid="nav-properties"]').click();
    cy.get('[data-testid="properties-list"]').should('be.visible');
    cy.url().should('include', '?tab=propiedades');

    // Navigate to budget requests
    cy.get('[data-testid="nav-budget"]').click();
    cy.get('[data-testid="budget-form"]').should('be.visible');
    cy.url().should('include', '?tab=presupuesto');

    // Navigate to notifications
    cy.get('[data-testid="nav-notifications"]').click();
    cy.get('[data-testid="notification-list"]').should('be.visible');
    cy.url().should('include', '?tab=notificaciones');
  });

  it('should switch roles and update interface', () => {
    // Verify initial role (particular)
    cy.get('[data-testid="active-role"]').should('contain', 'Particular');
    cy.get('[data-testid="nav-properties"]').should('be.visible');

    // Switch to service provider role
    cy.get('[data-testid="role-selector"]').click();
    cy.get('[data-testid="role-service-provider"]').click();

    // Wait for role switch animation
    cy.get('[data-testid="role-switch-loading"]').should('not.exist');

    // Verify interface updated
    cy.get('[data-testid="active-role"]').should('contain', 'Proveedor de Servicios');
    cy.get('[data-testid="nav-manage-quotes"]').should('be.visible');
    cy.get('[data-testid="provider-stats"]').should('be.visible');

    // Switch to property administrator
    cy.get('[data-testid="role-selector"]').click();
    cy.get('[data-testid="role-property-administrator"]').click();

    // Verify administrator interface
    cy.get('[data-testid="active-role"]').should('contain', 'Administrador de Fincas');
    cy.get('[data-testid="nav-communities"]').should('be.visible');
    cy.get('[data-testid="nav-incidents"]').should('be.visible');
    cy.get('[data-testid="admin-stats"]').should('be.visible');
  });

  it('should maintain role selection across page reloads', () => {
    // Switch to service provider
    cy.get('[data-testid="role-selector"]').click();
    cy.get('[data-testid="role-service-provider"]').click();
    
    // Wait for switch to complete
    cy.get('[data-testid="active-role"]').should('contain', 'Proveedor de Servicios');

    // Reload page
    cy.reload();

    // Verify role is maintained
    cy.get('[data-testid="active-role"]').should('contain', 'Proveedor de Servicios');
    cy.get('[data-testid="provider-stats"]').should('be.visible');
  });
});
```

## 📊 **PERFORMANCE TESTING**

### **1. Load Testing Configuration**
```typescript
// __tests__/performance/load-test.ts
import { performance } from 'perf_hooks';

describe('Performance Tests', () => {
  it('should load dashboard within performance budget', async () => {
    const startTime = performance.now();
    
    // Simulate dashboard data loading
    const mockDataLoad = new Promise(resolve => {
      setTimeout(() => resolve(true), 100); // Max 100ms budget
    });

    await mockDataLoad;
    
    const endTime = performance.now();
    const loadTime = endTime - startTime;

    expect(loadTime).toBeLessThan(150); // 150ms budget
  });

  it('should handle large notification lists efficiently', () => {
    const largeNotificationList = Array.from({ length: 1000 }, (_, i) => ({
      id: `notification-${i}`,
      title: `Notification ${i}`,
      message: `Message content for notification ${i}`,
    }));

    const startTime = performance.now();
    
    // Simulate processing large list
    const processedList = largeNotificationList
      .filter(notification => notification.id.includes('notification'))
      .map(notification => ({ ...notification, processed: true }))
      .slice(0, 20); // Pagination

    const endTime = performance.now();
    const processingTime = endTime - startTime;

    expect(processingTime).toBeLessThan(10); // 10ms budget for processing
    expect(processedList).toHaveLength(20);
  });
});
```

### **2. Bundle Size Monitoring**
```javascript
// __tests__/performance/bundle-analysis.test.js
const bundleAnalyzer = require('webpack-bundle-analyzer');
const fs = require('fs');
const path = require('path');

describe('Bundle Size Tests', () => {
  it('should maintain bundle size within limits', () => {
    const statsFile = path.join(__dirname, '../../.next/static/stats.json');
    
    if (!fs.existsSync(statsFile)) {
      console.warn('Bundle stats not found. Run `npm run build` first.');
      return;
    }

    const stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    
    // Check main bundle size
    const mainChunk = stats.chunks.find(chunk => chunk.names.includes('main'));
    const mainBundleSize = mainChunk ? mainChunk.size : 0;
    
    expect(mainBundleSize).toBeLessThan(500 * 1024); // 500KB limit
    
    // Check individual page bundles
    const pageChunks = stats.chunks.filter(chunk => 
      chunk.names.some(name => name.startsWith('pages/'))
    );
    
    pageChunks.forEach(chunk => {
      expect(chunk.size).toBeLessThan(300 * 1024); // 300KB per page
    });
  });
});
```

## 🚀 **CONTINUOUS INTEGRATION SETUP**

### **1. GitHub Actions Workflow**
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Start application
        run: npm start &
        
      - name: Wait for application
        run: npx wait-on http://localhost:3000
      
      - name: Run integration tests
        run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    needs: integration-tests
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Start application
        run: npm start &
        
      - name: Run Cypress tests
        uses: cypress-io/github-action@v5
        with:
          wait-on: 'http://localhost:3000'
          wait-on-timeout: 120
          browser: chrome
          record: true
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  performance-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### **2. Test Scripts Package.json**
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=__tests__/unit",
    "test:integration": "jest --testPathPattern=__tests__/integration",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "e2e": "cypress run",
    "e2e:open": "cypress open",
    "e2e:ci": "start-server-and-test start http://localhost:3000 'cypress run'",
    "type-check": "tsc --noEmit",
    "lint:test": "eslint '__tests__/**/*.{ts,tsx}' 'cypress/**/*.{ts,tsx}'",
    "test:ci": "npm run type-check && npm run lint:test && npm run test:coverage && npm run e2e:ci"
  }
}
```

## 📈 **MÉTRICAS Y REPORTING**

### **1. Coverage Reports**
- **Líneas de código**: Mínimo 70%
- **Branches**: Mínimo 70%
- **Funciones**: Mínimo 70%
- **Statements**: Mínimo 70%

### **2. Performance Budgets**
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 4s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### **3. Test Quality Metrics**
- **Test Execution Time**: < 5 minutos total
- **Flaky Test Rate**: < 1%
- **Test Maintenance Ratio**: < 2:1 (código:test)

Esta estrategia de testing garantiza la calidad, mantenibilidad y confiabilidad del código de HuBiT 9.0, estableciendo una base sólida para el desarrollo futuro y la detección temprana de errores.