
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type BudgetRequest = Database["public"]["Tables"]["budget_requests"]["Row"];
type BudgetRequestInsert = Database["public"]["Tables"]["budget_requests"]["Insert"];
type BudgetRequestUpdate = Database["public"]["Tables"]["budget_requests"]["Update"];
type Quote = Database["public"]["Tables"]["quotes"]["Row"];
type QuoteInsert = Database["public"]["Tables"]["quotes"]["Insert"];

export class SupabaseBudgetService {
  // Budget Requests
  static async createBudgetRequest(requestData: BudgetRequestInsert) {
    const { data, error } = await supabase
      .from("budget_requests")
      .insert(requestData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateBudgetRequest(id: string, updates: BudgetRequestUpdate) {
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
        properties:property_id (
          name,
          address,
          property_type
        ),
        service_categories:category_id (
          name,
          description,
          icon
        ),
        profiles:requester_id (
          full_name,
          email,
          phone
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
        properties:property_id (
          name,
          address
        ),
        service_categories:category_id (
          name,
          icon
        )
      `)
      .eq("requester_id", userId)
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
        properties:property_id (
          name,
          address
        ),
        service_categories:category_id (
          name,
          icon
        ),
        profiles:requester_id (
          full_name
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
  static async createQuote(quoteData: QuoteInsert) {
    const { data, error } = await supabase
      .from("quotes")
      .insert(quoteData)
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
        service_providers:provider_id (
          business_name,
          rating,
          verified,
          profiles:user_id (
            full_name,
            phone,
            email
          )
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
        budget_requests:budget_request_id (
          title,
          description,
          urgency,
          properties:property_id (
            name,
            address
          )
        )
      `)
      .eq("provider_id", providerId)
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
