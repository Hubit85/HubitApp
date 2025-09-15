export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      budget_requests: {
        Row: {
          id: string
          user_id: string
          property_id: string | null
          service_category_id: string | null
          title: string
          description: string
          category: string
          urgency: string
          status: string
          budget_range_min: number | null
          budget_range_max: number | null
          preferred_date: string | null
          deadline_date: string | null
          work_location: string | null
          special_requirements: string | null
          images: string[] | null
          documents: string[] | null
          quotes_count: number
          views_count: number
          published_at: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id?: string | null
          service_category_id?: string | null
          title: string
          description: string
          category: string
          urgency?: string
          status?: string
          budget_range_min?: number | null
          budget_range_max?: number | null
          preferred_date?: string | null
          deadline_date?: string | null
          work_location?: string | null
          special_requirements?: string | null
          images?: string[] | null
          documents?: string[] | null
          quotes_count?: number
          views_count?: number
          published_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string | null
          service_category_id?: string | null
          title?: string
          description?: string
          category?: string
          urgency?: string
          status?: string
          budget_range_min?: number | null
          budget_range_max?: number | null
          preferred_date?: string | null
          deadline_date?: string | null
          work_location?: string | null
          special_requirements?: string | null
          images?: string[] | null
          documents?: string[] | null
          quotes_count?: number
          views_count?: number
          published_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          quote_id: string
          user_id: string
          service_provider_id: string
          contract_number: string
          status: string
          start_date: string | null
          end_date: string | null
          completion_date: string | null
          total_amount: number
          payment_schedule: string
          terms: string | null
          work_description: string
          deliverables: string[] | null
          milestones: Json | null
          client_signature: string | null
          provider_signature: string | null
          signed_date: string | null
          progress_percentage: number
          last_update: string | null
          cancellation_reason: string | null
          dispute_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          user_id: string
          service_provider_id: string
          contract_number: string
          status?: string
          start_date?: string | null
          end_date?: string | null
          completion_date?: string | null
          total_amount: number
          payment_schedule?: string
          terms?: string | null
          work_description: string
          deliverables?: string[] | null
          milestones?: Json | null
          client_signature?: string | null
          provider_signature?: string | null
          signed_date?: string | null
          progress_percentage?: number
          last_update?: string | null
          cancellation_reason?: string | null
          dispute_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote_id?: string
          user_id?: string
          service_provider_id?: string
          contract_number?: string
          status?: string
          start_date?: string | null
          end_date?: string | null
          completion_date?: string | null
          total_amount?: number
          payment_schedule?: string
          terms?: string | null
          work_description?: string
          deliverables?: string[] | null
          milestones?: Json | null
          client_signature?: string | null
          provider_signature?: string | null
          signed_date?: string | null
          progress_percentage?: number
          last_update?: string | null
          cancellation_reason?: string | null
          dispute_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          budget_request_id: string | null
          quote_id: string | null
          contract_id: string | null
          user_id: string
          service_provider_id: string
          subject: string | null
          last_message: string | null
          last_message_at: string | null
          unread_count_user: number
          unread_count_provider: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          budget_request_id?: string | null
          quote_id?: string | null
          contract_id?: string | null
          user_id: string
          service_provider_id: string
          subject?: string | null
          last_message?: string | null
          last_message_at?: string | null
          unread_count_user?: number
          unread_count_provider?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          budget_request_id?: string | null
          quote_id?: string | null
          contract_id?: string | null
          user_id?: string
          service_provider_id?: string
          subject?: string | null
          last_message?: string | null
          last_message_at?: string | null
          unread_count_user?: number
          unread_count_provider?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          related_entity_type: string
          related_entity_id: string
          document_type: string
          name: string
          description: string | null
          file_path: string
          file_size: number | null
          mime_type: string | null
          is_public: boolean
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          related_entity_type: string
          related_entity_id: string
          document_type: string
          name: string
          description?: string | null
          file_path: string
          file_size?: number | null
          mime_type?: string | null
          is_public?: boolean
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          related_entity_type?: string
          related_entity_id?: string
          document_type?: string
          name?: string
          description?: string | null
          file_path?: string
          file_size?: number | null
          mime_type?: string | null
          is_public?: boolean
          uploaded_by?: string | null
          created_at?: string
        }
      }
      emergency_requests: {
        Row: {
          id: string
          user_id: string
          property_id: string | null
          service_category_id: string | null
          title: string
          description: string
          urgency_level: string
          location_details: string | null
          contact_phone: string
          status: string
          assigned_provider_id: string | null
          estimated_cost: number | null
          actual_cost: number | null
          response_time_minutes: number | null
          resolution_time_minutes: number | null
          images: string[] | null
          priority_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id?: string | null
          service_category_id?: string | null
          title: string
          description: string
          urgency_level?: string
          location_details?: string | null
          contact_phone: string
          status?: string
          assigned_provider_id?: string | null
          estimated_cost?: number | null
          actual_cost?: number | null
          response_time_minutes?: number | null
          resolution_time_minutes?: number | null
          images?: string[] | null
          priority_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string | null
          service_category_id?: string | null
          title?: string
          description?: string
          urgency_level?: string
          location_details?: string | null
          contact_phone?: string
          status?: string
          assigned_provider_id?: string | null
          estimated_cost?: number | null
          actual_cost?: number | null
          response_time_minutes?: number | null
          resolution_time_minutes?: number | null
          images?: string[] | null
          priority_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          contract_id: string | null
          quote_id: string | null
          user_id: string
          service_provider_id: string
          invoice_number: string
          amount: number
          tax_amount: number
          total_amount: number
          currency: string
          status: string
          due_date: string
          paid_date: string | null
          description: string | null
          line_items: Json | null
          payment_method: string | null
          payment_reference: string | null
          notes: string | null
          pdf_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contract_id?: string | null
          quote_id?: string | null
          user_id: string
          service_provider_id: string
          invoice_number: string
          amount: number
          tax_amount?: number
          total_amount: number
          currency?: string
          status?: string
          due_date: string
          paid_date?: string | null
          description?: string | null
          line_items?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          notes?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contract_id?: string | null
          quote_id?: string | null
          user_id?: string
          service_provider_id?: string
          invoice_number?: string
          amount?: number
          tax_amount?: number
          total_amount?: number
          currency?: string
          status?: string
          due_date?: string
          paid_date?: string | null
          description?: string | null
          line_items?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          notes?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          message: string
          message_type: string
          attachments: string[] | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          message: string
          message_type?: string
          attachments?: string[] | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          message?: string
          message_type?: string
          attachments?: string[] | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          category: string | null
          read: boolean
          read_at: string | null
          action_url: string | null
          action_label: string | null
          related_entity_type: string | null
          related_entity_id: string | null
          expires_at: string | null
          priority: number
          sent_email: boolean
          sent_sms: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string
          category?: string | null
          read?: boolean
          read_at?: string | null
          action_url?: string | null
          action_label?: string | null
          related_entity_type?: string | null
          related_entity_id?: string | null
          expires_at?: string | null
          priority?: number
          sent_email?: boolean
          sent_sms?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          category?: string | null
          read?: boolean
          read_at?: string | null
          action_url?: string | null
          action_label?: string | null
          related_entity_type?: string | null
          related_entity_id?: string | null
          expires_at?: string | null
          priority?: number
          sent_email?: boolean
          sent_sms?: boolean
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          invoice_id: string | null
          user_id: string
          service_provider_id: string
          amount: number
          currency: string
          payment_method: string
          payment_status: string
          payment_intent_id: string | null
          transaction_id: string | null
          reference_number: string | null
          payment_date: string | null
          refunded_amount: number
          refund_reason: string | null
          processing_fee: number
          net_amount: number | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_id?: string | null
          user_id: string
          service_provider_id: string
          amount: number
          currency?: string
          payment_method: string
          payment_status?: string
          payment_intent_id?: string | null
          transaction_id?: string | null
          reference_number?: string | null
          payment_date?: string | null
          refunded_amount?: number
          refund_reason?: string | null
          processing_fee?: number
          net_amount?: number | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string | null
          user_id?: string
          service_provider_id?: string
          amount?: number
          currency?: string
          payment_method?: string
          payment_status?: string
          payment_intent_id?: string | null
          transaction_id?: string | null
          reference_number?: string | null
          payment_date?: string | null
          refunded_amount?: number
          refund_reason?: string | null
          processing_fee?: number
          net_amount?: number | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          user_type: string
          avatar_url: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          country: string
          language: string
          timezone: string
          email_notifications: boolean
          sms_notifications: boolean
          is_verified: boolean
          verification_code: string | null
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          user_type: string
          avatar_url?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          language?: string
          timezone?: string
          email_notifications?: boolean
          sms_notifications?: boolean
          is_verified?: boolean
          verification_code?: string | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          user_type?: string
          avatar_url?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          language?: string
          timezone?: string
          email_notifications?: boolean
          sms_notifications?: boolean
          is_verified?: boolean
          verification_code?: string | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          user_id: string
          name: string
          address: string
          city: string
          postal_code: string | null
          latitude: number | null
          longitude: number | null
          property_type: string
          description: string | null
          units_count: number
          total_area: number | null
          year_built: number | null
          property_status: string
          images: string[] | null
          amenities: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          address: string
          city: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          property_type: string
          description?: string | null
          units_count?: number
          total_area?: number | null
          year_built?: number | null
          property_status?: string
          images?: string[] | null
          amenities?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          address?: string
          city?: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          property_type?: string
          description?: string | null
          units_count?: number
          total_area?: number | null
          year_built?: number | null
          property_status?: string
          images?: string[] | null
          amenities?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      property_units: {
        Row: {
          id: string
          property_id: string
          unit_number: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          unit_number?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          unit_number?: string | null
          description?: string | null
          created_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          budget_request_id: string
          service_provider_id: string
          amount: number
          description: string
          materials_cost: number
          labor_cost: number
          travel_cost: number
          estimated_duration: string | null
          estimated_start_date: string | null
          warranty_period: string | null
          terms_and_conditions: string | null
          valid_until: string | null
          status: string
          payment_terms: string
          attachments: string[] | null
          notes: string | null
          viewed_by_client: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          budget_request_id: string
          service_provider_id: string
          amount: number
          description: string
          materials_cost?: number
          labor_cost: number
          travel_cost?: number
          estimated_duration?: string | null
          estimated_start_date?: string | null
          warranty_period?: string | null
          terms_and_conditions?: string | null
          valid_until?: string | null
          status?: string
          payment_terms?: string
          attachments?: string[] | null
          notes?: string | null
          viewed_by_client?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          budget_request_id?: string
          service_provider_id?: string
          amount?: number
          description?: string
          materials_cost?: number
          labor_cost?: number
          travel_cost?: number
          estimated_duration?: string | null
          estimated_start_date?: string | null
          warranty_period?: string | null
          terms_and_conditions?: string | null
          valid_until?: string | null
          status?: string
          payment_terms?: string
          attachments?: string[] | null
          notes?: string | null
          viewed_by_client?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          service_provider_id: string
          user_id: string
          quote_id: string | null
          contract_id: string | null
          rating: number
          comment: string | null
          service_quality: number | null
          punctuality: number | null
          communication: number | null
          value_for_money: number | null
          cleanliness: number | null
          would_recommend: boolean | null
          images: string[] | null
          response_from_provider: string | null
          is_verified: boolean
          helpful_votes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_provider_id: string
          user_id: string
          quote_id?: string | null
          contract_id?: string | null
          rating: number
          comment?: string | null
          service_quality?: number | null
          punctuality?: number | null
          communication?: number | null
          value_for_money?: number | null
          cleanliness?: number | null
          would_recommend?: boolean | null
          images?: string[] | null
          response_from_provider?: string | null
          is_verified?: boolean
          helpful_votes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_provider_id?: string
          user_id?: string
          quote_id?: string | null
          contract_id?: string | null
          rating?: number
          comment?: string | null
          service_quality?: number | null
          punctuality?: number | null
          communication?: number | null
          value_for_money?: number | null
          cleanliness?: number | null
          would_recommend?: boolean | null
          images?: string[] | null
          response_from_provider?: string | null
          is_verified?: boolean
          helpful_votes?: number
          created_at?: string
          updated_at?: string
        }
      }
      service_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          parent_id: string | null
          icon: string | null
          color: string
          is_active: boolean
          sort_order: number
          emergency_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          parent_id?: string | null
          icon?: string | null
          color?: string
          is_active?: boolean
          sort_order?: number
          emergency_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          parent_id?: string | null
          icon?: string | null
          color?: string
          is_active?: boolean
          sort_order?: number
          emergency_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      service_providers: {
        Row: {
          id: string
          user_id: string
          company_name: string
          business_license: string | null
          tax_id: string | null
          description: string | null
          website: string | null
          specialties: string[] | null
          service_categories: string[] | null
          service_area: string[] | null
          service_radius: number
          verified: boolean
          insurance_verified: boolean
          background_check: boolean
          rating_average: number
          rating_count: number
          total_jobs_completed: number
          response_time_hours: number
          availability_schedule: Json | null
          emergency_services: boolean
          min_project_amount: number
          travel_cost_per_km: number
          base_hourly_rate: number | null
          portfolio_images: string[] | null
          certifications: string[] | null
          languages: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          business_license?: string | null
          tax_id?: string | null
          description?: string | null
          website?: string | null
          specialties?: string[] | null
          service_categories?: string[] | null
          service_area?: string[] | null
          service_radius?: number
          verified?: boolean
          insurance_verified?: boolean
          background_check?: boolean
          rating_average?: number
          rating_count?: number
          total_jobs_completed?: number
          response_time_hours?: number
          availability_schedule?: Json | null
          emergency_services?: boolean
          min_project_amount?: number
          travel_cost_per_km?: number
          base_hourly_rate?: number | null
          portfolio_images?: string[] | null
          certifications?: string[] | null
          languages?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          business_license?: string | null
          tax_id?: string | null
          description?: string | null
          website?: string | null
          specialties?: string[] | null
          service_categories?: string[] | null
          service_area?: string[] | null
          service_radius?: number
          verified?: boolean
          insurance_verified?: boolean
          background_check?: boolean
          rating_average?: number
          rating_count?: number
          total_jobs_completed?: number
          response_time_hours?: number
          availability_schedule?: Json | null
          emergency_services?: boolean
          min_project_amount?: number
          travel_cost_per_km?: number
          base_hourly_rate?: number | null
          portfolio_images?: string[] | null
          certifications?: string[] | null
          languages?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          is_active?: boolean
        }
      }
      work_sessions: {
        Row: {
          id: string
          contract_id: string
          service_provider_id: string
          start_time: string
          end_time: string | null
          duration_minutes: number | null
          description: string | null
          work_performed: string | null
          materials_used: Json | null
          images: string[] | null
          location_lat: number | null
          location_lng: number | null
          client_approved: boolean
          client_notes: string | null
          hourly_rate: number | null
          total_cost: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contract_id: string
          service_provider_id: string
          start_time: string
          end_time?: string | null
          duration_minutes?: number | null
          description?: string | null
          work_performed?: string | null
          materials_used?: Json | null
          images?: string[] | null
          location_lat?: number | null
          location_lng?: number | null
          client_approved?: boolean
          client_notes?: string | null
          hourly_rate?: number | null
          total_cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contract_id?: string
          service_provider_id?: string
          start_time?: string
          end_time?: string | null
          duration_minutes?: number | null
          description?: string | null
          work_performed?: string | null
          materials_used?: Json | null
          images?: string[] | null
          location_lat?: number | null
          location_lng?: number | null
          client_approved?: boolean
          client_notes?: string | null
          hourly_rate?: number | null
          total_cost?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_roles: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Exported type aliases for easier usage
export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
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
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never