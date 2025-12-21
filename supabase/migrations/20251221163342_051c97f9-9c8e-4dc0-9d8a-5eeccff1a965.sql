-- Phase 1: Leave Management System Database Schema

-- 1.1 Add new roles to app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'project_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'contractor';

-- 1.2 Add is_leave_admin flag to user_roles table
ALTER TABLE user_roles 
ADD COLUMN IF NOT EXISTS is_leave_admin BOOLEAN DEFAULT FALSE;

-- 1.3 Create leave_types table (configurable per company)
CREATE TABLE IF NOT EXISTS leave_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  requires_attachment BOOLEAN DEFAULT FALSE,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, code)
);

-- 1.4 Create leave_requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE RESTRICT,
  duration_type TEXT NOT NULL CHECK (duration_type IN ('full_day', 'half_day_am', 'half_day_pm')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_hours NUMERIC DEFAULT 0,
  remarks TEXT NOT NULL,
  manager_confirmed BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 1.5 Update annual_leaves table to link to leave types and requests
ALTER TABLE annual_leaves 
ADD COLUMN IF NOT EXISTS leave_type_id UUID REFERENCES leave_types(id),
ADD COLUMN IF NOT EXISTS leave_request_id UUID REFERENCES leave_requests(id);

-- 1.6 Create leave_digest_settings table
CREATE TABLE IF NOT EXISTS leave_digest_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,
  digest_email TEXT NOT NULL,
  frequency TEXT DEFAULT 'weekly' CHECK (frequency IN ('weekly', 'monthly')),
  send_day INTEGER DEFAULT 1,
  is_enabled BOOLEAN DEFAULT FALSE,
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 1.7 Create storage bucket for attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('leave-attachments', 'leave-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on new tables
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_digest_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leave_types
CREATE POLICY "Users can view leave types in their company"
ON leave_types FOR SELECT
USING (company_id = get_user_company_id_safe());

CREATE POLICY "Admins can manage leave types in their company"
ON leave_types FOR ALL
USING (company_id = get_user_company_id_safe() AND user_is_admin_safe())
WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

-- RLS Policies for leave_requests
CREATE POLICY "Users can view their own leave requests"
ON leave_requests FOR SELECT
USING (member_id = auth.uid());

CREATE POLICY "Users can view leave requests in their company"
ON leave_requests FOR SELECT
USING (company_id = get_user_company_id_safe());

CREATE POLICY "Users can create their own leave requests"
ON leave_requests FOR INSERT
WITH CHECK (member_id = auth.uid() AND company_id = get_user_company_id_safe());

CREATE POLICY "Users can update their own pending leave requests"
ON leave_requests FOR UPDATE
USING (member_id = auth.uid() AND status = 'pending');

CREATE POLICY "Project managers can approve leave requests from their team"
ON leave_requests FOR UPDATE
USING (
  company_id = get_user_company_id_safe() 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = leave_requests.member_id 
    AND profiles.manager_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all leave requests in their company"
ON leave_requests FOR ALL
USING (company_id = get_user_company_id_safe() AND user_is_admin_safe())
WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

-- RLS Policies for leave_digest_settings
CREATE POLICY "Admins can manage leave digest settings"
ON leave_digest_settings FOR ALL
USING (company_id = get_user_company_id_safe() AND user_is_admin_safe())
WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Leave admins can view digest settings"
ON leave_digest_settings FOR SELECT
USING (
  company_id = get_user_company_id_safe() 
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.is_leave_admin = true
  )
);

-- Storage policies for leave-attachments bucket
CREATE POLICY "Users can upload their own leave attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'leave-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own leave attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'leave-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all leave attachments in company"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'leave-attachments' 
  AND user_is_admin_safe()
);

CREATE POLICY "Users can delete their own leave attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'leave-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leave_requests_member_id ON leave_requests(member_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_company_id ON leave_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_dates ON leave_requests(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_leave_types_company_id ON leave_types(company_id);

-- Seed default leave types function (to be called per company)
CREATE OR REPLACE FUNCTION seed_default_leave_types(p_company_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO leave_types (company_id, name, code, requires_attachment, color, icon, order_index)
  VALUES 
    (p_company_id, 'Vacation / PTO', 'vacation', false, '#22C55E', 'palmtree', 1),
    (p_company_id, 'Sick Leave', 'sick', true, '#EF4444', 'thermometer', 2),
    (p_company_id, 'Maternity Leave', 'maternity', false, '#EC4899', 'baby', 3),
    (p_company_id, 'Paternity Leave', 'paternity', false, '#8B5CF6', 'baby', 4),
    (p_company_id, 'Compassionate Leave', 'compassionate', false, '#6B7280', 'heart', 5),
    (p_company_id, 'Training / Professional Development', 'training', false, '#3B82F6', 'graduation-cap', 6),
    (p_company_id, 'Other', 'other', false, '#F59E0B', 'file-text', 7)
  ON CONFLICT (company_id, code) DO NOTHING;
END;
$$;