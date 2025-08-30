import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationInsert, NotificationUpdate } from "@/integrations/supabase/types";

export class SupabaseNotificationService {
  // ===================== NOTIFICATIONS CRUD =====================
  
  static async createNotification(notificationData: NotificationInsert): Promise<Notification> {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        ...notificationData,
        read: false,
        priority: notificationData.priority || 1,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateNotification(id: string, updates: NotificationUpdate): Promise<Notification> {
    const { data, error } = await supabase
      .from("notifications")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getNotification(id: string): Promise<Notification> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async deleteNotification(id: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  // ===================== USER NOTIFICATIONS =====================

  static async getUserNotifications(userId: string, filters?: {
    read?: boolean;
    type?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<Notification[]> {
    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId);

    if (filters?.read !== undefined) {
      query = query.eq("read", filters.read);
    }

    if (filters?.type) {
      query = query.eq("type", filters.type);
    }

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    // Filter out expired notifications
    query = query.or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(filters?.limit || 50)
      .range(filters?.offset || 0, (filters?.offset || 0) + (filters?.limit || 50) - 1);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getUnreadNotificationsCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    if (error) {
      throw new Error(error.message);
    }

    return count || 0;
  }

  // ===================== NOTIFICATION ACTIONS =====================

  static async markAsRead(id: string): Promise<Notification> {
    return this.updateNotification(id, {
      read: true,
      read_at: new Date().toISOString()
    });
  }

  static async markAsUnread(id: string): Promise<Notification> {
    return this.updateNotification(id, {
      read: false,
      read_at: null
    });
  }

  static async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) {
      throw new Error(error.message);
    }
  }

  // ===================== NOTIFICATION TYPES =====================

  static async createBudgetRequestNotification(
    userId: string,
    budgetRequestId: string,
    type: "new_request" | "request_published" | "new_quote" | "quote_accepted",
    title: string,
    message: string
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: "info",
      category: "budget_request",
      related_entity_type: "budget_request",
      related_entity_id: budgetRequestId,
      action_url: `/dashboard/budget-requests/${budgetRequestId}`,
      action_label: "Ver solicitud",
      priority: type === "new_quote" ? 2 : 1
    });
  }

  static async createQuoteNotification(
    userId: string,
    quoteId: string,
    type: "new_quote" | "quote_updated" | "quote_accepted" | "quote_rejected",
    title: string,
    message: string
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: type === "quote_accepted" ? "success" : "info",
      category: "quote",
      related_entity_type: "quote",
      related_entity_id: quoteId,
      action_url: `/dashboard/quotes/${quoteId}`,
      action_label: "Ver cotización",
      priority: type === "quote_accepted" ? 3 : 2
    });
  }

  static async createContractNotification(
    userId: string,
    contractId: string,
    type: "contract_created" | "contract_signed" | "contract_completed" | "contract_cancelled",
    title: string,
    message: string
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: type === "contract_completed" ? "success" : type === "contract_cancelled" ? "warning" : "info",
      category: "contract",
      related_entity_type: "contract",
      related_entity_id: contractId,
      action_url: `/dashboard/contracts/${contractId}`,
      action_label: "Ver contrato",
      priority: type === "contract_signed" || type === "contract_completed" ? 3 : 2
    });
  }

  static async createPaymentNotification(
    userId: string,
    paymentId: string,
    type: "payment_received" | "payment_failed" | "refund_processed",
    title: string,
    message: string
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: type === "payment_received" || type === "refund_processed" ? "success" : "error",
      category: "payment",
      related_entity_type: "payment",
      related_entity_id: paymentId,
      action_url: `/dashboard/payments/${paymentId}`,
      action_label: "Ver pago",
      priority: 3
    });
  }

  static async createRatingNotification(
    userId: string,
    ratingId: string,
    title: string,
    message: string
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: "info",
      category: "rating",
      related_entity_type: "rating",
      related_entity_id: ratingId,
      action_url: `/dashboard/ratings/${ratingId}`,
      action_label: "Ver calificación",
      priority: 1
    });
  }

  static async createSystemNotification(
    userId: string,
    title: string,
    message: string,
    priority: number = 1
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: "system",
      category: "system",
      priority
    });
  }

  static async createEmergencyNotification(
    userId: string,
    emergencyRequestId: string,
    title: string,
    message: string
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: "error",
      category: "system",
      related_entity_type: "emergency_request",
      related_entity_id: emergencyRequestId,
      action_url: `/dashboard/emergency/${emergencyRequestId}`,
      action_label: "Ver emergencia",
      priority: 5, // Highest priority
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Expires in 24 hours
    });
  }

  // ===================== BULK OPERATIONS =====================

  static async bulkCreateNotifications(notifications: NotificationInsert[]): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notifications.map(notification => ({
        ...notification,
        read: false,
        priority: notification.priority || 1,
        created_at: new Date().toISOString()
      })))
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async bulkMarkAsRead(notificationIds: string[]): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .in("id", notificationIds);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async bulkDelete(notificationIds: string[]): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .in("id", notificationIds);

    if (error) {
      throw new Error(error.message);
    }
  }

  // ===================== CLEANUP & MAINTENANCE =====================

  static async deleteExpiredNotifications(): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .not("expires_at", "is", null)
      .lt("expires_at", new Date().toISOString());

    if (error) {
      throw new Error(error.message);
    }
  }

  static async deleteOldNotifications(daysOld: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const { error } = await supabase
      .from("notifications")
      .delete()
      .lt("created_at", cutoffDate.toISOString());

    if (error) {
      throw new Error(error.message);
    }
  }

  // ===================== STATISTICS =====================

  static async getUserNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    byType: { [key: string]: number };
    byCategory: { [key: string]: number };
  }> {
    const notifications = await this.getUserNotifications(userId);
    
    const stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      byType: notifications.reduce((acc, n) => {
        acc[n.type || 'unknown'] = (acc[n.type || 'unknown'] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }),
      byCategory: notifications.reduce((acc, n) => {
        acc[n.category || 'unknown'] = (acc[n.category || 'unknown'] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number })
    };

    return stats;
  }

  // ===================== PREFERENCES =====================

  static async shouldSendEmailNotification(userId: string, category: string): Promise<boolean> {
    // Check user preferences in profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("email_notifications")
      .eq("id", userId)
      .single();

    return profile?.email_notifications || false;
  }

  static async shouldSendSMSNotification(userId: string, category: string): Promise<boolean> {
    // Check user preferences in profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("sms_notifications")
      .eq("id", userId)
      .single();

    return profile?.sms_notifications || false;
  }
}
