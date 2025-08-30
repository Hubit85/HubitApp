import { supabase } from "@/integrations/supabase/client";
import { 
  BudgetRequest, 
  BudgetRequestInsert, 
  BudgetRequestUpdate, 
  Quote, 
  QuoteInsert, 
  QuoteUpdate,
  BudgetRequestWithDetails 
} from "@/integrations/supabase/types";

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

  static async getBudgetRequest(id: string): Promise<BudgetRequestWithDetails> {
    const { data, error } = await supabase
      .from("budget_requests")
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city,
          property_type,
          latitude,
          longitude
        ),
        service_categories (
          id,
          name,
          icon,
          color
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getUserBudgetRequests(userId: string): Promise<BudgetRequestWithDetails[]> {
    const { data, error } = await supabase
      .from("budget_requests")
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city
        ),
        service_categories (
          id,
          name,
          icon
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getPublishedBudgetRequests(filters?: {
    category?: string;
    city?: string;
    urgency?: string;
    maxBudget?: number;
    minBudget?: number;
  }): Promise<BudgetRequestWithDetails[]> {
    let query = supabase
      .from("budget_requests")
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city,
          latitude,
          longitude
        ),
        service_categories (
          id,
          name,
          icon,
          color
        )
      `)
      .eq("status", "published")
      .gt("expires_at", new Date().toISOString());

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.city) {
      query = query.eq("properties.city", filters.city);
    }

    if (filters?.urgency) {
      query = query.eq("urgency", filters.urgency);
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

    return data || [];
  }

  static async publishBudgetRequest(id: string, expiresInDays: number = 30): Promise<BudgetRequest> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    return this.updateBudgetRequest(id, {
      status: "published",
      published_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString()
    });
  }

  static async unpublishBudgetRequest(id: string): Promise<BudgetRequest> {
    return this.updateBudgetRequest(id, {
      status: "pending",
      published_at: null,
      expires_at: null
    });
  }

  static async incrementViews(budgetId: string) {
    try {
      const { error } = await supabase.rpc('increment_budget_request_views' as any, {
        request_id: budgetId,
      });

      if (error) {
        // Fallback to manual increment if RPC doesn't exist
        const { data: current } = await supabase
          .from("budget_requests")
          .select("views_count")
          .eq("id", budgetId)
          .single();

        if (current) {
          await this.updateBudgetRequest(budgetId, {
            views_count: (current.views_count || 0) + 1
          });
        }
      }
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
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

    // Increment quotes count on budget request
    await this.incrementQuotesCount(quoteData.budget_request_id);

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
      .select(`
        *,
        service_providers (
          id,
          company_name,
          verified,
          rating_average,
          rating_count,
          response_time_hours,
          emergency_services,
          portfolio_images
        )
      `)
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
      .select(`
        *,
        budget_requests (
          id,
          title,
          description,
          category,
          urgency,
          status,
          properties (
            id,
            name,
            address,
            city
          )
        )
      `)
      .eq("service_provider_id", providerId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async acceptQuote(id: string): Promise<Quote> {
    // Mark quote as accepted and reject others for the same budget request
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
      status: "accepted",
      viewed_by_client: true
    });

    // Update budget request status
    await this.updateBudgetRequest(quote.budget_request_id, {
      status: "in_progress"
    });

    return acceptedQuote;
  }

  static async rejectQuote(id: string): Promise<Quote> {
    return this.updateQuote(id, {
      status: "rejected",
      viewed_by_client: true
    });
  }

  static async withdrawQuote(id: string): Promise<Quote> {
    return this.updateQuote(id, {
      status: "withdrawn"
    });
  }

  static async markQuoteAsViewed(id: string): Promise<Quote> {
    return this.updateQuote(id, {
      viewed_by_client: true
    });
  }

  // ===================== HELPER METHODS =====================

  private static async incrementQuotesCount(budgetRequestId: string): Promise<void> {
    const { data: current } = await supabase
      .from("budget_requests")
      .select("quotes_count")
      .eq("id", budgetRequestId)
      .single();

    if (current) {
      await this.updateBudgetRequest(budgetRequestId, {
        quotes_count: (current.quotes_count || 0) + 1
      });
    }
  }

  // ===================== STATISTICS =====================

  static async getBudgetRequestStats(userId: string): Promise<{
    total: number;
    published: number;
    inProgress: number;
    completed: number;
    totalQuotes: number;
    averageQuotesPerRequest: number;
  }> {
    const requests = await this.getUserBudgetRequests(userId);
    
    const stats = {
      total: requests.length,
      published: requests.filter(r => r.status === "published").length,
      inProgress: requests.filter(r => r.status === "in_progress").length,
      completed: requests.filter(r => r.status === "completed").length,
      totalQuotes: requests.reduce((sum, r) => sum + (r.quotes_count || 0), 0),
      averageQuotesPerRequest: requests.length > 0 
        ? requests.reduce((sum, r) => sum + (r.quotes_count || 0), 0) / requests.length 
        : 0
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
    category?: string;
    city?: string;
    urgency?: string;
  }): Promise<BudgetRequestWithDetails[]> {
    let supabaseQuery = supabase
      .from("budget_requests")
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city
        ),
        service_categories (
          id,
          name,
          icon
        )
      `)
      .eq("status", "published")
      .gt("expires_at", new Date().toISOString());

    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    if (filters?.category) {
      supabaseQuery = supabaseQuery.eq("category", filters.category);
    }

    if (filters?.urgency) {
      supabaseQuery = supabaseQuery.eq("urgency", filters.urgency);
    }

    const { data, error } = await supabaseQuery
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async searchConversations(userId: string, query: string, isProvider: boolean = false): Promise<any[]> {
    // Note: This method should be moved to SupabaseConversationService
    // For now, returning empty array to prevent errors
    console.warn("searchConversations should be called from SupabaseConversationService");
    return [];
  }

  static async reorderCategories(categoryOrders: { id: string; sort_order: number }[]): Promise<void> {
    for (const order of categoryOrders) {
      const { error } = await supabase
        .from('service_categories')
        .update({ 
          sort_order: order.sort_order, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', order.id);
      
      if (error) {
        console.error(`Failed to update category order for ${order.id}:`, error);
        throw new Error(`Failed to update category order: ${error.message}`);
      }
    }
  }
}