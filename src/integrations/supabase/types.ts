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
          country: string | null
          language: string | null
          timezone: string | null
          email_notifications: boolean | null
          sms_notifications: boolean | null
          is_verified: boolean | null
          verification_code: string | null
          last_login: string | null
          created_at: string | null
          updated_at: string | null
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
          country?: string | null
          language?: string | null
          timezone?: string | null
          email_notifications?: boolean | null
          sms_notifications?: boolean | null
          is_verified?: boolean | null
          verification_code?: string | null
          last_login?: string | null
          created_at?: string | null
          updated_at?: string | null
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
          country?: string | null
          language?: string | null
          timezone?: string | null
          email_notifications?: boolean | null
          sms_notifications?: boolean | null
          is_verified?: boolean | null
          verification_code?: string | null
          last_login?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
          units_count: number | null
          total_area: number | null
          year_built: number | null
          property_status: string | null
          images: string[] | null
          amenities: string[] | null
          created_at: string | null
          updated_at: string | null
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
          units_count?: number | null
          total_area?: number | null
          year_built?: number | null
          property_status?: string | null
          images?: string[] | null
          amenities?: string[] | null
          created_at?: string | null
          updated_at?: string | null
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
          units_count?: number | null
          total_area?: number | null
          year_built?: number | null
          property_status?: string | null
          images?: string[] | null
          amenities?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      service_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          parent_id: string | null
          icon: string | null
          color: string | null
          is_active: boolean | null
          sort_order: number | null
          emergency_available: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          parent_id?: string | null
          icon?: string | null
          color?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          emergency_available?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          parent_id?: string | null
          icon?: string | null
          color?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          emergency_available?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      budget_requests: {
        Row: {
          id: string
          user_id: string
          property_id: string | null
          service_category_id: string | null
          title: string
          description: string
          category: string
          urgency: string | null
          status: string | null
          budget_range_min: number | null
          budget_range_max: number | null
          preferred_date: string | null
          deadline_date: string | null
          work_location: string | null
          special_requirements: string | null
          images: string[] | null
          documents: string[] | null
          quotes_count: number | null
          views_count: number | null
          published_at: string | null
          expires_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          property_id?: string | null
          service_category_id?: string | null
          title: string
          description: string
          category: string
          urgency?: string | null
          status?: string | null
          budget_range_min?: number | null
          budget_range_max?: number | null
          preferred_date?: string | null
          deadline_date?: string | null
          work_location?: string | null
          special_requirements?: string | null
          images?: string[] | null
          documents?: string[] | null
          quotes_count?: number | null
          views_count?: number | null
          published_at?: string | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string | null
          service_category_id?: string | null
          title?: string
          description?: string
          category?: string
          urgency?: string | null
          status?: string | null
          budget_range_min?: number | null
          budget_range_max?: number | null
          preferred_date?: string | null
          deadline_date?: string | null
          work_location?: string | null
          special_requirements?: string | null
          images?: string[] | null
          documents?: string[] | null
          quotes_count?: number | null
          views_count?: number | null
          published_at?: string | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_requests_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
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
          }
        ]
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
          service_radius: number | null
          verified: boolean | null
          insurance_verified: boolean | null
          background_check: boolean | null
          rating_average: number | null
          rating_count: number | null
          total_jobs_completed: number | null
          response_time_hours: number | null
          availability_schedule: Json | null
          emergency_services: boolean | null
          min_project_amount: number | null
          travel_cost_per_km: number | null
          base_hourly_rate: number | null
          portfolio_images: string[] | null
          certifications: string[] | null
          languages: string[] | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
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
          service_radius?: number | null
          verified?: boolean | null
          insurance_verified?: boolean | null
          background_check?: boolean | null
          rating_average?: number | null
          rating_count?: number | null
          total_jobs_completed?: number | null
          response_time_hours?: number | null
          availability_schedule?: Json | null
          emergency_services?: boolean | null
          min_project_amount?: number | null
          travel_cost_per_km?: number | null
          base_hourly_rate?: number | null
          portfolio_images?: string[] | null
          certifications?: string[] | null
          languages?: string[] | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
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
          service_radius?: number | null
          verified?: boolean | null
          insurance_verified?: boolean | null
          background_check?: boolean | null
          rating_average?: number | null
          rating_count?: number | null
          total_jobs_completed?: number | null
          response_time_hours?: number | null
          availability_schedule?: Json | null
          emergency_services?: boolean | null
          min_project_amount?: number | null
          travel_cost_per_km?: number | null
          base_hourly_rate?: number | null
          portfolio_images?: string[] | null
          certifications?: string[] | null
          languages?: string[] | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      quotes: {
        Row: {
          id: string
          budget_request_id: string
          service_provider_id: string
          amount: number
          description: string
          materials_cost: number | null
          labor_cost: number
          travel_cost: number | null
          estimated_duration: string | null
          estimated_start_date: string | null
          warranty_period: string | null
          terms_and_conditions: string | null
          valid_until: string | null
          status: string | null
          payment_terms: string | null
          attachments: string[] | null
          notes: string | null
          viewed_by_client: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          budget_request_id: string
          service_provider_id: string
          amount: number
          description: string
          materials_cost?: number | null
          labor_cost: number
          travel_cost?: number | null
          estimated_duration?: string | null
          estimated_start_date?: string | null
          warranty_period?: string | null
          terms_and_conditions?: string | null
          valid_until?: string | null
          status?: string | null
          payment_terms?: string | null
          attachments?: string[] | null
          notes?: string | null
          viewed_by_client?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          budget_request_id?: string
          service_provider_id?: string
          amount?: number
          description?: string
          materials_cost?: number | null
          labor_cost?: number
          travel_cost?: number | null
          estimated_duration?: string | null
          estimated_start_date?: string | null
          warranty_period?: string | null
          terms_and_conditions?: string | null
          valid_until?: string | null
          status?: string | null
          payment_terms?: string | null
          attachments?: string[] | null
          notes?: string | null
          viewed_by_client?: boolean | null
          created_at?: string | null
          updated_at?: string | null
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
          }
        ]
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
          tax_amount: number | null
          total_amount: number
          currency: string | null
          status: string | null
          due_date: string
          paid_date: string | null
          description: string | null
          line_items: Json | null
          payment_method: string | null
          payment_reference: string | null
          notes: string | null
          pdf_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          contract_id?: string | null
          quote_id?: string | null
          user_id: string
          service_provider_id: string
          invoice_number: string
          amount: number
          tax_amount?: number | null
          total_amount: number
          currency?: string | null
          status?: string | null
          due_date: string
          paid_date?: string | null
          description?: string | null
          line_items?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          notes?: string | null
          pdf_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          contract_id?: string | null
          quote_id?: string | null
          user_id?: string
          service_provider_id?: string
          invoice_number?: string
          amount?: number
          tax_amount?: number | null
          total_amount?: number
          currency?: string | null
          status?: string | null
          due_date?: string
          paid_date?: string | null
          description?: string | null
          line_items?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          notes?: string | null
          pdf_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_service_provider_id_fkey"
            columns: ["service_provider_id"]
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
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
          }
        ]
      }
      payments: {
        Row: {
          id: string
          invoice_id: string | null
          user_id: string
          service_provider_id: string
          amount: number
          currency: string | null
          payment_method: string
          payment_status: string | null
          payment_intent_id: string | null
          transaction_id: string | null
          reference_number: string | null
          payment_date: string | null
          refunded_amount: number | null
          refund_reason: string | null
          processing_fee: number | null
          net_amount: number | null
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          invoice_id?: string | null
          user_id: string
          service_provider_id: string
          amount: number
          currency?: string | null
          payment_method: string
          payment_status?: string | null
          payment_intent_id?: string | null
          transaction_id?: string | null
          reference_number?: string | null
          payment_date?: string | null
          refunded_amount?: number | null
          refund_reason?: string | null
          processing_fee?: number | null
          net_amount?: number | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          invoice_id?: string | null
          user_id?: string
          service_provider_id?: string
          amount?: number
          currency?: string | null
          payment_method?: string
          payment_status?: string | null
          payment_intent_id?: string | null
          transaction_id?: string | null
          reference_number?: string | null
          payment_date?: string | null
          refunded_amount?: number | null
          refund_reason?: string | null
          processing_fee?: number | null
          net_amount?: number | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_service_provider_id_fkey"
            columns: ["service_provider_id"]
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          }
        ]
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
          is_verified: boolean | null
          helpful_votes: number | null
          created_at: string | null
          updated_at: string | null
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
          is_verified?: boolean | null
          helpful_votes?: number | null
          created_at?: string | null
          updated_at?: string | null
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
          is_verified?: boolean | null
          helpful_votes?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
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
          {
            foreignKeyName: "ratings_quote_id_fkey"
            columns: ["quote_id"]
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_contract_id_fkey"
            columns: ["contract_id"]
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          }
        ]
      }
      contracts: {
        Row: {
          id: string
          quote_id: string
          user_id: string
          service_provider_id: string
          contract_number: string
          status: string | null
          start_date: string | null
          end_date: string | null
          completion_date: string | null
          total_amount: number
          payment_schedule: string | null
          terms: string | null
          work_description: string
          deliverables: string[] | null
          milestones: Json | null
          client_signature: string | null
          provider_signature: string | null
          signed_date: string | null
          progress_percentage: number | null
          last_update: string | null
          cancellation_reason: string | null
          dispute_reason: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          quote_id: string
          user_id: string
          service_provider_id: string
          contract_number: string
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          completion_date?: string | null
          total_amount: number
          payment_schedule?: string | null
          terms?: string | null
          work_description: string
          deliverables?: string[] | null
          milestones?: Json | null
          client_signature?: string | null
          provider_signature?: string | null
          signed_date?: string | null
          progress_percentage?: number | null
          last_update?: string | null
          cancellation_reason?: string | null
          dispute_reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          quote_id?: string
          user_id?: string
          service_provider_id?: string
          contract_number?: string
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          completion_date?: string | null
          total_amount?: number
          payment_schedule?: string | null
          terms?: string | null
          work_description?: string
          deliverables?: string[] | null
          milestones?: Json | null
          client_signature?: string | null
          provider_signature?: string | null
          signed_date?: string | null
          progress_percentage?: number | null
          last_update?: string | null
          cancellation_reason?: string | null
          dispute_reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_quote_id_fkey"
            columns: ["quote_id"]
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_service_provider_id_fkey"
            columns: ["service_provider_id"]
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          }
        ]
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
          client_approved: boolean | null
          client_notes: string | null
          hourly_rate: number | null
          total_cost: number | null
          created_at: string | null
          updated_at: string | null
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
          client_approved?: boolean | null
          client_notes?: string | null
          hourly_rate?: number | null
          total_cost?: number | null
          created_at?: string | null
          updated_at?: string | null
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
          client_approved?: boolean | null
          client_notes?: string | null
          hourly_rate?: number | null
          total_cost?: number | null
          created_at?: string | null
          updated_at?: string | null
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
          }
        ]
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
          unread_count_user: number | null
          unread_count_provider: number | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
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
          unread_count_user?: number | null
          unread_count_provider?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
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
          unread_count_user?: number | null
          unread_count_provider?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_service_provider_id_fkey"
            columns: ["service_provider_id"]
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_budget_request_id_fkey"
            columns: ["budget_request_id"]
            referencedRelation: "budget_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_quote_id_fkey"
            columns: ["quote_id"]
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_contract_id_fkey"
            columns: ["contract_id"]
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          message: string
          message_type: string | null
          attachments: string[] | null
          is_read: boolean | null
          read_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          message: string
          message_type?: string | null
          attachments?: string[] | null
          is_read?: boolean | null
          read_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          message?: string
          message_type?: string | null
          attachments?: string[] | null
          is_read?: boolean | null
          read_at?: string | null
          created_at?: string | null
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
          }
        ]
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
          is_public: boolean | null
          uploaded_by: string | null
          created_at: string | null
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
          is_public?: boolean | null
          uploaded_by?: string | null
          created_at?: string | null
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
          is_public?: boolean | null
          uploaded_by?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      emergency_requests: {
        Row: {
          id: string
          user_id: string
          property_id: string | null
          service_category_id: string | null
          title: string
          description: string
          urgency_level: string | null
          location_details: string | null
          contact_phone: string
          status: string | null
          assigned_provider_id: string | null
          estimated_cost: number | null
          actual_cost: number | null
          response_time_minutes: number | null
          resolution_time_minutes: number | null
          images: string[] | null
          priority_score: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          property_id?: string | null
          service_category_id?: string | null
          title: string
          description: string
          urgency_level?: string | null
          location_details?: string | null
          contact_phone: string
          status?: string | null
          assigned_provider_id?: string | null
          estimated_cost?: number | null
          actual_cost?: number | null
          response_time_minutes?: number | null
          resolution_time_minutes?: number | null
          images?: string[] | null
          priority_score?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string | null
          service_category_id?: string | null
          title?: string
          description?: string
          urgency_level?: string | null
          location_details?: string | null
          contact_phone?: string
          status?: string | null
          assigned_provider_id?: string | null
          estimated_cost?: number | null
          actual_cost?: number | null
          response_time_minutes?: number | null
          resolution_time_minutes?: number | null
          images?: string[] | null
          priority_score?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_requests_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
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
            foreignKeyName: "emergency_requests_assigned_provider_id_fkey"
            columns: ["assigned_provider_id"]
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string | null
          category: string | null
          read: boolean | null
          read_at: string | null
          action_url: string | null
          action_label: string | null
          related_entity_type: string | null
          related_entity_id: string | null
          expires_at: string | null
          priority: number | null
          sent_email: boolean | null
          sent_sms: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string | null
          category?: string | null
          read?: boolean | null
          read_at?: string | null
          action_url?: string | null
          action_label?: string | null
          related_entity_type?: string | null
          related_entity_id?: string | null
          expires_at?: string | null
          priority?: number | null
          sent_email?: boolean | null
          sent_sms?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string | null
          category?: string | null
          read?: boolean | null
          read_at?: string | null
          action_url?: string | null
          action_label?: string | null
          related_entity_type?: string | null
          related_entity_id?: string | null
          expires_at?: string | null
          priority?: number | null
          sent_email?: boolean | null
          sent_sms?: boolean | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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

// Helper types for easy use throughout the application
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

export type Property = Database["public"]["Tables"]["properties"]["Row"]
export type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"]
export type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"]

export type ServiceCategory = Database["public"]["Tables"]["service_categories"]["Row"]
export type ServiceCategoryInsert = Database["public"]["Tables"]["service_categories"]["Insert"]
export type ServiceCategoryUpdate = Database["public"]["Tables"]["service_categories"]["Update"]

export type BudgetRequest = Database["public"]["Tables"]["budget_requests"]["Row"]
export type BudgetRequestInsert = Database["public"]["Tables"]["budget_requests"]["Insert"]
export type BudgetRequestUpdate = Database["public"]["Tables"]["budget_requests"]["Update"]

export type ServiceProvider = Database["public"]["Tables"]["service_providers"]["Row"]
export type ServiceProviderInsert = Database["public"]["Tables"]["service_providers"]["Insert"]
export type ServiceProviderUpdate = Database["public"]["Tables"]["service_providers"]["Update"]

export type Quote = Database["public"]["Tables"]["quotes"]["Row"]
export type QuoteInsert = Database["public"]["Tables"]["quotes"]["Insert"]
export type QuoteUpdate = Database["public"]["Tables"]["quotes"]["Update"]

export type Invoice = Database["public"]["Tables"]["invoices"]["Row"]
export type InvoiceInsert = Database["public"]["Tables"]["invoices"]["Insert"]
export type InvoiceUpdate = Database["public"]["Tables"]["invoices"]["Update"]

export type Payment = Database["public"]["Tables"]["payments"]["Row"]
export type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"]
export type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"]

export type Rating = Database["public"]["Tables"]["ratings"]["Row"]
export type RatingInsert = Database["public"]["Tables"]["ratings"]["Insert"]
export type RatingUpdate = Database["public"]["Tables"]["ratings"]["Update"]

export type Contract = Database["public"]["Tables"]["contracts"]["Row"]
export type ContractInsert = Database["public"]["Tables"]["contracts"]["Insert"]
export type ContractUpdate = Database["public"]["Tables"]["contracts"]["Update"]

export type WorkSession = Database["public"]["Tables"]["work_sessions"]["Row"]
export type WorkSessionInsert = Database["public"]["Tables"]["work_sessions"]["Insert"]
export type WorkSessionUpdate = Database["public"]["Tables"]["work_sessions"]["Update"]

export type Conversation = Database["public"]["Tables"]["conversations"]["Row"]
export type ConversationInsert = Database["public"]["Tables"]["conversations"]["Insert"]
export type ConversationUpdate = Database["public"]["Tables"]["conversations"]["Update"]

export type Message = Database["public"]["Tables"]["messages"]["Row"]
export type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"]
export type MessageUpdate = Database["public"]["Tables"]["messages"]["Update"]

export type Document = Database["public"]["Tables"]["documents"]["Row"]
export type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"]
export type DocumentUpdate = Database["public"]["Tables"]["documents"]["Update"]

export type EmergencyRequest = Database["public"]["Tables"]["emergency_requests"]["Row"]
export type EmergencyRequestInsert = Database["public"]["Tables"]["emergency_requests"]["Insert"]
export type EmergencyRequestUpdate = Database["public"]["Tables"]["emergency_requests"]["Update"]

export type Notification = Database["public"]["Tables"]["notifications"]["Row"]
export type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"]
export type NotificationUpdate = Database["public"]["Tables"]["notifications"]["Update"]

// Common utility types
export type UserType = "particular" | "community_member" | "service_provider" | "property_administrator"
export type PropertyType = "residential" | "commercial" | "mixed"
export type PropertyStatus = "active" | "inactive" | "maintenance"
export type BudgetRequestCategory = "cleaning" | "plumbing" | "electrical" | "gardening" | "painting" | "maintenance" | "security" | "hvac" | "carpentry" | "emergency" | "other"
export type BudgetRequestUrgency = "low" | "normal" | "high" | "emergency"
export type BudgetRequestStatus = "pending" | "published" | "in_progress" | "completed" | "cancelled" | "expired"
export type QuoteStatus = "pending" | "accepted" | "rejected" | "expired" | "cancelled"
export type ContractStatus = "pending" | "signed" | "active" | "completed" | "cancelled" | "disputed"
export type InvoiceStatus = "pending" | "sent" | "paid" | "overdue" | "cancelled"
export type PaymentMethod = "stripe" | "paypal" | "bank_transfer" | "cash"
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded" | "cancelled"
export type NotificationType = "info" | "success" | "warning" | "error" | "system"
export type NotificationCategory = "budget_request" | "quote" | "contract" | "payment" | "rating" | "message" | "system"
export type EmergencyStatus = "open" | "assigned" | "in_progress" | "resolved" | "cancelled"
export type UrgencyLevel = "high" | "critical"
export type DocumentType = "contract" | "invoice" | "receipt" | "certificate" | "license" | "insurance" | "photo" | "blueprint" | "permit" | "other"
export type MessageType = "text" | "image" | "file" | "system"

// Extended types with joins
export interface BudgetRequestWithDetails extends BudgetRequest {
  property?: Property
  service_category?: ServiceCategory
  user?: Profile
  quotes?: Quote[]
}

export interface QuoteWithDetails extends Quote {
  budget_request?: BudgetRequest
  service_provider?: ServiceProvider
}

export interface ContractWithDetails extends Contract {
  quote?: Quote
  user?: Profile
  service_provider?: ServiceProvider
  work_sessions?: WorkSession[]
}

export interface ServiceProviderWithRatings extends ServiceProvider {
  user?: Profile
  ratings?: Rating[]
}

export interface ConversationWithDetails extends Conversation {
  user?: Profile
  service_provider?: ServiceProvider
  messages?: Message[]
  budget_request?: BudgetRequest
  quote?: Quote
  contract?: Contract
}
