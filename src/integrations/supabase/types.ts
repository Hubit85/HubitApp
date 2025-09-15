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
          property_id: string
          title: string
          description: string
          category: string
          status: string
          urgency: string
          budget_range_min: number | null
          budget_range_max: number | null
          deadline_date: string | null
          preferred_date: string | null
          work_location: string | null
          views_count: number
          special_requirements: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          title: string
          description: string
          category: string
          status?: string
          urgency?: string
          budget_range_min?: number | null
          budget_range_max?: number | null
          deadline_date?: string | null
          preferred_date?: string | null
          work_location?: string | null
          views_count?: number
          special_requirements?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          title?: string
          description?: string
          category?: string
          status?: string
          urgency?: string
          budget_range_min?: number | null
          budget_range_max?: number | null
          deadline_date?: string | null
          preferred_date?: string | null
          work_location?: string | null
          views_count?: number
          special_requirements?: string | null
          created_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          quote_id: string
          client_id: string
          provider_id: string
          contract_number: string
          work_description: string
          total_amount: number
          status: string
          start_date: string | null
          end_date: string | null
          created_at: string
          client_signature: string | null
          provider_signature: string | null
        }
        Insert: {
          id?: string
          quote_id: string
          client_id: string
          provider_id: string
          contract_number: string
          work_description: string
          total_amount: number
          status?: string
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          client_signature?: string | null
          provider_signature?: string | null
        }
        Update: {
          id?: string
          quote_id?: string
          client_id?: string
          provider_id?: string
          contract_number?: string
          work_description?: string
          total_amount?: number
          status?: string
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          client_signature?: string | null
          provider_signature?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          read: boolean
          data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          read?: boolean
          data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          read?: boolean
          data?: Json | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          province: string | null
          postal_code: string | null
          avatar_url: string | null
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          province?: string | null
          postal_code?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          province?: string | null
          postal_code?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          owner_id: string
          name: string
          address: string
          city: string
          province: string
          postal_code: string
          property_type: string
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          address: string
          city: string
          province: string
          postal_code: string
          property_type: string
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          address?: string
          city?: string
          province?: string
          postal_code?: string
          property_type?: string
          created_at?: string
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
          provider_id: string
          amount: number
          description: string | null
          status: string
          valid_until: string | null
          estimated_duration: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          budget_request_id: string
          provider_id: string
          amount: number
          description?: string | null
          status?: string
          valid_until?: string | null
          estimated_duration?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          budget_request_id?: string
          provider_id?: string
          amount?: number
          description?: string | null
          status?: string
          valid_until?: string | null
          estimated_duration?: string | null
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
        }
        Insert: {
          id?: string
          contract_id: string
          rater_id: string
          rated_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          contract_id?: string
          rater_id?: string
          rated_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      service_categories: {
        Row: {
          id: string
          name: string
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
        }
      }
      service_providers: {
        Row: {
          id: string
          user_id: string
          company_name: string
          cif: string
          services: string[]
          verified: boolean
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          cif: string
          services: string[]
          verified?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          cif?: string
          services?: string[]
          verified?: boolean
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
  }
}
