
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      budget_requests: {
        Row: {
          budget_range_max: number | null
          budget_range_min: number | null
          category: string
          created_at: string
          description: string
          id: string
          property_id: string
          status: string
          title: string
          updated_at: string
          user_id: string
          views_count: number
        }
        Insert: {
          budget_range_max?: number | null
          budget_range_min?: number | null
          category: string
          created_at?: string
          description: string
          id?: string
          property_id: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
          views_count?: number
        }
        Update: {
          budget_range_max?: number | null
          budget_range_min?: number | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          property_id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "budget_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_message: string | null
          last_message_at: string | null
          metadata: Json | null
          participants: string[]
          related_entity_id: string | null
          related_entity_type: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_message?: string | null
          last_message_at?: string | null
          metadata?: Json | null
          participants: string[]
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_message?: string | null
          last_message_at?: string | null
          metadata?: Json | null
          participants?: string[]
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          amount: number
          budget_request_id: string | null
          client_id: string
          client_signature: Json | null
          client_signed_at: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          payment_terms: string | null
          provider_id: string
          provider_signature: Json | null
          provider_signed_at: string | null
          quote_id: string | null
          start_date: string | null
          status: string
          terms_and_conditions: string | null
          title: string
          updated_at: string
        }
        Insert: {
          amount: number
          budget_request_id?: string | null
          client_id: string
          client_signature?: Json | null
          client_signed_at?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          payment_terms?: string | null
          provider_id: string
          provider_signature?: Json | null
          provider_signed_at?: string | null
          quote_id?: string | null
          start_date?: string | null
          status?: string
          terms_and_conditions?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          budget_request_id?: string | null
          client_id?: string
          client_signature?: Json | null
          client_signed_at?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          payment_terms?: string | null
          provider_id?: string
          provider_signature?: Json | null
          provider_signed_at?: string | null
          quote_id?: string | null
          start_date?: string | null
          status?: string
          terms_and_conditions?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_budget_request_id_fkey"
            columns: ["budget_request_id"]
            isOneToOne: false
            referencedRelation: "budget_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: true
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          document_type: string
          file_path: string
          file_size: number
          id: string
          is_public: boolean
          metadata: Json | null
          name: string
          related_entity_id: string | null
          related_entity_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_type: string
          file_path: string
          file_size: number
          id?: string
          is_public?: boolean
          metadata?: Json | null
          name: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_type?: string
          file_path?: string
          file_size?: number
          id?: string
          is_public?: boolean
          metadata?: Json | null
          name?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: string[] | null
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          message_type: string
          metadata: Json | null
          read_at: string | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          message_type?: string
          metadata?: Json | null
          read_at?: string | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          message_type?: string
          metadata?: Json | null
          read_at?: string | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          category: string | null
          created_at: string
          id: string
          message: string
          read: boolean
          read_at: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string
          email_notifications: boolean
          full_name: string | null
          id: string
          is_verified: boolean
          language: string
          last_login: string | null
          phone: string | null
          postal_code: string | null
          sms_notifications: boolean
          timezone: string
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type_enum"]
          verification_code: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email: string
          email_notifications?: boolean
          full_name?: string | null
          id: string
          is_verified?: boolean
          language?: string
          last_login?: string | null
          phone?: string | null
          postal_code?: string | null
          sms_notifications?: boolean
          timezone?: string
          updated_at?: string
          user_type: Database["public"]["Enums"]["user_type_enum"]
          verification_code?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string
          email_notifications?: boolean
          full_name?: string | null
          id?: string
          is_verified?: boolean
          language?: string
          last_login?: string | null
          phone?: string | null
          postal_code?: string | null
          sms_notifications?: boolean
          timezone?: string
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type_enum"]
          verification_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          city: string
          community_rules: string | null
          country: string
          created_at: string
          description: string | null
          id: string
          name: string
          postal_code: string
          property_type: string
          units_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          city: string
          community_rules?: string | null
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          postal_code: string
          property_type?: string
          units_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          city?: string
          community_rules?: string | null
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          postal_code?: string
          property_type?: string
          units_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          amount: number
          budget_request_id: string
          created_at: string
          description: string | null
          id: string
          payment_terms: string | null
          service_provider_id: string
          status: string
          terms_and_conditions: string | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          amount: number
          budget_request_id: string
          created_at?: string
          description?: string | null
          id?: string
          payment_terms?: string | null
          service_provider_id: string
          status?: string
          terms_and_conditions?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          amount?: number
          budget_request_id?: string
          created_at?: string
          description?: string | null
          id?: string
          payment_terms?: string | null
          service_provider_id?: string
          status?: string
          terms_and_conditions?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_budget_request_id_fkey"
            columns: ["budget_request_id"]
            isOneToOne: false
            referencedRelation: "budget_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          comment: string | null
          contract_id: string
          created_at: string
          id: string
          is_verified: boolean
          rating: number
          rated_by_user_id: string
          service_provider_id: string
          updated_at: string
        }
        Insert: {
          comment?: string | null
          contract_id: string
          created_at?: string
          id?: string
          is_verified?: boolean
          rating: number
          rated_by_user_id: string
          service_provider_id: string
          updated_at?: string
        }
        Update: {
          comment?: string | null
          contract_id?: string
          created_at?: string
          id?: string
          is_verified?: boolean
          rating?: number
          rated_by_user_id?: string
          service_provider_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rated_by_user_id_fkey"
            columns: ["rated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          emergency_available: boolean
          icon: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          requires_insurance: boolean
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          emergency_available?: boolean
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          requires_insurance?: boolean
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          emergency_available?: boolean
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          requires_insurance?: boolean
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          address: string | null
          availability: Json | null
          average_rating: number
          city: string | null
          company_name: string
          created_at: string
          description: string | null
          documentation: Json | null
          email: string
          id: string
          is_verified: boolean
          languages: string[] | null
          phone: string | null
          postal_code: string | null
          ratings_count: number
          service_areas: string[] | null
          service_categories: string[] | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          availability?: Json | null
          average_rating?: number
          city?: string | null
          company_name: string
          created_at?: string
          description?: string | null
          documentation?: Json | null
          email: string
          id?: string
          is_verified?: boolean
          languages?: string[] | null
          phone?: string | null
          postal_code?: string | null
          ratings_count?: number
          service_areas?: string[] | null
          service_categories?: string[] | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          availability?: Json | null
          average_rating?: number
          city?: string | null
          company_name?: string
          created_at?: string
          description?: string | null
          documentation?: Json | null
          email?: string
          id?: string
          is_verified?: boolean
          languages?: string[] | null
          phone?: string | null
          postal_code?: string | null
          ratings_count?: number
          service_areas?: string[] | null
          service_categories?: string[] | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_verified: boolean
          role_specific_data: Json | null
          role_type: Database["public"]["Enums"]["user_type_enum"]
          updated_at: string
          user_id: string
          verification_confirmed_at: string | null
          verification_expires_at: string | null
          verification_token: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          role_specific_data?: Json | null
          role_type: Database["public"]["Enums"]["user_type_enum"]
          updated_at?: string
          user_id: string
          verification_confirmed_at?: string | null
          verification_expires_at?: string | null
          verification_token?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          role_specific_data?: Json | null
          role_type?: Database["public"]["Enums"]["user_type_enum"]
          updated_at?: string
          user_id?: string
          verification_confirmed_at?: string | null
          verification_expires_at?: string | null
          verification_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      work_sessions: {
        Row: {
          approved_by_client: boolean | null
          approved_by_provider: boolean | null
          contract_id: string
          created_at: string
          description: string | null
          end_time: string
          id: string
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_by_client?: boolean | null
          approved_by_provider?: boolean | null
          contract_id: string
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          start_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_by_client?: boolean | null
          approved_by_provider?: boolean | null
          contract_id?: string
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_sessions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type_enum:
        | "particular"
        | "community_member"
        | "service_provider"
        | "property_administrator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
    
// Custom application types
export type Profile = Tables<'profiles'>
export type ProfileInsert = TablesInsert<'profiles'>
export type ProfileUpdate = TablesUpdate<'profiles'>

export type UserRole = Tables<'user_roles'>
export type UserRoleInsert = TablesInsert<'user_roles'>
export type UserRoleUpdate = TablesUpdate<'user_roles'>

export type Property = Tables<'properties'>
export type PropertyInsert = TablesInsert<'properties'>
export type PropertyUpdate = TablesUpdate<'properties'>

export type BudgetRequest = Tables<'budget_requests'>
export type BudgetRequestInsert = TablesInsert<'budget_requests'>
export type BudgetRequestUpdate = TablesUpdate<'budget_requests'>
export type BudgetRequestWithDetails = BudgetRequest & {
  properties: Property;
  quotes: (Quote & { service_providers: ServiceProvider | null })[];
  user_roles: UserRole | null;
};


export type Quote = Tables<'quotes'>
export type QuoteInsert = TablesInsert<'quotes'>
export type QuoteUpdate = TablesUpdate<'quotes'>
export type QuoteWithDetails = Quote & {
  service_providers: ServiceProvider;
};

export type Contract = Tables<'contracts'>
export type ContractInsert = TablesInsert<'contracts'>
export type ContractUpdate = TablesUpdate<'contracts'>
export type ContractWithDetails = Contract & {
  budget_requests: BudgetRequest | null;
  quotes: Quote | null;
  clients: Profile;
  providers: ServiceProvider;
}

export type WorkSession = Tables<'work_sessions'>
export type WorkSessionInsert = TablesInsert<'work_sessions'>
export type WorkSessionUpdate = TablesUpdate<'work_sessions'>

export type Rating = Tables<'ratings'>
export type RatingInsert = TablesInsert<'ratings'>
export type RatingUpdate = TablesUpdate<'ratings'>

export type ServiceProvider = Tables<'service_providers'>
export type ServiceProviderInsert = TablesInsert<'service_providers'>
export type ServiceProviderUpdate = TablesUpdate<'service_providers'>
export type ServiceProviderWithRatings = ServiceProvider & {
  ratings: Rating[]
}

export type ServiceCategory = Tables<'service_categories'>
export type ServiceCategoryInsert = TablesInsert<'service_categories'>
export type ServiceCategoryUpdate = TablesUpdate<'service_categories'>

export type Notification = Tables<'notifications'>
export type NotificationInsert = TablesInsert<'notifications'>
export type NotificationUpdate = TablesUpdate<'notifications'>

export type Conversation = Tables<'conversations'>
export type ConversationInsert = TablesInsert<'conversations'>
export type ConversationUpdate = TablesUpdate<'conversations'>
export type ConversationWithDetails = Conversation & {
  participants_profiles: Profile[];
  last_message_details: Message | null;
  unread_count: number;
}

export type Message = Tables<'messages'>
export type MessageInsert = TablesInsert<'messages'>
export type MessageUpdate = TablesUpdate<'messages'>

export type Document = Tables<'documents'>
export type DocumentInsert = TablesInsert<'documents'>
export type DocumentUpdate = TablesUpdate<'documents'>
