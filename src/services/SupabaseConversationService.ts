import { supabase } from "@/integrations/supabase/client";
import { 
  Conversation, 
  ConversationInsert, 
  ConversationUpdate,
  ConversationWithDetails,
  Message,
  MessageInsert,
  MessageUpdate
} from "@/integrations/supabase/types";
import { SupabaseServiceProviderService } from "./SupabaseServiceProviderService";

export class SupabaseConversationService {
  // ===================== CONVERSATIONS =====================
  
  static async createConversation(conversationData: ConversationInsert): Promise<Conversation> {
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        ...conversationData,
        is_active: true,
        unread_count_user: 0,
        unread_count_provider: 0,
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

  static async updateConversation(id: string, updates: ConversationUpdate): Promise<Conversation> {
    const { data, error } = await supabase
      .from("conversations")
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

  static async getConversationById(conversationId: string): Promise<ConversationWithDetails | null> {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        user:profiles!conversations_user_id_fkey(*),
        service_provider:service_providers!conversations_service_provider_id_fkey(*, profiles!service_providers_user_id_fkey(*)),
        messages(*, profiles:profiles!messages_sender_id_fkey(*))
      `)
      .eq('id', conversationId)
      .single();
    
    if (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }
    
    return data as unknown as ConversationWithDetails;
  }

  static async getUserConversations(userId: string, isProvider: boolean = false): Promise<ConversationWithDetails[]> {
    let query = supabase
      .from('conversations')
      .select(`
        *,
        user:profiles!conversations_user_id_fkey(*),
        service_provider:service_providers!conversations_service_provider_id_fkey(*, profiles!service_providers_user_id_fkey(*)),
        messages:messages(*, profiles:profiles!messages_sender_id_fkey(*))
      `);

    if (userId) {
      if (isProvider) {
        // For service providers, find conversations where they are the service provider
        const providerProfile = await SupabaseServiceProviderService.getServiceProviderByUserId(userId);
        if (providerProfile) {
          query = query.eq("service_provider_id", providerProfile.id);
        } else {
          return [];
        }
      } else {
        // For regular users, find conversations where they are the user
        query = query.eq("user_id", userId);
      }
    }

    const { data, error } = await query.order("last_message_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data as any[]) || [];
  }

  static async deleteConversation(id: string): Promise<void> {
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  // ===================== CONVERSATION MANAGEMENT =====================

  static async findOrCreateConversation(
    userId: string,
    serviceProviderId: string,
    relatedEntityType?: "budget_request" | "quote" | "contract",
    relatedEntityId?: string,
    subject?: string
  ): Promise<Conversation> {
    // Try to find existing conversation
    let query = supabase
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .eq("service_provider_id", serviceProviderId)
      .eq("is_active", true);

    if (relatedEntityId) {
      switch (relatedEntityType) {
        case "budget_request":
          query = query.eq("budget_request_id", relatedEntityId);
          break;
        case "quote":
          query = query.eq("quote_id", relatedEntityId);
          break;
        case "contract":
          query = query.eq("contract_id", relatedEntityId);
          break;
      }
    }

    const { data: existing } = await query.single();

    if (existing) {
      return existing;
    }

    // Create new conversation
    const conversationData: ConversationInsert = {
      user_id: userId,
      service_provider_id: serviceProviderId,
      subject: subject || "Nueva conversación"
    };

    if (relatedEntityId) {
      switch (relatedEntityType) {
        case "budget_request":
          conversationData.budget_request_id = relatedEntityId;
          break;
        case "quote":
          conversationData.quote_id = relatedEntityId;
          break;
        case "contract":
          conversationData.contract_id = relatedEntityId;
          break;
      }
    }

    return this.createConversation(conversationData);
  }

  static async archiveConversation(id: string): Promise<Conversation> {
    return this.updateConversation(id, { is_active: false });
  }

  static async unarchiveConversation(id: string): Promise<Conversation> {
    return this.updateConversation(id, { is_active: true });
  }

  static async updateLastMessage(conversationId: string, message: string, senderId: string): Promise<void> {
    const conversation = await this.getConversationById(conversationId);
    
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    
    // Determine if sender is user or provider
    const isUserSender = senderId === conversation.user_id;
    
    const updates: ConversationUpdate = {
      last_message: message,
      last_message_at: new Date().toISOString()
    };

    // Increment unread count for the recipient
    if (isUserSender) {
      updates.unread_count_provider = (conversation.unread_count_provider || 0) + 1;
    } else {
      updates.unread_count_user = (conversation.unread_count_user || 0) + 1;
    }

    await this.updateConversation(conversationId, updates);
  }

  // ===================== MESSAGES =====================

  static async createMessage(messageData: MessageInsert): Promise<Message> {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        ...messageData,
        is_read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Update conversation's last message
    await this.updateLastMessage(messageData.conversation_id, messageData.message, messageData.sender_id);

    return data;
  }

  static async updateMessage(id: string, updates: MessageUpdate): Promise<Message> {
    const { data, error } = await supabase
      .from("messages")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getMessage(id: string): Promise<Message> {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getConversationMessages(conversationId: string, limit: number = 50, offset: number = 0): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    // Return messages in chronological order (oldest first)
    return (data || []).reverse();
  }

  static async deleteMessage(id: string): Promise<void> {
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  // ===================== MESSAGE ACTIONS =====================

  static async markMessageAsRead(id: string): Promise<Message> {
    return this.updateMessage(id, {
      is_read: true,
      read_at: new Date().toISOString()
    });
  }

  static async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    const conversation = await this.getConversationById(conversationId);
    
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    
    const isUser = userId === conversation.user_id;

    // Mark all unread messages as read
    await supabase
      .from("messages")
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq("conversation_id", conversationId)
      .eq("is_read", false)
      .neq("sender_id", userId);

    // Reset unread count for the user
    const updates: ConversationUpdate = isUser 
      ? { unread_count_user: 0 }
      : { unread_count_provider: 0 };

    await this.updateConversation(conversationId, updates);
  }

  static async sendMessage(
    conversationId: string,
    senderId: string,
    message: string,
    messageType: "text" | "image" | "file" | "system" = "text",
    attachments?: string[]
  ): Promise<Message> {
    return this.createMessage({
      conversation_id: conversationId,
      sender_id: senderId,
      message,
      message_type: messageType,
      attachments
    });
  }

  static async sendSystemMessage(
    conversationId: string,
    message: string
  ): Promise<Message> {
    // System messages use a special sender ID or can be sent without one
    return this.createMessage({
      conversation_id: conversationId,
      sender_id: "system", // You might want to handle this differently
      message,
      message_type: "system"
    });
  }

  // ===================== SEARCH & FILTERS =====================

  static async searchConversations(userId: string, query: string, isProvider: boolean = false): Promise<ConversationWithDetails[]> {
    const conversations = await this.getUserConversations(userId, isProvider);
    
    if (!query) return conversations;

    // Filter conversations by subject, last message, or participant names
    return conversations.filter(conv => 
      conv.subject?.toLowerCase().includes(query.toLowerCase()) ||
      conv.last_message?.toLowerCase().includes(query.toLowerCase()) ||
      conv.profiles?.full_name?.toLowerCase().includes(query.toLowerCase()) ||
      conv.service_providers?.company_name?.toLowerCase().includes(query.toLowerCase())
    );
  }

  static async searchMessages(conversationId: string, query: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("conversation_id", conversationId)
      .ilike("message", `%${query}%`)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // ===================== STATISTICS =====================

  static async getConversationStats(userId: string, isProvider: boolean = false): Promise<{
    total: number;
    active: number;
    archived: number;
    unreadMessages: number;
    totalMessages: number;
  }> {
    const conversations = await this.getUserConversations(userId, isProvider);
    
    const stats = await SupabaseServiceProviderService.getProviderStats(userId);
    
    return {
      total: conversations.length,
      active: conversations.filter(c => c.is_active).length,
      archived: conversations.filter(c => !c.is_active).length,
      unreadMessages: conversations.reduce((sum, c) => 
        sum + (isProvider ? (c.unread_count_provider || 0) : (c.unread_count_user || 0)), 0
      ),
      totalMessages: 0
    };
  }

  static async getUnreadCount(userId: string, isProvider: boolean = false): Promise<number> {
    const conversations = await this.getUserConversations(userId, isProvider);
    
    return conversations.reduce((sum, c) => 
      sum + (isProvider ? (c.unread_count_provider || 0) : (c.unread_count_user || 0)), 0
    );
  }

  // ===================== BULK OPERATIONS =====================

  static async bulkMarkAsRead(conversationIds: string[], userId: string): Promise<void> {
    for (const conversationId of conversationIds) {
      await this.markConversationAsRead(conversationId, userId);
    }
  }

  static async bulkArchiveConversations(conversationIds: string[]): Promise<void> {
    const { error } = await supabase
      .from("conversations")
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .in("id", conversationIds);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async bulkDeleteConversations(conversationIds: string[]): Promise<void> {
    // First delete all messages in these conversations
    const { error: messagesError } = await supabase
      .from("messages")
      .delete()
      .in("conversation_id", conversationIds);

    if (messagesError) {
      throw new Error(messagesError.message);
    }

    // Then delete the conversations
    const { error } = await supabase
      .from("conversations")
      .delete()
      .in("id", conversationIds);

    if (error) {
      throw new Error(error.message);
    }
  }

  // ===================== REAL-TIME SUBSCRIPTIONS =====================

  static subscribeToConversation(conversationId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        callback(payload.new as Message);
      })
      .subscribe();
  }

  static subscribeToUserConversations(userId: string, callback: (conversation: Conversation) => void) {
    return supabase
      .channel(`user_conversations:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        callback(payload.new as Conversation);
      })
      .subscribe();
  }

