-- Remove the default value first
ALTER TABLE projects ALTER COLUMN status DROP DEFAULT;

-- Change projects.status from ENUM to TEXT to support custom statuses
ALTER TABLE projects ALTER COLUMN status TYPE text;

-- Drop the old enum type
DROP TYPE IF EXISTS project_status CASCADE;

-- Update existing statuses to match custom status names
UPDATE projects 
SET status = 'Active'
WHERE status = 'In Progress';

UPDATE projects 
SET status = 'Completed'
WHERE status = 'Complete';

-- Set a new default that uses a common custom status
ALTER TABLE projects ALTER COLUMN status SET DEFAULT 'Active';