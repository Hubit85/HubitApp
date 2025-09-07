
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
          budget_range_max: number | null
          budget_range_min: number | null
          category: "cleaning" | "plumbing" | "electrical" | "gardening" | "painting" | "maintenance" | "security" | "hvac" | "carpentry" | "emergency" | "other"
          created_at: string
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
          quotes_count: number
          service_category_id: string | null
          special_requirements: string | null
          status:
            | "pending"
            | "published"
            | "in_progress"
            | "completed"
            | "cancelled"
            | "expired"
          title: string
          updated_at: string
          urgency: "low" | "normal" | "high" | "emergency"
          user_id: string
          views_count: number
          work_location: string | null
        }
        Insert: {
          budget_range_max?: number | null
          budget_range_min?: number | null
          category?: "cleaning" | "plumbing" | "electrical" | "gardening" | "painting" | "maintenance" | "security" | "hvac" | "carpentry" | "emergency" | "other"
          created_at?: string
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
          quotes_count?: number
          service_category_id?: string | null
          special_requirements?: string | null
          status?:
            | "pending"
            | "published"
            | "in_progress"
            | "completed"
            | "cancelled"
            | "expired"
          title: string
          updated_at?: string
          urgency?: "low" | "normal" | "high" | "emergency"
          user_id: string
          views_count?: number
          work_location?: string | null
        }
        Update: {
          budget_range_max?: number | null
          budget_range_min?: number | null
          category?: "cleaning" | "plumbing" | "electrical" | "gardening" | "painting" | "maintenance" | "security" | "hvac" | "carpentry" | "emergency" | "other"
          created_at?: string
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
          quotes_count?: number
          service_category_id?: string | null
          special_requirements?: string | null
          status?:
            | "pending"
            | "published"
            | "in_progress"
            | "completed"
            | "cancelled"
            | "expired"
          title?: string
          updated_at?: string
          urgency?: "low" | "normal" | "high" | "emergency"
          user_id?: string
          views_count?: number
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
          }
        ]
      }
      communities: {
        Row: {
          address: string
          administrator_id: string
          city: string
          created_at: string
          description: string | null
          id: string
          name: string
          postal_code: string | null
          status: "active" | "inactive"
          updated_at: string
        }
        Insert: {
          address: string
          administrator_id: string
          city: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          postal_code?: string | null
          status?: "active" | "inactive"
          updated_at?: string
        }
        Update: {
          address?: string
          administrator_id?: string
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          postal_code?: string | null
          status?: "active" | "inactive"
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communities_administrator_id_fkey"
            columns: ["administrator_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      contracts: {
        Row: {
          cancellation_reason: string | null
          client_signature: string | null
          completion_date: string | null
          contract_number: string
          created_at: string
          deliverables: string[] | null
          dispute_reason: string | null
          end_date: string | null
          id: string
          last_update: string | null
          milestones: Json | null
          payment_schedule: string
          progress_percentage: number
          provider_signature: string | null
          quote_id: string
          service_provider_id: string
          signed_date: string | null
          start_date: string | null
          status:
            | "pending"
            | "signed"
            | "active"
            | "completed"
            | "cancelled"
            | "disputed"
          terms: string | null
          total_amount: number
          updated_at: string
          user_id: string
          work_description: string
        }
        Insert: {
          cancellation_reason?: string | null
          client_signature?: string | null
          completion_date?: string | null
          contract_number: string
          created_at?: string
          deliverables?: string[] | null
          dispute_reason?: string | null
          end_date?: string | null
          id?: string
          last_update?: string | null
          milestones?: Json | null
          payment_schedule?: string
          progress_percentage?: number
          provider_signature?: string | null
          quote_id: string
          service_provider_id: string
          signed_date?: string | null
          start_date?: string | null
          status?:
            | "pending"
            | "signed"
            | "active"
            | "completed"
            | "cancelled"
            | "disputed"
          terms?: string | null
          total_amount: number
          updated_at?: string
          user_id: string
          work_description: string
        }
        Update: {
          cancellation_reason?: string | null
          client_signature?: string | null
          completion_date?: string | null
          contract_number?: string
          created_at?: string
          deliverables?: string[] | null
          dispute_reason?: string | null
          end_date?: string | null
          id?: string
          last_update?: string | null
          milestones?: Json | null
          payment_schedule?: string
          progress_percentage?: number
          provider_signature?: string | null
          quote_id?: string
          service_provider_id?: string
          signed_date?: string | null
          start_date?: string | null
          status?:
            | "pending"
            | "signed"
            | "active"
            | "completed"
            | "cancelled"
            | "disputed"
          terms?: string | null
          total_amount?: number
          updated_at?: string
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
          }
        ]
      }
      conversations: {
        Row: {
          budget_request_id: string | null
          contract_id: string | null
          created_at: string
          id: string
          is_active: boolean
          last_message: string | null
          last_message_at: string | null
          quote_id: string | null
          service_provider_id: string
          subject: string | null
          unread_count_provider: number
          unread_count_user: number
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_request_id?: string | null
          contract_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_message?: string | null
          last_message_at?: string | null
          quote_id?: string | null
          service_provider_id: string
          subject?: string | null
          unread_count_provider?: number
          unread_count_user?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_request_id?: string | null
          contract_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_message?: string | null
          last_message_at?: string | null
          quote_id?: string | null
          service_provider_id?: string
          subject?: string | null
          unread_count_provider?: number
          unread_count_user?: number
          updated_at?: string
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
          }
        ]
      }
      documents: {
        Row: {
          created_at: string
          description: string | null
          document_type:
            | "contract"
            | "invoice"
            | "receipt"
            | "certificate"
            | "license"
            | "insurance"
            | "photo"
            | "blueprint"
            | "permit"
            | "other"
          file_path: string
          file_size: number | null
          id: string
          is_public: boolean
          mime_type: string | null
          name: string
          related_entity_id: string
          related_entity_type:
            | "budget_request"
            | "quote"
            | "contract"
            | "invoice"
            | "profile"
            | "property"
          uploaded_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_type:
            | "contract"
            | "invoice"
            | "receipt"
            | "certificate"
            | "license"
            | "insurance"
            | "photo"
            | "blueprint"
            | "permit"
            | "other"
          file_path: string
          file_size?: number | null
          id?: string
          is_public?: boolean
          mime_type?: string | null
          name: string
          related_entity_id: string
          related_entity_type:
            | "budget_request"
            | "quote"
            | "contract"
            | "invoice"
            | "profile"
            | "property"
          uploaded_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_type?:
            | "contract"
            | "invoice"
            | "receipt"
            | "certificate"
            | "license"
            | "insurance"
            | "photo"
            | "blueprint"
            | "permit"
            | "other"
          file_path?: string
          file_size?: number | null
          id?: string
          is_public?: boolean
          mime_type?: string | null
          name?: string
          related_entity_id?: string
          related_entity_type?:
            | "budget_request"
            | "quote"
            | "contract"
            | "invoice"
            | "profile"
            | "property"
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
          }
        ]
      }
      emergency_requests: {
        Row: {
          actual_cost: number | null
          assigned_provider_id: string | null
          contact_phone: string
          created_at: string
          description: string
          estimated_cost: number | null
          id: string
          images: string[] | null
          location_details: string | null
          priority_score: number
          property_id: string | null
          resolution_time_minutes: number | null
          response_time_minutes: number | null
          service_category_id: string | null
          status: "open" | "assigned" | "in_progress" | "resolved" | "cancelled"
          title: string
          updated_at: string
          urgency_level: "high" | "critical"
          user_id: string
        }
        Insert: {
          actual_cost?: number | null
          assigned_provider_id?: string | null
          contact_phone: string
          created_at?: string
          description: string
          estimated_cost?: number | null
          id?: string
          images?: string[] | null
          location_details?: string | null
          priority_score?: number
          property_id?: string | null
          resolution_time_minutes?: number | null
          response_time_minutes?: number | null
          service_category_id?: string | null
          status?: "open" | "assigned" | "in_progress" | "resolved" | "cancelled"
          title: string
          updated_at?: string
          urgency_level?: "high" | "critical"
          user_id: string
        }
        Update: {
          actual_cost?: number | null
          assigned_provider_id?: string | null
          contact_phone?: string
          created_at?: string
          description?: string
          estimated_cost?: number | null
          id?: string
          images?: string[] | null
          location_details?: string | null
          priority_score?: number
          property_id?: string | null
          resolution_time_minutes?: number | null
          response_time_minutes?: number | null
          service_category_id?: string | null
          status?: "open" | "assigned" | "in_progress" | "resolved" | "cancelled"
          title?: string
          updated_at?: string
          urgency_level?: "high" | "critical"
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
          }
        ]
      }
      incidents: {
        Row: {
          admin_notes: string | null
          administrator_id: string
          category: string
          community_id: string
          created_at: string
          description: string
          documents: string[]
          id: string
          images: string[]
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          special_requirements: string | null
          status: "pending" | "under_review" | "approved" | "rejected" | "processed"
          title: string
          updated_at: string
          urgency: "low" | "normal" | "high" | "emergency"
          work_location: string | null
        }
        Insert: {
          admin_notes?: string | null
          administrator_id: string
          category: string
          community_id: string
          created_at?: string
          description: string
          documents?: string[]
          id?: string
          images?: string[]
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          special_requirements?: string | null
          status?: "pending" | "under_review" | "approved" | "rejected" | "processed"
          title: string
          updated_at?: string
          urgency?: "low" | "normal" | "high" | "emergency"
          work_location?: string | null
        }
        Update: {
          admin_notes?: string | null
          administrator_id?: string
          category?: string
          community_id?: string
          created_at?: string
          description?: string
          documents?: string[]
          id?: string
          images?: string[]
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          special_requirements?: string | null
          status?: "pending" | "under_review" | "approved" | "rejected" | "processed"
          title?: string
          updated_at?: string
          urgency?: "low" | "normal" | "high" | "emergency"
          work_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_administrator_id_fkey"
            columns: ["administrator_id"]
            referencedRelation: "users"
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
          }
        ]
      }
      incident_reports: {
        Row: {
          budget_request_id: string | null
          category: string
          created_at: string
          description: string
          id: string
          location: string | null
          photo_urls: string[] | null
          property_admin_id: string | null
          reported_at: string
          resolution_notes: string | null
          resolved_at: string | null
          status: string
          title: string
          updated_at: string
          urgency: string
          user_id: string
        }
        Insert: {
          budget_request_id?: string | null
          category: string
          created_at?: string
          description: string
          id?: string
          location?: string | null
          photo_urls?: string[] | null
          property_admin_id?: string | null
          reported_at?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          title: string
          updated_at?: string
          urgency?: string
          user_id: string
        }
        Update: {
          budget_request_id?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          location?: string | null
          photo_urls?: string[] | null
          property_admin_id?: string | null
          reported_at?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          title?: string
          updated_at?: string
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_reports_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      invoices: {
        Row: {
          amount: number
          contract_id: string | null
          created_at: string
          currency: string
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
          status: "pending" | "sent" | "paid" | "overdue" | "cancelled"
          tax_amount: number
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          contract_id?: string | null
          created_at?: string
          currency?: string
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
          status?: "pending" | "sent" | "paid" | "overdue" | "cancelled"
          tax_amount?: number
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          contract_id?: string | null
          created_at?: string
          currency?: string
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
          status?: "pending" | "sent" | "paid" | "overdue" | "cancelled"
          tax_amount?: number
          total_amount?: number
          updated_at?: string
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
          }
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
          message_type: "text" | "image" | "file" | "system"
          read_at: string | null
          sender_id: string
        }
        Insert: {
          attachments?: string[] | null
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          message_type?: "text" | "image" | "file" | "system"
          read_at?: string | null
          sender_id: string
        }
        Update: {
          attachments?: string[] | null
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          message_type?: "text" | "image" | "file" | "system"
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
          }
        ]
      }
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          category:
            | "budget_request"
            | "quote"
            | "contract"
            | "payment"
            | "rating"
            | "message"
            | "system"
            | "incident"
            | null
          created_at: string
          expires_at: string | null
          id: string
          message: string
          priority: number
          read: boolean
          read_at: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          sent_email: boolean
          sent_sms: boolean
          title: string
          type: "info" | "success" | "warning" | "error" | "system"
          user_id: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          category?:
            | "budget_request"
            | "quote"
            | "contract"
            | "payment"
            | "rating"
            | "message"
            | "system"
            | "incident"
            | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message: string
          priority?: number
          read?: boolean
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          sent_email?: boolean
          sent_sms?: boolean
          title: string
          type?: "info" | "success" | "warning" | "error" | "system"
          user_id: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          category?:
            | "budget_request"
            | "quote"
            | "contract"
            | "payment"
            | "rating"
            | "message"
            | "system"
            | "incident"
            | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string
          priority?: number
          read?: boolean
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          sent_email?: boolean
          sent_sms?: boolean
          title?: string
          type?: "info" | "success" | "warning" | "error" | "system"
          user_id?: string
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
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          invoice_id: string | null
          metadata: Json | null
          net_amount: number | null
          payment_date: string | null
          payment_intent_id: string | null
          payment_method: "stripe" | "paypal" | "bank_transfer" | "cash"
          payment_status:
            | "pending"
            | "processing"
            | "completed"
            | "failed"
            | "refunded"
            | "cancelled"
          processing_fee: number
          reference_number: string | null
          refund_reason: string | null
          refunded_amount: number
          service_provider_id: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          net_amount?: number | null
          payment_date?: string | null
          payment_intent_id?: string | null
          payment_method: "stripe" | "paypal" | "bank_transfer" | "cash"
          payment_status?:
            | "pending"
            | "processing"
            | "completed"
            | "failed"
            | "refunded"
            | "cancelled"
          processing_fee?: number
          reference_number?: string | null
          refund_reason?: string | null
          refunded_amount?: number
          service_provider_id: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          net_amount?: number | null
          payment_date?: string | null
          payment_intent_id?: string | null
          payment_method?: "stripe" | "paypal" | "bank_transfer" | "cash"
          payment_status?:
            | "pending"
            | "processing"
            | "completed"
            | "failed"
            | "refunded"
            | "cancelled"
          processing_fee?: number
          reference_number?: string | null
          refund_reason?: string | null
          refunded_amount?: number
          service_provider_id?: string
          transaction_id?: string | null
          updated_at?: string
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
          }
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
          province: string | null
          sms_notifications: boolean
          timezone: string
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
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
          province?: string | null
          sms_notifications?: boolean
          timezone?: string
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
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
          province?: string | null
          sms_notifications?: boolean
          timezone?: string
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          verification_code?: string | null
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
          address: string
          amenities: string[] | null
          city: string
          community_info: Json | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          is_currently_selected: boolean
          latitude: number | null
          longitude: number | null
          name: string
          postal_code: string
          property_status: "active" | "inactive" | "maintenance" | null
          property_type: string
          size: number | null
          units_count: number | null
          updated_at: string
          user_id: string
          year_built: number | null
        }
        Insert: {
          address: string
          amenities?: string[] | null
          city: string
          community_info?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_currently_selected?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          postal_code: string
          property_status?: "active" | "inactive" | "maintenance" | null
          property_type: string
          size?: number | null
          units_count?: number | null
          updated_at?: string
          user_id: string
          year_built?: number | null
        }
        Update: {
          address?: string
          amenities?: string[] | null
          city?: string
          community_info?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_currently_selected?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          postal_code?: string
          property_status?: "active" | "inactive" | "maintenance" | null
          property_type?: string
          size?: number | null
          units_count?: number | null
          updated_at?: string
          user_id?: string
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      quotes: {
        Row: {
          amount: number
          attachments: string[] | null
          budget_request_id: string
          created_at: string
          description: string
          estimated_duration: string | null
          estimated_start_date: string | null
          estimated_hours: number | null
          id: string
          labor_cost: number
          materials_cost: number
          notes: string | null
          payment_terms: string
          service_provider_id: string
          status: "pending" | "accepted" | "rejected" | "expired" | "cancelled"
          terms_and_conditions: string | null
          updated_at: string
          valid_until: string | null
          viewed_by_client: boolean
          warranty_period: string | null
        }
        Insert: {
          amount: number
          attachments?: string[] | null
          budget_request_id: string
          created_at?: string
          description: string
          estimated_duration?: string | null
          estimated_start_date?: string | null
          estimated_hours?: number | null
          id?: string
          labor_cost?: number
          materials_cost?: number
          notes?: string | null
          payment_terms?: string
          service_provider_id: string
          status?: "pending" | "accepted" | "rejected" | "expired" | "cancelled"
          terms_and_conditions?: string | null
          updated_at?: string
          valid_until?: string | null
          viewed_by_client?: boolean
          warranty_period?: string | null
        }
        Update: {
          amount?: number
          attachments?: string[] | null
          budget_request_id?: string
          created_at?: string
          description?: string
          estimated_duration?: string | null
          estimated_start_date?: string | null
          estimated_hours?: number | null
          id?: string
          labor_cost?: number
          materials_cost?: number
          notes?: string | null
          payment_terms?: string
          service_provider_id?: string
          status?: "pending" | "accepted" | "rejected" | "expired" | "cancelled"
          terms_and_conditions?: string | null
          updated_at?: string
          valid_until?: string | null
          viewed_by_client?: boolean
          warranty_period?: string | null
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
      ratings: {
        Row: {
          cleanliness: number | null
          comment: string | null
          communication: number | null
          contract_id: string | null
          created_at: string
          helpful_votes: number
          id: string
          images: string[] | null
          is_verified: boolean
          punctuality: number | null
          quote_id: string | null
          rating: number
          response_from_provider: string | null
          service_provider_id: string
          service_quality: number | null
          updated_at: string
          user_id: string
          value_for_money: number | null
          would_recommend: boolean | null
        }
        Insert: {
          cleanliness?: number | null
          comment?: string | null
          communication?: number | null
          contract_id?: string | null
          created_at?: string
          helpful_votes?: number
          id?: string
          images?: string[] | null
          is_verified?: boolean
          punctuality?: number | null
          quote_id?: string | null
          rating: number
          response_from_provider?: string | null
          service_provider_id: string
          service_quality?: number | null
          updated_at?: string
          user_id: string
          value_for_money?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          cleanliness?: number | null
          comment?: string | null
          communication?: number | null
          contract_id?: string | null
          created_at?: string
          helpful_votes?: number
          id?: string
          images?: string[] | null
          is_verified?: boolean
          punctuality?: number | null
          quote_id?: string | null
          rating?: number
          response_from_provider?: string | null
          service_provider_id?: string
          service_quality?: number | null
          updated_at?: string
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
          }
        ]
      }
      service_categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          emergency_available: boolean
          icon: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          emergency_available?: boolean
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          emergency_available?: boolean
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
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
      service_providers: {
        Row: {
          availability_schedule: Json | null
          background_check: boolean
          base_hourly_rate: number | null
          business_license: string | null
          certifications: string[] | null
          company_name: string
          created_at: string
          description: string | null
          emergency_services: boolean
          id: string
          insurance_verified: boolean
          is_active: boolean
          languages: string[] | null
          min_project_amount: number
          portfolio_images: string[] | null
          rating_average: number
          rating_count: number
          response_time_hours: number
          service_area: string[] | null
          service_categories: string[] | null
          service_radius: number
          specialties: string[] | null
          tax_id: string | null
          total_jobs_completed: number
          travel_cost_per_km: number
          updated_at: string
          user_id: string
          verified: boolean
          website: string | null
        }
        Insert: {
          availability_schedule?: Json | null
          background_check?: boolean
          base_hourly_rate?: number | null
          business_license?: string | null
          certifications?: string[] | null
          company_name: string
          created_at?: string
          description?: string | null
          emergency_services?: boolean
          id?: string
          insurance_verified?: boolean
          is_active?: boolean
          languages?: string[] | null
          min_project_amount?: number
          portfolio_images?: string[] | null
          rating_average?: number
          rating_count?: number
          response_time_hours?: number
          service_area?: string[] | null
          service_categories?: string[] | null
          service_radius?: number
          specialties?: string[] | null
          tax_id?: string | null
          total_jobs_completed?: number
          travel_cost_per_km?: number
          updated_at?: string
          user_id: string
          verified?: boolean
          website?: string | null
        }
        Update: {
          availability_schedule?: Json | null
          background_check?: boolean
          base_hourly_rate?: number | null
          business_license?: string | null
          certifications?: string[] | null
          company_name?: string
          created_at?: string
          description?: string | null
          emergency_services?: boolean
          id?: string
          insurance_verified?: boolean
          is_active?: boolean
          languages?: string[] | null
          min_project_amount?: number
          portfolio_images?: string[] | null
          rating_average?: number
          rating_count?: number
          response_time_hours?: number
          service_area?: string[] | null
          service_categories?: string[] | null
          service_radius?: number
          specialties?: string[] | null
          tax_id?: string | null
          total_jobs_completed?: number
          travel_cost_per_km?: number
          updated_at?: string
          user_id?: string
          verified?: boolean
          website?: string | null
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_verified: boolean
          role_specific_data: Json | null
          role_type: 
            | "particular"
            | "community_member"
            | "service_provider"
            | "property_administrator"
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
          role_type: 
            | "particular"
            | "community_member"
            | "service_provider"
            | "property_administrator"
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
          role_type?: 
            | "particular"
            | "community_member"
            | "service_provider"
            | "property_administrator"
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      begin_cross_role_sync: {
        Args: {
          user_id: string
          source_role: string
          target_role: string
        }
        Returns: undefined
      }
      commit_cross_role_sync: {
        Args: Record<string, unknown>
        Returns: undefined
      }
      increment_quotes_count: {
        Args: {
          budget_request_id: string
        }
        Returns: undefined
      }
      rollback_cross_role_sync: {
        Args: Record<string, unknown>
        Returns: undefined
      }
      sync_property_budget_history: {
        Args: {
          property_id: string
          source_role: string
          target_role: string
        }
        Returns: undefined
      }
      sync_property_contracts: {
        Args: {
          property_id: string
          source_role: string
          target_role: string
        }
        Returns: undefined
      }
      sync_property_documents: {
        Args: {
          property_id: string
          source_role: string
          target_role: string
        }
        Returns: undefined
      }
    }
    Enums: {
      budget_request_category:
        | "cleaning"
        | "plumbing"
        | "electrical"
        | "gardening"
        | "painting"
        | "maintenance"
        | "security"
        | "hvac"
        | "carpentry"
        | "emergency"
        | "other"
      budget_request_status:
        | "pending"
        | "published"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "expired"
      budget_request_urgency: "low" | "normal" | "high" | "emergency"
      community_status: "active" | "inactive"
      contract_status:
        | "pending"
        | "signed"
        | "active"
        | "completed"
        | "cancelled"
        | "disputed"
      document_related_entity_type:
        | "budget_request"
        | "quote"
        | "contract"
        | "invoice"
        | "profile"
        | "property"
      document_type:
        | "contract"
        | "invoice"
        | "receipt"
        | "certificate"
        | "license"
        | "insurance"
        | "photo"
        | "blueprint"
        | "permit"
        | "other"
      emergency_request_status:
        | "open"
        | "assigned"
        | "in_progress"
        | "resolved"
        | "cancelled"
      emergency_request_urgency_level: "high" | "critical"
      incident_status: "pending" | "under_review" | "approved" | "rejected" | "processed"
      incident_urgency: "low" | "normal" | "high" | "emergency"
      invoice_status: "pending" | "sent" | "paid" | "overdue" | "cancelled"
      message_type: "text" | "image" | "file" | "system"
      notification_category:
        | "budget_request"
        | "quote"
        | "contract"
        | "payment"
        | "rating"
        | "message"
        | "system"
        | "incident"
      notification_type: "info" | "success" | "warning" | "error" | "system"
      payment_method: "stripe" | "paypal" | "bank_transfer" | "cash"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
        | "cancelled"
      property_status: "active" | "inactive" | "maintenance"
      property_type: "residential" | "commercial" | "industrial" | "land"
      quote_status: "pending" | "accepted" | "rejected" | "expired" | "cancelled"
      role_type:
        | "particular"
        | "community_member"
        | "service_provider"
        | "property_administrator"
      user_type:
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

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];

// Custom exports for convenience
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];
export type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"];

export type ServiceCategory = Database["public"]["Tables"]["service_categories"]["Row"];
export type ServiceCategoryInsert = Database["public"]["Tables"]["service_categories"]["Insert"];
export type ServiceCategoryUpdate = Database["public"]["Tables"]["service_categories"]["Update"];

export type BudgetRequest = Database["public"]["Tables"]["budget_requests"]["Row"];
export type BudgetRequestInsert = Database["public"]["Tables"]["budget_requests"]["Insert"];
export type BudgetRequestUpdate = Database["public"]["Tables"]["budget_requests"]["Update"];

export type ServiceProvider = Database["public"]["Tables"]["service_providers"]["Row"];
export type ServiceProviderInsert = Database["public"]["Tables"]["service_providers"]["Insert"];
export type ServiceProviderUpdate = Database["public"]["Tables"]["service_providers"]["Update"];

export type Quote = Database["public"]["Tables"]["quotes"]["Row"];
export type QuoteInsert = Database["public"]["Tables"]["quotes"]["Insert"];
export type QuoteUpdate = Database["public"]["Tables"]["quotes"]["Update"];

export type Contract = Database["public"]["Tables"]["contracts"]["Row"];
export type ContractInsert = Database["public"]["Tables"]["contracts"]["Insert"];
export type ContractUpdate = Database["public"]["Tables"]["contracts"]["Update"];

export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type InvoiceInsert = Database["public"]["Tables"]["invoices"]["Insert"];
export type InvoiceUpdate = Database["public"]["Tables"]["invoices"]["Update"];

export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];
export type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"];

export type Rating = Database["public"]["Tables"]["ratings"]["Row"];
export type RatingInsert = Database["public"]["Tables"]["ratings"]["Insert"];
export type RatingUpdate = Database["public"]["Tables"]["ratings"]["Update"];

export type WorkSession = Database["public"]["Tables"]["work_sessions"]["Row"];
export type WorkSessionInsert = Database["public"]["Tables"]["work_sessions"]["Insert"];
export type WorkSessionUpdate = Database["public"]["Tables"]["work_sessions"]["Update"];

export type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
export type ConversationInsert = Database["public"]["Tables"]["conversations"]["Insert"];
export type ConversationUpdate = Database["public"]["Tables"]["conversations"]["Update"];

export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];
export type MessageUpdate = Database["public"]["Tables"]["messages"]["Update"];

