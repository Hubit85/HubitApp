
import { supabase } from "@/integrations/supabase/client";
import { 
  BudgetRequest, 
  BudgetRequestInsert, 
  BudgetRequestUpdate, 
  Quote, 
  QuoteInsert, 
  QuoteUpdate
} from "@/integrations/supabase/types";
import { SupabaseBudgetNotificationService } from "./SupabaseBudgetNotificationService";

type BudgetRequestWithProperty = BudgetRequest & {
  properties: { id: string; name: string; address: string; city: string } | null;
};

export class SupabaseBudgetService {
  // ===================== BUDGET REQUESTS =====================
  
  static async createBudgetRequest(requestData: BudgetRequestInsert): Promise<BudgetRequest> {
    const { data, error } = await supabase
      .from("budget_requests")
      .insert({
        ...requestData,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    console.log("✅ Budget request created:", data.id);
    return data;
  }

  static async updateBudgetRequest(id: string, updates: BudgetRequestUpdate): Promise<BudgetRequest> {
    const { data, error } = await supabase
      .from("budget_requests")
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

    console.log("✅ Budget request updated:", data.id);
    return data;
  }

  /**
   * NUEVA FUNCIONALIDAD: Publica una solicitud de presupuesto y notifica automáticamente a proveedores elegibles
   */
  static async publishBudgetRequest(id: string): Promise<{
    budgetRequest: BudgetRequest;
    notificationResults: {
      success: boolean;
      notificationsSent: number;
      error?: string;
    };
  }> {
    try {
      console.log("🔔 Publishing budget request and notifying providers:", id);

      // 1. Actualizar estado a 'published' y establecer fecha de publicación
      const publishedRequest = await this.updateBudgetRequest(id, {
        status: "published",
        published_at: new Date().toISOString(),
        // Establecer fecha de expiración si no está definida (30 días por defecto)
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      console.log("✅ Budget request published successfully");

      // 2. Enviar notificaciones automáticas a proveedores elegibles
      const notificationResults = await SupabaseBudgetNotificationService.notifyProvidersOfNewBudgetRequest(publishedRequest);

      console.log(`📊 Notification results: ${notificationResults.notificationsSent} notifications sent`);

      return {
        budgetRequest: publishedRequest,
        notificationResults
      };

    } catch (error) {
      console.error("❌ Error publishing budget request:", error);
      throw error;
    }
  }

  /**
   * FUNCIONALIDAD MEJORADA: Solicitar presupuesto con notificación automática
   */
  static async createAndPublishBudgetRequest(requestData: BudgetRequestInsert, autoPublish: boolean = false): Promise<{
    budgetRequest: BudgetRequest;
    notificationResults?: {
      success: boolean;
      notificationsSent: number;
      error?: string;
    };
  }> {
    try {
      console.log("🚀 Creating budget request with auto-publish:", autoPublish);

      // 1. Crear la solicitud de presupuesto
      const budgetRequest = await this.createBudgetRequest(requestData);

      // 2. Si se solicita auto-publicación, publicar y notificar
      if (autoPublish) {
        const publishResults = await this.publishBudgetRequest(budgetRequest.id);
        return publishResults;
      }

      // 3. Si no se auto-publica, devolver solo la solicitud creada
      return { budgetRequest };

    } catch (error) {
      console.error("❌ Error creating and publishing budget request:", error);
      throw error;
    }
  }

  static async getBudgetRequest(id: string): Promise<BudgetRequestWithProperty> {
    const { data, error } = await supabase
      .from("budget_requests")
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as BudgetRequestWithProperty;
  }

  static async getUserBudgetRequests(userId: string): Promise<BudgetRequestWithProperty[]> {
    const { data, error } = await supabase
      .from("budget_requests")
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data || []) as BudgetRequestWithProperty[];
  }

  /**
   * FUNCIONALIDAD MEJORADA: Obtener solicitudes con filtrado por categorías de servicio
   */
  static async getPublishedBudgetRequests(filters?: {
    category?: BudgetRequest['category'];
    city?: string;
    maxBudget?: number;
    minBudget?: number;
    serviceCategories?: string[]; // Para filtrar por categorías específicas del proveedor
    urgency?: BudgetRequest['urgency'];
  }): Promise<BudgetRequestWithProperty[]> {
    let query = supabase
      .from("budget_requests")
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city
        )
      `)
      .eq("status", "published")
      .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`); // No expiradas

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.serviceCategories && filters.serviceCategories.length > 0) {
      // Filtrar por categorías que maneje el proveedor
      query = query.in("category", filters.serviceCategories as BudgetRequest['category'][]);
    }

    if (filters?.urgency) {
      query = query.eq("urgency", filters.urgency);
    }

    if (filters?.minBudget) {
      query = query.gte("budget_range_min", filters.minBudget);
    }

    if (filters?.maxBudget) {
      query = query.lte("budget_range_max", filters.maxBudget);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data || []) as BudgetRequestWithProperty[];
  }

