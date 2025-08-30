import { supabase } from "@/integrations/supabase/client";
import { Rating, RatingInsert, RatingUpdate } from "@/integrations/supabase/types";
import { SupabaseServiceProviderService } from "./SupabaseServiceProviderService";

export class SupabaseRatingService {
  // ===================== RATINGS CRUD =====================
  
  static async createRating(ratingData: RatingInsert): Promise<Rating> {
    const { data, error } = await supabase
      .from("ratings")
      .insert({
        ...ratingData,
        is_verified: false,
        helpful_votes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Update service provider rating statistics
    await SupabaseServiceProviderService.updateRatingStats(ratingData.service_provider_id);

    return data;
  }

  static async updateRating(id: string, updates: RatingUpdate): Promise<Rating> {
    const { data, error } = await supabase
      .from("ratings")
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

    // If the rating was updated, recalculate provider stats
    if (updates.rating) {
      const rating = await this.getRating(id);
      await SupabaseServiceProviderService.updateRatingStats(rating.service_provider_id);
    }

    return data;
  }

  static async getRating(id: string): Promise<Rating> {
    const { data, error } = await supabase
      .from("ratings")
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        ),
        service_providers (
          id,
          company_name,
          profiles (
            full_name
          )
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async deleteRating(id: string): Promise<void> {
    const rating = await this.getRating(id);
    
    const { error } = await supabase
      .from("ratings")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    // Update service provider rating statistics after deletion
    await SupabaseServiceProviderService.updateRatingStats(rating.service_provider_id);
  }

  // ===================== RATINGS BY SERVICE PROVIDER =====================

  static async getServiceProviderRatings(serviceProviderId: string, filters?: {
    verified?: boolean;
    minRating?: number;
    maxRating?: number;
    limit?: number;
    offset?: number;
  }): Promise<Rating[]> {
    let query = supabase
      .from("ratings")
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        ),
        quotes (
          id,
          description
        ),
        contracts (
          id,
          work_description
        )
      `)
      .eq("service_provider_id", serviceProviderId);

    if (filters?.verified !== undefined) {
      query = query.eq("is_verified", filters.verified);
    }

    if (filters?.minRating) {
      query = query.gte("rating", filters.minRating);
    }

    if (filters?.maxRating) {
      query = query.lte("rating", filters.maxRating);
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(filters?.limit || 50)
      .range(filters?.offset || 0, (filters?.offset || 0) + (filters?.limit || 50) - 1);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // ===================== RATINGS BY USER =====================

  static async getUserRatings(userId: string): Promise<Rating[]> {
    const { data, error } = await supabase
      .from("ratings")
      .select(`
        *,
        service_providers (
          id,
          company_name,
          profiles (
            full_name,
            avatar_url
          )
        ),
        quotes (
          id,
          description
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // ===================== RATING VERIFICATION =====================

  static async verifyRating(id: string): Promise<Rating> {
    return this.updateRating(id, { is_verified: true });
  }

  static async unverifyRating(id: string): Promise<Rating> {
    return this.updateRating(id, { is_verified: false });
  }

  // ===================== HELPFUL VOTES =====================

  static async incrementHelpfulVotes(id: string): Promise<Rating> {
    const rating = await this.getRating(id);
    return this.updateRating(id, {
      helpful_votes: (rating.helpful_votes || 0) + 1
    });
  }

  static async decrementHelpfulVotes(id: string): Promise<Rating> {
    const rating = await this.getRating(id);
    return this.updateRating(id, {
      helpful_votes: Math.max(0, (rating.helpful_votes || 0) - 1)
    });
  }

  // ===================== PROVIDER RESPONSE =====================

  static async addProviderResponse(id: string, response: string): Promise<Rating> {
    return this.updateRating(id, {
      response_from_provider: response
    });
  }

  static async removeProviderResponse(id: string): Promise<Rating> {
    return this.updateRating(id, {
      response_from_provider: null
    });
  }

  // ===================== RATING STATISTICS =====================

  static async getRatingStats(serviceProviderId: string): Promise<{
    totalRatings: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
    averageServiceQuality: number;
    averagePunctuality: number;
    averageCommunication: number;
    averageValueForMoney: number;
    averageCleanliness: number;
    recommendationRate: number;
    verifiedRatingsCount: number;
  }> {
    const ratings = await this.getServiceProviderRatings(serviceProviderId);

    const stats = {
      totalRatings: ratings.length,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as { [key: number]: number },
      averageServiceQuality: 0,
      averagePunctuality: 0,
      averageCommunication: 0,
      averageValueForMoney: 0,
      averageCleanliness: 0,
      recommendationRate: 0,
      verifiedRatingsCount: ratings.filter(r => r.is_verified).length
    };

    if (ratings.length === 0) {
      return stats;
    }

    // Calculate averages
    stats.averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    stats.averageServiceQuality = ratings.reduce((sum, r) => sum + (r.service_quality || 0), 0) / ratings.length;
    stats.averagePunctuality = ratings.reduce((sum, r) => sum + (r.punctuality || 0), 0) / ratings.length;
    stats.averageCommunication = ratings.reduce((sum, r) => sum + (r.communication || 0), 0) / ratings.length;
    stats.averageValueForMoney = ratings.reduce((sum, r) => sum + (r.value_for_money || 0), 0) / ratings.length;
    stats.averageCleanliness = ratings.reduce((sum, r) => sum + (r.cleanliness || 0), 0) / ratings.length;

    // Calculate recommendation rate
    const recommendedCount = ratings.filter(r => r.would_recommend === true).length;
    stats.recommendationRate = (recommendedCount / ratings.length) * 100;

    // Calculate rating distribution
    ratings.forEach(rating => {
      const ratingValue = rating.rating as keyof typeof stats.ratingDistribution;
      stats.ratingDistribution[ratingValue] = (stats.ratingDistribution[ratingValue] || 0) + 1;
    });

    return stats;
  }

  // ===================== SEARCH & FILTERS =====================

  static async searchRatings(filters: {
    serviceProviderId?: string;
    userId?: string;
    minRating?: number;
    maxRating?: number;
    verified?: boolean;
    hasComment?: boolean;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: 'date' | 'rating' | 'helpful';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<Rating[]> {
    let query = supabase
      .from("ratings")
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        ),
        service_providers (
          id,
          company_name,
          profiles (
            full_name
          )
        )
      `);

    if (filters.serviceProviderId) {
      query = query.eq("service_provider_id", filters.serviceProviderId);
    }

    if (filters.userId) {
      query = query.eq("user_id", filters.userId);
    }

    if (filters.minRating) {
      query = query.gte("rating", filters.minRating);
    }

    if (filters.maxRating) {
      query = query.lte("rating", filters.maxRating);
    }

    if (filters.verified !== undefined) {
      query = query.eq("is_verified", filters.verified);
    }

    if (filters.hasComment) {
      query = query.not("comment", "is", null);
    }

    if (filters.dateFrom) {
      query = query.gte("created_at", filters.dateFrom);
    }

    if (filters.dateTo) {
      query = query.lte("created_at", filters.dateTo);
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder || 'desc';
    
    switch (sortBy) {
      case 'rating':
        query = query.order("rating", { ascending: sortOrder === 'asc' });
        break;
      case 'helpful':
        query = query.order("helpful_votes", { ascending: sortOrder === 'asc' });
        break;
      default:
        query = query.order("created_at", { ascending: sortOrder === 'asc' });
    }

    const { data, error } = await query
      .limit(filters.limit || 50)
      .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 50) - 1);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // ===================== RATING VALIDATION =====================

  static async canUserRateProvider(userId: string, serviceProviderId: string): Promise<{
    canRate: boolean;
    reason?: string;
    existingRating?: Rating;
  }> {
    // Check if user has already rated this provider
    const { data: existingRating } = await supabase
      .from("ratings")
      .select("*")
      .eq("user_id", userId)
      .eq("service_provider_id", serviceProviderId)
      .single();

    if (existingRating) {
      return {
        canRate: false,
        reason: "User has already rated this provider",
        existingRating
      };
    }

    // Check if user has completed work with this provider
    const { data: contracts } = await supabase
      .from("contracts")
      .select("*")
      .eq("user_id", userId)
      .eq("service_provider_id", serviceProviderId)
      .eq("status", "completed");

    if (!contracts || contracts.length === 0) {
      return {
        canRate: false,
        reason: "User must complete at least one contract with provider before rating"
      };
    }

    return { canRate: true };
  }

  // ===================== BULK OPERATIONS =====================

  static async bulkVerifyRatings(ratingIds: string[]): Promise<Rating[]> {
    const { data, error } = await supabase
      .from("ratings")
      .update({ is_verified: true, updated_at: new Date().toISOString() })
      .in("id", ratingIds)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async bulkDeleteRatings(ratingIds: string[]): Promise<void> {
    const { error } = await supabase
      .from("ratings")
      .delete()
      .in("id", ratingIds);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async getRatingDistribution(serviceProviderId: string): Promise<{
    average: number;
    total: number;
    distribution: { rating: number; count: number; percentage: number }[];
  }> {
    const ratings = await this.getServiceProviderRatings(serviceProviderId);

    const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRatings = 0;

    for (const rating of ratings) {
      if (rating.rating >= 1 && rating.rating <= 5) {
        ratingCounts[rating.rating] = (ratingCounts[rating.rating] || 0) + 1;
        totalRatings++;
      }
    }

    const average = totalRatings > 0 ? (ratings.reduce((acc, r) => acc + r.rating, 0) / totalRatings) : 0;

    const distribution = Object.entries(ratingCounts).map(([key, value]) => ({
      rating: parseInt(key),
      count: value,
      percentage: totalRatings > 0 ? (value / totalRatings) * 100 : 0
    }));

    return {
      average: parseFloat(average.toFixed(2)),
      total: totalRatings,
      distribution
    };
  }
}