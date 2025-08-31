
import { supabase } from "@/integrations/supabase/client";
import { 
  Rating, 
  RatingInsert, 
  RatingUpdate, 
  ServiceProvider,
  Contract,
  Profile
} from "@/integrations/supabase/types";

type RatingWithDetails = Rating & {
  contracts: Pick<Contract, 'id' | 'user_id'>;
  profiles: Pick<Profile, 'full_name' | 'id'>;
  service_providers: Pick<ServiceProvider, 'company_name' | 'id'>;
};

export class SupabaseRatingService {
  // ===================== RATINGS CRUD =====================
  
  static async createRating(ratingData: RatingInsert): Promise<Rating> {
    const { data, error } = await supabase
      .from("ratings")
      .insert({
        ...ratingData,
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Update service provider's rating average
    await this.updateProviderRatingStats(ratingData.service_provider_id);

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

    // Update service provider's rating stats
    const rating = await this.getRating(id);
    await this.updateProviderRatingStats(rating.service_provider_id);

    return data;
  }

  static async getRating(id: string): Promise<Rating> {
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
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

    // Update service provider's rating stats
    await this.updateProviderRatingStats(rating.service_provider_id);
  }

  // ===================== RATING QUERIES =====================

  static async getUserRatingsGiven(userId: string): Promise<Rating[]> {
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("rated_by_user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getServiceProviderRatings(serviceProviderId: string): Promise<Rating[]> {
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("service_provider_id", serviceProviderId)
      .eq("is_verified", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getContractRating(contractId: string): Promise<Rating | null> {
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("contract_id", contractId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rating found
      }
      throw new Error(error.message);
    }

    return data;
  }

  static async canUserRateContract(userId: string, contractId: string): Promise<boolean> {
    // Check if contract exists and user is the client
    const contractDetails = await this.getContractDetails(contractId);
    if (!contractDetails) {
      return false;
    }

    if (contractDetails.user_id !== userId) {
      return false;
    }

    // Check if contract is completed
    if (contractDetails.status !== "completed") {
      return false;
    }

    // Check if rating already exists
    const existingRating = await this.getContractRating(contractId);
    return !existingRating;
  }

  // ===================== RATING MANAGEMENT =====================

  static async verifyRating(ratingId: string, verified: boolean): Promise<Rating> {
    return this.updateRating(ratingId, { is_verified: verified });
  }

  static async flagRating(ratingId: string, reason: string): Promise<void> {
    // In a real implementation, you might have a separate table for flags
    console.log(`Rating ${ratingId} flagged for: ${reason}`);
  }

  // ===================== STATISTICS & ANALYTICS =====================

  static async updateProviderRatingStats(serviceProviderId: string): Promise<void> {
    try {
      // Calculate new rating statistics
      const { data: ratings, error } = await supabase
        .from("ratings")
        .select("rating")
        .eq("service_provider_id", serviceProviderId)
        .eq("is_verified", true);

      if (error) {
        throw new Error(error.message);
      }

      // Note: average_rating field doesn't exist in service_providers table
      // This would need to be added to the database schema if required
      console.log(`Would update rating stats for provider ${serviceProviderId} with ${ratings?.length || 0} ratings`);

    } catch (error) {
      console.error("Error updating provider rating stats:", error);
    }
  }

  static async getProviderRatingStats(serviceProviderId: string): Promise<{
    totalRatings: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
    verificationRate: number;
  }> {
    const allRatings = await supabase
      .from("ratings")
      .select("rating, is_verified")
      .eq("service_provider_id", serviceProviderId);

    if (allRatings.error) {
      throw new Error(allRatings.error.message);
    }

    const ratings = allRatings.data || [];
    const verifiedRatings = ratings.filter(r => r.is_verified);

    const stats = {
      totalRatings: ratings.length,
      averageRating: ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0,
      ratingDistribution: ratings.reduce((acc, r) => {
        acc[r.rating] = (acc[r.rating] || 0) + 1;
        return acc;
      }, {} as { [key: number]: number }),
      verificationRate: ratings.length > 0 
        ? (verifiedRatings.length / ratings.length) * 100 
        : 0
    };

    return stats;
  }

  // ===================== SEARCH & FILTERS =====================

  static async searchRatings(filters?: {
    serviceProviderId?: string;
    userId?: string;
    minRating?: number;
    maxRating?: number;
    verified?: boolean;
    contractId?: string;
    limit?: number;
  }): Promise<Rating[]> {
    let query = supabase
      .from("ratings")
      .select("*");

    if (filters?.serviceProviderId) {
      query = query.eq("service_provider_id", filters.serviceProviderId);
    }

    if (filters?.userId) {
      query = query.eq("rated_by_user_id", filters.userId);
    }

    if (filters?.minRating) {
      query = query.gte("rating", filters.minRating);
    }

    if (filters?.maxRating) {
      query = query.lte("rating", filters.maxRating);
    }

    if (filters?.verified !== undefined) {
      query = query.eq("is_verified", filters.verified);
    }

    if (filters?.contractId) {
      query = query.eq("contract_id", filters.contractId);
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(filters?.limit || 50);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getRatingTrends(serviceProviderId: string, days: number = 30): Promise<{
    period: string;
    averageRating: number;
    count: number;
  }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("ratings")
      .select("rating, created_at")
      .eq("service_provider_id", serviceProviderId)
      .eq("is_verified", true)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Group by week and calculate trends
    const trends = (data || []).reduce((acc, rating) => {
      // Add null check for created_at
      if (rating.created_at) {
        const week = new Date(rating.created_at).toISOString().substring(0, 10);
        if (!acc[week]) {
          acc[week] = { ratings: [], count: 0 };
        }
        acc[week].ratings.push(rating.rating);
        acc[week].count++;
      }
      return acc;
    }, {} as { [key: string]: { ratings: number[], count: number } });

    return Object.entries(trends).map(([period, data]) => ({
      period,
      averageRating: data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length,
      count: data.count
    }));
  }

  // ===================== VALIDATION HELPERS =====================

  static async validateRatingEligibility(userId: string, contractId: string): Promise<{
    eligible: boolean;
    reason?: string;
  }> {
    try {
      // Check if contract exists and user is the client
      const contractDetails = await this.getContractDetails(contractId);
      if (!contractDetails) {
        return { eligible: false, reason: "Contract not found" };
      }

      if (contractDetails.user_id !== userId) {
        return { eligible: false, reason: "You are not the client for this contract" };
      }

      if (contractDetails.status !== "completed") {
        return { eligible: false, reason: "Contract must be completed before rating" };
      }

      // Check if rating already exists
      const existingRating = await this.getContractRating(contractId);
      if (existingRating) {
        return { eligible: false, reason: "Rating already exists for this contract" };
      }

      return { eligible: true };

    } catch (error) {
      return { eligible: false, reason: "Error validating rating eligibility" };
    }
  }

  // ===================== BULK OPERATIONS =====================

  static async bulkUpdateRatings(ratingIds: string[], updates: RatingUpdate): Promise<void> {
    const { error } = await supabase
      .from("ratings")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .in("id", ratingIds);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async bulkVerifyRatings(ratingIds: string[], verified: boolean): Promise<void> {
    await this.bulkUpdateRatings(ratingIds, { is_verified: verified });
  }

  // ===================== ADMIN FUNCTIONS =====================

  static async getPendingVerificationRatings(): Promise<Rating[]> {
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("is_verified", false)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getFlaggedRatings(): Promise<Rating[]> {
    // In a real implementation, you'd have a flags table
    // For now, return empty array
    return [];
  }

  // ===================== REPORTING & ANALYTICS =====================

  static async generateRatingReport(serviceProviderId: string, startDate: string, endDate: string): Promise<{
    totalRatings: number;
    averageRating: number;
    ratingsByMonth: { month: string; average: number; count: number }[];
    topComments: string[];
  }> {
    const { data, error } = await supabase
      .from("ratings")
      .select("rating, comment, created_at")
      .eq("service_provider_id", serviceProviderId)
      .eq("is_verified", true)
      .gte("created_at", startDate)
      .lte("created_at", endDate)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const ratings = data || [];
    
    const report = {
      totalRatings: ratings.length,
      averageRating: ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0,
      ratingsByMonth: [], // Simplified for now
      topComments: ratings
        .filter(r => r.comment && r.comment.length > 10)
        .slice(0, 5)
        .map(r => r.comment!)
    };

    return report;
  }

  // ===================== UTILITIES =====================

  static formatRating(rating: number): string {
    return `${rating.toFixed(1)}/5.0`;
  }

  static getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
  }

  static categorizeRating(rating: number): 'excellent' | 'good' | 'average' | 'poor' | 'terrible' {
    if (rating >= 4.5) return 'excellent';
    if (rating >= 3.5) return 'good';
    if (rating >= 2.5) return 'average';
    if (rating >= 1.5) return 'poor';
    return 'terrible';
  }

  private static async getContractDetails(contractId: string) {
    const { data, error } = await supabase
      .from("contracts")
      .select(`
        id,
        user_id,
        service_provider_id,
        status,
        total_amount,
        work_description
      `)
      .eq("id", contractId)
      .single();

    if (error) {
      console.error("Error fetching contract:", error);
      return null;
    }

    return data;
  }
}