-- Remove sector column from office_departments
ALTER TABLE office_departments 
DROP COLUMN IF EXISTS sector;

-- Create office_sectors table
CREATE TABLE IF NOT EXISTS office_sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text,
  company_id uuid REFERENCES companies(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE office_sectors ENABLE ROW LEVEL SECURITY;

-- Create policies for office_sectors
CREATE POLICY "Admins can manage sectors in their company"
  ON office_sectors
  FOR ALL
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe())
  WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Users can view sectors in their company"
  ON office_sectors
  FOR SELECT
  USING (company_id = get_user_company_id_safe());