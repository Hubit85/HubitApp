import { supabase } from "@/integrations/supabase/client";
import { 
  Contract, 
  ContractInsert, 
  ContractUpdate,
  ContractWithDetails,
  WorkSession,
  WorkSessionInsert,
  WorkSessionUpdate
} from "@/integrations/supabase/types";

export class SupabaseContractService {
  // ===================== CONTRACTS =====================
  
  static async createContract(contractData: ContractInsert): Promise<Contract> {
    const { data, error } = await supabase
      .from("contracts")
      .insert({
        ...contractData,
        status: "pending",
        progress_percentage: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateContract(id: string, updates: ContractUpdate): Promise<Contract> {
    const { data, error } = await supabase
      .from("contracts")
      .update({
        ...updates,
        last_update: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getContract(id: string): Promise<ContractWithDetails> {
    const { data, error } = await supabase
      .from("contracts")
      .select(`
        *,
        quotes (
          id,
          amount,
          description,
          estimated_duration,
          warranty_period,
          terms_and_conditions
        ),
        profiles!contracts_user_id_fkey (
          id,
          full_name,
          email,
          phone,
          avatar_url
        ),
        service_providers (
          id,
          company_name,
          business_license,
          verified,
          rating_average,
          emergency_services,
          profiles (
            full_name,
            phone,
            email
          )
        ),
        work_sessions (*),
        ratings (*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as ContractWithDetails;
  }

  static async getUserContracts(userId: string): Promise<ContractWithDetails[]> {
    const { data, error } = await supabase
      .from("contracts")
      .select(`
        *,
        quotes (
          id,
          amount,
          description
        ),
        service_providers (
          id,
          company_name,
          verified,
          rating_average,
          profiles (
            full_name,
            phone
          )
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getProviderContracts(providerId: string): Promise<ContractWithDetails[]> {
    const { data, error } = await supabase
      .from("contracts")
      .select(`
        *,
        quotes (
          id,
          amount,
          description
        ),
        profiles!contracts_user_id_fkey (
          id,
          full_name,
          phone,
          address,
          city
        )
      `)
      .eq("service_provider_id", providerId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async signContract(id: string, signature: string, signerType: 'client' | 'provider'): Promise<Contract> {
    const updates: ContractUpdate = {
      signed_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (signerType === 'client') {
      updates.client_signature = signature;
    } else {
      updates.provider_signature = signature;
    }

    const contract = await this.updateContract(id, updates);

    // If both signatures are present, activate the contract
    if (contract.client_signature && contract.provider_signature) {
      return this.updateContract(id, {
        status: "active",
        start_date: new Date().toISOString()
      });
    }

    return contract;
  }

  static async updateContractProgress(id: string, percentage: number, notes?: string): Promise<Contract> {
    return this.updateContract(id, {
      progress_percentage: Math.max(0, Math.min(100, percentage)),
      last_update: new Date().toISOString()
    });
  }

  static async completeContract(id: string): Promise<Contract> {
    return this.updateContract(id, {
      status: "completed",
      completion_date: new Date().toISOString(),
      progress_percentage: 100
    });
  }

  static async cancelContract(id: string, reason: string): Promise<Contract> {
    return this.updateContract(id, {
      status: "cancelled",
      cancellation_reason: reason
    });
  }

  static async disputeContract(id: string, reason: string): Promise<Contract> {
    return this.updateContract(id, {
      status: "disputed",
      dispute_reason: reason
    });
  }

  // ===================== WORK SESSIONS =====================

  static async createWorkSession(sessionData: WorkSessionInsert): Promise<WorkSession> {
    const { data, error } = await supabase
      .from("work_sessions")
      .insert({
        ...sessionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateWorkSession(id: string, updates: WorkSessionUpdate): Promise<WorkSession> {
    const { data, error } = await supabase
      .from("work_sessions")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getWorkSession(id: string): Promise<WorkSession> {
    const { data, error } = await supabase
      .from("work_sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getContractWorkSessions(contractId: string): Promise<WorkSession[]> {
    const { data, error } = await supabase
      .from("work_sessions")
      .select("*")
      .eq("contract_id", contractId)
      .order("start_time", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async startWorkSession(contractId: string, serviceProviderId: string, description?: string): Promise<WorkSession> {
    return this.createWorkSession({
      contract_id: contractId,
      service_provider_id: serviceProviderId,
      start_time: new Date().toISOString(),
      description: description || "Work session started"
    });
  }

  static async endWorkSession(id: string, workPerformed?: string, materialsUsed?: any[]): Promise<WorkSession> {
    const session = await this.getWorkSession(id);
    const startTime = new Date(session.start_time);
    const endTime = new Date();
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    let totalCost = 0;
    if (session.hourly_rate) {
      totalCost = (session.hourly_rate * durationMinutes) / 60;
    }

    return this.updateWorkSession(id, {
      end_time: endTime.toISOString(),
      duration_minutes: durationMinutes,
      work_performed: workPerformed,
      materials_used: materialsUsed,
      total_cost: totalCost
    });
  }

  static async approveWorkSession(id: string, approved: boolean, clientNotes?: string): Promise<WorkSession> {
    return this.updateWorkSession(id, {
      client_approved: approved,
      client_notes: clientNotes
    });
  }

  // ===================== CONTRACT ANALYTICS =====================

  static async getContractStats(userId: string, isProvider: boolean = false): Promise<{
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    totalValue: number;
    averageValue: number;
    completionRate: number;
  }> {
    const contracts = isProvider 
      ? await this.getProviderContracts(userId)
      : await this.getUserContracts(userId);
    
    const stats = {
      total: contracts.length,
      active: contracts.filter(c => c.status === "active").length,
      completed: contracts.filter(c => c.status === "completed").length,
      cancelled: contracts.filter(c => c.status === "cancelled").length,
      totalValue: contracts.reduce((sum, c) => sum + (c.total_amount || 0), 0),
      averageValue: contracts.length > 0 
        ? contracts.reduce((sum, c) => sum + (c.total_amount || 0), 0) / contracts.length 
        : 0,
      completionRate: contracts.length > 0
        ? (contracts.filter(c => c.status === "completed").length / contracts.length) * 100
        : 0
    };

    return stats;
  }

  static async getWorkSessionStats(contractId: string): Promise<{
    totalSessions: number;
    totalHours: number;
    totalCost: number;
    averageSessionDuration: number;
    approvedSessions: number;
  }> {
    const sessions = await this.getContractWorkSessions(contractId);
    
    const stats = {
      totalSessions: sessions.length,
      totalHours: sessions.reduce((sum, s) => sum + ((s.duration_minutes || 0) / 60), 0),
      totalCost: sessions.reduce((sum, s) => sum + (s.total_cost || 0), 0),
      averageSessionDuration: sessions.length > 0
        ? sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / sessions.length
        : 0,
      approvedSessions: sessions.filter(s => s.client_approved === true).length
    };

    return stats;
  }

  // ===================== SEARCH & FILTERS =====================

  static async searchContracts(userId: string, filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
    isProvider?: boolean;
  }): Promise<ContractWithDetails[]> {
    let query = supabase
      .from("contracts")
      .select(`
        *,
        quotes (
          id,
          amount,
          description
        ),
        service_providers (
          id,
          company_name,
          verified,
          profiles (
            full_name
          )
        )
      `);

    if (filters?.isProvider) {
      query = query.eq("service_provider_id", userId);
    } else {
      query = query.eq("user_id", userId);
    }

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.dateFrom) {
      query = query.gte("created_at", filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte("created_at", filters.dateTo);
    }

    if (filters?.minAmount) {
      query = query.gte("total_amount", filters.minAmount);
    }

    if (filters?.maxAmount) {
      query = query.lte("total_amount", filters.maxAmount);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // ===================== CONTRACT TEMPLATES & AUTOMATION =====================

  static async generateContractFromQuote(quoteId: string): Promise<Contract> {
    // First get the quote with related data
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select(`
        *,
        budget_requests (
          id,
          user_id,
          title,
          description,
          work_location
        ),
        service_providers (
          id,
          user_id,
          company_name
        )
      `)
      .eq("id", quoteId)
      .single();

    if (quoteError || !quote) {
      throw new Error("Quote not found");
    }

    // Generate contract number
    const contractNumber = `CT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const contractData: ContractInsert = {
      quote_id: quoteId,
      user_id: quote.budget_requests.user_id,
      service_provider_id: quote.service_provider_id,
      contract_number: contractNumber,
      total_amount: quote.amount,
      work_description: quote.description,
      terms: quote.terms_and_conditions || "Standard terms and conditions apply",
      payment_schedule: quote.payment_terms || "Payment due upon completion"
    };

    return this.createContract(contractData);
  }

  static async deleteContract(id: string): Promise<void> {
    const { error } = await supabase
      .from("contracts")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }
}