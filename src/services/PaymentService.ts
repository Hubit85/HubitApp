
export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank_account' | 'paypal' | 'bizum';
  provider: 'stripe' | 'paypal' | 'redsys';
  isDefault: boolean;
  cardLast4?: string;
  cardBrand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  bankName?: string;
  accountLast4?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  type: 'service_payment' | 'community_fee' | 'subscription' | 'deposit';
  description: string;
  serviceRequestId?: string;
  invoiceId?: string;
  subscriptionId?: string;
  paymentMethodId: string;
  providerId?: string;
  communityId?: string;
  metadata?: Record<string, any>;
  processingFee: number;
  netAmount: number;
  refundAmount?: number;
  refundReason?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  providerId?: string;
  communityId?: string;
  amount: number;
  currency: string;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  items: InvoiceItem[];
  paymentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
}

export interface Subscription {
  id: string;
  userId: string;
  providerId?: string;
  communityId?: string;
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  amount: number;
  currency: string;
  interval: 'monthly' | 'quarterly' | 'yearly';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethodId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentData {
  amount: number;
  currency: string;
  type: 'service_payment' | 'community_fee' | 'subscription' | 'deposit';
  description: string;
  paymentMethodId: string;
  serviceRequestId?: string;
  providerId?: string;
  communityId?: string;
  metadata?: Record<string, any>;
}

export interface CreateInvoiceData {
  userId: string;
  providerId?: string;
  communityId?: string;
  amount: number;
  currency: string;
  taxAmount: number;
  dueDate: Date;
  items: Omit<InvoiceItem, 'id'>[];
  notes?: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

class PaymentService {
  private baseUrl = '/api/payments';
  private invoiceUrl = '/api/invoices';
  private subscriptionUrl = '/api/subscriptions';

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await fetch(`${this.baseUrl}/methods`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment methods');
    }

    return response.json();
  }

  async addPaymentMethod(data: {
    type: 'card' | 'bank_account' | 'paypal' | 'bizum';
    provider: 'stripe' | 'paypal' | 'redsys';
    token: string;
    isDefault?: boolean;
  }): Promise<PaymentMethod> {
    const response = await fetch(`${this.baseUrl}/methods`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to add payment method');
    }

    return response.json();
  }

  async updatePaymentMethod(id: string, data: {
    isDefault?: boolean;
  }): Promise<PaymentMethod> {
    const response = await fetch(`${this.baseUrl}/methods/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update payment method');
    }

    return response.json();
  }

  async deletePaymentMethod(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/methods/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete payment method');
    }
  }

  async createPaymentIntent(data: CreatePaymentData): Promise<PaymentIntent> {
    const response = await fetch(`${this.baseUrl}/intent`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return response.json();
  }

  async confirmPayment(paymentIntentId: string): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/confirm`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ paymentIntentId }),
    });

    if (!response.ok) {
      throw new Error('Failed to confirm payment');
    }

    return response.json();
  }

  async getPayments(filters?: {
    status?: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Payment[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());

    const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }

    return response.json();
  }

  async getPayment(id: string): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment');
    }

    return response.json();
  }

  async refundPayment(id: string, amount?: number, reason?: string): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/${id}/refund`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ amount, reason }),
    });

    if (!response.ok) {
      throw new Error('Failed to refund payment');
    }

    return response.json();
  }

  async createInvoice(data: CreateInvoiceData): Promise<Invoice> {
    const response = await fetch(this.invoiceUrl, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create invoice');
    }

    return response.json();
  }

  async getInvoices(filters?: {
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Invoice[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());

    const response = await fetch(`${this.invoiceUrl}?${params.toString()}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }

    return response.json();
  }

  async getInvoice(id: string): Promise<Invoice> {
    const response = await fetch(`${this.invoiceUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invoice');
    }

    return response.json();
  }

  async updateInvoice(id: string, data: Partial<CreateInvoiceData>): Promise<Invoice> {
    const response = await fetch(`${this.invoiceUrl}/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update invoice');
    }

    return response.json();
  }

  async sendInvoice(id: string): Promise<Invoice> {
    const response = await fetch(`${this.invoiceUrl}/${id}/send`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to send invoice');
    }

    return response.json();
  }

  async payInvoice(id: string, paymentMethodId: string): Promise<Payment> {
    const response = await fetch(`${this.invoiceUrl}/${id}/pay`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ paymentMethodId }),
    });

    if (!response.ok) {
      throw new Error('Failed to pay invoice');
    }

    return response.json();
  }

  async downloadInvoice(id: string): Promise<Blob> {
    const response = await fetch(`${this.invoiceUrl}/${id}/download`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to download invoice');
    }

    return response.blob();
  }

  async getSubscriptions(): Promise<Subscription[]> {
    const response = await fetch(this.subscriptionUrl, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscriptions');
    }

    return response.json();
  }

  async createSubscription(data: {
    planId: string;
    paymentMethodId: string;
    providerId?: string;
    communityId?: string;
  }): Promise<Subscription> {
    const response = await fetch(this.subscriptionUrl, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create subscription');
    }

    return response.json();
  }

  async updateSubscription(id: string, data: {
    paymentMethodId?: string;
    cancelAtPeriodEnd?: boolean;
  }): Promise<Subscription> {
    const response = await fetch(`${this.subscriptionUrl}/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }

    return response.json();
  }

  async cancelSubscription(id: string, immediately: boolean = false): Promise<Subscription> {
    const response = await fetch(`${this.subscriptionUrl}/${id}/cancel`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ immediately }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    return response.json();
  }

  async getPaymentStats(period: 'week' | 'month' | 'quarter' | 'year'): Promise<{
    totalRevenue: number;
    totalPayments: number;
    averagePayment: number;
    refundRate: number;
    topCategories: Array<{ category: string; amount: number; count: number }>;
  }> {
    const response = await fetch(`${this.baseUrl}/stats?period=${period}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment stats');
    }

    return response.json();
  }
}

export const paymentService = new PaymentService();
