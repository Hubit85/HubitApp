
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];
type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"];

export class SupabasePropertyService {
  static async createProperty(propertyData: PropertyInsert) {
    const insertData = propertyData as Database["public"]["Tables"]["properties"]["Insert"];
    const { data, error } = await supabase
      .from("properties")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateProperty(id: string, updates: PropertyUpdate) {
    const updateData = updates as Database["public"]["Tables"]["properties"]["Update"];
    const { data, error } = await supabase
      .from("properties")
      .update(updateData)
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
