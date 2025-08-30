import { supabase } from "@/integrations/supabase/client";
import { ServiceCategory, ServiceCategoryInsert, ServiceCategoryUpdate } from "@/integrations/supabase/types";

export class SupabaseServiceCategoryService {
  // ===================== SERVICE CATEGORIES CRUD =====================
  
  static async createServiceCategory(categoryData: ServiceCategoryInsert): Promise<ServiceCategory> {
    const { data, error } = await supabase
      .from("service_categories")
      .insert({
        ...categoryData,
        is_active: true,
        emergency_available: categoryData.emergency_available || false,
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

  static async updateServiceCategory(id: string, updates: ServiceCategoryUpdate): Promise<ServiceCategory> {
    const { data, error } = await supabase
      .from("service_categories")
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

  static async getServiceCategory(id: string): Promise<ServiceCategory> {
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async deleteServiceCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from("service_categories")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  // ===================== CATEGORY HIERARCHY =====================

  static async getMainCategories(): Promise<ServiceCategory[]> {
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .is("parent_id", null)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getSubCategories(parentId: string): Promise<ServiceCategory[]> {
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .eq("parent_id", parentId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getCategoryHierarchy(): Promise<ServiceCategory[]> {
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Build hierarchy tree
    const categories = data || [];
    const mainCategories = categories.filter(cat => !cat.parent_id);
    
    // Add subcategories to main categories
    mainCategories.forEach(mainCat => {
      (mainCat as any).subcategories = categories.filter(cat => cat.parent_id === mainCat.id);
    });

    return mainCategories;
  }

  static async getAllActiveCategories(): Promise<ServiceCategory[]> {
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // ===================== CATEGORY MANAGEMENT =====================

  static async activateCategory(id: string): Promise<ServiceCategory> {
    return this.updateServiceCategory(id, { is_active: true });
  }

  static async deactivateCategory(id: string): Promise<ServiceCategory> {
    return this.updateServiceCategory(id, { is_active: false });
  }

  static async updateCategoryOrder(id: string, sortOrder: number): Promise<ServiceCategory> {
    return this.updateServiceCategory(id, { sort_order: sortOrder });
  }

  static async updateCategoryIcon(id: string, icon: string): Promise<ServiceCategory> {
    return this.updateServiceCategory(id, { icon });
  }

  static async updateCategoryColor(id: string, color: string): Promise<ServiceCategory> {
    return this.updateServiceCategory(id, { color });
  }

  // ===================== EMERGENCY SERVICES =====================

  static async getEmergencyCategories(): Promise<ServiceCategory[]> {
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .eq("is_active", true)
      .eq("emergency_available", true)
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async enableEmergencyServices(id: string): Promise<ServiceCategory> {
    return this.updateServiceCategory(id, { emergency_available: true });
  }

  static async disableEmergencyServices(id: string): Promise<ServiceCategory> {
    return this.updateServiceCategory(id, { emergency_available: false });
  }

  // ===================== SEARCH & FILTERS =====================

  static async searchCategories(query: string): Promise<ServiceCategory[]> {
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .eq("is_active", true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getCategoriesByIds(categoryIds: string[]): Promise<ServiceCategory[]> {
    if (categoryIds.length === 0) return [];

    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .in("id", categoryIds)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // ===================== CATEGORY ANALYTICS =====================

  static async getCategoryUsageStats(): Promise<{
    categoryId: string;
    name: string;
    budgetRequestsCount: number;
    serviceProvidersCount: number;
  }[]> {
    // This would require complex joins - for now returning basic structure
    const categories = await this.getAllActiveCategories();
    
    // In a real implementation, you would join with budget_requests and service_providers tables
    return categories.map(cat => ({
      categoryId: cat.id,
      name: cat.name,
      budgetRequestsCount: 0, // Would need to query budget_requests table
      serviceProvidersCount: 0 // Would need to query service_providers table
    }));
  }

  // ===================== CATEGORY INITIALIZATION =====================

  static async initializeDefaultCategories(): Promise<void> {
    const defaultCategories = [
      {
        name: "Limpieza",
        description: "Servicios de limpieza residencial y comercial",
        icon: "🧹",
        color: "#3B82F6",
        sort_order: 1,
        emergency_available: false
      },
      {
        name: "Fontanería",
        description: "Reparación e instalación de sistemas de agua",
        icon: "🔧",
        color: "#06B6D4",
        sort_order: 2,
        emergency_available: true
      },
      {
        name: "Electricidad",
        description: "Instalaciones y reparaciones eléctricas",
        icon: "⚡",
        color: "#F59E0B",
        sort_order: 3,
        emergency_available: true
      },
      {
        name: "Jardinería",
        description: "Mantenimiento de jardines y áreas verdes",
        icon: "🌱",
        color: "#10B981",
        sort_order: 4,
        emergency_available: false
      },
      {
        name: "Pintura",
        description: "Servicios de pintura interior y exterior",
        icon: "🎨",
        color: "#8B5CF6",
        sort_order: 5,
        emergency_available: false
      },
      {
        name: "Mantenimiento General",
        description: "Reparaciones y mantenimiento diversos",
        icon: "🛠️",
        color: "#6B7280",
        sort_order: 6,
        emergency_available: false
      },
      {
        name: "Seguridad",
        description: "Sistemas de seguridad y vigilancia",
        icon: "🔒",
        color: "#DC2626",
        sort_order: 7,
        emergency_available: true
      },
      {
        name: "Climatización",
        description: "Aires acondicionados y calefacción",
        icon: "❄️",
        color: "#0EA5E9",
        sort_order: 8,
        emergency_available: true
      },
      {
        name: "Carpintería",
        description: "Trabajos en madera y muebles",
        icon: "🪵",
        color: "#92400E",
        sort_order: 9,
        emergency_available: false
      },
      {
        name: "Emergencias",
        description: "Servicios de emergencia 24/7",
        icon: "🚨",
        color: "#EF4444",
        sort_order: 10,
        emergency_available: true
      }
    ];

    try {
      const { data, error } = await supabase.from('service_categories').select('*');
      if (error) throw error;
  
      const updates: { id: string; emergency_available: boolean; }[] = [];
      data.forEach(category => {
        const hasEmergencySubcategory = data.some(sub => sub.parent_id === category.id && sub.emergency_available);
        if (hasEmergencySubcategory && !category.emergency_available) {
          updates.push({ id: category.id, emergency_available: true });
        }
      });
  
      if (updates.length > 0) {
        const { error: updateError } = await supabase.from('service_categories').upsert(updates);
        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error("Error initializing default categories:", error);
    }
  }

  // ===================== BULK OPERATIONS =====================

  static async bulkUpdateCategories(updates: { id: string; updates: ServiceCategoryUpdate }[]): Promise<ServiceCategory[]> {
    const results: ServiceCategory[] = [];

    for (const { id, updates } of updates) {
      try {
        const updated = await this.updateServiceCategory(id, updates);
        results.push(updated);
      } catch (error) {
        console.error(`Failed to update category ${id}:`, error);
      }
    }

    return results;
  }

  static async reorderCategories(categoryOrders: { id: string; sort_order: number }[]): Promise<void> {
    for (const { id, sort_order } of categoryOrders) {
      await this.updateCategoryOrder(id, sort_order);
    }
  }
}