
import { supabase } from "@/integrations/supabase/client";
import {
  BudgetRequest,
  Profile,
  Property,
  Quote,
} from "@/integrations/supabase/types";

export type ExtendedQuote = Quote & {
  budget_requests: BudgetRequest & {
    profiles: Profile;
    properties: Property;
  };
};

export const QuoteService = {
  async getQuotesForProvider(providerId: string): Promise<ExtendedQuote[]> {
    const { data, error } = await supabase
      .from("quotes")
      .select(
        `
        *,
        budget_requests (
          *,
          profiles ( * ),
          properties ( * )
        )
      `
      )
      .eq("service_provider_id", providerId);
    
    if (error) throw error;
    return (data || []) as unknown as ExtendedQuote[];
  },

  async getQuotesForRequest(requestId: string): Promise<ExtendedQuote[]> {
    const { data, error } = await supabase
      .from("quotes")
      .select(
        `
        *,
        budget_requests (
          *,
          profiles ( * ),
          properties ( * )
        )
      `
      )
      .eq("budget_request_id", requestId);
    
    if (error) throw error;
    return (data || []) as unknown as ExtendedQuote[];
  },

  async createQuote(quoteData: Quote) {
    const { data, error } = await supabase
      .from("quotes")
      .insert(quoteData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateQuoteStatus(
    quoteId: string,
    status: "pending" | "accepted" | "rejected"
  ) {
    const { data, error } = await supabase
      .from("quotes")
      .update({ status })
      .eq("id", quoteId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  calculateQuoteStats: (quotes: ExtendedQuote[]) => {
    const totalQuotes = quotes.length;
    const acceptedQuotes = quotes.filter(
      (q) => q.status === "accepted"
    ).length;
    const pendingQuotes = quotes.filter((q) => q.status === "pending").length;
    const rejectedQuotes = quotes.filter((q) => q.status === "rejected").length;
    const averageAmount =
      totalQuotes > 0
        ? quotes.reduce((acc, q) => acc + q.amount, 0) / totalQuotes
        : 0;
    const acceptanceRate =
      totalQuotes > 0 ? (acceptedQuotes / totalQuotes) * 100 : 0;

    return {
      totalQuotes,
      acceptedQuotes,
      pendingQuotes,
      rejectedQuotes,
      averageAmount,
      acceptanceRate,
    };
  },
};