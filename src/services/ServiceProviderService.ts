
export interface ServiceProvider {
  id: string;
  userId: string;
  companyName: string;
  taxId: string;
  description: string;
  website?: string;
  address: string;
  phone: string;
  email: string;
  services: ServiceCategory[];
  certifications: Certification[];
  portfolio: PortfolioItem[];
  rating: number;
  reviewCount: number;
  completedJobs: number;
  responseTime: string;
  memberSince: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  basePrice?: number;
  priceUnit?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  validUntil?: Date;
  documentUrl?: string;
  isVerified: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  completedAt: Date;
  category: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  serviceCategory: string;
  createdAt: Date;
}

export interface CreateServiceProviderData {
  companyName: string;
  taxId: string;
  description: string;
  website?: string;
  address: string;
  phone: string;
  email: string;
  services: string[];
}

export interface UpdateServiceProviderData {
  companyName?: string;
  description?: string;
  website?: string;
  address?: string;
  phone?: string;
  email?: string;
  services?: string[];
}

class ServiceProviderService {
  private baseUrl = '/api/service-providers';

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getServiceProviders(filters?: {
    category?: string;
    location?: string;
    rating?: number;
    search?: string;
  }): Promise<ServiceProvider[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.rating) params.append('rating', filters.rating.toString());
    if (filters?.search) params.append('search', filters.search);

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch service providers');
    }

    return response.json();
  }

  async getServiceProvider(id: string): Promise<ServiceProvider> {
    const response = await fetch(`${this.baseUrl}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch service provider');
    }

    return response.json();
  }

  async getMyProfile(): Promise<ServiceProvider> {
    const response = await fetch(`${this.baseUrl}/my-profile`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }

  async createProfile(data: CreateServiceProviderData): Promise<ServiceProvider> {
    const response = await fetch(`${this.baseUrl}/profile`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create profile');
    }

    return response.json();
  }

  async updateProfile(data: UpdateServiceProviderData): Promise<ServiceProvider> {
    const response = await fetch(`${this.baseUrl}/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  }

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${this.baseUrl}/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }

    const result = await response.json();
    return result.avatarUrl;
  }

  async addCertification(certification: Omit<Certification, 'id' | 'isVerified'>): Promise<Certification> {
    const response = await fetch(`${this.baseUrl}/certifications`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(certification),
    });

    if (!response.ok) {
      throw new Error('Failed to add certification');
    }

    return response.json();
  }

  async updateCertification(id: string, certification: Partial<Certification>): Promise<Certification> {
    const response = await fetch(`${this.baseUrl}/certifications/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(certification),
    });

    if (!response.ok) {
      throw new Error('Failed to update certification');
    }

    return response.json();
  }

  async deleteCertification(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/certifications/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete certification');
    }
  }

  async addPortfolioItem(item: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem> {
    const response = await fetch(`${this.baseUrl}/portfolio`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to add portfolio item');
    }

    return response.json();
  }

  async updatePortfolioItem(id: string, item: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const response = await fetch(`${this.baseUrl}/portfolio/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to update portfolio item');
    }

    return response.json();
  }

  async deletePortfolioItem(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/portfolio/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete portfolio item');
    }
  }

  async uploadPortfolioImages(itemId: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${this.baseUrl}/portfolio/${itemId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload portfolio images');
    }

    return response.json();
  }

  async getReviews(providerId: string): Promise<Review[]> {
    const response = await fetch(`${this.baseUrl}/${providerId}/reviews`);

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    return response.json();
  }

  async addReview(providerId: string, review: {
    rating: number;
    comment: string;
    serviceCategory: string;
  }): Promise<Review> {
    const response = await fetch(`${this.baseUrl}/${providerId}/reviews`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      throw new Error('Failed to add review');
    }

    return response.json();
  }

  async getServiceCategories(): Promise<ServiceCategory[]> {
    const response = await fetch('/api/service-categories');

    if (!response.ok) {
      throw new Error('Failed to fetch service categories');
    }

    return response.json();
  }

  async getFavoriteProviders(): Promise<ServiceProvider[]> {
    const response = await fetch(`${this.baseUrl}/favorites`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch favorite providers');
    }

    return response.json();
  }

  async addToFavorites(providerId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${providerId}/favorite`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to add to favorites');
    }
  }

  async removeFromFavorites(providerId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${providerId}/favorite`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to remove from favorites');
    }
  }
}

export const serviceProviderService = new ServiceProviderService();
