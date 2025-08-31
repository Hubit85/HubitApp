
import { supabase } from "@/integrations/supabase/client";
import { 
  Conversation, 
  ConversationInsert, 
  ConversationUpdate,
  Message,
  MessageInsert,
  MessageUpdate
} from "@/integrations/supabase/types";

export class SupabaseConversationService {
  // ===================== CONVERSATIONS =====================
  
  static async createConversation(conversationData: ConversationInsert): Promise<Conversation> {
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        ...conversationData,
        is_active: true,
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

  static async getConversation(id: string): Promise<Conversation> {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getUserConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("last_message_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async deleteConversation(id: string): Promise<void> {
    // First delete all messages in the conversation
    const { error: messagesError } = await supabase
      .from("messages")
      .delete()
      .eq("conversation_id", id);

    if (messagesError) {
      console.warn("Error deleting messages:", messagesError);
    }

    // Then delete the conversation
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
    participant1: string,
    participant2: string,
    budgetRequestId?: string,
    contractId?: string,
    quoteId?: string
  ): Promise<Conversation> {
    // Try to find existing conversation between these participants
    const { data: existing, error: findError } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", participant1)
      .eq("is_active", true)
      .limit(1)
      .single();

    if (!findError && existing) {
      return existing;
    }

    // Create new conversation
    const conversationData: ConversationInsert = {
      user_id: participant1,
      service_provider_id: participant2,
      budget_request_id: budgetRequestId || null,
      contract_id: contractId || null,
      quote_id: quoteId || null,
    };

    return this.createConversation(conversationData);
  }

  static async archiveConversation(id: string): Promise<Conversation> {
    return this.updateConversation(id, { is_active: false });
  }

  static async unarchiveConversation(id: string): Promise<Conversation> {
    return this.updateConversation(id, { is_active: true });
  }

  static async updateLastMessage(conversationId: string, message: string): Promise<void> {
    await this.updateConversation(conversationId, {
      last_message: message,
      last_message_at: new Date().toISOString()
    });
  }

  // ===================== MESSAGES =====================

  static async createMessage(messageData: MessageInsert): Promise<Message> {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        ...messageData,
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Update conversation's last message
    await this.updateLastMessage(messageData.conversation_id, messageData.message);

    return data;
  }

  static async updateMessage(id: string, updates: MessageUpdate): Promise<Message> {
    const { data, error } = await supabase
      .from("messages")
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

  static async getMessage(id: string): Promise<Message> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
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
      .select("*")
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

  // ===================== SEARCH & FILTERS =====================

  static async searchConversations(userId: string, query: string): Promise<Conversation[]> {
    const conversations = await this.getUserConversations(userId);
    
    if (!query) return conversations;

    return conversations.filter(conv => 
      conv.last_message?.toLowerCase().includes(query.toLowerCase())
    );
  }

  static async searchMessages(conversationId: string, query: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
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

  static async getConversationStats(userId: string): Promise<{
    total: number;
    active: number;
    archived: number;
    unreadMessages: number;
  }> {
    const conversations = await this.getUserConversations(userId);
    
    // Get unread message count
    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .neq("sender_id", userId)
      .eq("is_read", false);

    return {
      total: conversations.length,
      active: conversations.filter(c => c.is_active).length,
      archived: conversations.filter(c => !c.is_active).length,
      unreadMessages: count || 0
    };
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
        const conversation = payload.new as Conversation;
        callback(conversation);
      })
      .subscribe();
  }

  // ===================== CONVERSATION TEMPLATES =====================

  static async createBudgetRequestConversation(
    userId: string,
    budgetRequestId: string,
    subject: string,
    initialMessage?: string
  ): Promise<{ conversation: Conversation; message?: Message }> {
    const newConversation = await supabase.from("conversations").insert([{
      user_id: userId,
      service_provider_id: "00000000-0000-0000-0000-000000000000", // Default system ID
      budget_request_id: budgetRequestId,
      subject: subject,
      is_active: true
    }]).select().single();

    let message;
    if (initialMessage) {
      message = await this.sendMessage(newConversation.id, userId, initialMessage);
    }

    return { conversation: newConversation, message };
  }

  static async createQuoteConversation(
    userId: string,
    quoteId: string,
    serviceProviderId: string,
    initialMessage?: string
  ): Promise<{ conversation: Conversation; message?: Message }> {
    const conversationData: ConversationInsert = {
      user_id: userId,
      service_provider_id: serviceProviderId,
      quote_id: quoteId,
      subject: `Conversación sobre presupuesto`,
      is_active: true,
    };

    const conversation = await this.createConversation(conversationData);

    let message;
    if (initialMessage) {
      message = await this.sendMessage(conversation.id, userId, initialMessage);
    }

    return { conversation, message };
  }

  // ===================== UTILITIES =====================

  static async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .neq("sender_id", userId)
      .eq("is_read", false);

    if (error) {
      throw new Error(error.message);
    }

    return count || 0;
  }
}