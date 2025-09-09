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
          incident_id: string | null
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
          category: string
          created_at?: string | null
          deadline_date?: string | null
          description: string
          documents?: string[] | null
          expires_at?: string | null
          id?: string
          images?: string[] | null
          incident_id?: string | null
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
          incident_id?: string | null
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
            foreignKeyName: "budget_requests_incident_id_fkey"
            columns: ["incident_id"]
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_requests_property_id_fkey"
            columns: ["property_id"]
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_requests_service_category_id_fkey"
            columns: ["service_category_id"]
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_requests_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          address: string
          administrator_id: string
          city: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          postal_code: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          address: string
          administrator_id: string
          city: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          postal_code?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          administrator_id?: string
          city?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          postal_code?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communities_administrator_id_fkey"
            columns: ["administrator_id"]
            referencedRelation: "property_administrators"
            referencedColumns: ["id"]
          },
        ]
      }
      community_member_administrators: {
        Row: {
          administrator_verified: boolean | null
          company_cif: string
          company_name: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          administrator_verified?: boolean | null
          company_cif: string
          company_name: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          administrator_verified?: boolean | null
          company_cif?: string
          company_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_member_administrators_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          cancellation_reason: string | null
          client_signature: string | null
          completion_date: string | null
          contract_number: string
          created_at: string | null
          deliverables: string[] | null
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
        }
        Insert: {
          cancellation_reason?: string | null
          client_signature?: string | null
          completion_date?: string | null
          contract_number: string
          created_at?: string | null
          deliverables?: string[] | null
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
        }
        Update: {
          cancellation_reason?: string | null
          client_signature?: string | null
          completion_date?: string | null
          contract_number?: string
          created_at?: string | null
          deliverables?: string[] | null
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
        }
        Relationships: [
          {
            foreignKeyName: "contracts_quote_id_fkey"
            columns: ["quote_id"]
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_service_provider_id_fkey"
            columns: ["service_provider_id"]
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_user_id_fkey"
            columns: ["user_id"]
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
            referencedRelation: "budget_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_contract_id_fkey"
            columns: ["contract_id"]
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_quote_id_fkey"
            columns: ["quote_id"]
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_service_provider_id_fkey"
            columns: ["service_provider_id"]
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
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
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_requests_property_id_fkey"
            columns: ["property_id"]
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_requests_service_category_id_fkey"
            columns: ["service_category_id"]
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_requests_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_reports: {
        Row: {
          budget_request_id: string | null
          category: string
          created_at: string | null
          description: string
          id: string
          location: string | null
          photo_urls: string[] | null
          property_admin_id: string | null
          reported_at: string | null
          resolved_at: string | null
          resolution_notes: string | null
          status: string
          title: string
          updated_at: string | null
          urgency: string
          user_id: string
        }
        Insert: {
          budget_request_id?: string | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          location?: string | null
          photo_urls?: string[] | null
          property_admin_id?: string | null
          reported_at?: string | null
          resolved_at?: string | null
          resolution_notes?: string | null
          status: string
          title: string
          updated_at?: string | null
          urgency: string
          user_id: string
        }
        Update: {
          budget_request_id?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          location?: string | null
          photo_urls?: string[] | null
          property_admin_id?: string | null
          reported_at?: string | null
          resolved_at?: string | null
          resolution_notes?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          urgency?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "incident_reports_budget_request_id_fkey"
            columns: ["budget_request_id"]
            referencedRelation: "budget_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_reports_property_admin_id_fkey"
            columns: ["property_admin_id"]
            referencedRelation: "property_administrators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_reports_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          admin_notes: string | null
          administrator_id: string
          category: string
          community_id: string
          created_at: string | null
          description: string
          documents: string[] | null
          id: string
          images: string[] | null
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          special_requirements: string | null
          status: string
          title: string
          updated_at: string | null
          urgency: string
          work_location: string | null
        }
        Insert: {
          admin_notes?: string | null
          administrator_id: string
          category: string
          community_id: string
          created_at?: string | null
          description: string
          documents?: string[] | null
          id?: string
          images?: string[] | null
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          special_requirements?: string | null
          status: string
          title: string
          updated_at?: string | null
          urgency: string
          work_location?: string | null
        }
        Update: {
          admin_notes?: string | null
          administrator_id?: string
          category?: string
          community_id?: string
          created_at?: string | null
          description?: string
          documents?: string[] | null
          id?: string
          images?: string[] | null
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          special_requirements?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          urgency?: string
          work_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_administrator_id_fkey"
            columns: ["administrator_id"]
            referencedRelation: "property_administrators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_reporter_id_fkey"
            columns: ["reporter_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_reviewed_by_fkey"
            columns: ["reviewed_by"]
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
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quote_id_fkey"
            columns: ["quote_id"]
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_service_provider_id_fkey"
            columns: ["service_provider_id"]
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
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
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
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
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_service_provider_id_fkey"
            columns: ["service_provider_id"]
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      property_administrators: {
        Row: {
          company_cif: string
          company_name: string
          contact_email: string
          contact_phone: string | null
          created_at: string | null
          id: string
          license_number: string | null
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_cif: string
          company_name: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          license_number?: string | null
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_cif?: string
          company_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          license_number?: string | null
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_administrators_user_id_fkey"
            columns: ["user_id"]
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
        }
        Relationships: [
          {
            foreignKeyName: "quotes_budget_request_id_fkey"
            columns: ["budget_request_id"]
            referencedRelation: "budget_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_service_provider_id_fkey"
            columns: ["service_provider_id"]
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
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_quote_id_fkey"
            columns: ["quote_id"]
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_service_provider_id_fkey"
            columns: ["service_provider_id"]
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_user_id_fkey"
            columns: ["user_id"]
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          role_specific_data: Json | null
          role_type: string
          updated_at: string | null
          user_id: string
          verification_confirmed_at: string | null
          verification_expires_at: string | null
          verification_token: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          role_specific_data?: Json | null
          role_type: string
          updated_at?: string | null
          user_id: string
          verification_confirmed_at?: string | null
          verification_expires_at?: string | null
          verification_token?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          role_specific_data?: Json | null
          role_type?: string
          updated_at?: string | null
          user_id?: string
          verification_confirmed_at?: string | null
          verification_expires_at?: string | null
          verification_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
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
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_sessions_service_provider_id_fkey"
            columns: ["service_provider_id"]
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]
export type Functions<T extends keyof Database["public"]["Functions"]> =
  Database["public"]["Functions"][T]

export type BudgetRequest = Tables<'budget_requests'>;
export type BudgetRequestInsert = Database["public"]["Tables"]["budget_requests"]["Insert"];
export type BudgetRequestUpdate = Database["public"]["Tables"]["budget_requests"]["Update"];

export type Community = Tables<'communities'>;
export type CommunityMemberAdministrator = Tables<'community_member_administrators'>;

export type Contract = Tables<'contracts'>;
export type ContractInsert = Database["public"]["Tables"]["contracts"]["Insert"];
export type ContractUpdate = Database["public"]["Tables"]["contracts"]["Update"];

export type Conversation = Tables<'conversations'>;
export type ConversationInsert = Database["public"]["Tables"]["conversations"]["Insert"];
export type ConversationUpdate = Database["public"]["Tables"]["conversations"]["Update"];

export type Document = Tables<'documents'>;
export type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];
export type DocumentUpdate = Database["public"]["Tables"]["documents"]["Update"];

export type Incident = Tables<'incidents'>;
export type IncidentInsert = Database["public"]["Tables"]["incidents"]["Insert"];
export type IncidentUpdate = Database["public"]["Tables"]["incidents"]["Update"];

export type Message = Tables<'messages'>;
export type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];
export type MessageUpdate = Database["public"]["Tables"]["messages"]["Update"];

export type Notification = Tables<'notifications'>;
export type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"];
export type NotificationUpdate = Database["public"]["Tables"]["notifications"]["Update"];

export type Profile = Tables<'profiles'>;
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Property = Tables<'properties'>;
export type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];
export type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"];

export type Quote = Tables<'quotes'>;
export type QuoteInsert = Database["public"]["Tables"]["quotes"]["Insert"];
export type QuoteUpdate = Database["public"]["Tables"]["quotes"]["Update"];

export type Rating = Tables<'ratings'>;
export type RatingInsert = Database["public"]["Tables"]["ratings"]["Insert"];
export type RatingUpdate = Database["public"]["Tables"]["ratings"]["Update"];

export type ServiceCategory = Tables<'service_categories'>;
export type ServiceCategoryInsert = Database["public"]["Tables"]["service_categories"]["Insert"];
export type ServiceCategoryUpdate = Database["public"]["Tables"]["service_categories"]["Update"];

export type ServiceProvider = Tables<'service_providers'>;
export type ServiceProviderInsert = Database["public"]["Tables"]["service_providers"]["Insert"];
export type ServiceProviderUpdate = Database["public"]["Tables"]["service_providers"]["Update"];

export type UserRole = {
  id: string
  user_id: string
  role_type: 'particular' | 'community_member' | 'service_provider' | 'property_administrator'
  is_verified: boolean | null
  is_active: boolean | null
  role_specific_data: Json | null
  verification_token: string | null
  verification_expires_at: string | null
  verification_confirmed_at: string | null
  created_at: string | null
  updated_at: string | null
}

export type UserRoleInsert = {
  id?: string
  user_id: string
  role_type: 'particular' | 'community_member' | 'service_provider' | 'property_administrator'
  is_verified?: boolean | null
  is_active?: boolean | null
  role_specific_data?: Json | null
  verification_token?: string | null
  verification_expires_at?: string | null
  verification_confirmed_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type UserRoleUpdate = {
  id?: string
  user_id?: string
  role_type?: 'particular' | 'community_member' | 'service_provider' | 'property_administrator'
  is_verified?: boolean | null
  is_active?: boolean | null
  role_specific_data?: Json | null
  verification_token?: string | null
  verification_expires_at?: string | null
  verification_confirmed_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type WorkSession = Tables<'work_sessions'>;
export type WorkSessionInsert = Database["public"]["Tables"]["work_sessions"]["Insert"];
export type WorkSessionUpdate = Database["public"]["Tables"]["work_sessions"]["Update"];

