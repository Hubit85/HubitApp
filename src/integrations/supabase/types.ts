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
          created_at: string | null
          deadline_date: string | null
          description: string
          documents: string[] | null
          expires_at: string | null
          id: string
          images: string[] | null
          preferred_date: string | null
          property_id: string | null
          published_at: string | null
          quotes_count: number | null
          service_category_id: string | null
          special_requirements: string | null
          status: string | null
          title: string
          updated_at: string | null
          urgency: string | null
          user_id: string
          views_count: number | null
          work_location: string | null
        }
        Insert: {
          budget_range_max?: number | null
          budget_range_min?: number | null
          category?: string
          created_at?: string | null
          deadline_date?: string | null
          description: string
          documents?: string[] | null
          expires_at?: string | null
          id?: string
          images?: string[] | null
          preferred_date?: string | null
          property_id?: string | null
          published_at?: string | null
          quotes_count?: number | null
          service_category_id?: string | null
          special_requirements?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          urgency?: string | null
          user_id: string
          views_count?: number | null
          work_location?: string | null
        }
        Update: {
          budget_range_max?: number | null
          budget_range_min?: number | null
          category?: string
          created_at?: string | null
          deadline_date?: string | null
          description?: string
          documents?: string[] | null
          expires_at?: string | null
          id?: string
          images?: string[] | null
          preferred_date?: string | null
          property_id?: string | null
          published_at?: string | null
          quotes_count?: number | null
          service_category_id?: string | null
          special_requirements?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          urgency?: string | null
          user_id?: string
          views_count?: number | null
          work_location?: string | null
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
            foreignKeyName: "budget_requests_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
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
      contracts: {
        Row: {
          client_signature: string | null
          completion_date: string | null
          contract_number: string
          created_at: string | null
          cancellation_reason: string | null
          dispute_reason: string | null
          end_date: string | null
          id: string
          last_update: string | null
          milestones: Json | null
          payment_schedule: string | null
          progress_percentage: number | null
          provider_signature: string | null
          quote_id: string
          service_provider_id: string
          signed_date: string | null
          start_date: string | null
          status: string | null
          terms: string | null
          total_amount: number
          updated_at: string | null
          user_id: string
          work_description: string
          deliverables: string[] | null
        }
        Insert: {
          client_signature?: string | null
          completion_date?: string | null
          contract_number: string
          created_at?: string | null
          cancellation_reason?: string | null
          dispute_reason?: string | null
          end_date?: string | null
          id?: string
          last_update?: string | null
          milestones?: Json | null
          payment_schedule?: string | null
          progress_percentage?: number | null
          provider_signature?: string | null
          quote_id: string
          service_provider_id: string
          signed_date?: string | null
          start_date?: string | null
          status?: string | null
          terms?: string | null
          total_amount: number
          updated_at?: string | null
          user_id: string
          work_description: string
          deliverables?: string[] | null
        }
        Update: {
          client_signature?: string | null
          completion_date?: string | null
          contract_number?: string
          created_at?: string | null
          cancellation_reason?: string | null
          dispute_reason?: string | null
          end_date?: string | null
          id?: string
          last_update?: string | null
          milestones?: Json | null
          payment_schedule?: string | null
          progress_percentage?: number | null
          provider_signature?: string | null
          quote_id?: string
          service_provider_id?: string
          signed_date?: string | null
          start_date?: string | null
          status?: string | null
          terms?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
          work_description?: string
          deliverables?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          budget_request_id: string | null
          contract_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_message: string | null
          last_message_at: string | null
          quote_id: string | null
          service_provider_id: string
          subject: string | null
          unread_count_provider: number | null
          unread_count_user: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          budget_request_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_message?: string | null
          last_message_at?: string | null
          quote_id?: string | null
          service_provider_id: string
          subject?: string | null
          unread_count_provider?: number | null
          unread_count_user?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          budget_request_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_message?: string | null
          last_message_at?: string | null
          quote_id?: string | null
          service_provider_id?: string
          subject?: string | null
          unread_count_provider?: number | null
          unread_count_user?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_budget_request_id_fkey"
            columns: ["budget_request_id"]
            isOneToOne: false
            referencedRelation: "budget_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          description: string | null
          document_type: string
          file_path: string
          file_size: number | null
          id: string
          is_public: boolean | null
          mime_type: string | null
          name: string
          related_entity_id: string
          related_entity_type: string
          uploaded_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          document_type: string
          file_path: string
          file_size?: number | null
          id?: string
          is_public?: boolean | null
          mime_type?: string | null
          name: string
          related_entity_id: string
          related_entity_type: string
          uploaded_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          document_type?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_public?: boolean | null
          mime_type?: string | null
          name?: string
          related_entity_id?: string
          related_entity_type?: string
          uploaded_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_requests: {
        Row: {
          actual_cost: number | null
          assigned_provider_id: string | null
          contact_phone: string
          created_at: string | null
          description: string
          estimated_cost: number | null
          id: string
          images: string[] | null
          location_details: string | null
          priority_score: number | null
          property_id: string | null
          resolution_time_minutes: number | null
          response_time_minutes: number | null
          service_category_id: string | null
          status: string | null
          title: string
          updated_at: string | null
          urgency_level: string | null
          user_id: string
        }
        Insert: {
          actual_cost?: number | null
          assigned_provider_id?: string | null
          contact_phone: string
          created_at?: string | null
          description: string
          estimated_cost?: number | null
          id?: string
          images?: string[] | null
          location_details?: string | null
          priority_score?: number | null
          property_id?: string | null
          resolution_time_minutes?: number | null
          response_time_minutes?: number | null
          service_category_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          urgency_level?: string | null
          user_id: string
        }
        Update: {
          actual_cost?: number | null
          assigned_provider_id?: string | null
          contact_phone?: string
          created_at?: string | null
          description?: string
          estimated_cost?: number | null
          id?: string
          images?: string[] | null
          location_details?: string | null
          priority_score?: number | null
          property_id?: string | null
          resolution_time_minutes?: number | null
          response_time_minutes?: number | null
          service_category_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          urgency_level?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_requests_assigned_provider_id_fkey"
            columns: ["assigned_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_requests_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          contract_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          due_date: string
          id: string
          invoice_number: string
          line_items: Json | null
          notes: string | null
          paid_date: string | null
          payment_method: string | null
          payment_reference: string | null
          pdf_url: string | null
          quote_id: string | null
          service_provider_id: string
          status: string | null
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          contract_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          due_date: string
          id?: string
          invoice_number: string
          line_items?: Json | null
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          pdf_url?: string | null
          quote_id?: string | null
          service_provider_id: string
          status?: string | null
          tax_amount?: number | null
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          contract_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          line_items?: Json | null
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          pdf_url?: string | null
          quote_id?: string | null
          service_provider_id?: string
          status?: string | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
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
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          message_type: string | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          attachments?: string[] | null
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          message_type?: string | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          attachments?: string[] | null
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string
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
          action_label: string | null
          action_url: string | null
          category: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          message: string
          priority: number | null
          read: boolean | null
          read_at: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          sent_email: boolean | null
          sent_sms: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          category?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message: string
          priority?: number | null
          read?: boolean | null
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          sent_email?: boolean | null
          sent_sms?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          category?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message?: string
          priority?: number | null
          read?: boolean | null
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          sent_email?: boolean | null
          sent_sms?: boolean | null
          title?: string
          type?: string | null
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
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          invoice_id: string | null
          metadata: Json | null
          net_amount: number | null
          payment_date: string | null
          payment_intent_id: string | null
          payment_method: string
          payment_status: string | null
          processing_fee: number | null
          reference_number: string | null
          refund_reason: string | null
          refunded_amount: number | null
          service_provider_id: string
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          net_amount?: number | null
          payment_date?: string | null
          payment_intent_id?: string | null
          payment_method: string
          payment_status?: string | null
          processing_fee?: number | null
          reference_number?: string | null
          refund_reason?: string | null
          refunded_amount?: number | null
          service_provider_id: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          net_amount?: number | null
          payment_date?: string | null
          payment_intent_id?: string | null
          payment_method?: string
          payment_status?: string | null
          processing_fee?: number | null
          reference_number?: string | null
          refund_reason?: string | null
          refunded_amount?: number | null
          service_provider_id?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
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
          created_at: string | null
          email: string
          email_notifications: boolean | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          language: string | null
          last_login: string | null
          phone: string | null
          postal_code: string | null
          sms_notifications: boolean | null
          timezone: string | null
          updated_at: string | null
          user_type: string
          verification_code: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          email_notifications?: boolean | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          language?: string | null
          last_login?: string | null
          phone?: string | null
          postal_code?: string | null
          sms_notifications?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          user_type: string
          verification_code?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          language?: string | null
          last_login?: string | null
          phone?: string | null
          postal_code?: string | null
          sms_notifications?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          user_type?: string
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
          amenities: string[] | null
          city: string
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          latitude: number | null
          longitude: number | null
          name: string
          postal_code: string | null
          property_status: string | null
          property_type: string
          total_area: number | null
          units_count: number | null
          updated_at: string | null
          user_id: string
          year_built: number | null
        }
        Insert: {
          address: string
          amenities?: string[] | null
          city: string
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          name: string
          postal_code?: string | null
          property_status?: string | null
          property_type: string
          total_area?: number | null
          units_count?: number | null
          updated_at?: string | null
          user_id: string
          year_built?: number | null
        }
        Update: {
          address?: string
          amenities?: string[] | null
          city?: string
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          postal_code?: string | null
          property_status?: string | null
          property_type?: string
          total_area?: number | null
          units_count?: number | null
          updated_at?: string | null
          user_id?: string
          year_built?: number | null
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
          attachments: string[] | null
          budget_request_id: string
          created_at: string | null
          description: string
          estimated_duration: string | null
          estimated_start_date: string | null
          id: string
          labor_cost: number
          materials_cost: number | null
          notes: string | null
          payment_terms: string | null
          service_provider_id: string
          status: string | null
          terms_and_conditions: string | null
          travel_cost: number | null
          updated_at: string | null
          valid_until: string | null
          viewed_by_client: boolean | null
          warranty_period: string | null
        }
        Insert: {
          amount: number
          attachments?: string[] | null
          budget_request_id: string
          created_at?: string | null
          description: string
          estimated_duration?: string | null
          estimated_start_date?: string | null
          id?: string
          labor_cost: number
          materials_cost?: number | null
          notes?: string | null
          payment_terms?: string | null
          service_provider_id: string
          status?: string | null
          terms_and_conditions?: string | null
          travel_cost?: number | null
          updated_at?: string | null
          valid_until?: string | null
          viewed_by_client?: boolean | null
          warranty_period?: string | null
        }
        Update: {
          amount?: number
          attachments?: string[] | null
          budget_request_id?: string
          created_at?: string | null
          description?: string
          estimated_duration?: string | null
          estimated_start_date?: string | null
          id?: string
          labor_cost?: number
          materials_cost?: number | null
          notes?: string | null
          payment_terms?: string | null
          service_provider_id?: string
          status?: string | null
          terms_and_conditions?: string | null
          travel_cost?: number | null
          updated_at?: string | null
          valid_until?: string | null
          viewed_by_client?: boolean | null
          warranty_period?: string | null
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
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          cleanliness: number | null
          comment: string | null
          communication: number | null
          contract_id: string | null
          created_at: string | null
          helpful_votes: number | null
          id: string
          images: string[] | null
          is_verified: boolean | null
          punctuality: number | null
          quote_id: string | null
          rating: number
          response_from_provider: string | null
          service_provider_id: string
          service_quality: number | null
          updated_at: string | null
          user_id: string
          value_for_money: number | null
          would_recommend: boolean | null
        }
        Insert: {
          cleanliness?: number | null
          comment?: string | null
          communication?: number | null
          contract_id?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          punctuality?: number | null
          quote_id?: string | null
          rating: number
          response_from_provider?: string | null
          service_provider_id: string
          service_quality?: number | null
          updated_at?: string | null
          user_id: string
          value_for_money?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          cleanliness?: number | null
          comment?: string | null
          communication?: number | null
          contract_id?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          punctuality?: number | null
          quote_id?: string | null
          rating?: number
          response_from_provider?: string | null
          service_provider_id?: string
          service_quality?: number | null
          updated_at?: string | null
          user_id?: string
          value_for_money?: number | null
          would_recommend?: boolean | null
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
            foreignKeyName: "ratings_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          emergency_available: boolean | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          emergency_available?: boolean | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          emergency_available?: boolean | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
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
          availability_schedule: Json | null
          background_check: boolean | null
          base_hourly_rate: number | null
          business_license: string | null
          certifications: string[] | null
          company_name: string
          created_at: string | null
          description: string | null
          emergency_services: boolean | null
          id: string
          insurance_verified: boolean | null
          is_active: boolean | null
          languages: string[] | null
          min_project_amount: number | null
          portfolio_images: string[] | null
          rating_average: number | null
          rating_count: number | null
          response_time_hours: number | null
          service_area: string[] | null
          service_categories: string[] | null
          service_radius: number | null
          specialties: string[] | null
          tax_id: string | null
          total_jobs_completed: number | null
          travel_cost_per_km: number | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          availability_schedule?: Json | null
          background_check?: boolean | null
          base_hourly_rate?: number | null
          business_license?: string | null
          certifications?: string[] | null
          company_name: string
          created_at?: string | null
          description?: string | null
          emergency_services?: boolean | null
          id?: string
          insurance_verified?: boolean | null
          is_active?: boolean | null
          languages?: string[] | null
          min_project_amount?: number | null
          portfolio_images?: string[] | null
          rating_average?: number | null
          rating_count?: number | null
          response_time_hours?: number | null
          service_area?: string[] | null
          service_categories?: string[] | null
          service_radius?: number | null
          specialties?: string[] | null
          tax_id?: string | null
          total_jobs_completed?: number | null
          travel_cost_per_km?: number | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          availability_schedule?: Json | null
          background_check?: boolean | null
          base_hourly_rate?: number | null
          business_license?: string | null
          certifications?: string[] | null
          company_name?: string
          created_at?: string | null
          description?: string | null
          emergency_services?: boolean | null
          id?: string
          insurance_verified?: boolean | null
          is_active?: boolean | null
          languages?: string[] | null
          min_project_amount?: number | null
          portfolio_images?: string[] | null
          rating_average?: number | null
          rating_count?: number | null
          response_time_hours?: number | null
          service_area?: string[] | null
          service_categories?: string[] | null
          service_radius?: number | null
          specialties?: string[] | null
          tax_id?: string | null
          total_jobs_completed?: number | null
          travel_cost_per_km?: number | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      work_sessions: {
        Row: {
          client_approved: boolean | null
          client_notes: string | null
          contract_id: string
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          end_time: string | null
          hourly_rate: number | null
          id: string
          images: string[] | null
          location_lat: number | null
          location_lng: number | null
          materials_used: Json | null
          service_provider_id: string
          start_time: string
          total_cost: number | null
          updated_at: string | null
          work_performed: string | null
        }
        Insert: {
          client_approved?: boolean | null
          client_notes?: string | null
          contract_id: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          images?: string[] | null
          location_lat?: number | null
          location_lng?: number | null
          materials_used?: Json | null
          service_provider_id: string
          start_time: string
          total_cost?: number | null
          updated_at?: string | null
          work_performed?: string | null
        }
        Update: {
          client_approved?: boolean | null
          client_notes?: string | null
          contract_id?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          images?: string[] | null
          location_lat?: number | null
          location_lng?: number | null
          materials_used?: Json | null
          service_provider_id?: string
          start_time?: string
          total_cost?: number | null
          updated_at?: string | null
          work_performed?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_sessions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_sessions_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: unknown
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