  static async deleteBudgetRequest(id: string): Promise<void> {
    // Antes de eliminar, notificar cambio de estado
    await SupabaseBudgetNotificationService.updateBudgetRequestStatusNotifications(id, 'cancelled');

    const { error } = await supabase
      .from("budget_requests")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    console.log("✅ Budget request deleted:", id);
  }

  /**
   * NUEVA FUNCIONALIDAD: Cancelar solicitud con notificaciones
   */
  static async cancelBudgetRequest(id: string, reason?: string): Promise<BudgetRequest> {
    // Actualizar estado y notificar a proveedores
    await SupabaseBudgetNotificationService.updateBudgetRequestStatusNotifications(id, 'cancelled');

    return await this.updateBudgetRequest(id, {
      status: "cancelled",
      // Podríamos agregar un campo cancellation_reason si fuera necesario
    });
  }

  // ===================== QUOTES =====================

  static async createQuote(quoteData: QuoteInsert): Promise<Quote> {
    const { data, error } = await supabase
      .from("quotes")
      .insert({
        ...quoteData,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    console.log("✅ Quote created:", data.id);

    // Incrementar contador de cotizaciones en la solicitud de presupuesto
    try {
      await supabase.rpc('increment_quotes_count', { 
        budget_request_id: quoteData.budget_request_id 
      });
    } catch (incrementError) {
      console.warn("⚠️ Failed to increment quotes count:", incrementError);
    }

    return data;
  }

  static async updateQuote(id: string, updates: QuoteUpdate): Promise<Quote> {
    const { data, error } = await supabase
      .from("quotes")
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

    console.log("✅ Quote updated:", data.id);
    return data;
  }

  static async getQuote(id: string): Promise<Quote> {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * FUNCIONALIDAD MEJORADA: Obtener cotizaciones con información del proveedor
   */
  static async getBudgetRequestQuotes(budgetRequestId: string): Promise<(Quote & {
    service_provider: {
      company_name: string;
      rating_average: number;
      total_jobs_completed: number;
    } | null;
  })[]> {
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        *,
        service_providers (
          company_name,
          rating_average,
          total_jobs_completed
        )
      `)
      .eq("budget_request_id", budgetRequestId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data || []) as any[];
  }

  static async getProviderQuotes(providerId: string): Promise<Quote[]> {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("service_provider_id", providerId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async acceptQuote(id: string): Promise<Quote> {
    const quote = await this.getQuote(id);
    
    // First, reject all other quotes for this budget request
    await supabase
      .from("quotes")
      .update({ 
        status: "rejected",
        updated_at: new Date().toISOString() 
      })
      .eq("budget_request_id", quote.budget_request_id)
      .neq("id", id);

    // Then accept this quote
    const acceptedQuote = await this.updateQuote(id, {
      status: "accepted"
    });

    // Update budget request status
    await this.updateBudgetRequest(quote.budget_request_id, {
      status: "in_progress"
    });

    console.log("✅ Quote accepted:", id);
    return acceptedQuote;
  }

  static async rejectQuote(id: string): Promise<Quote> {
    const rejectedQuote = await this.updateQuote(id, {
      status: "rejected"
    });

    console.log("✅ Quote rejected:", id);
    return rejectedQuote;
  }

  static async withdrawQuote(id: string): Promise<Quote> {
    return this.updateQuote(id, {
      status: "cancelled"
    });
  }

  // ===================== STATISTICS =====================

  static async getBudgetRequestStats(userId: string): Promise<{
    total: number;
    pending: number;
    published: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  }> {
    const requests = await this.getUserBudgetRequests(userId);
    
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === "pending").length,
      published: requests.filter(r => r.status === "published").length,
      inProgress: requests.filter(r => r.status === "in_progress").length,
      completed: requests.filter(r => r.status === "completed").length,
      cancelled: requests.filter(r => r.status === "cancelled").length,
    };

    return stats;
  }

  static async getProviderQuoteStats(providerId: string): Promise<{
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    acceptanceRate: number;
    averageAmount: number;
  }> {
    const quotes = await this.getProviderQuotes(providerId);
    
    const acceptedQuotes = quotes.filter(q => q.status === "accepted");
    const stats = {
      total: quotes.length,
      pending: quotes.filter(q => q.status === "pending").length,
      accepted: acceptedQuotes.length,
      rejected: quotes.filter(q => q.status === "rejected").length,
      acceptanceRate: quotes.length > 0 
        ? (acceptedQuotes.length / quotes.length) * 100 
        : 0,
      averageAmount: acceptedQuotes.length > 0
        ? acceptedQuotes.reduce((sum, q) => sum + q.amount, 0) / acceptedQuotes.length
        : 0
    };

    return stats;
  }

  // ===================== SEARCH & FILTERS =====================

  static async searchBudgetRequests(query: string, filters?: {
    category?: BudgetRequest['category'];
    city?: string;
    urgency?: BudgetRequest['urgency'];
    serviceCategories?: string[];
  }): Promise<BudgetRequestWithProperty[]> {
    let supabaseQuery = supabase
      .from("budget_requests")
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city
        )
      `)
      .eq("status", "published")
      .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`);

    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    if (filters?.category) {
      supabaseQuery = supabaseQuery.eq("category", filters.category);
    }

    if (filters?.urgency) {
      supabaseQuery = supabaseQuery.eq("urgency", filters.urgency);
    }

    if (filters?.serviceCategories && filters.serviceCategories.length > 0) {
      supabaseQuery = supabaseQuery.in("category", filters.serviceCategories as BudgetRequest['category'][]);
    }

    const { data, error } = await supabaseQuery
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(error.message);
    }

    return (data || []) as BudgetRequestWithProperty[];
  }

  // ===================== NOTIFICATION INTEGRATION =====================

  /**
   * NUEVA FUNCIONALIDAD: Obtener estadísticas de notificaciones para una solicitud
   */
  static async getBudgetRequestNotificationStats(budgetRequestId: string) {
    return await SupabaseBudgetNotificationService.getBudgetRequestNotificationStats(budgetRequestId);
  }

  /**
   * NUEVA FUNCIONALIDAD: Encontrar proveedores elegibles para una solicitud (para preview)
   */
  static async findEligibleProvidersPreview(budgetRequest: BudgetRequest): Promise<{
    count: number;
    preview: Array<{
      company_name: string;
      rating_average: number;
      total_jobs_completed: number;
    }>;
  }> {
    try {
      // Esta es una versión simplificada de la lógica de elegibilidad
      let query = supabase
        .from('service_providers')
        .select('company_name, rating_average, total_jobs_completed, service_categories')
        .eq('is_active', true)
        .eq('verified', true);

      const { data: providers, error } = await query;

      if (error || !providers) {
        return { count: 0, preview: [] };
      }

      // Filtrar por categoría
      const filteredProviders = providers.filter(provider => {
        if (!provider.service_categories || provider.service_categories.length === 0) {
          return true; // Acepta todas las categorías
        }
        
        return provider.service_categories.some((cat: string) =>
          cat.toLowerCase() === budgetRequest.category.toLowerCase()
        );
      });

      // Ordenar y tomar los primeros 5 para preview
      const sortedProviders = filteredProviders
        .sort((a, b) => (b.rating_average || 0) - (a.rating_average || 0))
        .slice(0, 5)
        .map(p => ({
          company_name: p.company_name,
          rating_average: p.rating_average || 0,
          total_jobs_completed: p.total_jobs_completed || 0
        }));

      return {
        count: filteredProviders.length,
        preview: sortedProviders
      };

    } catch (error) {
      console.error("❌ Error finding eligible providers preview:", error);
      return { count: 0, preview: [] };
    }
  }
}