  // ===================== CONVERSATION TEMPLATES =====================

  static async createBudgetRequestConversation(
    userId: string,
    serviceProviderId: string,
    budgetRequestId: string,
    initialMessage?: string
  ): Promise<{ conversation: Conversation; message?: Message }> {
    const conversation = await this.findOrCreateConversation(
      userId,
      serviceProviderId,
      "budget_request",
      budgetRequestId,
      "Consulta sobre solicitud de presupuesto"
    );

    let message;
    if (initialMessage) {
      message = await this.sendMessage(conversation.id, userId, initialMessage);
    }

    return { conversation, message };
  }

  static async createQuoteConversation(
    userId: string,
    serviceProviderId: string,
    quoteId: string,
    initialMessage?: string
  ): Promise<{ conversation: Conversation; message?: Message }> {
    const conversation = await this.findOrCreateConversation(
      userId,
      serviceProviderId,
      "quote",
      quoteId,
      "Conversación sobre cotización"
    );

    let message;
    if (initialMessage) {
      message = await this.sendMessage(conversation.id, userId, initialMessage);
    }

    return { conversation, message };
  }

  static async addMessage(conversationId: string, senderId: string, message: string, messageType: string = 'text', attachments: string[] = []) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        conversation_id: conversationId,
        sender_id: senderId,
        message: message,
        message_type: messageType,
        attachments: attachments
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding message:', error);
      return null;
    }

    // Update conversation's last message
    await supabase
      .from('conversations')
      .update({
        last_message: message,
        last_message_at: new Date().toISOString()
      })
      .eq('id', conversationId);
      
    return data;
  }

  static async markAsRead(conversationId: string, userId: string) {
    const { error } = await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .eq('is_read', false);

    if (error) {
        console.error('Error marking messages as read:', error);
    }
    return { error };
  }

  static async getConversation(conversationId: string): Promise<ConversationWithDetails | null> {
    return this.getConversationById(conversationId);
  }

  static getParticipantDetails(conversation: ConversationWithDetails, currentUserId: string) {
    const isUser = conversation.user_id === currentUserId;
    const otherParticipant = isUser ? conversation.service_provider : conversation.user;
    
    return {
      isUser,
      currentUser: isUser ? conversation.user : conversation.service_provider?.profiles,
      otherParticipant,
    };
  }
}