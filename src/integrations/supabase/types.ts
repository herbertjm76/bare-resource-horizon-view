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
          member_id: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          date: string
          hours: number
          id?: string
          member_id: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          date?: string
          hours?: number
          id?: string
          member_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          phone: string | null
          size: string | null
          subdomain: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          size?: string | null
          subdomain: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          size?: string | null
          subdomain?: string
          updated_at?: string
          website?: string | null
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
        ]
      }
      office_departments: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
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
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          company_id: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          department: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          id: string
          job_title: string | null
          last_name: string | null
          location: string | null
          manager_id: string | null
          phone: string | null
          postal_code: string | null
          role: Database["public"]["Enums"]["user_role"]
          social_linkedin: string | null
          social_twitter: string | null
          start_date: string | null
          state: string | null
          updated_at: string
          weekly_capacity: number
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_id?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id: string
          job_title?: string | null
          last_name?: string | null
          location?: string | null
          manager_id?: string | null
          phone?: string | null
          postal_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          social_linkedin?: string | null
          social_twitter?: string | null
          start_date?: string | null
          state?: string | null
          updated_at?: string
          weekly_capacity?: number
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_id?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          location?: string | null
          manager_id?: string | null
          phone?: string | null
          postal_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          social_linkedin?: string | null
          social_twitter?: string | null
          start_date?: string | null
          state?: string | null
          updated_at?: string
          weekly_capacity?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
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
          company_id: string | null
          created_at: string
          hours: number
          id: string
          project_id: string
          resource_id: string
          resource_type: string
          updated_at: string
          week_start_date: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          hours?: number
          id?: string
          project_id: string
          resource_id: string
          resource_type: string
          updated_at?: string
          week_start_date: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          hours?: number
          id?: string
          project_id?: string
          resource_id?: string
          resource_type?: string
          updated_at?: string
          week_start_date?: string
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
      project_stages: {
        Row: {
          billing_month: string | null
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
          stage_name: string
          updated_at: string | null
          variance_percentage: number | null
        }
        Insert: {
          billing_month?: string | null
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
          stage_name: string
          updated_at?: string | null
          variance_percentage?: number | null
        }
        Update: {
          billing_month?: string | null
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
          stage_name?: string
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
          financial_status: string | null
          id: string
          name: string
          office_id: string
          project_manager_id: string | null
          stages: string[] | null
          status: Database["public"]["Enums"]["project_status"]
          target_profit_percentage: number
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
          financial_status?: string | null
          id?: string
          name: string
          office_id: string
          project_manager_id?: string | null
          stages?: string[] | null
          status?: Database["public"]["Enums"]["project_status"]
          target_profit_percentage: number
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
          financial_status?: string | null
          id?: string
          name?: string
          office_id?: string
          project_manager_id?: string | null
          stages?: string[] | null
          status?: Database["public"]["Enums"]["project_status"]
          target_profit_percentage?: number
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
    }
    Views: {
      [_ in never]: never
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
      get_current_user_company_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_company_id: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_company_id_safe: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_role_safe: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_company_role: {
        Args:
          | Record<PropertyKey, never>
          | {
              company_uuid: string
              requested_role: Database["public"]["Enums"]["user_role"]
            }
        Returns: boolean
      }
      user_has_admin_role: {
        Args: { user_id: string }
        Returns: boolean
      }
      user_has_owner_role: {
        Args: { user_id: string }
        Returns: boolean
      }
      user_is_admin_safe: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      users_are_in_same_company: {
        Args: { user_id_1: string; user_id_2: string }
        Returns: boolean
      }
    }
    Enums: {
      project_status: "In Progress" | "On Hold" | "Complete" | "Planning"
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
      project_status: ["In Progress", "On Hold", "Complete", "Planning"],
      user_role: ["owner", "admin", "member"],
    },
  },
} as const
