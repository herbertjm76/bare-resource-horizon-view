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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      annual_leaves: {
        Row: {
          company_id: string
          created_at: string | null
          date: string
          hours: number
          id: string
          leave_request_id: string | null
          leave_type_id: string | null
          member_id: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          date: string
          hours: number
          id?: string
          leave_request_id?: string | null
          leave_type_id?: string | null
          member_id: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          date?: string
          hours?: number
          id?: string
          leave_request_id?: string | null
          leave_type_id?: string | null
          member_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "annual_leaves_leave_request_id_fkey"
            columns: ["leave_request_id"]
            isOneToOne: false
            referencedRelation: "leave_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_leaves_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          allocation_danger_threshold: number | null
          allocation_max_limit: number | null
          allocation_warning_threshold: number | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          opt_out_financials: boolean | null
          phone: string | null
          project_display_preference: string | null
          size: string | null
          start_of_work_week: string | null
          subdomain: string
          theme: string | null
          updated_at: string
          use_hours_or_percentage: string | null
          website: string | null
          work_week_hours: number | null
        }
        Insert: {
          address?: string | null
          allocation_danger_threshold?: number | null
          allocation_max_limit?: number | null
          allocation_warning_threshold?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          opt_out_financials?: boolean | null
          phone?: string | null
          project_display_preference?: string | null
          size?: string | null
          start_of_work_week?: string | null
          subdomain: string
          theme?: string | null
          updated_at?: string
          use_hours_or_percentage?: string | null
          website?: string | null
          work_week_hours?: number | null
        }
        Update: {
          address?: string | null
          allocation_danger_threshold?: number | null
          allocation_max_limit?: number | null
          allocation_warning_threshold?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          opt_out_financials?: boolean | null
          phone?: string | null
          project_display_preference?: string | null
          size?: string | null
          start_of_work_week?: string | null
          subdomain?: string
          theme?: string | null
          updated_at?: string
          use_hours_or_percentage?: string | null
          website?: string | null
          work_week_hours?: number | null
        }
        Relationships: []
      }
      invites: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          avatar_url: string | null
          code: string
          company_id: string
          created_at: string
          created_by: string
          department: string | null
          email: string | null
          first_name: string | null
          id: string
          invitation_type: string
          job_title: string | null
          last_name: string | null
          location: string | null
          office_role_id: string | null
          practice_area: string | null
          role: string | null
          status: string
          updated_at: string | null
          weekly_capacity: number | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          avatar_url?: string | null
          code: string
          company_id: string
          created_at?: string
          created_by: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          invitation_type?: string
          job_title?: string | null
          last_name?: string | null
          location?: string | null
          office_role_id?: string | null
          practice_area?: string | null
          role?: string | null
          status?: string
          updated_at?: string | null
          weekly_capacity?: number | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          avatar_url?: string | null
          code?: string
          company_id?: string
          created_at?: string
          created_by?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          invitation_type?: string
          job_title?: string | null
          last_name?: string | null
          location?: string | null
          office_role_id?: string | null
          practice_area?: string | null
          role?: string | null
          status?: string
          updated_at?: string | null
          weekly_capacity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invites_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_office_role_id_fkey"
            columns: ["office_role_id"]
            isOneToOne: false
            referencedRelation: "office_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_digest_settings: {
        Row: {
          company_id: string
          created_at: string | null
          digest_email: string
          frequency: string | null
          id: string
          is_enabled: boolean | null
          last_sent_at: string | null
          send_day: number | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          digest_email: string
          frequency?: string | null
          id?: string
          is_enabled?: boolean | null
          last_sent_at?: string | null
          send_day?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          digest_email?: string
          frequency?: string | null
          id?: string
          is_enabled?: boolean | null
          last_sent_at?: string | null
          send_day?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_digest_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          attachment_url: string | null
          calendar_uid: string | null
          company_id: string
          created_at: string | null
          duration_type: string
          end_date: string
          id: string
          leave_type_id: string
          manager_confirmed: boolean | null
          member_id: string
          rejection_reason: string | null
          remarks: string
          requested_approver_id: string | null
          sent_to_calendar_at: string | null
          start_date: string
          status: string | null
          total_hours: number | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          attachment_url?: string | null
          calendar_uid?: string | null
          company_id: string
          created_at?: string | null
          duration_type: string
          end_date: string
          id?: string
          leave_type_id: string
          manager_confirmed?: boolean | null
          member_id: string
          rejection_reason?: string | null
          remarks: string
          requested_approver_id?: string | null
          sent_to_calendar_at?: string | null
          start_date: string
          status?: string | null
          total_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          attachment_url?: string | null
          calendar_uid?: string | null
          company_id?: string
          created_at?: string | null
          duration_type?: string
          end_date?: string
          id?: string
          leave_type_id?: string
          manager_confirmed?: boolean | null
          member_id?: string
          rejection_reason?: string | null
          remarks?: string
          requested_approver_id?: string | null
          sent_to_calendar_at?: string | null
          start_date?: string
          status?: string | null
          total_hours?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_requested_approver_id_fkey"
            columns: ["requested_approver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_types: {
        Row: {
          code: string
          color: string | null
          company_id: string
          created_at: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
          requires_attachment: boolean | null
          updated_at: string | null
        }
        Insert: {
          code: string
          color?: string | null
          company_id: string
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
          requires_attachment?: boolean | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          color?: string | null
          company_id?: string
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          requires_attachment?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_types_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      office_departments: {
        Row: {
          company_id: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "office_departments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      office_holidays: {
        Row: {
          company_id: string | null
          created_at: string
          date: string
          end_date: string | null
          id: string
          is_recurring: boolean
          location_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          date: string
          end_date?: string | null
          id?: string
          is_recurring?: boolean
          location_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          date?: string
          end_date?: string | null
          id?: string
          is_recurring?: boolean
          location_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "office_holidays_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "office_holidays_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "office_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      office_locations: {
        Row: {
          city: string
          code: string
          company_id: string | null
          country: string
          created_at: string
          emoji: string | null
          id: string
          updated_at: string
        }
        Insert: {
          city: string
          code: string
          company_id?: string | null
          country: string
          created_at?: string
          emoji?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          city?: string
          code?: string
          company_id?: string | null
          country?: string
          created_at?: string
          emoji?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "office_locations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      office_practice_areas: {
        Row: {
          company_id: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "office_sectors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      office_project_types: {
        Row: {
          color: string | null
          company_id: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          order_index: number
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          company_id?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          order_index?: number
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          company_id?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          order_index?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "office_project_types_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      office_rates: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          reference_id: string
          type: string
          unit: string
          updated_at: string
          value: number
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          reference_id: string
          type: string
          unit: string
          updated_at?: string
          value: number
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          reference_id?: string
          type?: string
          unit?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "office_rates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      office_roles: {
        Row: {
          code: string
          company_id: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          company_id?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          company_id?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "office_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      office_stages: {
        Row: {
          code: string | null
          color: string | null
          company_id: string | null
          created_at: string
          id: string
          name: string
          order_index: number
          updated_at: string
        }
        Insert: {
          code?: string | null
          color?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          name: string
          order_index: number
          updated_at?: string
        }
        Update: {
          code?: string | null
          color?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          name?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "office_stages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      offices: {
        Row: {
          country: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pending_resources: {
        Row: {
          company_id: string | null
          created_at: string
          hours: number
          id: string
          invite_id: string
          project_id: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          hours?: number
          id?: string
          invite_id: string
          project_id?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          hours?: number
          id?: string
          invite_id?: string
          project_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pending_resources_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pending_resources_invite_id_fkey"
            columns: ["invite_id"]
            isOneToOne: false
            referencedRelation: "invites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pending_resources_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_info_access_log: {
        Row: {
          access_type: string
          accessed_at: string
          accessed_by: string
          company_id: string
          id: string
          ip_address: unknown
          profile_id: string
          user_agent: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string
          accessed_by: string
          company_id: string
          id?: string
          ip_address?: unknown
          profile_id: string
          user_agent?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string
          accessed_by?: string
          company_id?: string
          id?: string
          ip_address?: unknown
          profile_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      personal_information: {
        Row: {
          address: string | null
          city: string | null
          company_id: string
          country: string | null
          created_at: string
          data_sensitivity_level: Database["public"]["Enums"]["data_sensitivity"]
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          id: string
          phone: string | null
          postal_code: string | null
          profile_id: string
          social_linkedin: string | null
          social_twitter: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_id: string
          country?: string | null
          created_at?: string
          data_sensitivity_level?: Database["public"]["Enums"]["data_sensitivity"]
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          phone?: string | null
          postal_code?: string | null
          profile_id: string
          social_linkedin?: string | null
          social_twitter?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          company_id?: string
          country?: string | null
          created_at?: string
          data_sensitivity_level?: Database["public"]["Enums"]["data_sensitivity"]
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          phone?: string | null
          postal_code?: string | null
          profile_id?: string
          social_linkedin?: string | null
          social_twitter?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_information_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company_id: string | null
          created_at: string
          date_of_birth: string | null
          department: string | null
          email: string
          first_name: string | null
          id: string
          job_title: string | null
          last_name: string | null
          location: string | null
          manager_id: string | null
          office_role_id: string | null
          practice_area: string | null
          start_date: string | null
          updated_at: string
          weekly_capacity: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          email: string
          first_name?: string | null
          id: string
          job_title?: string | null
          last_name?: string | null
          location?: string | null
          manager_id?: string | null
          office_role_id?: string | null
          practice_area?: string | null
          start_date?: string | null
          updated_at?: string
          weekly_capacity?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          email?: string
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          location?: string | null
          manager_id?: string | null
          office_role_id?: string | null
          practice_area?: string | null
          start_date?: string | null
          updated_at?: string
          weekly_capacity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_office_role_id_fkey"
            columns: ["office_role_id"]
            isOneToOne: false
            referencedRelation: "office_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_areas: {
        Row: {
          code: string
          color: string | null
          company_id: string | null
          created_at: string
          emoji: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          color?: string | null
          company_id?: string | null
          created_at?: string
          emoji?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          color?: string | null
          company_id?: string | null
          created_at?: string
          emoji?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_areas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      project_budgets: {
        Row: {
          budget_type: string
          budgeted_amount: number
          committed_amount: number | null
          company_id: string
          created_at: string | null
          forecast_amount: number | null
          id: string
          project_id: string
          spent_amount: number | null
          stage_id: string | null
          updated_at: string | null
          variance_amount: number | null
          variance_percentage: number | null
        }
        Insert: {
          budget_type: string
          budgeted_amount?: number
          committed_amount?: number | null
          company_id: string
          created_at?: string | null
          forecast_amount?: number | null
          id?: string
          project_id: string
          spent_amount?: number | null
          stage_id?: string | null
          updated_at?: string | null
          variance_amount?: number | null
          variance_percentage?: number | null
        }
        Update: {
          budget_type?: string
          budgeted_amount?: number
          committed_amount?: number | null
          company_id?: string
          created_at?: string | null
          forecast_amount?: number | null
          id?: string
          project_id?: string
          spent_amount?: number | null
          stage_id?: string | null
          updated_at?: string | null
          variance_amount?: number | null
          variance_percentage?: number | null
        }
        Relationships: []
      }
      project_fees: {
        Row: {
          billing_month: string | null
          company_id: string
          created_at: string | null
          currency: string | null
          due_date: string | null
          fee: number
          id: string
          invoice_date: string | null
          invoice_number: string | null
          invoice_status: string | null
          notes: string | null
          payment_date: string | null
          payment_terms: number | null
          project_id: string
          stage_id: string
          updated_at: string | null
        }
        Insert: {
          billing_month?: string | null
          company_id: string
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          fee?: number
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          invoice_status?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_terms?: number | null
          project_id: string
          stage_id: string
          updated_at?: string | null
        }
        Update: {
          billing_month?: string | null
          company_id?: string
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          fee?: number
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          invoice_status?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_terms?: number | null
          project_id?: string
          stage_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_fees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_fees_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_fees_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "project_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      project_financial_tracking: {
        Row: {
          budget_variance: number | null
          company_id: string
          cost_incurred: number | null
          created_at: string | null
          hours_consumed: number | null
          id: string
          project_id: string
          revenue_recognized: number | null
          stage_id: string | null
          updated_at: string | null
          utilization_rate: number | null
          week_ending: string
        }
        Insert: {
          budget_variance?: number | null
          company_id: string
          cost_incurred?: number | null
          created_at?: string | null
          hours_consumed?: number | null
          id?: string
          project_id: string
          revenue_recognized?: number | null
          stage_id?: string | null
          updated_at?: string | null
          utilization_rate?: number | null
          week_ending: string
        }
        Update: {
          budget_variance?: number | null
          company_id?: string
          cost_incurred?: number | null
          created_at?: string | null
          hours_consumed?: number | null
          id?: string
          project_id?: string
          revenue_recognized?: number | null
          stage_id?: string | null
          updated_at?: string | null
          utilization_rate?: number | null
          week_ending?: string
        }
        Relationships: []
      }
      project_resource_allocations: {
        Row: {
          allocation_amount: number | null
          allocation_date: string
          company_id: string | null
          created_at: string
          hours: number
          id: string
          project_id: string
          rate_snapshot: number | null
          resource_id: string
          resource_type: string
          stage_id: string | null
          updated_at: string
        }
        Insert: {
          allocation_amount?: number | null
          allocation_date: string
          company_id?: string | null
          created_at?: string
          hours?: number
          id?: string
          project_id: string
          rate_snapshot?: number | null
          resource_id: string
          resource_type: string
          stage_id?: string | null
          updated_at?: string
        }
        Update: {
          allocation_amount?: number | null
          allocation_date?: string
          company_id?: string | null
          created_at?: string
          hours?: number
          id?: string
          project_id?: string
          rate_snapshot?: number | null
          resource_id?: string
          resource_type?: string
          stage_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_resource_allocations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_resource_allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_resource_allocations_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "office_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      project_resources: {
        Row: {
          company_id: string | null
          created_at: string | null
          hours: number
          id: string
          project_id: string
          staff_id: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          hours: number
          id?: string
          project_id: string
          staff_id: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          hours?: number
          id?: string
          project_id?: string
          staff_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_resources_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_resources_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_resources_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_stage_team_composition: {
        Row: {
          company_id: string
          created_at: string
          id: string
          planned_hours_per_person: number
          planned_quantity: number
          project_id: string
          rate_snapshot: number
          reference_id: string
          reference_type: string
          stage_id: string
          total_budget_amount: number | null
          total_planned_hours: number | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          planned_hours_per_person?: number
          planned_quantity?: number
          project_id: string
          rate_snapshot?: number
          reference_id: string
          reference_type: string
          stage_id: string
          total_budget_amount?: number | null
          total_planned_hours?: number | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          planned_hours_per_person?: number
          planned_quantity?: number
          project_id?: string
          rate_snapshot?: number
          reference_id?: string
          reference_type?: string
          stage_id?: string
          total_budget_amount?: number | null
          total_planned_hours?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_stage_team_composition_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_stage_team_composition_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "office_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      project_stages: {
        Row: {
          allocated_hours: number | null
          billing_month: string | null
          budget_utilization_percentage: number | null
          budgeted_hours: number | null
          company_id: string | null
          completion_percentage: number | null
          consumed_hours: number | null
          contracted_weeks: number | null
          created_at: string | null
          currency: string | null
          fee: number
          id: string
          invoice_age: number | null
          invoice_date: string | null
          invoice_status: string | null
          is_applicable: boolean | null
          project_id: string
          remaining_hours: number | null
          stage_name: string
          start_date: string | null
          total_budget_amount: number | null
          total_budgeted_hours: number | null
          updated_at: string | null
          variance_percentage: number | null
        }
        Insert: {
          allocated_hours?: number | null
          billing_month?: string | null
          budget_utilization_percentage?: number | null
          budgeted_hours?: number | null
          company_id?: string | null
          completion_percentage?: number | null
          consumed_hours?: number | null
          contracted_weeks?: number | null
          created_at?: string | null
          currency?: string | null
          fee: number
          id?: string
          invoice_age?: number | null
          invoice_date?: string | null
          invoice_status?: string | null
          is_applicable?: boolean | null
          project_id: string
          remaining_hours?: number | null
          stage_name: string
          start_date?: string | null
          total_budget_amount?: number | null
          total_budgeted_hours?: number | null
          updated_at?: string | null
          variance_percentage?: number | null
        }
        Update: {
          allocated_hours?: number | null
          billing_month?: string | null
          budget_utilization_percentage?: number | null
          budgeted_hours?: number | null
          company_id?: string | null
          completion_percentage?: number | null
          consumed_hours?: number | null
          contracted_weeks?: number | null
          created_at?: string | null
          currency?: string | null
          fee?: number
          id?: string
          invoice_age?: number | null
          invoice_date?: string | null
          invoice_status?: string | null
          is_applicable?: boolean | null
          project_id?: string
          remaining_hours?: number | null
          stage_name?: string
          start_date?: string | null
          total_budget_amount?: number | null
          total_budgeted_hours?: number | null
          updated_at?: string | null
          variance_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_stages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_stages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_statuses: {
        Row: {
          color: string | null
          company_id: string | null
          created_at: string
          id: string
          name: string
          order_index: number
          updated_at: string
        }
        Insert: {
          color?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          name: string
          order_index: number
          updated_at?: string
        }
        Update: {
          color?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          name?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_statuses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      project_team_composition: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          number_of_people: number
          project_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          number_of_people: number
          project_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          number_of_people?: number
          project_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_team_composition_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_composition_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          average_rate: number | null
          blended_rate: number | null
          budget_amount: number | null
          budget_hours: number | null
          code: string
          company_id: string | null
          consumed_hours: number | null
          contract_end_date: string | null
          contract_start_date: string | null
          country: string
          created_at: string | null
          currency: string | null
          current_stage: string
          department: string | null
          department_icon: string | null
          financial_status: string | null
          id: string
          name: string
          office_id: string
          project_manager_id: string | null
          rate_basis_strategy: string | null
          stages: string[] | null
          status: string
          target_profit_percentage: number | null
          temp_office_location_id: string | null
          updated_at: string | null
        }
        Insert: {
          average_rate?: number | null
          blended_rate?: number | null
          budget_amount?: number | null
          budget_hours?: number | null
          code: string
          company_id?: string | null
          consumed_hours?: number | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          country: string
          created_at?: string | null
          currency?: string | null
          current_stage: string
          department?: string | null
          department_icon?: string | null
          financial_status?: string | null
          id?: string
          name: string
          office_id: string
          project_manager_id?: string | null
          rate_basis_strategy?: string | null
          stages?: string[] | null
          status?: string
          target_profit_percentage?: number | null
          temp_office_location_id?: string | null
          updated_at?: string | null
        }
        Update: {
          average_rate?: number | null
          blended_rate?: number | null
          budget_amount?: number | null
          budget_hours?: number | null
          code?: string
          company_id?: string | null
          consumed_hours?: number | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          country?: string
          created_at?: string | null
          currency?: string | null
          current_stage?: string
          department?: string | null
          department_icon?: string | null
          financial_status?: string | null
          id?: string
          name?: string
          office_id?: string
          project_manager_id?: string | null
          rate_basis_strategy?: string | null
          stages?: string[] | null
          status?: string
          target_profit_percentage?: number | null
          temp_office_location_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_project_manager_id_fkey"
            columns: ["project_manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_rates: {
        Row: {
          company_id: string
          created_at: string | null
          currency: string | null
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean | null
          project_id: string | null
          rate_type: string
          rate_value: number
          staff_id: string
          stage_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          currency?: string | null
          effective_from: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          project_id?: string | null
          rate_type?: string
          rate_value?: number
          staff_id: string
          stage_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          currency?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          project_id?: string | null
          rate_type?: string
          rate_value?: number
          staff_id?: string
          stage_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_leave_admin: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_leave_admin?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_leave_admin?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_rundown_preferences: {
        Row: {
          card_order: Json | null
          company_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          visible_cards: Json
        }
        Insert: {
          card_order?: Json | null
          company_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          visible_cards?: Json
        }
        Update: {
          card_order?: Json | null
          company_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          visible_cards?: Json
        }
        Relationships: [
          {
            foreignKeyName: "user_rundown_preferences_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_custom_card_entries: {
        Row: {
          card_type_id: string
          company_id: string
          created_at: string
          id: string
          member_id: string
          member_type: Database["public"]["Enums"]["member_type"]
          notes: string | null
          updated_at: string
          week_start_date: string
        }
        Insert: {
          card_type_id: string
          company_id: string
          created_at?: string
          id?: string
          member_id: string
          member_type?: Database["public"]["Enums"]["member_type"]
          notes?: string | null
          updated_at?: string
          week_start_date: string
        }
        Update: {
          card_type_id?: string
          company_id?: string
          created_at?: string
          id?: string
          member_id?: string
          member_type?: Database["public"]["Enums"]["member_type"]
          notes?: string | null
          updated_at?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_custom_card_entries_card_type_id_fkey"
            columns: ["card_type_id"]
            isOneToOne: false
            referencedRelation: "weekly_custom_card_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_custom_card_entries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_custom_card_files: {
        Row: {
          card_type_id: string
          company_id: string
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          updated_at: string
          week_start_date: string
        }
        Insert: {
          card_type_id: string
          company_id: string
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          updated_at?: string
          week_start_date: string
        }
        Update: {
          card_type_id?: string
          company_id?: string
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          updated_at?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_custom_card_files_card_type_id_fkey"
            columns: ["card_type_id"]
            isOneToOne: false
            referencedRelation: "weekly_custom_card_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_custom_card_files_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_custom_card_types: {
        Row: {
          color: string | null
          company_id: string
          created_at: string
          display_type: string
          icon: string | null
          id: string
          is_active: boolean | null
          label: string
          order_index: number
          survey_type: string | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          company_id: string
          created_at?: string
          display_type?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          label: string
          order_index?: number
          survey_type?: string | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          company_id?: string
          created_at?: string
          display_type?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          label?: string
          order_index?: number
          survey_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_custom_card_types_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_notes: {
        Row: {
          company_id: string
          created_at: string | null
          description: string
          end_date: string | null
          id: string
          start_date: string
          updated_at: string | null
          week_start_date: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description: string
          end_date?: string | null
          id?: string
          start_date: string
          updated_at?: string | null
          week_start_date: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string
          end_date?: string | null
          id?: string
          start_date?: string
          updated_at?: string | null
          week_start_date?: string
        }
        Relationships: []
      }
      weekly_other_leave: {
        Row: {
          company_id: string
          created_at: string
          hours: number
          id: string
          leave_type: string
          member_id: string
          notes: string | null
          updated_at: string
          week_start_date: string
        }
        Insert: {
          company_id: string
          created_at?: string
          hours?: number
          id?: string
          leave_type?: string
          member_id: string
          notes?: string | null
          updated_at?: string
          week_start_date: string
        }
        Update: {
          company_id?: string
          created_at?: string
          hours?: number
          id?: string
          leave_type?: string
          member_id?: string
          notes?: string | null
          updated_at?: string
          week_start_date?: string
        }
        Relationships: []
      }
      weekly_survey_options: {
        Row: {
          card_type_id: string
          company_id: string | null
          created_at: string | null
          id: string
          label: string
          order_index: number | null
          week_start_date: string
        }
        Insert: {
          card_type_id: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          label: string
          order_index?: number | null
          week_start_date: string
        }
        Update: {
          card_type_id?: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          label?: string
          order_index?: number | null
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_survey_options_card_type_id_fkey"
            columns: ["card_type_id"]
            isOneToOne: false
            referencedRelation: "weekly_custom_card_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_survey_options_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_survey_responses: {
        Row: {
          card_type_id: string
          company_id: string | null
          created_at: string | null
          id: string
          member_id: string
          member_type: string
          option_id: string
          rating_value: number | null
          week_start_date: string
        }
        Insert: {
          card_type_id: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          member_id: string
          member_type?: string
          option_id: string
          rating_value?: number | null
          week_start_date: string
        }
        Update: {
          card_type_id?: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          member_id?: string
          member_type?: string
          option_id?: string
          rating_value?: number | null
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_survey_responses_card_type_id_fkey"
            columns: ["card_type_id"]
            isOneToOne: false
            referencedRelation: "weekly_custom_card_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_survey_responses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_timeline_entries: {
        Row: {
          card_type_id: string
          company_id: string | null
          created_at: string | null
          description: string | null
          event_date: string
          id: string
          title: string
          updated_at: string | null
          week_start_date: string
        }
        Insert: {
          card_type_id: string
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          event_date: string
          id?: string
          title: string
          updated_at?: string | null
          week_start_date: string
        }
        Update: {
          card_type_id?: string
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          event_date?: string
          id?: string
          title?: string
          updated_at?: string | null
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_timeline_entries_card_type_id_fkey"
            columns: ["card_type_id"]
            isOneToOne: false
            referencedRelation: "weekly_custom_card_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_timeline_entries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      weekly_resource_allocations: {
        Row: {
          allocation_amount: number | null
          company_id: string | null
          created_at: string | null
          hours: number | null
          project_id: string | null
          rate_snapshot: number | null
          resource_id: string | null
          resource_type: string | null
          stage_id: string | null
          updated_at: string | null
          week_start_date: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_resource_allocations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_resource_allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_resource_allocations_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "office_stages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_project_financial_metrics: {
        Args: { project_uuid: string }
        Returns: {
          blended_rate: number
          budget_hours: number
          budget_variance: number
          burn_rate: number
          consumed_hours: number
          profit_margin: number
          schedule_variance: number
          total_budget: number
          total_revenue: number
          total_spent: number
        }[]
      }
      get_company_leave_approvers: {
        Args: { p_company_id: string }
        Returns: {
          avatar_url: string
          email: string
          first_name: string
          id: string
          last_name: string
          role: string
        }[]
      }
      get_current_user_company_id: { Args: never; Returns: string }
      get_user_company_id: { Args: { user_id: string }; Returns: string }
      get_user_company_id_safe: { Args: never; Returns: string }
      get_user_profile_by_id: {
        Args: { user_id: string }
        Returns: {
          company_id: string
          created_at: string
          department: string
          email: string
          first_name: string
          id: string
          job_title: string
          last_name: string
          location: string
          role: string
          updated_at: string
        }[]
      }
      get_user_role: { Args: { user_id: string }; Returns: string }
      get_user_role_safe: { Args: never; Returns: string }
      get_user_role_secure: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_for_company: {
        Args: { check_company_id: string }
        Returns: boolean
      }
      is_company_role:
        | { Args: never; Returns: boolean }
        | {
            Args: {
              company_uuid: string
              requested_role: Database["public"]["Enums"]["user_role"]
            }
            Returns: boolean
          }
      migrate_sensitive_profile_data: { Args: never; Returns: undefined }
      seed_default_leave_types: {
        Args: { p_company_id: string }
        Returns: undefined
      }
      update_stage_budgets: {
        Args: { p_project_id: string; p_stage_id: string }
        Returns: undefined
      }
      user_has_admin_role: { Args: { user_id: string }; Returns: boolean }
      user_has_owner_role: { Args: { user_id: string }; Returns: boolean }
      user_is_admin_safe: { Args: never; Returns: boolean }
      users_are_in_same_company: {
        Args: { user_id_1: string; user_id_2: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "admin" | "member" | "project_manager" | "contractor"
      data_sensitivity: "public" | "internal" | "confidential" | "restricted"
      member_type: "active" | "pre_registered"
      user_role: "owner" | "admin" | "member"
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
    Enums: {
      app_role: ["owner", "admin", "member", "project_manager", "contractor"],
      data_sensitivity: ["public", "internal", "confidential", "restricted"],
      member_type: ["active", "pre_registered"],
      user_role: ["owner", "admin", "member"],
    },
  },
} as const
