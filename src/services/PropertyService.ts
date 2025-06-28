
export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'commercial' | 'community';
  size: string;
  description?: string;
  images: string[];
  ownerId: string;
  communityId?: string;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Community {
  id: string;
  name: string;
  address: string;
  description?: string;
  totalUnits: number;
  administratorId: string;
  budget: CommunityBudget;
  rules: string[];
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityBudget {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  breakdown: {
    expenses: Record<string, number>;
    income: Record<string, number>;
  };
  year: number;
}

export interface CreatePropertyData {
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'commercial' | 'community';
  size: string;
  description?: string;
  communityId?: string;
  features: string[];
}

export interface CreateCommunityData {
  name: string;
  address: string;
  description?: string;
  totalUnits: number;
  rules: string[];
  amenities: string[];
}

class PropertyService {
  private baseUrl = '/api/properties';
  private communityUrl = '/api/communities';

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getMyProperties(): Promise<Property[]> {
    const response = await fetch(`${this.baseUrl}/my-properties`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    return response.json();
  }

  async getProperty(id: string): Promise<Property> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch property');
    }

    return response.json();
  }

  async createProperty(data: CreatePropertyData): Promise<Property> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create property');
    }

    return response.json();
  }

  async updateProperty(id: string, data: Partial<CreatePropertyData>): Promise<Property> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update property');
    }

    return response.json();
  }

  async deleteProperty(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete property');
    }
  }

  async uploadPropertyImages(propertyId: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${this.baseUrl}/${propertyId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload images');
    }

    return response.json();
  }

  async getCommunities(): Promise<Community[]> {
    const response = await fetch(this.communityUrl, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch communities');
    }

    return response.json();
  }

  async getCommunity(id: string): Promise<Community> {
    const response = await fetch(`${this.communityUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch community');
    }

    return response.json();
  }

  async createCommunity(data: CreateCommunityData): Promise<Community> {
    const response = await fetch(this.communityUrl, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create community');
    }

    return response.json();
  }

  async updateCommunity(id: string, data: Partial<CreateCommunityData>): Promise<Community> {
    const response = await fetch(`${this.communityUrl}/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update community');
    }

    return response.json();
  }

  async getCommunityBudget(communityId: string, year?: number): Promise<CommunityBudget> {
    const yearParam = year ? `?year=${year}` : '';
    const response = await fetch(`${this.communityUrl}/${communityId}/budget${yearParam}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch community budget');
    }

    return response.json();
  }

  async updateCommunityBudget(communityId: string, budget: Partial<CommunityBudget>): Promise<CommunityBudget> {
    const response = await fetch(`${this.communityUrl}/${communityId}/budget`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(budget),
    });

    if (!response.ok) {
      throw new Error('Failed to update community budget');
    }

    return response.json();
  }

  async getCommunityMembers(communityId: string): Promise<any[]> {
    const response = await fetch(`${this.communityUrl}/${communityId}/members`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch community members');
    }

    return response.json();
  }

  async joinCommunity(communityId: string): Promise<void> {
    const response = await fetch(`${this.communityUrl}/${communityId}/join`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to join community');
    }
  }

  async leaveCommunity(communityId: string): Promise<void> {
    const response = await fetch(`${this.communityUrl}/${communityId}/leave`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to leave community');
    }
  }
}

export const propertyService = new PropertyService();
