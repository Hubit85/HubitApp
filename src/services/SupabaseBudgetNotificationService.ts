import { supabase } from "@/integrations/supabase/client";
import { ServiceProvider, BudgetRequest } from "@/integrations/supabase/types";

export interface NotificationToProvider {
  providerId: string;
  providerName: string;
  notificationId: string;
  sent: boolean;
  error?: string;
}

export class SupabaseBudgetNotificationService {
  /**
   * Extract a city-like token from free-text work_location.
   * Admin budget create (#60) persists: "name, address, city, postal_code".
   */
  private static extractCityFromWorkLocation(workLocation: string | null | undefined): string | null {
    if (!workLocation?.trim()) return null;

    const parts = workLocation.split(',').map((part) => part.trim()).filter(Boolean);
    if (parts.length === 0) return null;

    const last = parts[parts.length - 1];
    // Spanish postal codes are typically 5 digits; treat last segment as CP when it matches.
    if (/^\d{4,5}(-\d+)?$/.test(last) && parts.length >= 2) {
      return parts[parts.length - 2];
    }

    // Free-text locations often end with the city.
    if (parts.length >= 2) {
      return parts[parts.length - 1];
    }

    return parts[0];
  }

  private static providerServesLocation(
    provider: ServiceProvider,
    city: string,
    workLocation?: string | null
  ): boolean {
    if (!provider.service_area || provider.service_area.length === 0) {
      return true;
    }

    const cityLower = city.toLowerCase();
    const workLocationLower = (workLocation || '').toLowerCase();

    return provider.service_area.some((area: string) => {
      const areaLower = area.toLowerCase();
      return (
        areaLower.includes(cityLower) ||
        cityLower.includes(areaLower) ||
        // Also match against full work_location (community name/address/city blob from #60)
        (!!workLocationLower &&
          (workLocationLower.includes(areaLower) || areaLower.includes(workLocationLower)))
      );
    });
  }

  /**
   * Notifica automáticamente a proveedores relevantes cuando se publica una solicitud de presupuesto
   */
  static async notifyProvidersOfNewBudgetRequest(budgetRequest: BudgetRequest): Promise<{
    success: boolean;
    notificationsSent: number;
    notifications: NotificationToProvider[];
    error?: string;
  }> {
    try {
      console.log("🔔 Starting provider notifications for budget request:", budgetRequest.id);

      // 1. Buscar proveedores que manejan esta categoría de servicio
      const eligibleProviders = await this.findEligibleProviders(budgetRequest);
      
      if (eligibleProviders.length === 0) {
        console.log("⚠️ No eligible providers found for category:", budgetRequest.category);
        return {
          success: true,
          notificationsSent: 0,
          notifications: [],
          error: "No se encontraron proveedores para esta categoría de servicio"
        };
      }

      console.log(`📋 Found ${eligibleProviders.length} eligible providers`);

      // 2. Crear notificaciones para cada proveedor elegible
      const notifications: NotificationToProvider[] = [];
      let successCount = 0;

      for (const provider of eligibleProviders) {
        try {
          const notificationResult = await this.createProviderNotification(budgetRequest, provider);
          
          if (notificationResult.success) {
            successCount++;
            notifications.push({
              providerId: provider.id,
              providerName: provider.company_name,
              notificationId: notificationResult.notificationId!,
              sent: true
            });
          } else {
            notifications.push({
              providerId: provider.id,
              providerName: provider.company_name,
              notificationId: '',
              sent: false,
              error: notificationResult.error
            });
          }
        } catch (providerError) {
          console.error(`❌ Error notifying provider ${provider.company_name}:`, providerError);
          notifications.push({
            providerId: provider.id,
            providerName: provider.company_name,
            notificationId: '',
            sent: false,
            error: providerError instanceof Error ? providerError.message : 'Error desconocido'
          });
        }
      }

      console.log(`✅ Notifications completed: ${successCount}/${eligibleProviders.length} sent successfully`);

      return {
        success: true,
        notificationsSent: successCount,
        notifications
      };

    } catch (error) {
      console.error("❌ Error in notification service:", error);
      return {
        success: false,
        notificationsSent: 0,
        notifications: [],
        error: error instanceof Error ? error.message : "Error al enviar notificaciones"
      };
    }
  }

