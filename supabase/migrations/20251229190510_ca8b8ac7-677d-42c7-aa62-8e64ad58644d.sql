-- Drop the old constraint and add a new one with all display types
ALTER TABLE public.weekly_custom_card_types 
DROP CONSTRAINT weekly_custom_card_types_display_type_check;

ALTER TABLE public.weekly_custom_card_types 
ADD CONSTRAINT weekly_custom_card_types_display_type_check 
CHECK (display_type = ANY (ARRAY['list'::text, 'gallery'::text, 'pdf'::text, 'dates'::text, 'timeline'::text, 'survey'::text, 'text'::text]));