
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  name: string;
  address: string;
  property_type: 'apartment' | 'house' | 'commercial' | 'land';
  total_units: number | null;
  owner_id: string;
  administrator_id: string | null;
  community_id: string | null;
  created_at: string;
  updated_at: string;
}

interface PropertyInsert {
  id?: string;
  name: string;
  address: string;
  property_type: 'apartment' | 'house' | 'commercial' | 'land';
  total_units?: number | null;
  owner_id: string;
  administrator_id?: string | null;
  community_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface PropertyUpdate {
  id?: string;
  name?: string;
  address?: string;
  property_type?: 'apartment' | 'house' | 'commercial' | 'land';
  total_units?: number | null;
  owner_id?: string;
  administrator_id?: string | null;
  community_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export class SupabasePropertyService {
  static async createProperty(propertyData: PropertyInsert) {
    const { data, error } = await supabase
      .from("properties")
      .insert(propertyData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateProperty(id: string, updates: PropertyUpdate) {
    const { data, error } = await supabase
      .from("properties")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getProperty(id: string) {
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

  static async getUserProperties(userId: string) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getPropertiesByAdministrator(adminId: string) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("administrator_id", adminId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async deleteProperty(id: string) {
    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async getPropertiesByType(propertyType: string) {
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
}