export type Document = Database["public"]["Tables"]["documents"]["Row"];
export type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];
export type DocumentUpdate = Database["public"]["Tables"]["documents"]["Update"];

export type EmergencyRequest = Database["public"]["Tables"]["emergency_requests"]["Row"];
export type EmergencyRequestInsert = Database["public"]["Tables"]["emergency_requests"]["Insert"];
export type EmergencyRequestUpdate = Database["public"]["Tables"]["emergency_requests"]["Update"];

export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"];
export type NotificationUpdate = Database["public"]["Tables"]["notifications"]["Update"];

export type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];
export type UserRoleInsert = Database["public"]["Tables"]["user_roles"]["Insert"];
export type UserRoleUpdate = Database["public"]["Tables"]["user_roles"]["Update"];

export type IncidentReport = Database["public"]["Tables"]["incident_reports"]["Row"];
export type IncidentReportInsert = Database["public"]["Tables"]["incident_reports"]["Insert"];
export type IncidentReportUpdate = Database["public"]["Tables"]["incident_reports"]["Update"];

// New types for incidents and communities
export type Community = Database["public"]["Tables"]["communities"]["Row"];
export type CommunityInsert = Database["public"]["Tables"]["communities"]["Insert"];
export type CommunityUpdate = Database["public"]["Tables"]["communities"]["Update"];

export type Incident = Database["public"]["Tables"]["incidents"]["Row"];
export type IncidentInsert = Database["public"]["Tables"]["incidents"]["Insert"];
export type IncidentUpdate = Database["public"]["Tables"]["incidents"]["Update"];
