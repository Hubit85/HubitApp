import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyInsert, PropertyUpdate } from "@/integrations/supabase/types";
import { SupabaseServiceProviderService } from "./SupabaseServiceProviderService";

export class SupabasePropertyService {
  static async createProperty(propertyData: PropertyInsert): Promise<Property> {
    const { data, error } = await supabase
      .from("properties")
      .insert({
        ...propertyData,
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

  static async updateProperty(id: string, updates: PropertyUpdate): Promise<Property> {
    const { data, error } = await supabase
      .from("properties")
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

  static async getProperty(id: string): Promise<Property> {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getUserProperties(userId: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async deleteProperty(id: string): Promise<void> {
    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async getPropertiesByType(propertyType: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("property_type", propertyType)
      .eq("property_status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getPropertiesByCity(city: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .ilike("city", `%${city}%`)
      .eq("property_status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async searchProperties(searchParams: {
    city?: string;
    propertyType?: string;
    minUnits?: number;
    maxUnits?: number;
    minArea?: number;
    maxArea?: number;
  }): Promise<Property[]> {
    let query = supabase
      .from("properties")
      .select("*")
      .eq("property_status", "active");

    if (searchParams.city) {
      query = query.ilike("city", `%${searchParams.city}%`);
    }

    if (searchParams.propertyType) {
      query = query.eq("property_type", searchParams.propertyType);
    }

    if (searchParams.minUnits) {
      query = query.gte("units_count", searchParams.minUnits);
    }

    if (searchParams.maxUnits) {
      query = query.lte("units_count", searchParams.maxUnits);
    }

    if (searchParams.minArea) {
      query = query.gte("total_area", searchParams.minArea);
    }

    if (searchParams.maxArea) {
      query = query.lte("total_area", searchParams.maxArea);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getNearbyProperties(latitude: number, longitude: number, radius: number): Promise<Property[]> {
    try {
      const { data, error } = await supabase.rpc('properties_near_location' as any, {
        lat: latitude,
        lng: longitude,
        radius_km: radius
      });

      if (error) {
        // Fallback to simple query if RPC function doesn't exist
        console.warn("Geographic search not available, using simple query");
        return [];
      }

      return (data as Property[]) || [];
    } catch (error) {
      console.error("Error in getNearbyProperties:", error);
      return [];
    }
  }

  static async updatePropertyImages(id: string, images: string[]): Promise<Property> {
    return this.updateProperty(id, { images });
  }

  static async updatePropertyAmenities(id: string, amenities: string[]): Promise<Property> {
    return this.updateProperty(id, { amenities });
  }

  static async setPropertyStatus(id: string, status: "active" | "inactive" | "maintenance"): Promise<Property> {
    return this.updateProperty(id, { property_status: status });
  }

  // Statistics and analytics
  static async getPropertyStats(userId: string): Promise<{
    totalProperties: number;
    activeProperties: number;
    totalUnits: number;
    averageArea: number;
    propertyTypes: { [key: string]: number };
  }> {
    const properties = await this.getUserProperties(userId);
    
    const stats = {
      totalProperties: properties.length,
      activeProperties: properties.filter(p => p.property_status === "active").length,
      totalUnits: properties.reduce((sum, p) => sum + (p.units_count || 0), 0),
      averageArea: properties.reduce((sum, p) => sum + (p.total_area || 0), 0) / properties.length || 0,
      propertyTypes: properties.reduce((acc, p) => {
        acc[p.property_type] = (acc[p.property_type] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number })
    };

    return stats;
  }
}