  /**
   * Busca proveedores elegibles para una solicitud de presupuesto
   */
  private static async findEligibleProviders(budgetRequest: BudgetRequest): Promise<ServiceProvider[]> {
    try {
      console.log("🔍 Finding eligible providers for category:", budgetRequest.category);

      // Resolve location: property.city first, then work_location (admin community path has no property_id)
      let locationCity: string | null = null;
      if (budgetRequest.property_id) {
        const { data: property, error: propertyError } = await supabase
          .from('properties')
          .select('city, latitude, longitude')
          .eq('id', budgetRequest.property_id)
          .single();

        if (!propertyError && property?.city) {
          locationCity = property.city;
          console.log("📍 Property location found:", property.city);
        }
      }

      if (!locationCity) {
        locationCity = this.extractCityFromWorkLocation(budgetRequest.work_location);
        if (locationCity) {
          console.log("📍 City resolved from work_location:", locationCity);
        } else if (budgetRequest.work_location) {
          console.log("📍 Using full work_location for service_area matching (no city token)");
        } else {
          console.log("⚠️ No property_id city or work_location; skipping location filter");
        }
      }

      // Buscar proveedores activos y verificados
      const query = supabase
        .from('service_providers')
        .select('*')
        .eq('is_active', true)
        .eq('verified', true);

      const { data: allProviders, error } = await query;

      if (error) {
        console.error("❌ Error querying service providers:", error);
        throw error;
      }

      if (!allProviders || allProviders.length === 0) {
        console.log("⚠️ No active providers found");
        return [];
      }

      console.log(`📊 Found ${allProviders.length} active providers`);

      // Filtrar por categoría de servicio
      const categoryFilteredProviders = allProviders.filter(provider => {
        // Si el proveedor no tiene categorías específicas, puede manejar cualquier solicitud
        if (!provider.service_categories || provider.service_categories.length === 0) {
          console.log(`✅ Provider ${provider.company_name} accepts all categories`);
          return true;
        }

        // Verificar si la categoría coincide
        const hasMatchingCategory = provider.service_categories.some((cat: string) =>
          cat.toLowerCase() === budgetRequest.category.toLowerCase()
        );

        console.log(`${hasMatchingCategory ? '✅' : '❌'} Provider ${provider.company_name} - categories:`, 
          provider.service_categories, `matches ${budgetRequest.category}:`, hasMatchingCategory);

        return hasMatchingCategory;
      });

      console.log(`📋 After category filtering: ${categoryFilteredProviders.length} providers`);

      // Filtrar por ubicación y radio de servicio (si está disponible)
      let locationFilteredProviders = categoryFilteredProviders;
      
      if (locationCity || budgetRequest.work_location) {
        const cityForFilter = locationCity || budgetRequest.work_location || '';
        locationFilteredProviders = categoryFilteredProviders.filter(provider => {
          if (!provider.service_area || provider.service_area.length === 0) {
            console.log(`✅ Provider ${provider.company_name} serves all areas`);
            return true;
          }

          const servesLocation = this.providerServesLocation(
            provider,
            cityForFilter,
            budgetRequest.work_location
          );

          console.log(`${servesLocation ? '✅' : '❌'} Provider ${provider.company_name} serves ${cityForFilter}:`, servesLocation);

          return servesLocation;
        });

        console.log(`📍 After location filtering: ${locationFilteredProviders.length} providers`);
      }

      // Filtrar por monto mínimo del proyecto
      const budgetFilteredProviders = locationFilteredProviders.filter(provider => {
        if (!provider.min_project_amount || provider.min_project_amount === 0) {
          return true; // No hay mínimo establecido
        }

        // Si hay rango de presupuesto, verificar que el máximo sea mayor al mínimo del proveedor
        if (budgetRequest.budget_range_max && budgetRequest.budget_range_max >= provider.min_project_amount) {
          console.log(`✅ Provider ${provider.company_name} budget requirements met`);
          return true;
        }

        // Si no hay rango específico, incluir al proveedor (el cliente decidirá)
        if (!budgetRequest.budget_range_max) {
          return true;
        }

        console.log(`❌ Provider ${provider.company_name} minimum (€${provider.min_project_amount}) exceeds budget (€${budgetRequest.budget_range_max})`);
        return false;
      });

      console.log(`💰 After budget filtering: ${budgetFilteredProviders.length} providers`);

      // Ordenar por relevancia (rating, trabajos completados, tiempo de respuesta)
      const sortedProviders = budgetFilteredProviders.sort((a, b) => {
        // Primero por rating promedio
        const ratingDiff = (b.rating_average || 0) - (a.rating_average || 0);
        if (Math.abs(ratingDiff) > 0.1) return ratingDiff;

        // Luego por trabajos completados
        const jobsDiff = (b.total_jobs_completed || 0) - (a.total_jobs_completed || 0);
        if (jobsDiff !== 0) return jobsDiff;

        // Finalmente por tiempo de respuesta (menor es mejor)
        return (a.response_time_hours || 24) - (b.response_time_hours || 24);
      });

      console.log("🎯 Final eligible providers:", sortedProviders.map(p => ({
        company: p.company_name,
        rating: p.rating_average,
        jobs: p.total_jobs_completed,
        responseTime: p.response_time_hours
      })));

      return sortedProviders;

    } catch (error) {
      console.error("❌ Error finding eligible providers:", error);
      throw error;
    }
  }

