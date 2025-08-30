import { supabase } from "@/integrations/supabase/client";
import { 
  ServiceProvider, 
  ServiceProviderInsert, 
  ServiceProviderUpdate,
  ServiceProviderWithRatings,
  Rating 
} from "@/integrations/supabase/types";

export class SupabaseServiceProviderService {
  // ===================== SERVICE PROVIDER PROFILE =====================
  
  static async createServiceProvider(providerData: ServiceProviderInsert): Promise<ServiceProvider> {
    const { data, error } = await supabase
      .from("service_providers")
      .insert({
        ...providerData,
        is_active: true,
        rating_average: 0,
        rating_count: 0,
        total_jobs_completed: 0,
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

  static async updateServiceProvider(id: string, updates: ServiceProviderUpdate): Promise<ServiceProvider> {
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

  static async getServiceProvider(id: string): Promise<ServiceProviderWithRatings> {
    const { data, error } = await supabase
      .from('service_providers')
      .select(`
        *,
        profiles:profiles!service_providers_user_id_fkey(*),
        ratings:ratings(*, profiles:profiles!ratings_user_id_fkey(*))
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as ServiceProviderWithRatings;
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
    serviceArea?: string;
    minRating?: number;
    emergencyServices?: boolean;
    verified?: boolean;
    maxDistance?: number;
    latitude?: number;
    longitude?: number;
  }): Promise<ServiceProvider[]> {
    let query = supabase
      .from("service_providers")
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url,
          city,
          country
        )
      `)
      .eq("is_active", true);

    if (filters.categories && filters.categories.length > 0) {
      query = query.overlaps("service_categories", filters.categories);
    }

    if (filters.city) {
      query = query.contains("service_area", [filters.city]);
    }

    if (filters.minRating) {
      query = query.gte("rating_average", filters.minRating);
    }

    if (filters.emergencyServices) {
      query = query.eq("emergency_services", true);
    }

    if (filters.verified) {
      query = query.eq("verified", true);
    }

    const { data, error } = await query
      .order("rating_average", { ascending: false })
      .order("rating_count", { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getTopRatedProviders(limit: number = 10): Promise<ServiceProvider[]> {
    const { data, error } = await supabase
      .from("service_providers")
      .select(`
        *,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq("is_active", true)
      .gte("rating_count", 5) // Only providers with at least 5 ratings
      .order("rating_average", { ascending: false })
      .order("rating_count", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getEmergencyProviders(category?: string, city?: string): Promise<ServiceProvider[]> {
    let query = supabase
      .from("service_providers")
      .select(`
        *,
        profiles (
          full_name,
          phone,
          avatar_url
        )
      `)
      .eq("is_active", true)
      .eq("emergency_services", true);

    if (category) {
      query = query.contains("service_categories", [category]);
    }

    if (city) {
      query = query.contains("service_area", [city]);
    }

    const { data, error } = await query
      .order("response_time_hours", { ascending: true })
      .order("rating_average", { ascending: false })
      .limit(20);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // ===================== VERIFICATION & STATUS =====================

  static async verifyServiceProvider(id: string): Promise<ServiceProvider> {
    return this.updateServiceProvider(id, {
      verified: true,
      updated_at: new Date().toISOString()
    });
  }

  static async setServiceProviderStatus(id: string, isActive: boolean): Promise<ServiceProvider> {
    return this.updateServiceProvider(id, {
      is_active: isActive,
      updated_at: new Date().toISOString()
    });
  }

  static async updateInsuranceVerification(id: string, verified: boolean): Promise<ServiceProvider> {
    return this.updateServiceProvider(id, {
      insurance_verified: verified,
      updated_at: new Date().toISOString()
    });
  }

  static async updateBackgroundCheck(id: string, verified: boolean): Promise<ServiceProvider> {
    return this.updateServiceProvider(id, {
      background_check: verified,
      updated_at: new Date().toISOString()
    });
  }

  // ===================== PORTFOLIO & MEDIA =====================

  static async updatePortfolio(id: string, images: string[]): Promise<ServiceProvider> {
    return this.updateServiceProvider(id, {
      portfolio_images: images
    });
  }

  static async addPortfolioImage(id: string, imageUrl: string): Promise<ServiceProvider> {
    const provider = await this.getServiceProvider(id);
    const currentImages = provider.portfolio_images || [];
    
    return this.updateServiceProvider(id, {
      portfolio_images: [...currentImages, imageUrl]
    });
  }

  static async removePortfolioImage(id: string, imageUrl: string): Promise<ServiceProvider> {
    const provider = await this.getServiceProvider(id);
    const currentImages = provider.portfolio_images || [];
    
    return this.updateServiceProvider(id, {
      portfolio_images: currentImages.filter(img => img !== imageUrl)
    });
  }

  // ===================== AVAILABILITY & SCHEDULING =====================

  static async updateAvailabilitySchedule(id: string, schedule: any): Promise<ServiceProvider> {
    return this.updateServiceProvider(id, {
      availability_schedule: schedule
    });
  }

  static async updateResponseTime(id: string, hours: number): Promise<ServiceProvider> {
    return this.updateServiceProvider(id, {
      response_time_hours: hours
    });
  }

  // ===================== RATINGS & REVIEWS =====================

  static async updateRatingStats(providerId: string): Promise<void> {
    // Calculate new rating statistics
    const { data: ratings, error } = await supabase
      .from("ratings")
      .select("rating, service_quality, punctuality, communication, value_for_money, cleanliness")
      .eq("service_provider_id", providerId);

    if (error || !ratings) {
      throw new Error("Failed to fetch ratings");
    }

    if (ratings.length === 0) {
      await this.updateServiceProvider(providerId, {
        rating_average: 0,
        rating_count: 0
      });
      return;
    }

    const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;

    await this.updateServiceProvider(providerId, {
      rating_average: Number(averageRating.toFixed(2)),
      rating_count: ratings.length
    });
  }

  static async getProviderRatings(providerId: string): Promise<Rating[]> {
    const { data, error } = await supabase
      .from("ratings")
      .select(`
        *,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq("service_provider_id", providerId)
      .eq("is_verified", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // ===================== STATISTICS & ANALYTICS =====================

  static async getProviderStats(providerId: string): Promise<{
    totalQuotes: number;
    acceptedQuotes: number;
    completedJobs: number;
    averageResponseTime: number;
    acceptanceRate: number;
    completionRate: number;
  }> {
    // This would need to query quotes and contracts tables
    // For now, returning basic structure
    const provider = await this.getServiceProvider(providerId);
    
    return {
      totalQuotes: 0, // Would need to query quotes table
      acceptedQuotes: 0,
      completedJobs: provider.total_jobs_completed || 0,
      averageResponseTime: provider.response_time_hours || 0,
      acceptanceRate: 0,
      completionRate: 0
    };
  }

  static async incrementJobsCompleted(providerId: string): Promise<void> {
    const provider = await this.getServiceProvider(providerId);
    await this.updateServiceProvider(providerId, {
      total_jobs_completed: (provider.total_jobs_completed || 0) + 1
    });
  }

  // ===================== SERVICE AREAS & CATEGORIES =====================

  static async updateServiceAreas(id: string, areas: string[]): Promise<ServiceProvider> {
    return this.updateServiceProvider(id, {
      service_area: areas
    });
  }

  static async updateServiceCategories(id: string, categories: string[]): Promise<ServiceProvider> {
    return this.updateServiceProvider(id, {
      service_categories: categories
    });
  }

  static async updateSpecialties(id: string, specialties: string[]): Promise<ServiceProvider> {
    return this.updateServiceProvider(id, {
      specialties: specialties
    });
  }
}