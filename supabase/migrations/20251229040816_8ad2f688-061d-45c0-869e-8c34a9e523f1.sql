-- First, update leave_requests to point to the lowercase version of Vacation/PTO
UPDATE leave_requests 
SET leave_type_id = 'f025992b-a4c7-494c-9657-ce674e00c41d'
WHERE leave_type_id = 'fd40c299-6f93-403b-99f6-12872aee7bfe';

-- Also update annual_leaves if any reference the old ID
UPDATE annual_leaves 
SET leave_type_id = 'f025992b-a4c7-494c-9657-ce674e00c41d'
WHERE leave_type_id = 'fd40c299-6f93-403b-99f6-12872aee7bfe';

-- Now delete the duplicate leave types with uppercase codes
DELETE FROM leave_types 
WHERE company_id = '1cd60548-fd91-46f2-acb4-61362d71c7af'
AND code IN ('MAT', 'COM', 'OTH', 'PAT', 'SIC', 'TRA', 'VAC');

-- Add unique constraint to prevent future duplicates
ALTER TABLE leave_types 
ADD CONSTRAINT unique_leave_type_name_per_company UNIQUE (company_id, name);