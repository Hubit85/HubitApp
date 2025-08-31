
import { supabase } from "@/integrations/supabase/client";
import { 
  ServiceProvider, 
  ServiceProviderInsert, 
  ServiceProviderUpdate
} from "@/integrations/supabase/types";

export class SupabaseServiceProviderService {
  // ===================== SERVICE PROVIDER PROFILE =====================
  
  static async createServiceProvider(providerData: ServiceProviderInsert): Promise<ServiceProvider> {
    const { data, error } = await supabase
      .from("service_providers")
      .insert({
        ...providerData,
        is_verified: false,
        average_rating: 0,
        ratings_count: 0,
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

  static async updateServiceProvider(id: string, updates: Partial<ServiceProvider>): Promise<ServiceProvider> {
    const { data, error } = await supabase
      .from("service_providers")
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

  static async getServiceProvider(id: string): Promise<ServiceProvider> {
    const { data, error } = await supabase
      .from("service_providers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getServiceProviderByUserId(userId: string): Promise<ServiceProvider | null> {
    const { data, error } = await supabase
      .from("service_providers")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No service provider profile found
      }
      throw new Error(error.message);
    }

    return data;
  }

  static async deleteServiceProvider(id: string): Promise<void> {
    const { error } = await supabase
      .from("service_providers")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  // ===================== SEARCH & DISCOVERY =====================

  static async searchServiceProviders(filters: {
    categories?: string[];
    city?: string;
    minRating?: number;
    emergencyServices?: boolean;
    verified?: boolean;
  }): Promise<ServiceProvider[]> {
    let query = supabase
      .from("service_providers")
      .select("*")
      .eq("is_verified", true);

    if (filters.categories && filters.categories.length > 0) {
      query = query.overlaps("service_categories", filters.categories);
    }

    if (filters.city) {
      query = query.ilike("city", `%${filters.city}%`);
    }

    if (filters.minRating) {
      query = query.gte("average_rating", filters.minRating);
    }

    const { data, error } = await query
      .order("average_rating", { ascending: false })
      .order("ratings_count", { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getTopRatedProviders(limit: number = 10): Promise<ServiceProvider[]> {
    const { data, error } = await supabase
      .from("service_providers")
      .select("*")
      .eq("is_verified", true)
      .gte("ratings_count", 5) // Only providers with at least 5 ratings
      .order("average_rating", { ascending: false })
      .order("ratings_count", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // ===================== VERIFICATION & STATUS =====================

  static async verifyServiceProvider(id: string): Promise<ServiceProvider> {
    return this.updateServiceProvider(id, { 
      verified: true // using 'verified' instead of 'is_verified'
    });
  }

  // ===================== RATINGS & REVIEWS =====================

  static async updateRatingStats(providerId: string): Promise<void> {
    try {
      // Calculate new rating statistics
      const { data: ratings, error } = await supabase
        .from("ratings")
        .select("rating")
        .eq("service_provider_id", providerId)
        .eq("is_verified", true);

      if (error) {
        throw new Error(error.message);
      }

      if (!ratings || ratings.length === 0) {
        await this.updateServiceProvider(providerId, {
          average_rating: 0,
          ratings_count: 0
        });
        return;
      }

      const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;

      await this.updateServiceProvider(providerId, {
        average_rating: Math.round(averageRating * 100) / 100, // Round to 2 decimals
        ratings_count: ratings.length
      });

    } catch (error) {
      console.error("Error updating provider rating stats:", error);
    }
  }

  // ===================== STATISTICS & ANALYTICS =====================

  static async getProviderStats(providerId: string): Promise<{
    totalQuotes: number;
    acceptedQuotes: number;
    completedJobs: number;
    acceptanceRate: number;
    completionRate: number;
  }> {
    // Basic stats from current schema
    const provider = await this.getServiceProvider(providerId);
    
    // This would need actual queries to quotes and contracts tables for real data
    return {
      totalQuotes: 0, // Would need to query quotes table
      acceptedQuotes: 0,
      completedJobs: 0,
      acceptanceRate: 0,
      completionRate: 0
    };
  }

  // ===================== SERVICE AREAS & CATEGORIES =====================

  static async updateServiceArea(id: string, serviceArea: string[]): Promise<ServiceProvider> {
    return this.updateServiceProvider(id, { 
      service_area: serviceArea // using 'service_area' instead of 'service_areas'
    });
  }

  static async updateServiceCategories(id: string, categories: string[]): Promise<ServiceProvider> {
    return this.updateServiceProvider(id, {
      service_categories: categories
    });
  }

  // ===================== SEARCH & FILTERS =====================

  static async getProvidersInCity(city: string): Promise<ServiceProvider[]> {
    const { data, error } = await supabase
      .from("service_providers")
      .select("*")
      .eq("is_verified", true)
      .ilike("city", `%${city}%`)
      .order("average_rating", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getProvidersByCategory(categoryId: string): Promise<ServiceProvider[]> {
    const { data, error } = await supabase
      .from("service_providers")
      .select("*")
      .eq("is_verified", true)
      .contains("service_categories", [categoryId])
      .order("average_rating", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // ===================== BULK OPERATIONS =====================

  static async bulkVerifyProviders(providerIds: string[]): Promise<void> {
    const { error } = await supabase
      .from("service_providers")
      .update({ 
        is_verified: true,
        updated_at: new Date().toISOString()
      })
      .in("id", providerIds);

    if (error) {
      throw new Error(error.message);
    }
  }
}