
export interface Contract {
  id: string;
  budgetRequestId: string;
  quoteId: string;
  clientId: string;
  providerId: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: 'draft' | 'pending_signature' | 'active' | 'completed' | 'cancelled' | 'disputed';
  terms: ContractTerms;
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: Milestone[];
  };
  payments: ContractPayment[];
  documents: ContractDocument[];
  signatures: ContractSignature[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ContractTerms {
  workDescription: string;
  deliverables: string[];
  paymentTerms: string;
  cancellationPolicy: string;
  warranty: {
    duration: number;
    description: string;
  };
  liability: string;
  additionalTerms: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  completedAt?: Date;
  notes?: string;
}

export interface ContractPayment {
  id: string;
  milestoneId?: string;
  amount: number;
  type: 'deposit' | 'milestone' | 'final' | 'additional';
  status: 'pending' | 'paid' | 'overdue';
  dueDate: Date;
  paidAt?: Date;
  paymentId?: string;
}

export interface ContractDocument {
  id: string;
  name: string;
  type: 'contract' | 'invoice' | 'receipt' | 'certificate' | 'other';
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ContractSignature {
  id: string;
  userId: string;
  userRole: 'client' | 'provider';
  signedAt: Date;
  ipAddress: string;
  signatureData: string;
}

export interface CreateContractData {
  budgetRequestId: string;
  quoteId: string;
  providerId: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  terms: ContractTerms;
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: Omit<Milestone, 'id' | 'status' | 'completedAt'>[];
  };
  paymentSchedule: Omit<ContractPayment, 'id' | 'status' | 'paidAt' | 'paymentId'>[];
}

export interface UpdateContractData {
  title?: string;
  description?: string;
  terms?: Partial<ContractTerms>;
  timeline?: {
    startDate?: Date;
    endDate?: Date;
    milestones?: Partial<Milestone>[];
  };
}

class ContractService {
  private baseUrl = '/api/contracts';

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async createContract(data: CreateContractData): Promise<Contract> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create contract');
    }

    return response.json();
  }

  async getContracts(filters?: {
    status?: string;
    role?: 'client' | 'provider';
    startDate?: Date;
    endDate?: Date;
  }): Promise<Contract[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());

    const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contracts');
    }

    return response.json();
  }

  async getContract(id: string): Promise<Contract> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contract');
    }

    return response.json();
  }

  async updateContract(id: string, data: UpdateContractData): Promise<Contract> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update contract');
    }

    return response.json();
  }

  async signContract(id: string, signatureData: string): Promise<Contract> {
    const response = await fetch(`${this.baseUrl}/${id}/sign`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ signatureData }),
    });

    if (!response.ok) {
      throw new Error('Failed to sign contract');
    }

    return response.json();
  }

  async activateContract(id: string): Promise<Contract> {
    const response = await fetch(`${this.baseUrl}/${id}/activate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to activate contract');
    }

    return response.json();
  }

  async completeContract(id: string): Promise<Contract> {
    const response = await fetch(`${this.baseUrl}/${id}/complete`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to complete contract');
    }

    return response.json();
  }

  async cancelContract(id: string, reason: string): Promise<Contract> {
    const response = await fetch(`${this.baseUrl}/${id}/cancel`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel contract');
    }

    return response.json();
  }

  async updateMilestone(contractId: string, milestoneId: string, data: {
    status?: 'pending' | 'in_progress' | 'completed' | 'overdue';
    notes?: string;
  }): Promise<Milestone> {
    const response = await fetch(`${this.baseUrl}/${contractId}/milestones/${milestoneId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update milestone');
    }

    return response.json();
  }

  async completeMilestone(contractId: string, milestoneId: string): Promise<Milestone> {
    const response = await fetch(`${this.baseUrl}/${contractId}/milestones/${milestoneId}/complete`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to complete milestone');
    }

    return response.json();
  }

  async processPayment(contractId: string, paymentId: string, paymentMethodId: string): Promise<ContractPayment> {
    const response = await fetch(`${this.baseUrl}/${contractId}/payments/${paymentId}/process`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ paymentMethodId }),
    });

    if (!response.ok) {
      throw new Error('Failed to process payment');
    }

    return response.json();
  }

  async uploadDocument(contractId: string, file: File, type: string): Promise<ContractDocument> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${this.baseUrl}/${contractId}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload document');
    }

    return response.json();
  }

  async downloadDocument(contractId: string, documentId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/${contractId}/documents/${documentId}/download`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to download document');
    }

    return response.blob();
  }

  async generateContractPDF(id: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/${id}/pdf`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to generate contract PDF');
    }

    return response.blob();
  }

  async getContractStats(): Promise<{
    totalContracts: number;
    activeContracts: number;
    completedContracts: number;
    totalValue: number;
    averageValue: number;
    completionRate: number;
  }> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contract stats');
    }

    return response.json();
  }
}

export const contractService = new ContractService();
