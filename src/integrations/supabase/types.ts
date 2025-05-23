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
          weekly_capacity: number | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
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
          weekly_capacity?: number | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
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
          avatar_url: string | null
          company_id: string | null
          created_at: string
          department: string | null
          email: string
          first_name: string | null
          id: string
          job_title: string | null
          last_name: string | null
          location: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          weekly_capacity: number
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          department?: string | null
          email: string
          first_name?: string | null
          id: string
          job_title?: string | null
          last_name?: string | null
          location?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          weekly_capacity?: number
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          department?: string | null
          email?: string
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          location?: string | null
          role?: Database["public"]["Enums"]["user_role"]
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
      project_fees: {
        Row: {
          billing_month: string | null
          company_id: string
          created_at: string | null
          currency: string | null
          fee: number
          id: string
          invoice_date: string | null
          invoice_status: string | null
          project_id: string
          stage_id: string
          updated_at: string | null
        }
        Insert: {
          billing_month?: string | null
          company_id: string
          created_at?: string | null
          currency?: string | null
          fee?: number
          id?: string
          invoice_date?: string | null
          invoice_status?: string | null
          project_id: string
          stage_id: string
          updated_at?: string | null
        }
        Update: {
          billing_month?: string | null
          company_id?: string
          created_at?: string | null
          currency?: string | null
          fee?: number
          id?: string
          invoice_date?: string | null
          invoice_status?: string | null
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
          company_id: string | null
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
        }
        Insert: {
          billing_month?: string | null
          company_id?: string | null
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
        }
        Update: {
          billing_month?: string | null
          company_id?: string | null
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
          code: string
          company_id: string | null
          country: string
          created_at: string | null
          currency: string | null
          current_stage: string
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
          code: string
          company_id?: string | null
          country: string
          created_at?: string | null
          currency?: string | null
          current_stage: string
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
          code?: string
          company_id?: string | null
          country?: string
          created_at?: string | null
          currency?: string | null
          current_stage?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_company_id: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_profile_by_id: {
        Args: { user_id: string }
        Returns: {
          id: string
          company_id: string
          role: string
          email: string
          first_name: string
          last_name: string
          job_title: string
          department: string
          location: string
          created_at: string
          updated_at: string
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
