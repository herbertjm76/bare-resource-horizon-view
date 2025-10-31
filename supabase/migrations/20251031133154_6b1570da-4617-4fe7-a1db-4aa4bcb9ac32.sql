-- Add department/type and icon columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS department_icon text DEFAULT 'briefcase';

-- Add comment to describe the icon field
COMMENT ON COLUMN projects.department_icon IS 'Lucide icon name for the project department (e.g., briefcase, building, palette, code, etc.)';
