
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
          user_type: 'particular' | 'community_member' | 'service_provider' | 'property_administrator'
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          user_type: 'particular' | 'community_member' | 'service_provider' | 'property_administrator'
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          user_type?: 'particular' | 'community_member' | 'service_provider' | 'property_administrator'
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          name: string
          address: string
          property_type: 'apartment' | 'house' | 'commercial' | 'land'
          total_units: number | null
          owner_id: string
          administrator_id: string | null
          community_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          property_type: 'apartment' | 'house' | 'commercial' | 'land'
          total_units?: number | null
          owner_id: string
          administrator_id?: string | null
          community_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          property_type?: 'apartment' | 'house' | 'commercial' | 'land'
          total_units?: number | null
          owner_id?: string
          administrator_id?: string | null
          community_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      communities: {
        Row: {
          id: string
          name: string
          address: string
          total_units: number
          administrator_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          total_units: number
          administrator_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          total_units?: number
          administrator_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      service_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      service_providers: {
        Row: {
          id: string
          user_id: string
          business_name: string
          services: string[]
          service_area: string[]
          rating: number | null
          total_reviews: number
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          services: string[]
          service_area: string[]
          rating?: number | null
          total_reviews?: number
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          services?: string[]
          service_area?: string[]
          rating?: number | null
          total_reviews?: number
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      budget_requests: {
        Row: {
          id: string
          title: string
          description: string
          property_id: string
          requester_id: string
          category_id: string
          budget_range: string | null
          urgency: 'low' | 'medium' | 'high'
          status: 'draft' | 'published' | 'in_review' | 'completed' | 'cancelled'
          images: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          property_id: string
          requester_id: string
          category_id: string
          budget_range?: string | null
          urgency?: 'low' | 'medium' | 'high'
          status?: 'draft' | 'published' | 'in_review' | 'completed' | 'cancelled'
          images?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          property_id?: string
          requester_id?: string
          category_id?: string
          budget_range?: string | null
          urgency?: 'low' | 'medium' | 'high'
          status?: 'draft' | 'published' | 'in_review' | 'completed' | 'cancelled'
          images?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          budget_request_id: string
          provider_id: string
          amount: number
          description: string
          estimated_duration: string | null
          terms_conditions: string | null
          status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          valid_until: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          budget_request_id: string
          provider_id: string
          amount: number
          description: string
          estimated_duration?: string | null
          terms_conditions?: string | null
          status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          valid_until: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          budget_request_id?: string
          provider_id?: string
          amount?: number
          description?: string
          estimated_duration?: string | null
          terms_conditions?: string | null
          status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          valid_until?: string
          created_at?: string
          updated_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          quote_id: string
          client_id: string
          provider_id: string
          amount: number
          status: 'pending' | 'signed' | 'in_progress' | 'completed' | 'cancelled'
          start_date: string | null
          end_date: string | null
          signed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          client_id: string
          provider_id: string
          amount: number
          status?: 'pending' | 'signed' | 'in_progress' | 'completed' | 'cancelled'
          start_date?: string | null
          end_date?: string | null
          signed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote_id?: string
          client_id?: string
          provider_id?: string
          amount?: number
          status?: 'pending' | 'signed' | 'in_progress' | 'completed' | 'cancelled'
          start_date?: string | null
          end_date?: string | null
          signed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          contract_id: string
          amount: number
          payment_method: 'stripe' | 'paypal' | 'bank_transfer'
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id: string | null
          paypal_order_id: string | null
          processed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contract_id: string
          amount: number
          payment_method: 'stripe' | 'paypal' | 'bank_transfer'
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          paypal_order_id?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contract_id?: string
          amount?: number
          payment_method?: 'stripe' | 'paypal' | 'bank_transfer'
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          paypal_order_id?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          contract_id: string
          rater_id: string
          rated_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contract_id: string
          rater_id: string
          rated_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contract_id?: string
          rater_id?: string
          rated_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'warning' | 'error' | 'success'
          read: boolean
          action_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'warning' | 'error' | 'success'
          read?: boolean
          action_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'warning' | 'error' | 'success'
          read?: boolean
          action_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      // Add your views here
    }
    Functions: {
      // Add your functions here
    }
    Enums: {
      user_type: 'particular' | 'community_member' | 'service_provider' | 'property_administrator'
      property_type: 'apartment' | 'house' | 'commercial' | 'land'
      urgency: 'low' | 'medium' | 'high'
      request_status: 'draft' | 'published' | 'in_review' | 'completed' | 'cancelled'
      quote_status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
      contract_status: 'pending' | 'signed' | 'in_progress' | 'completed' | 'cancelled'
      payment_method: 'stripe' | 'paypal' | 'bank_transfer'
      payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
      notification_type: 'info' | 'warning' | 'error' | 'success'
    }
  }
}