  /**
   * Crea una notificación individual para un proveedor
   */
  private static async createProviderNotification(
    budgetRequest: BudgetRequest, 
    provider: ServiceProvider
  ): Promise<{
    success: boolean;
    notificationId?: string;
    error?: string;
  }> {
    try {
      // Obtener información del usuario que creó la solicitud
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', budgetRequest.user_id)
        .single();

      const clientName = userProfile?.full_name || 'Cliente';

      // Crear mensaje personalizado basado en la urgencia
      const urgencyText: { [key: string]: string } = {
        'emergency': '🚨 URGENTE',
        'high': '🔥 ALTA PRIORIDAD',
        'normal': '📅 NORMAL',
        'low': '🕐 BAJA PRIORIDAD'
      };
      
      const urgencyKey = budgetRequest.urgency || 'normal';
      const urgencyLabel = urgencyText[urgencyKey] || 'NUEVA';

      const title = `${urgencyLabel}: Nueva solicitud de presupuesto`;
      
      let message = `${clientName} solicita un presupuesto para "${budgetRequest.title}" en la categoría ${budgetRequest.category}.`;

      if (budgetRequest.work_location) {
        message += ` Ubicación: ${budgetRequest.work_location}.`;
      }
      
      if (budgetRequest.budget_range_min && budgetRequest.budget_range_max) {
        message += ` Presupuesto estimado: €${budgetRequest.budget_range_min} - €${budgetRequest.budget_range_max}.`;
      }

      if (budgetRequest.deadline_date) {
        const deadlineDate = new Date(budgetRequest.deadline_date);
        message += ` Fecha límite: ${deadlineDate.toLocaleDateString()}.`;
      }

      // Insertar notificación en la base de datos
      const { data: notification, error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: provider.user_id,
          title,
          message,
          type: budgetRequest.urgency === 'emergency' ? 'warning' : 'info',
          category: 'budget_request',
          related_entity_type: 'budget_request',
          related_entity_id: budgetRequest.id,
          action_url: `/service-provider?request=${budgetRequest.id}`,
          action_label: 'Ver Solicitud',
          priority: budgetRequest.urgency === 'emergency' ? 3 : budgetRequest.urgency === 'high' ? 2 : 1,
          expires_at: budgetRequest.expires_at,
          read: false,
          sent_email: false,
          sent_sms: false
        })
        .select()
        .single();

      if (notificationError) {
        console.error(`❌ Error creating notification for provider ${provider.company_name}:`, notificationError);
        return {
          success: false,
          error: notificationError.message
        };
      }

      console.log(`✅ Notification created for provider ${provider.company_name}`);

      return {
        success: true,
        notificationId: notification.id
      };

    } catch (error) {
      console.error(`❌ Error creating notification for provider ${provider.company_name}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido"
      };
    }
  }

  /**
   * Actualiza las notificaciones cuando cambia el estado de una solicitud
   */
  static async updateBudgetRequestStatusNotifications(
    budgetRequestId: string,
    newStatus: string
  ): Promise<void> {
    try {
      console.log("🔄 Updating notifications for budget request status change:", newStatus);

      // Obtener la solicitud de presupuesto
      const { data: budgetRequest, error: requestError } = await supabase
        .from('budget_requests')
        .select('*')
        .eq('id', budgetRequestId)
        .single();

      if (requestError || !budgetRequest) {
        console.error("❌ Budget request not found:", requestError);
        return;
      }

      // Crear notificaciones específicas según el cambio de estado
      if (newStatus === 'cancelled' || newStatus === 'expired') {
        // Notificar a proveedores que han enviado cotizaciones
        await this.notifyProvidersOfBudgetRequestCancellation(budgetRequestId);
      }

      console.log("✅ Status notifications updated");

    } catch (error) {
      console.error("❌ Error updating status notifications:", error);
    }
  }

  /**
   * Notifica a proveedores cuando se cancela una solicitud
   */
  private static async notifyProvidersOfBudgetRequestCancellation(budgetRequestId: string): Promise<void> {
    try {
      // Obtener proveedores que han enviado cotizaciones
      const { data: quotes, error: quotesError } = await supabase
        .from('quotes')
        .select(`
          service_provider_id,
          service_providers (
            user_id,
            company_name
          ),
          budget_requests (
            title,
            user_id,
            profiles (
              full_name
            )
          )
        `)
        .eq('budget_request_id', budgetRequestId)
        .eq('status', 'pending');

      if (quotesError || !quotes || quotes.length === 0) {
        console.log("ℹ️ No pending quotes found for cancelled request");
        return;
      }

      // Crear notificaciones de cancelación
      const notifications = quotes.map((quote: any) => ({
        user_id: quote.service_providers.user_id,
        title: 'Solicitud de presupuesto cancelada',
        message: `La solicitud "${quote.budget_requests.title}" ha sido cancelada por el cliente.`,
        type: 'warning' as const,
        category: 'budget_request' as const,
        related_entity_type: 'budget_request',
        related_entity_id: budgetRequestId,
        read: false
      }));

      if (notifications.length > 0) {
        const { error: insertError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (insertError) {
          console.error("❌ Error creating cancellation notifications:", insertError);
        } else {
          console.log(`✅ Sent ${notifications.length} cancellation notifications`);
        }
      }

    } catch (error) {
      console.error("❌ Error notifying providers of cancellation:", error);
    }
  }

  /**
   * Obtiene estadísticas de notificaciones para un presupuesto
   */
  static async getBudgetRequestNotificationStats(budgetRequestId: string): Promise<{
    totalNotifications: number;
    readNotifications: number;
    providersNotified: number;
    quotesReceived: number;
  }> {
    try {
      // Contar notificaciones totales
      const { data: notifications } = await supabase
        .from('notifications')
        .select('read')
        .eq('related_entity_id', budgetRequestId)
        .eq('category', 'budget_request');

      // Contar cotizaciones recibidas
      const { data: quotes } = await supabase
        .from('quotes')
        .select('id')
        .eq('budget_request_id', budgetRequestId);

      const stats = {
        totalNotifications: notifications?.length || 0,
        readNotifications: notifications?.filter(n => n.read).length || 0,
        providersNotified: notifications?.length || 0,
        quotesReceived: quotes?.length || 0
      };

      console.log("📊 Notification stats for budget request:", stats);
      return stats;

    } catch (error) {
      console.error("❌ Error getting notification stats:", error);
      return {
        totalNotifications: 0,
        readNotifications: 0,
        providersNotified: 0,
        quotesReceived: 0
      };
    }
  }
}
