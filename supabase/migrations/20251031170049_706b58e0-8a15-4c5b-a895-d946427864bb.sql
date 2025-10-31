-- Add icon column to office_departments table
ALTER TABLE office_departments 
ADD COLUMN icon text;

COMMENT ON COLUMN office_departments.icon IS 'Lucide icon name for the department';