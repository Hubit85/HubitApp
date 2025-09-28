import { supabase } from "@/integrations/supabase/client";
import {
  BudgetRequest,
  Contract,
  Profile,
  Property,
  Quote,
} from "@/integrations/supabase/types";

type ExtendedQuote = Quote & {
  budget_requests: BudgetRequest & {
    profiles: Profile;
    properties: Property;
  };
};

type ExtendedContract = Contract & {
  quotes: Quote & {
    budget_requests: BudgetRequest & {
      profiles: Profile;
      properties: Property;
    };
  };
};

export const ServiceProviderDashboardService = {
  async getDashboardData(providerId: string) {
    const [
      openBudgetRequests,
      activeContracts,
      recentQuotes,
      stats,
    ] = await Promise.all([
      ServiceProviderDashboardService.getOpenBudgetRequests(providerId),
      ServiceProviderDashboardService.getActiveContracts(providerId),
      ServiceProviderDashboardService.getRecentQuotes(providerId),
      ServiceProviderDashboardService.getProviderStats(providerId),
    ]);

    return {
      openBudgetRequests,
      activeContracts,
      recentQuotes,
      stats,
    };
  },

  async getOpenBudgetRequests(_providerId: string): Promise<BudgetRequest[]> {
    const { data, error } = await supabase
      .from("budget_requests")
      .select("*")
      .eq("status", "published");
    // In a real app, you'd filter by categories the provider is subscribed to
    if (error) throw error;
    return data || [];
  },

  async getActiveContracts(providerId: string): Promise<ExtendedContract[]> {
    const { data, error } = await supabase
      .from("contracts")
      .select(
        `
        *,
        quotes (
          *,
          budget_requests (
            *,
            profiles ( * ),
            properties ( * )
          )
        )
      `
      )
      .eq("service_provider_id", providerId)
      .in("status", ["signed", "in_progress"]);
    
    if (error) throw error;
    return (data || []) as unknown as ExtendedContract[];
  },

  async getRecentQuotes(providerId: string): Promise<ExtendedQuote[]> {
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
      .eq("service_provider_id", providerId)
      .limit(5)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return (data || []) as unknown as ExtendedQuote[];
  },

  async getProviderStats(providerId: string) {
    const { data: quotes, error: quotesError } = await supabase
      .from("quotes")
      .select("status, amount")
      .eq("provider_id", providerId);

    if (quotesError) throw quotesError;

    const { data: contracts, error: contractsError } = await supabase
      .from("contracts")
      .select("total_amount")
      .eq("provider_id", providerId)
      .eq("status", "completed");

    if (contractsError) throw contractsError;

    const totalQuotes = quotes.length;
    const acceptedQuotes = quotes.filter(q => q.status === 'accepted').length;
    const pendingQuotes = quotes.filter(q => q.status === 'pending').length;
    const totalEarnings = contracts.reduce((sum, c) => sum + c.total_amount, 0);

    return {
      totalQuotes,
      acceptedQuotes,
      pendingQuotes,
      totalEarnings,
    };
  },

  formatQuoteForCard: (quote: ExtendedQuote) => {
    return {
      id: quote.id,
      title: quote.budget_requests.title,
      clientName: quote.budget_requests.profiles.full_name,
      propertyAddress: quote.budget_requests.properties.address,
      status: quote.status,
      amount: quote.amount,
      date: quote.updated_at || quote.created_at,
    };
  },
};
