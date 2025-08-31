
import { supabase } from "@/integrations/supabase/client";
import { 
  BudgetRequest, 
  BudgetRequestInsert, 
  BudgetRequestUpdate, 
  Quote, 
  QuoteInsert, 
  QuoteUpdate
} from "@/integrations/supabase/types";

type BudgetRequestWithProperty = BudgetRequest & {
  properties: { id: string; name: string; address: string; city: string } | null;
};

export class SupabaseBudgetService {
  // ===================== BUDGET REQUESTS =====================
  
  static async createBudgetRequest(requestData: BudgetRequestInsert): Promise<BudgetRequest> {
    const { data, error } = await supabase
      .from("budget_requests")
      .insert({
        ...requestData,
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

  static async updateBudgetRequest(id: string, updates: BudgetRequestUpdate): Promise<BudgetRequest> {
    const { data, error } = await supabase
      .from("budget_requests")
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

  static async getBudgetRequest(id: string): Promise<BudgetRequestWithProperty> {
    const { data, error } = await supabase
      .from("budget_requests")
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as BudgetRequestWithProperty;
  }

  static async getUserBudgetRequests(userId: string): Promise<BudgetRequestWithProperty[]> {
    const { data, error } = await supabase
      .from("budget_requests")
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data || []) as BudgetRequestWithProperty[];
  }

  static async getPublishedBudgetRequests(filters?: {
    category?: BudgetRequest['category'];
    city?: string;
    maxBudget?: number;
    minBudget?: number;
  }): Promise<BudgetRequestWithProperty[]> {
    let query = supabase
      .from("budget_requests")
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city
        )
      `)
      .eq("status", "published");

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.minBudget) {
      query = query.gte("budget_range_min", filters.minBudget);
    }

    if (filters?.maxBudget) {
      query = query.lte("budget_range_max", filters.maxBudget);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data || []) as BudgetRequestWithProperty[];
  }

  static async deleteBudgetRequest(id: string): Promise<void> {
    const { error } = await supabase
      .from("budget_requests")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  // ===================== QUOTES =====================

  static async createQuote(quoteData: QuoteInsert): Promise<Quote> {
    const { data, error } = await supabase
      .from("quotes")
      .insert({
        ...quoteData,
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

  static async updateQuote(id: string, updates: QuoteUpdate): Promise<Quote> {
    const { data, error } = await supabase
      .from("quotes")
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

  static async getQuote(id: string): Promise<Quote> {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getBudgetRequestQuotes(budgetRequestId: string): Promise<Quote[]> {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("budget_request_id", budgetRequestId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getProviderQuotes(providerId: string): Promise<Quote[]> {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("service_provider_id", providerId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async acceptQuote(id: string): Promise<Quote> {
    const quote = await this.getQuote(id);
    
    // First, reject all other quotes for this budget request
    await supabase
      .from("quotes")
      .update({ 
        status: "rejected",
        updated_at: new Date().toISOString() 
      })
      .eq("budget_request_id", quote.budget_request_id)
      .neq("id", id);

    // Then accept this quote
    const acceptedQuote = await this.updateQuote(id, {
      status: "accepted"
    });

    // Update budget request status
    await this.updateBudgetRequest(quote.budget_request_id, {
      status: "in_progress"
    });

    return acceptedQuote;
  }

  static async rejectQuote(id: string): Promise<Quote> {
    return this.updateQuote(id, {
      status: "rejected"
    });
  }

  static async withdrawQuote(id: string): Promise<Quote> {
    return this.updateQuote(id, {
      status: "cancelled"
    });
  }

  // ===================== STATISTICS =====================

  static async getBudgetRequestStats(userId: string): Promise<{
    total: number;
    published: number;
    inProgress: number;
    completed: number;
  }> {
    const requests = await this.getUserBudgetRequests(userId);
    
    const stats = {
      total: requests.length,
      published: requests.filter(r => r.status === "published").length,
      inProgress: requests.filter(r => r.status === "in_progress").length,
      completed: requests.filter(r => r.status === "completed").length
    };

    return stats;
  }

  static async getProviderQuoteStats(providerId: string): Promise<{
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    acceptanceRate: number;
  }> {
    const quotes = await this.getProviderQuotes(providerId);
    
    const stats = {
      total: quotes.length,
      pending: quotes.filter(q => q.status === "pending").length,
      accepted: quotes.filter(q => q.status === "accepted").length,
      rejected: quotes.filter(q => q.status === "rejected").length,
      acceptanceRate: quotes.length > 0 
        ? (quotes.filter(q => q.status === "accepted").length / quotes.length) * 100 
        : 0
    };

    return stats;
  }

  // ===================== SEARCH & FILTERS =====================

  static async searchBudgetRequests(query: string, filters?: {
    category?: BudgetRequest['category'];
    city?: string;
  }): Promise<BudgetRequestWithProperty[]> {
    let supabaseQuery = supabase
      .from("budget_requests")
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city
        )
      `)
      .eq("status", "published");

    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    if (filters?.category) {
      supabaseQuery = supabaseQuery.eq("category", filters.category);
    }

    const { data, error } = await supabaseQuery
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(error.message);
    }

    return (data || []) as BudgetRequestWithProperty[];
  }
}
