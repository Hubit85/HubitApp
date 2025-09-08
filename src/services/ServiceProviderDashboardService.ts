
import { supabase } from "@/integrations/supabase/client";
import { ServiceProvider, BudgetRequest } from "@/integrations/supabase/types";
import { QuoteService } from "./QuoteService";

export interface DashboardStats {
  totalQuotes: number;
  pendingQuotes: number;
  acceptedQuotes: number;
  rejectedQuotes: number;
  monthlyRevenue: number;
  activeClients: number;
  averageRating: number;
  totalReviews: number;
  availableRequests: number;
  responseRate: number;
}

export interface ServiceProviderProfile extends ServiceProvider {
  user?: {
    email: string;
    full_name: string;
  };
  ratings_stats?: {
    average_rating: number;
    total_ratings: number;
  };
}

export class ServiceProviderDashboardService {
  /**
   * Gets comprehensive dashboard statistics for a service provider
   */
  static async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      // Get service provider record
      const { data: provider, error: providerError } = await supabase
        .from('service_providers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (providerError) {
        throw new Error(`Error finding service provider: ${providerError.message}`);
      }

      // Get quote statistics
      const quoteStats = await QuoteService.getQuoteStats(provider.id);

      // Get available budget requests count
      const availableRequests = await QuoteService.getAvailableBudgetRequests(provider.id);

      // Get monthly revenue (last 30 days of accepted quotes)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: monthlyQuotes, error: monthlyError } = await supabase
        .from('quotes')
        .select('amount, created_at')
        .eq('service_provider_id', provider.id)
        .eq('status', 'accepted')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (monthlyError) {
        console.warn("Error fetching monthly revenue:", monthlyError);
      }

      const monthlyRevenue = (monthlyQuotes || []).reduce((sum, quote) => sum + quote.amount, 0);

      // Get active clients count (unique clients with accepted quotes)
      const { data: clientQuotes, error: clientError } = await supabase
        .from('quotes')
        .select(`
          budget_requests (
            user_id
          )
        `)
        .eq('service_provider_id', provider.id)
        .eq('status', 'accepted');

      if (clientError) {
        console.warn("Error fetching client data:", clientError);
      }

      const uniqueClients = new Set(
        (clientQuotes || [])
          .map(q => (q as any).budget_requests?.user_id)
          .filter(Boolean)
      ).size;

      // Calculate response rate (quotes sent vs available opportunities)
      const totalOpportunities = Math.max(availableRequests.length + quoteStats.totalQuotes, 1);
      const responseRate = (quoteStats.totalQuotes / totalOpportunities) * 100;

