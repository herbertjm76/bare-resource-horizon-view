-- Add display_type column to weekly_custom_card_types
ALTER TABLE public.weekly_custom_card_types 
ADD COLUMN display_type TEXT NOT NULL DEFAULT 'list' 
CHECK (display_type IN ('list', 'gallery', 'pdf'));

-- Create storage bucket for custom card uploads (images and PDFs)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'custom-card-uploads', 
  'custom-card-uploads', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
);

-- Create storage policies for custom card uploads
CREATE POLICY "Anyone can view custom card uploads" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'custom-card-uploads');

CREATE POLICY "Authenticated users can upload custom card files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'custom-card-uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their uploads" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'custom-card-uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete their uploads" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'custom-card-uploads' AND auth.role() = 'authenticated');

-- Create table to store files for gallery/pdf cards
CREATE TABLE public.weekly_custom_card_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  card_type_id UUID NOT NULL REFERENCES public.weekly_custom_card_types(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.weekly_custom_card_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view files in their company" 
ON public.weekly_custom_card_files FOR SELECT 
USING (company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert files in their company" 
ON public.weekly_custom_card_files FOR INSERT 
WITH CHECK (company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update files in their company" 
ON public.weekly_custom_card_files FOR UPDATE 
USING (company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete files in their company" 
ON public.weekly_custom_card_files FOR DELETE 
USING (company_id IN (SELECT company_id FROM public.profiles WHERE id = auth.uid()));

-- Add index for faster lookups
CREATE INDEX idx_custom_card_files_lookup 
ON public.weekly_custom_card_files(card_type_id, week_start_date);