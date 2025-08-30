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
          title: string
          description: string
          category: string
          status: string | null
          budget_range_min: number | null
          budget_range_max: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          property_id?: string | null
          title: string
          description: string
          category: string
          status?: string | null
          budget_range_min?: number | null
          budget_range_max?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string | null
          title?: string
          description?: string
          category?: string
          status?: string | null
          budget_range_min?: number | null
          budget_range_max?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_requests_property_id_fkey"
            columns: ["property_id"]
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_requests_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
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
          status: string | null
          start_date: string | null
          end_date: string | null
          total_amount: number
          terms: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          quote_id: string
          user_id: string
          service_provider_id: string
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          total_amount: number
          terms?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          quote_id?: string
          user_id?: string
          service_provider_id?: string
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          total_amount?: number
          terms?: string | null
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
            foreignKeyName: "contracts_service_provider_id_fkey"
            columns: ["service_provider_id"]
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
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
          read: boolean | null
          related_entity_type: string | null
          related_entity_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string | null
          read?: boolean | null
          related_entity_type?: string | null
          related_entity_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string | null
          read?: boolean | null
          related_entity_type?: string | null
          related_entity_id?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          user_type: string
          avatar_url: string | null
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
          property_type: string
          description: string | null
          units_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          address: string
          property_type: string
          description?: string | null
          units_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          address?: string
          property_type?: string
          description?: string | null
          units_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
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
          estimated_duration: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          budget_request_id: string
          service_provider_id: string
          amount: number
          description: string
          estimated_duration?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          budget_request_id?: string
          service_provider_id?: string
          amount?: number
          description?: string
          estimated_duration?: string | null
          status?: string | null
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
      ratings: {
        Row: {
          id: string
          service_provider_id: string
          user_id: string
          quote_id: string | null
          rating: number
          comment: string | null
          service_quality: number | null
          punctuality: number | null
          communication: number | null
          value_for_money: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          service_provider_id: string
          user_id: string
          quote_id?: string | null
          rating: number
          comment?: string | null
          service_quality?: number | null
          punctuality?: number | null
          communication?: number | null
          value_for_money?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          service_provider_id?: string
          user_id?: string
          quote_id?: string | null
          rating?: number
          comment?: string | null
          service_quality?: number | null
          punctuality?: number | null
          communication?: number | null
          value_for_money?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
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
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      service_providers: {
        Row: {
          id: string
          user_id: string
          company_name: string
          description: string | null
          specialties: string[] | null
          service_area: string[] | null
          verified: boolean | null
          rating_average: number | null
          rating_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          description?: string | null
          specialties?: string[] | null
          service_area?: string[] | null
          verified?: boolean | null
          rating_average?: number | null
          rating_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          description?: string | null
          specialties?: string[] | null
          service_area?: string[] | null
          verified?: boolean | null
          rating_average?: number | null
          rating_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
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
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Property = Database['public']['Tables']['properties']['Row']
export type PropertyInsert = Database['public']['Tables']['properties']['Insert']
export type PropertyUpdate = Database['public']['Tables']['properties']['Update']

export type BudgetRequest = Database['public']['Tables']['budget_requests']['Row']
export type BudgetRequestInsert = Database['public']['Tables']['budget_requests']['Insert']
export type BudgetRequestUpdate = Database['public']['Tables']['budget_requests']['Update']

export type Quote = Database['public']['Tables']['quotes']['Row']
export type QuoteInsert = Database['public']['Tables']['quotes']['Insert']
export type QuoteUpdate = Database['public']['Tables']['quotes']['Update']

export type Contract = Database['public']['Tables']['contracts']['Row']
export type ContractInsert = Database['public']['Tables']['contracts']['Insert']
export type ContractUpdate = Database['public']['Tables']['contracts']['Update']

export type Rating = Database['public']['Tables']['ratings']['Row']
export type RatingInsert = Database['public']['Tables']['ratings']['Insert']
export type RatingUpdate = Database['public']['Tables']['ratings']['Update']

export type ServiceProvider = Database['public']['Tables']['service_providers']['Row']
export type ServiceProviderInsert = Database['public']['Tables']['service_providers']['Insert']
export type ServiceProviderUpdate = Database['public']['Tables']['service_providers']['Update']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']