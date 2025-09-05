-- Security Enhancement: Split profiles table to minimize sensitive data exposure
-- Create a separate table for sensitive personal information with stricter access controls

-- 1. Create enum for data sensitivity levels
CREATE TYPE public.data_sensitivity AS ENUM ('public', 'internal', 'confidential', 'restricted');

-- 2. Create personal_information table for highly sensitive data
CREATE TABLE public.personal_information (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL UNIQUE,
  date_of_birth date,
  phone text,
  emergency_contact_name text,
  emergency_contact_phone text,
  address text,
  city text,
  state text,
  postal_code text,
  country text,
  social_linkedin text,
  social_twitter text,
  data_sensitivity_level data_sensitivity NOT NULL DEFAULT 'confidential',
  company_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 3. Enable RLS on personal_information table
ALTER TABLE public.personal_information ENABLE ROW LEVEL SECURITY;

-- 4. Create restrictive RLS policies for personal_information
-- Only allow users to view their own personal info
CREATE POLICY "Users can view their own personal information"
ON public.personal_information
FOR SELECT
USING (profile_id = auth.uid());

-- Only allow users to update their own personal info
CREATE POLICY "Users can update their own personal information"
ON public.personal_information
FOR UPDATE
USING (profile_id = auth.uid());

-- Only allow users to insert their own personal info
CREATE POLICY "Users can insert their own personal information"
ON public.personal_information
FOR INSERT
WITH CHECK (profile_id = auth.uid() AND company_id = get_user_company_id_safe());

-- Admins can view personal info only within their company and with explicit role check
CREATE POLICY "Company admins can view personal information for company members"
ON public.personal_information
FOR SELECT
USING (
  company_id = get_user_company_id_safe() 
  AND user_is_admin_safe()
);

-- Admins can update personal info within their company
CREATE POLICY "Company admins can update personal information for company members"
ON public.personal_information
FOR UPDATE
USING (
  company_id = get_user_company_id_safe() 
  AND user_is_admin_safe()
);

-- 5. Create audit log for personal information access
CREATE TABLE public.personal_info_access_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL,
  accessed_by uuid NOT NULL,
  access_type text NOT NULL, -- 'view', 'update', 'delete'
  company_id uuid NOT NULL,
  accessed_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address inet,
  user_agent text
);

-- Enable RLS on access log
ALTER TABLE public.personal_info_access_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view access logs for their company
CREATE POLICY "Company admins can view access logs"
ON public.personal_info_access_log
FOR SELECT
USING (
  company_id = get_user_company_id_safe() 
  AND user_is_admin_safe()
);

-- 6. Strengthen existing profiles table policies
-- Drop existing policies that might be too permissive
DROP POLICY IF EXISTS "Users can view profiles in their company" ON public.profiles;

-- Create more restrictive policy for viewing other profiles
CREATE POLICY "Users can view limited profile info in their company"
ON public.profiles
FOR SELECT
USING (
  id = auth.uid() OR (
    company_id = get_user_company_id_safe() 
    AND company_id IS NOT NULL
  )
);

-- 7. Create function to securely migrate existing sensitive data
CREATE OR REPLACE FUNCTION public.migrate_sensitive_profile_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert existing sensitive data into personal_information table
  INSERT INTO public.personal_information (
    profile_id,
    date_of_birth,
    phone,
    emergency_contact_name,
    emergency_contact_phone,
    address,
    city,
    state,
    postal_code,
    country,
    social_linkedin,
    social_twitter,
    company_id
  )
  SELECT 
    id,
    date_of_birth,
    phone,
    emergency_contact_name,
    emergency_contact_phone,
    address,
    city,
    state,
    postal_code,
    country,
    social_linkedin,
    social_twitter,
    company_id
  FROM public.profiles 
  WHERE company_id IS NOT NULL
  ON CONFLICT (profile_id) DO NOTHING;
  
  -- Clear sensitive data from profiles table
  UPDATE public.profiles SET
    date_of_birth = NULL,
    phone = NULL,
    emergency_contact_name = NULL,
    emergency_contact_phone = NULL,
    address = NULL,
    city = NULL,
    state = NULL,
    postal_code = NULL,
    country = NULL,
    social_linkedin = NULL,
    social_twitter = NULL
  WHERE company_id IS NOT NULL;
END;
$$;

-- 8. Create trigger for updated_at on personal_information
CREATE TRIGGER update_personal_information_updated_at
BEFORE UPDATE ON public.personal_information
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();