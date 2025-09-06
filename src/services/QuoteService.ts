
import { supabase } from "@/integrations/supabase/client";
import { Quote, QuoteInsert, QuoteUpdate, BudgetRequest } from "@/integrations/supabase/types";

export interface ExtendedQuote extends Quote {
  budget_requests?: {
    title: string;
    description: string;
    status: string;
    category: string;
    user_id: string;
    properties?: {
      name: string;
      address: string;
    } | undefined;
    profiles?: {
      full_name: string;
    };
  } | undefined;
}

export class QuoteService {
  /**
   * Creates a new quote for a budget request
   */
  static async createQuote(quoteData: QuoteInsert): Promise<{ success: boolean; quote?: Quote; message: string }> {
    try {
      const { data: newQuote, error } = await supabase
        .from('quotes')
        .insert({
          ...quoteData,
          status: 'pending',
          viewed_by_client: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        quote: newQuote,
        message: "Cotización creada exitosamente"
      };

    } catch (error) {
      console.error("Error creating quote:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al crear la cotización"
      };
    }
  }

  /**
   * Gets all quotes for a service provider
   */
  static async getProviderQuotes(serviceProviderId: string): Promise<ExtendedQuote[]> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          budget_requests (
            title,
            description,
            status,
            category,
            user_id,
            properties (
              name,
              address
            ),
            profiles (
              full_name
            )
          )
        `)
        .eq('service_provider_id', serviceProviderId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data to match ExtendedQuote interface
      const transformedData = (data || []).map(quote => ({
        ...quote,
        budget_requests: quote.budget_requests ? {
          ...quote.budget_requests,
          properties: quote.budget_requests.properties || undefined
        } : undefined
      })) as ExtendedQuote[];

      return transformedData;

    } catch (error) {
      console.error("Error fetching provider quotes:", error);
      return [];
    }
  }

  /**
   * Updates an existing quote
   */
  static async updateQuote(quoteId: string, updates: QuoteUpdate): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', quoteId);

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "Cotización actualizada exitosamente"
      };

    } catch (error) {
      console.error("Error updating quote:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al actualizar la cotización"
      };
    }
  }

  /**
   * Cancels a quote
   */
  static async cancelQuote(quoteId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', quoteId);

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "Cotización cancelada exitosamente"
      };

    } catch (error) {
      console.error("Error canceling quote:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al cancelar la cotización"
      };
    }
  }

  /**
   * Gets quote statistics for a service provider
   */
  static async getQuoteStats(serviceProviderId: string): Promise<{
    totalQuotes: number;
    pendingQuotes: number;
    acceptedQuotes: number;
    rejectedQuotes: number;
    totalValue: number;
    acceptedValue: number;
  }> {
    try {
      const quotes = await this.getProviderQuotes(serviceProviderId);

      const stats = {
        totalQuotes: quotes.length,
        pendingQuotes: quotes.filter(q => q.status === 'pending').length,
        acceptedQuotes: quotes.filter(q => q.status === 'accepted').length,
        rejectedQuotes: quotes.filter(q => q.status === 'rejected').length,
        totalValue: quotes.reduce((sum, q) => sum + q.amount, 0),
        acceptedValue: quotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.amount, 0)
      };

      return stats;

    } catch (error) {
      console.error("Error calculating quote stats:", error);
      return {
        totalQuotes: 0,
        pendingQuotes: 0,
        acceptedQuotes: 0,
        rejectedQuotes: 0,
        totalValue: 0,
        acceptedValue: 0
      };
    }
  }

  /**
   * Creates a notification for a new quote
   */
  static async createQuoteNotification(quote: Quote, budgetRequest: BudgetRequest): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: budgetRequest.user_id,
          title: 'Nueva cotización recibida',
          message: `Has recibido una nueva cotización para "${budgetRequest.title}" por €${quote.amount.toLocaleString()}`,
          type: 'info',
          category: 'quote',
          related_entity_type: 'quote',
          related_entity_id: quote.id,
          action_url: `/dashboard?quote=${quote.id}`,
          action_label: 'Ver Cotización',
          read: false,
          created_at: new Date().toISOString()
        });

    } catch (error) {
      console.error("Error creating quote notification:", error);
      // Don't throw error - notification failure shouldn't break quote creation
    }
  }

  /**
   * Gets available budget requests for a service provider
   */
  static async getAvailableBudgetRequests(serviceProviderId: string, filters?: {
    category?: string;
    urgency?: string;
    city?: string;
  }): Promise<BudgetRequest[]> {
    try {
      // First get service provider details to understand their service categories and areas
      const { data: provider, error: providerError } = await supabase
        .from('service_providers')
        .select('service_categories, service_area')
        .eq('id', serviceProviderId)
        .single();

      if (providerError) {
        console.warn("Could not fetch provider details:", providerError);
      }

      // Build query for budget requests
      let query = supabase
        .from('budget_requests')
        .select(`
          *,
          properties (
            name,
            address,
            city,
            user_id
          ),
          profiles (
            full_name
          )
        `)
        .eq('status', 'published')
        .gte('expires_at', new Date().toISOString());

      // Apply provider's service categories filter if available
      if (provider?.service_categories && Array.isArray(provider.service_categories) && provider.service_categories.length > 0) {
        // Type assertion for service categories to satisfy TypeScript
        const validCategories = provider.service_categories.filter((cat: any) => 
          typeof cat === 'string' && [
            'cleaning', 'plumbing', 'electrical', 'gardening', 'painting', 
            'maintenance', 'security', 'hvac', 'carpentry', 'emergency', 'other'
          ].includes(cat)
        ) as ('cleaning' | 'plumbing' | 'electrical' | 'gardening' | 'painting' | 'maintenance' | 'security' | 'hvac' | 'carpentry' | 'emergency' | 'other')[];
        
        if (validCategories.length > 0) {
          query = query.in('category', validCategories);
        }
      }

      // Apply additional filters if provided
      if (filters?.category) {
        const validCategory = filters.category as 'cleaning' | 'plumbing' | 'electrical' | 'gardening' | 'painting' | 'maintenance' | 'security' | 'hvac' | 'carpentry' | 'emergency' | 'other';
        query = query.eq('category', validCategory);
      }

      if (filters?.urgency) {
        const validUrgency = filters.urgency as 'emergency' | 'low' | 'normal' | 'high';
        query = query.eq('urgency', validUrgency);
      }

      // Execute query
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error("Error fetching available budget requests:", error);
      return [];
    }
  }

  /**
   * Checks if provider has already quoted on a budget request
   */
  static async hasExistingQuote(budgetRequestId: string, serviceProviderId: string): Promise<Quote | null> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('budget_request_id', budgetRequestId)
        .eq('service_provider_id', serviceProviderId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
        throw error;
      }

      return data || null;

    } catch (error) {
      console.error("Error checking existing quote:", error);
      return null;
    }
  }

  /**
   * Marks a quote as viewed by client
   */
  static async markAsViewedByClient(quoteId: string): Promise<void> {
    try {
      await supabase
        .from('quotes')
        .update({ viewed_by_client: true })
        .eq('id', quoteId);

    } catch (error) {
      console.error("Error marking quote as viewed:", error);
    }
  }

  /**
   * Gets recent quotes activity for dashboard
   */
  static async getRecentActivity(serviceProviderId: string, limit: number = 10): Promise<ExtendedQuote[]> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          budget_requests (
            title,
            description,
            status,
            category,
            user_id,
            properties (
              name,
              address
            ),
            profiles (
              full_name
            )
          )
        `)
        .eq('service_provider_id', serviceProviderId)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      // Transform data to match ExtendedQuote interface
      const transformedData = (data || []).map(quote => ({
        ...quote,
        budget_requests: quote.budget_requests ? {
          ...quote.budget_requests,
          properties: quote.budget_requests.properties || undefined
        } : undefined
      })) as ExtendedQuote[];

      return transformedData;

    } catch (error) {
      console.error("Error fetching recent activity:", error);
      return [];
    }
  }
}