      return {
        totalQuotes: quoteStats.totalQuotes,
        pendingQuotes: quoteStats.pendingQuotes,
        acceptedQuotes: quoteStats.acceptedQuotes,
        rejectedQuotes: quoteStats.rejectedQuotes,
        monthlyRevenue,
        activeClients: uniqueClients,
        averageRating: provider.rating_average || 0,
        totalReviews: provider.rating_count || 0,
        availableRequests: availableRequests.length,
        responseRate: Math.min(responseRate, 100)
      };

    } catch (error) {
      console.error("Error calculating dashboard stats:", error);
      return {
        totalQuotes: 0,
        pendingQuotes: 0,
        acceptedQuotes: 0,
        rejectedQuotes: 0,
        monthlyRevenue: 0,
        activeClients: 0,
        averageRating: 0,
        totalReviews: 0,
        availableRequests: 0,
        responseRate: 0
      };
    }
  }

  /**
   * Gets complete service provider profile with additional data
   */
  static async getServiceProviderProfile(userId: string): Promise<ServiceProviderProfile | null> {
    try {
      const { data: provider, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          profiles (
            email,
            full_name
          )
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No service provider profile found
        }
        throw error;
      }

      // Get rating statistics
      const { data: ratingStats, error: ratingError } = await supabase
        .from('ratings')
        .select('rating')
        .eq('service_provider_id', provider.id);

      if (ratingError) {
        console.warn("Error fetching rating stats:", ratingError);
      }

      let ratingsData = undefined;
      if (ratingStats && ratingStats.length > 0) {
        const totalRating = ratingStats.reduce((sum, r) => sum + r.rating, 0);
        ratingsData = {
          average_rating: totalRating / ratingStats.length,
          total_ratings: ratingStats.length
        };
      }

      return {
        ...provider,
        user: (provider as any).profiles,
        ratings_stats: ratingsData
      };

    } catch (error) {
      console.error("Error fetching service provider profile:", error);
      return null;
    }
  }

  /**
   * Updates service provider profile
   */
  static async updateServiceProviderProfile(
    userId: string, 
    updates: Partial<ServiceProvider>
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('service_providers')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "Perfil de proveedor actualizado exitosamente"
      };

    } catch (error) {
      console.error("Error updating service provider profile:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al actualizar el perfil"
      };
    }
  }

  /**
   * Creates initial service provider profile
   */
  static async createServiceProviderProfile(
    userId: string,
    profileData: {
      company_name: string;
      service_categories: string[];
      service_area?: string[];
      description?: string;
      business_phone?: string;
      business_email?: string;
    }
  ): Promise<{ success: boolean; message: string; provider?: ServiceProvider }> {
    try {
      const { data: newProvider, error } = await supabase
        .from('service_providers')
        .insert({
          user_id: userId,
          company_name: profileData.company_name,
          service_categories: profileData.service_categories,
          service_area: profileData.service_area || [],
          description: profileData.description || '',
          is_active: true,
          verified: false,
          rating_average: 0,
          rating_count: 0,
          total_jobs_completed: 0,
          response_time_hours: 24,
          min_project_amount: 0,
          service_radius: 50,
          travel_cost_per_km: 0.5,
          base_hourly_rate: 25,
          emergency_services: false,
          background_check: false,
          insurance_verified: false,
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
        message: "Perfil de proveedor creado exitosamente",
        provider: newProvider
      };

    } catch (error) {
      console.error("Error creating service provider profile:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al crear el perfil de proveedor"
      };
    }
  }

  /**
   * Gets recent activities for dashboard
   */
  static async getRecentActivities(userId: string, limit: number = 10): Promise<Array<{
    id: string;
    type: 'quote_sent' | 'quote_accepted' | 'quote_rejected' | 'new_request';
    title: string;
    description: string;
    timestamp: string;
    status?: string;
    amount?: number;
  }>> {
    try {
      // Get service provider record
      const { data: provider, error: providerError } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (providerError) {
        throw providerError;
      }

      // Get recent quotes
      const recentQuotes = await QuoteService.getRecentActivity(provider.id, limit);

      // Transform to activity format
      const activities = recentQuotes.map(quote => {
        let type: 'quote_sent' | 'quote_accepted' | 'quote_rejected' | 'new_request';
        let description: string;

        switch (quote.status) {
          case 'accepted':
            type = 'quote_accepted';
            description = `Tu cotización ha sido aceptada por ${quote.budget_requests?.profiles?.full_name || 'el cliente'}`;
            break;
          case 'rejected':
            type = 'quote_rejected';
            description = `Tu cotización ha sido rechazada`;
            break;
          default:
            type = 'quote_sent';
            description = `Cotización enviada por €${quote.amount.toLocaleString()}`;
        }

        return {
          id: quote.id,
          type,
          title: quote.budget_requests?.title || 'Solicitud de presupuesto',
          description,
          timestamp: quote.updated_at,
          status: quote.status,
          amount: quote.amount
        };
      });

      return activities;

    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return [];
    }
  }

  /**
   * Gets service categories available in the system
   */
  static async getServiceCategories(): Promise<Array<{ id: string; name: string; icon?: string | undefined }>> {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('id, name, icon')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.warn("Error fetching service categories:", error);
      }

      // Transform data to handle null values properly
      const transformedData = (data || []).map(category => ({
        id: category.id,
        name: category.name,
        icon: category.icon || undefined
      }));

      // Return default categories if database query fails or returns empty
      if (!transformedData || transformedData.length === 0) {
        return [
          { id: 'cleaning', name: 'Limpieza', icon: '🧽' },
          { id: 'plumbing', name: 'Fontanería', icon: '🔧' },
          { id: 'electrical', name: 'Electricidad', icon: '⚡' },
          { id: 'gardening', name: 'Jardinería', icon: '🌱' },
          { id: 'painting', name: 'Pintura', icon: '🎨' },
          { id: 'maintenance', name: 'Mantenimiento', icon: '🛠️' },
          { id: 'security', name: 'Seguridad', icon: '🛡️' },
          { id: 'hvac', name: 'Climatización', icon: '🌡️' },
          { id: 'carpentry', name: 'Carpintería', icon: '🪵' },
          { id: 'emergency', name: 'Emergencias', icon: '🚨' },
          { id: 'other', name: 'Otros', icon: '📋' }
        ];
      }

      return transformedData;

    } catch (error) {
      console.error("Error getting service categories:", error);
      return [];
    }
  }
}
