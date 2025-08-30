
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type BudgetRequestInsert = Database['public']['Tables']['budget_requests']['Insert'];
type QuoteInsert = Database['public']['Tables']['quotes']['Insert'];

export class SupabaseBudgetService {
  // Budget Requests
  static async createBudgetRequest(requestData: Partial<BudgetRequestInsert>) {
    const { data, error } = await supabase
      .from("budget_requests")
      .insert(requestData as BudgetRequestInsert)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateBudgetRequest(id: string, updates: any) {
    const { data, error } = await supabase
      .from("budget_requests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getBudgetRequest(id: string) {
    const { data, error } = await supabase
      .from("budget_requests")
      .select(`
        *,
        properties!inner(
          name,
          address,
          property_type
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getUserBudgetRequests(userId: string) {
    const { data, error } = await supabase
      .from("budget_requests")
      .select(`
        *,
        properties!inner(
          name,
          address
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getPublishedBudgetRequests() {
    const { data, error } = await supabase
      .from("budget_requests")
      .select(`
        *,
        properties!inner(
          name,
          address
        )
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // Quotes
  static async createQuote(quoteData: Partial<QuoteInsert>) {
    const { data, error } = await supabase
      .from("quotes")
      .insert(quoteData as QuoteInsert)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getBudgetRequestQuotes(budgetRequestId: string) {
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        *,
        service_providers!inner(
          company_name,
          verified,
          rating_average
        )
      `)
      .eq("budget_request_id", budgetRequestId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getProviderQuotes(providerId: string) {
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        *,
        budget_requests!inner(
          title,
          description,
          properties!inner(
            name,
            address
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

  static async updateQuoteStatus(id: string, status: "accepted" | "rejected" | "withdrawn") {
    const { data, error } = await supabase
      .from("quotes")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async publishBudgetRequest(id: string) {
    return this.updateBudgetRequest(id, { status: "published" });
  }

  static async deleteBudgetRequest(id: string) {
    const { error } = await supabase
      .from("budget_requests")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }
}
