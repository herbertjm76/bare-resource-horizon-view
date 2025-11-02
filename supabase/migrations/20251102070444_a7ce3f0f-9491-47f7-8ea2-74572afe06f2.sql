-- Create enum for member types in custom cards
DO $$ BEGIN
  CREATE TYPE member_type AS ENUM ('active', 'pre_registered');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Table for custom card type definitions (admin creates these)
CREATE TABLE IF NOT EXISTS public.weekly_custom_card_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  label text NOT NULL,
  icon text,
  color text,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id, label)
);

-- Table for weekly member entries per custom card
CREATE TABLE IF NOT EXISTS public.weekly_custom_card_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_type_id uuid NOT NULL REFERENCES public.weekly_custom_card_types(id) ON DELETE CASCADE,
  member_id uuid NOT NULL,
  member_type member_type NOT NULL DEFAULT 'active',
  week_start_date date NOT NULL,
  notes text,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(card_type_id, member_id, week_start_date)
);

-- Table for user card visibility preferences
CREATE TABLE IF NOT EXISTS public.user_rundown_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  visible_cards jsonb NOT NULL DEFAULT '{"holidays": true, "annualLeave": true, "otherLeave": true, "notes": true, "available": true}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- Enable RLS
ALTER TABLE public.weekly_custom_card_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_custom_card_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rundown_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for weekly_custom_card_types
CREATE POLICY "Users can view card types in their company"
  ON public.weekly_custom_card_types
  FOR SELECT
  USING (company_id = get_user_company_id_safe());

CREATE POLICY "Admins can manage card types in their company"
  ON public.weekly_custom_card_types
  FOR ALL
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe())
  WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

-- RLS Policies for weekly_custom_card_entries
CREATE POLICY "Users can view card entries in their company"
  ON public.weekly_custom_card_entries
  FOR SELECT
  USING (company_id = get_user_company_id_safe());

CREATE POLICY "Users can manage card entries in their company"
  ON public.weekly_custom_card_entries
  FOR ALL
  USING (company_id = get_user_company_id_safe())
  WITH CHECK (company_id = get_user_company_id_safe());

-- RLS Policies for user_rundown_preferences
CREATE POLICY "Users can view their own preferences"
  ON public.user_rundown_preferences
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own preferences"
  ON public.user_rundown_preferences
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_custom_card_types_company ON public.weekly_custom_card_types(company_id, is_active);
CREATE INDEX IF NOT EXISTS idx_custom_card_entries_card_week ON public.weekly_custom_card_entries(card_type_id, week_start_date);
CREATE INDEX IF NOT EXISTS idx_custom_card_entries_company_week ON public.weekly_custom_card_entries(company_id, week_start_date);
CREATE INDEX IF NOT EXISTS idx_user_rundown_preferences_user ON public.user_rundown_preferences(user_id, company_id);

-- Create trigger for updated_at
CREATE TRIGGER update_weekly_custom_card_types_updated_at
  BEFORE UPDATE ON public.weekly_custom_card_types
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_weekly_custom_card_entries_updated_at
  BEFORE UPDATE ON public.weekly_custom_card_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_rundown_preferences_updated_at
  BEFORE UPDATE ON public.user_rundown_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();