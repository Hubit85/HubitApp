
import { supabase } from "@/integrations/supabase/client";
import { 
  Contract, 
  ContractInsert, 
  ContractUpdate,
  WorkSession,
  WorkSessionInsert,
  WorkSessionUpdate,
  Profile,
  ServiceProvider
} from "@/integrations/supabase/types";
import { SupabaseBudgetService } from "./SupabaseBudgetService";

type ContractWithProfiles = Contract & {
  clients: Pick<Profile, 'id' | 'full_name' | 'email' | 'phone'>;
  providers: Pick<ServiceProvider, 'id' | 'company_name' | 'email' | 'phone'>;
};

export class SupabaseContractService {
  // ===================== CONTRACTS =====================
  
  static async createContract(contractData: ContractInsert): Promise<Contract> {
    const { data, error } = await supabase
      .from("contracts")
      .insert({
        ...contractData,
        status: "pending",
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

  static async getContract(id: string): Promise<Contract> {
    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getContractWithProfiles(id: string): Promise<ContractWithProfiles | null> {
    const { data, error } = await supabase
      .from("contracts")
      .select(`
        *,
        profiles!contracts_client_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        service_providers (
          id,
          company_name,
          email,
          phone
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    // Transform the data to match our type
    const contract = data as any;
    return {
      ...contract,
      clients: contract.profiles,
      providers: contract.service_providers
    } as ContractWithProfiles;
  }

  static async getUserContracts(userId: string): Promise<Contract[]> {
    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .eq("client_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getProviderContracts(providerId: string): Promise<Contract[]> {
    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .eq("provider_id", providerId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async signContract(id: string, signature: string, signerType: 'client' | 'provider'): Promise<Contract> {
    const updates: ContractUpdate = {
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

  static async completeContract(id: string): Promise<Contract> {
    return this.updateContract(id, {
      status: "completed",
      end_date: new Date().toISOString()
    });
  }

  static async cancelContract(id: string, reason?: string): Promise<Contract> {
    return this.updateContract(id, {
      status: "cancelled"
    });
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

  // ===================== WORK SESSIONS =====================

  static async createWorkSession(workSessionData: {
    contract_id: string;
    service_provider_id: string;
    start_time: string;
    end_time: string;
    description: string;
  }): Promise<any> {
    const { data, error } = await supabase
      .from("work_sessions")
      .insert({
        contract_id: workSessionData.contract_id,
        service_provider_id: workSessionData.service_provider_id,
        start_time: workSessionData.start_time,
        end_time: workSessionData.end_time,
        description: workSessionData.description,
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

  static async startWorkSession(contractId: string, description?: string): Promise<WorkSession> {
    return this.createWorkSession({
      contract_id: contractId,
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      description: description || "Work session started"
    });
  }

  static async endWorkSession(id: string, workPerformed?: string): Promise<WorkSession> {
    const session = await this.getWorkSession(id);
    const startTime = new Date(session.start_time);
    const endTime = new Date();

    return this.updateWorkSession(id, {
      end_time: endTime.toISOString(),
      description: workPerformed || session.description
    });
  }

  static async approveWorkSession(id: string, approved: boolean): Promise<WorkSession> {
    return this.updateWorkSession(id, {
      client_approved: approved
    });
  }

  // ===================== STATISTICS =====================

  static async getContractStats(userId: string, isProvider: boolean = false): Promise<{
    total: number;
    active: number;
    completed: number;
    cancelled: number;
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
      completionRate: contracts.length > 0
        ? (contracts.filter(c => c.status === "completed").length / contracts.length) * 100
        : 0
    };

    return stats;
  }

  static async getWorkSessionStats(contractId: string): Promise<{
    totalSessions: number;
    totalHours: number;
    approvedSessions: number;
  }> {
    const sessions = await this.getContractWorkSessions(contractId);
    
    const stats = {
      totalSessions: sessions.length,
      totalHours: sessions.reduce((sum, s) => {
        if (s.start_time && s.end_time) {
          const duration = (new Date(s.end_time).getTime() - new Date(s.start_time).getTime()) / (1000 * 60 * 60);
          return sum + duration;
        }
        return sum;
      }, 0),
      approvedSessions: sessions.filter(s => s.client_approved === true).length
    };

    return stats;
  }

  // ===================== SEARCH & FILTERS =====================

  static async searchContracts(userId: string, filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    isProvider?: boolean;
  }): Promise<Contract[]> {
    let query = supabase
      .from("contracts")
      .select("*");

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

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async createFromQuote(quoteId: string): Promise<Contract> {
    // Get quote details
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", quoteId)
      .single();

    if (quoteError) {
      throw new Error(quoteError.message);
    }

    // Create contract with correct field mapping
    const contractData = {
      quote_id: quoteId,
      user_id: quote.user_id,
      service_provider_id: quote.service_provider_id,
      contract_number: this.generateContractNumber(),
      contract_status: "pending" as const,
      total_amount: quote.amount,
      description: quote.description,
      estimated_duration: quote.estimated_duration,
      estimated_start_date: quote.estimated_start_date,
      warranty_period: quote.warranty_period,
      terms_and_conditions: quote.terms_and_conditions,
      payment_terms: quote.payment_terms,
      deliverables: quote.deliverables,
      project_timeline: quote.project_timeline,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return this.createContract(contractData);
  }

  static async getServiceProviderInfo(providerId: string): Promise<ServiceProvider | null> {
    const { data, error } = await supabase
      .from("service_providers")
      .select("id, user_id, company_name, phone")
      .eq("user_id", providerId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    return data;
  }
}

// Export for backward compatibility
export default SupabaseContractService;