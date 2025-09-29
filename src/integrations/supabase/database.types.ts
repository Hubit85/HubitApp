/* eslint-disable @typescript-eslint/no-empty-object-type */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      administrator_requests: {
        Row: {
          assignment_type: string | null
          community_id: string | null
          community_member_id: string
          created_at: string | null
          id: string
          property_administrator_id: string
          request_message: string | null
          requested_at: string | null
          responded_at: string | null
          responded_by: string | null
          response_message: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          assignment_type?: string | null
          community_id?: string | null
          community_member_id: string
          created_at?: string | null
          id?: string
          property_administrator_id: string
          request_message?: string | null
          requested_at?: string | null
          responded_at?: string | null
          responded_by?: string | null
          response_message?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          assignment_type?: string | null
          community_id?: string | null
          community_member_id?: string
          created_at?: string | null
          id?: string
          property_administrator_id?: string
          request_message?: string | null
          requested_at?: string | null
          responded_at?: string | null
          responded_by?: string | null
          response_message?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "administrator_requests_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "administrator_requests_community_member_id_fkey"
            columns: ["community_member_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "administrator_requests_property_administrator_id_fkey"
            columns: ["property_administrator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "administrator_requests_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
          category?: string
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
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
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
          status?: string
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
        Relationships: []
      }
      community_codes: {
        Row: {
          city: string
          code: string
          country: string
          created_at: string | null
          created_by: string
          id: string
          province: string
          street: string
          street_number: string
          updated_at: string | null
        }
        Insert: {
          city: string
          code: string
          country: string
          created_at?: string | null
          created_by: string
          id?: string
          province: string
          street: string
          street_number: string
          updated_at?: string | null
        }
        Update: {
          city?: string
          code?: string
          country?: string
          created_at?: string | null
          created_by?: string
          id?: string
          province?: string
          street?: string
          street_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
        Relationships: []
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
        Relationships: []
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
          managing_administrator_id: string | null
          photo_urls: string[] | null
          property_admin_id: string | null
          reported_at: string | null
          resolution_notes: string | null
          resolved_at: string | null
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
          managing_administrator_id?: string | null
          photo_urls?: string[] | null
          property_admin_id?: string | null
          reported_at?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          title: string
          updated_at?: string | null
          urgency?: string
          user_id: string
        }
        Update: {
          budget_request_id?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          location?: string | null
          managing_administrator_id?: string | null
          photo_urls?: string[] | null
          property_admin_id?: string | null
          reported_at?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
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
            isOneToOne: false
            referencedRelation: "budget_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_reports_managing_administrator_id_fkey"
            columns: ["managing_administrator_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          admin_notes: string | null
          administrator_id: string | null
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
          administrator_id?: string | null
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
          status?: string
          title: string
          updated_at?: string | null
          urgency?: string
          work_location?: string | null
        }
        Update: {
          admin_notes?: string | null
          administrator_id?: string | null
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
            foreignKeyName: "incidents_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
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
        ]
      }
      managed_communities: {
        Row: {
          community_id: string | null
          community_member_id: string
          created_at: string | null
          established_at: string | null
          established_by: string | null
          id: string
          notes: string | null
          property_administrator_id: string
          relationship_status: string
          updated_at: string | null
        }
        Insert: {
          community_id?: string | null
          community_member_id: string
          created_at?: string | null
          established_at?: string | null
          established_by?: string | null
          id?: string
          notes?: string | null
          property_administrator_id: string
          relationship_status?: string
          updated_at?: string | null
        }
        Update: {
          community_id?: string | null
          community_member_id?: string
          created_at?: string | null
          established_at?: string | null
          established_by?: string | null
          id?: string
          notes?: string | null
          property_administrator_id?: string
          relationship_status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "managed_communities_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "managed_communities_community_member_id_fkey"
            columns: ["community_member_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "managed_communities_established_by_fkey"
            columns: ["established_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "managed_communities_property_administrator_id_fkey"
            columns: ["property_administrator_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
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
        Relationships: []
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
          province: string | null
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
          province?: string | null
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
          province?: string | null
          sms_notifications?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          user_type?: string
          verification_code?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          amenities: string[] | null
          city: string
          community_code: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          latitude: number | null
          longitude: number | null
          name: string
          number: string | null
          postal_code: string | null
          property_photo_url: string | null
          property_status: string | null
          property_type: string
          province: string | null
          street: string | null
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
          community_code?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          name: string
          number?: string | null
          postal_code?: string | null
          property_photo_url?: string | null
          property_status?: string | null
          property_type: string
          province?: string | null
          street?: string | null
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
          community_code?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          number?: string | null
          postal_code?: string | null
          property_photo_url?: string | null
          property_status?: string | null
          property_type?: string
          province?: string | null
          street?: string | null
          total_area?: number | null
          units_count?: number | null
          updated_at?: string | null
          user_id?: string
          year_built?: number | null
        }
        Relationships: []
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
        Relationships: []
      }
      quote_rejections: {
        Row: {
          budget_request_id: string
          created_at: string | null
          id: string
          reason: string
          rejected_at: string
          service_provider_id: string
          updated_at: string | null
        }
        Insert: {
          budget_request_id: string
          created_at?: string | null
          id?: string
          reason: string
          rejected_at?: string
          service_provider_id: string
          updated_at?: string | null
        }
        Update: {
          budget_request_id?: string
          created_at?: string | null
          id?: string
          reason?: string
          rejected_at?: string
          service_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_rejections_budget_request_id_fkey"
            columns: ["budget_request_id"]
            isOneToOne: false
            referencedRelation: "budget_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_rejections_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
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
        Relationships: []
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
        Relationships: []
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
      begin_cross_role_sync: {
        Args: { source_role: string; target_role: string; user_id: string }
        Returns: undefined
      }
      commit_cross_role_sync: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      rollback_cross_role_sync: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      sync_property_budget_history: {
        Args: { property_id: string; source_role: string; target_role: string }
        Returns: undefined
      }
      sync_property_contracts: {
        Args: { property_id: string; source_role: string; target_role: string }
        Returns: undefined
      }
      sync_property_documents: {
        Args: { property_id: string; source_role: string; target_role: string }
        Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
