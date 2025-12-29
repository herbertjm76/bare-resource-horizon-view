-- Add date_of_birth to profiles table (for birthdays card)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth date;

-- Add timeline and survey display types to weekly_custom_card_types
-- Add survey_type column for survey cards (multiple_choice, poll, rating)
ALTER TABLE public.weekly_custom_card_types 
  ADD COLUMN IF NOT EXISTS survey_type text;

-- Create table for timeline entries
CREATE TABLE IF NOT EXISTS public.weekly_timeline_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_type_id uuid NOT NULL REFERENCES weekly_custom_card_types(id) ON DELETE CASCADE,
  week_start_date date NOT NULL,
  title text NOT NULL,
  event_date date NOT NULL,
  description text,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create table for survey responses
CREATE TABLE IF NOT EXISTS public.weekly_survey_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_type_id uuid NOT NULL REFERENCES weekly_custom_card_types(id) ON DELETE CASCADE,
  week_start_date date NOT NULL,
  option_id text NOT NULL, -- For multiple choice/poll
  rating_value integer, -- For rating type (1-5 or 1-10)
  member_id uuid NOT NULL,
  member_type text NOT NULL DEFAULT 'active',
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(card_type_id, week_start_date, member_id)
);

-- Create table for survey options (for multiple choice and poll types)
CREATE TABLE IF NOT EXISTS public.weekly_survey_options (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_type_id uuid NOT NULL REFERENCES weekly_custom_card_types(id) ON DELETE CASCADE,
  week_start_date date NOT NULL,
  label text NOT NULL,
  order_index integer DEFAULT 0,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.weekly_timeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_survey_options ENABLE ROW LEVEL SECURITY;

-- RLS for timeline entries
CREATE POLICY "Users can view timeline entries in their company"
  ON public.weekly_timeline_entries FOR SELECT
  USING (company_id = get_user_company_id_safe());

CREATE POLICY "Users can manage timeline entries in their company"
  ON public.weekly_timeline_entries FOR ALL
  USING (company_id = get_user_company_id_safe())
  WITH CHECK (company_id = get_user_company_id_safe());

-- RLS for survey responses
CREATE POLICY "Users can view survey responses in their company"
  ON public.weekly_survey_responses FOR SELECT
  USING (company_id = get_user_company_id_safe());

CREATE POLICY "Users can manage their own survey responses"
  ON public.weekly_survey_responses FOR ALL
  USING (member_id = auth.uid() OR company_id = get_user_company_id_safe())
  WITH CHECK (company_id = get_user_company_id_safe());

-- RLS for survey options
CREATE POLICY "Users can view survey options in their company"
  ON public.weekly_survey_options FOR SELECT
  USING (company_id = get_user_company_id_safe());

CREATE POLICY "Users can manage survey options in their company"
  ON public.weekly_survey_options FOR ALL
  USING (company_id = get_user_company_id_safe())
  WITH CHECK (company_id = get_user_company_id_safe());