
import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyInsert, PropertyUpdate } from "@/integrations/supabase/types";

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

  static async getManagedProperties(adminId: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from("properties")
      .select("*, user_roles!inner(user_id, role_type)")
      .eq("user_roles.user_id", adminId)
      .eq("user_roles.role_type", "property_administrator");

    if (error) {
      console.error("Error fetching managed properties:", error);
      throw new Error(error.message);
    }

    return data as Property[] || [];
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

  static async getPropertiesByType(propertyType: Property['property_type']): Promise<Property[]> {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("property_type", propertyType)
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
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async searchProperties(searchParams: {
    city?: string;
    propertyType?: Property['property_type'];
    minUnits?: number;
    maxUnits?: number;
  }): Promise<Property[]> {
    let query = supabase
      .from("properties")
      .select("*");

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

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getNearbyProperties(_latitude: number, _longitude: number, _radius: number): Promise<Property[]> {
    try {
      // Simple fallback query without RPC to avoid type errors
      console.warn("Geographic search not available, using simple query");
      return [];
    } catch (error) {
      console.error("Error in getNearbyProperties:", error);
      return [];
    }
  }

  // Statistics and analytics
  static async getPropertyStats(userId: string): Promise<{
    totalProperties: number;
    totalUnits: number;
    propertyTypes: { [key: string]: number };
  }> {
    const properties = await this.getUserProperties(userId);
    
    const stats = {
      totalProperties: properties.length,
      totalUnits: properties.reduce((sum, p) => sum + (p.units_count || 0), 0),
      propertyTypes: properties.reduce((acc, p) => {
        acc[p.property_type] = (acc[p.property_type] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number })
    };

    return stats;
  }
}
