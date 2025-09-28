import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'particular' | 'community_member' | 'service_provider' | 'administrator';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'particular' | 'community_member' | 'service_provider' | 'administrator';
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private baseUrl = '/api/auth';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Mock implementation for demo purposes
    // In a real app, this would make an API call
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      name: 'Usuario Demo',
      role: 'particular',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockToken = 'mock-jwt-token-' + Date.now();
    this.setToken(mockToken);

    return {
      user: mockUser,
      token: mockToken
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    // Mock implementation for demo purposes
    const mockUser: User = {
      id: '1',
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockToken = 'mock-jwt-token-' + Date.now();
    this.setToken(mockToken);

    return {
      user: mockUser,
      token: mockToken
    };
  }

  async logout(): Promise<void> {
    try {
      // Since no backend is connected, we'll just clear local storage
      // In a real app with backend, this would make an API call first
      this.removeToken();
      
      // Clear any other auth-related data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selectedProperty');
        localStorage.removeItem('user_profile');
        localStorage.removeItem('user_preferences');
      }
      
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch {
      // Even if there's an error, we should still clear local storage
      this.removeToken();
      throw new Error('Error durante el cierre de sesión');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Mock implementation - in a real app this would fetch from API
      const mockUser: User = {
        id: '1',
        email: 'usuario@demo.com',
        name: 'Usuario Demo',
        role: 'particular',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return mockUser;
    } catch {
      this.removeToken();
      return null;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    // Mock implementation
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const updatedUser: User = {
      ...currentUser,
      ...data,
      updatedAt: new Date()
    };

    return updatedUser;
  }

  async changePassword(_currentPassword: string, _newPassword: string): Promise<void> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would validate and update the password
  }

  async resetPassword(_email: string): Promise<void> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would send a reset email
  }

  static async changePassword(userId: string, currentPassword?: string, newPassword?: string): Promise<{ success: boolean; message: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _currentPassword, _newPassword } = { _currentPassword: currentPassword, _newPassword: newPassword };
    // This is a placeholder. In a real application, you would:
    // 1. Verify the current password is correct.
    // 2. Update the user's password in Supabase Auth.
    // This requires the user to be logged in.
    return { success: true, message: "Funcionalidad de cambio de contraseña no implementada." };
  }

  static async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      return { success: false, message: error.message };
    }
    
    return { success: true, message: "Si existe una cuenta con este email, se ha enviado un enlace para restablecer la contraseña." };
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
