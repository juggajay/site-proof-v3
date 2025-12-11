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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      diaries: {
        Row: {
          created_at: string | null
          date: string
          foreman_id: string | null
          id: string
          lot_id: string | null
          notes: string | null
          organization_id: string
          project_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          foreman_id?: string | null
          id?: string
          lot_id?: string | null
          notes?: string | null
          organization_id: string
          project_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          foreman_id?: string | null
          id?: string
          lot_id?: string | null
          notes?: string | null
          organization_id?: string
          project_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diaries_foreman_id_fkey"
            columns: ["foreman_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diaries_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diaries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diaries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_entries: {
        Row: {
          break_hours: number | null
          created_at: string | null
          diary_id: string
          finish_time: string | null
          frozen_rate_cents: number | null
          id: string
          resource_id: string
          start_time: string | null
          total_cost_cents: number | null
          total_hours: number | null
        }
        Insert: {
          break_hours?: number | null
          created_at?: string | null
          diary_id: string
          finish_time?: string | null
          frozen_rate_cents?: number | null
          id?: string
          resource_id: string
          start_time?: string | null
          total_cost_cents?: number | null
          total_hours?: number | null
        }
        Update: {
          break_hours?: number | null
          created_at?: string | null
          diary_id?: string
          finish_time?: string | null
          frozen_rate_cents?: number | null
          id?: string
          resource_id?: string
          start_time?: string | null
          total_cost_cents?: number | null
          total_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "diary_entries_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diary_entries_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      itp_checks: {
        Row: {
          created_at: string | null
          id: string
          lot_itp_id: string
          photo_url: string | null
          question: string
          rectification_note: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lot_itp_id: string
          photo_url?: string | null
          question: string
          rectification_note?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lot_itp_id?: string
          photo_url?: string | null
          question?: string
          rectification_note?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itp_checks_lot_itp_id_fkey"
            columns: ["lot_itp_id"]
            isOneToOne: false
            referencedRelation: "lot_itps"
            referencedColumns: ["id"]
          },
        ]
      }
      itp_templates: {
        Row: {
          created_at: string | null
          id: string
          items: Json
          organization_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          items: Json
          organization_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          items?: Json
          organization_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "itp_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      lot_itps: {
        Row: {
          created_at: string | null
          id: string
          lot_id: string
          organization_id: string
          status: string | null
          template_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lot_id: string
          organization_id: string
          status?: string | null
          template_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lot_id?: string
          organization_id?: string
          status?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lot_itps_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lot_itps_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lot_itps_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "itp_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      lots: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          lot_number: string
          organization_id: string
          project_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          lot_number: string
          organization_id: string
          project_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          lot_number?: string
          organization_id?: string
          project_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          organization_id: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          organization_id?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          name: string
          organization_id: string
          status: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          name: string
          organization_id: string
          status?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_cards: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string
          rate_cents: number
          role_name: string
          unit: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id: string
          rate_cents: number
          role_name: string
          unit?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string
          rate_cents?: number
          role_name?: string
          unit?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rate_cards_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rate_cards_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          assigned_rate_card_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          organization_id: string
          phone: string | null
          type: string | null
          vendor_id: string
        }
        Insert: {
          assigned_rate_card_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_id: string
          phone?: string | null
          type?: string | null
          vendor_id: string
        }
        Update: {
          assigned_rate_card_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string
          phone?: string | null
          type?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_assigned_rate_card_id_fkey"
            columns: ["assigned_rate_card_id"]
            isOneToOne: false
            referencedRelation: "rate_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          abn: string | null
          contact_email: string | null
          created_at: string | null
          id: string
          is_internal: boolean | null
          name: string
          organization_id: string
        }
        Insert: {
          abn?: string | null
          contact_email?: string | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          name: string
          organization_id: string
        }
        Update: {
          abn?: string | null
          contact_email?: string | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_organization_id: { Args: never; Returns: string }
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
