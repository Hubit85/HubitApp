
export interface BudgetRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  propertyId?: string;
  communityId?: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: string[];
  attachments: string[];
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  timeline: {
    startDate?: Date;
    endDate?: Date;
    flexible: boolean;
  };
  status: 'draft' | 'published' | 'in_review' | 'quotes_received' | 'provider_selected' | 'completed' | 'cancelled';
  quotesCount: number;
  selectedQuoteId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  id: string;
  budgetRequestId: string;
  providerId: string;
  providerName: string;
  providerRating: number;
  amount: number;
  currency: string;
  breakdown: QuoteBreakdown[];
  description: string;
  timeline: {
    startDate: Date;
    endDate: Date;
    estimatedDuration: string;
  };
  terms: string;
  warranty: {
    duration: number;
    description: string;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  validUntil: Date;
  attachments: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteBreakdown {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

export interface CreateBudgetRequestData {
  title: string;
  description: string;
  category: string;
  propertyId?: string;
  communityId?: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: string[];
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  timeline: {
    startDate?: Date;
    endDate?: Date;
    flexible: boolean;
  };
}

export interface CreateQuoteData {
  budgetRequestId: string;
  amount: number;
  currency: string;
  breakdown: Omit<QuoteBreakdown, 'id'>[];
  description: string;
  timeline: {
    startDate: Date;
    endDate: Date;
    estimatedDuration: string;
  };
  terms: string;
  warranty: {
    duration: number;
    description: string;
  };
  validUntil: Date;
}

class BudgetService {
  private baseUrl = '/api/budget-requests';
  private quoteUrl = '/api/quotes';

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async createBudgetRequest(data: CreateBudgetRequestData): Promise<BudgetRequest> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create budget request');
    }

    return response.json();
  }

  async getBudgetRequests(filters?: {
    status?: string;
    category?: string;
    urgency?: string;
    location?: string;
  }): Promise<BudgetRequest[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.urgency) params.append('urgency', filters.urgency);
    if (filters?.location) params.append('location', filters.location);

    const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch budget requests');
    }

    return response.json();
  }

  async getMyBudgetRequests(): Promise<BudgetRequest[]> {
    const response = await fetch(`${this.baseUrl}/my-requests`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch my budget requests');
    }

    return response.json();
  }

  async getBudgetRequest(id: string): Promise<BudgetRequest> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch budget request');
    }

    return response.json();
  }

  async updateBudgetRequest(id: string, data: Partial<CreateBudgetRequestData>): Promise<BudgetRequest> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update budget request');
    }

    return response.json();
  }

  async publishBudgetRequest(id: string): Promise<BudgetRequest> {
    const response = await fetch(`${this.baseUrl}/${id}/publish`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to publish budget request');
    }

    return response.json();
  }

  async cancelBudgetRequest(id: string): Promise<BudgetRequest> {
    const response = await fetch(`${this.baseUrl}/${id}/cancel`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel budget request');
    }

    return response.json();
  }

  async uploadAttachments(id: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('attachments', file));

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${this.baseUrl}/${id}/attachments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload attachments');
    }

    return response.json();
  }

  async createQuote(data: CreateQuoteData): Promise<Quote> {
    const response = await fetch(this.quoteUrl, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create quote');
    }

    return response.json();
  }

  async getQuotes(budgetRequestId: string): Promise<Quote[]> {
    const response = await fetch(`${this.quoteUrl}?budgetRequestId=${budgetRequestId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch quotes');
    }

    return response.json();
  }

  async getMyQuotes(): Promise<Quote[]> {
    const response = await fetch(`${this.quoteUrl}/my-quotes`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch my quotes');
    }

    return response.json();
  }

  async getQuote(id: string): Promise<Quote> {
    const response = await fetch(`${this.quoteUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }

    return response.json();
  }

  async updateQuote(id: string, data: Partial<CreateQuoteData>): Promise<Quote> {
    const response = await fetch(`${this.quoteUrl}/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update quote');
    }

    return response.json();
  }

  async acceptQuote(id: string): Promise<Quote> {
    const response = await fetch(`${this.quoteUrl}/${id}/accept`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to accept quote');
    }

    return response.json();
  }

  async rejectQuote(id: string, reason?: string): Promise<Quote> {
    const response = await fetch(`${this.quoteUrl}/${id}/reject`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      throw new Error('Failed to reject quote');
    }

    return response.json();
  }

  async uploadQuoteAttachments(id: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('attachments', file));

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${this.quoteUrl}/${id}/attachments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload quote attachments');
    }

    return response.json();
  }

  async getCategories(): Promise<Array<{ id: string; name: string; description: string }>> {
    const response = await fetch('/api/service-categories');

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  }

  async getBudgetStats(): Promise<{
    totalRequests: number;
    activeRequests: number;
    completedRequests: number;
    averageBudget: number;
    topCategories: Array<{ category: string; count: number; averageBudget: number }>;
  }> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch budget stats');
    }

    return response.json();
  }
}

export const budgetService = new BudgetService();
