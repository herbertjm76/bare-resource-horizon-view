-- First, let's create some realistic projects
INSERT INTO projects (
  code, name, country, office_id, current_stage, target_profit_percentage, status, company_id
) VALUES 
  ('PROJ001', 'Digital Transformation Initiative', 'USA', (SELECT id FROM offices WHERE name = 'New York' LIMIT 1), 'Planning', 15, 'In Progress', (SELECT company_id FROM profiles WHERE id = auth.uid())),
  ('PROJ002', 'E-commerce Platform Upgrade', 'USA', (SELECT id FROM offices WHERE name = 'New York' LIMIT 1), 'Development', 20, 'In Progress', (SELECT company_id FROM profiles WHERE id = auth.uid())),
  ('PROJ003', 'Mobile App Development', 'USA', (SELECT id FROM offices WHERE name = 'New York' LIMIT 1), 'Design', 25, 'In Progress', (SELECT company_id FROM profiles WHERE id = auth.uid())),
  ('PROJ004', 'Data Analytics Platform', 'USA', (SELECT id FROM offices WHERE name = 'New York' LIMIT 1), 'Implementation', 18, 'In Progress', (SELECT company_id FROM profiles WHERE id = auth.uid())),
  ('PROJ005', 'Security Audit & Compliance', 'USA', (SELECT id FROM offices WHERE name = 'New York' LIMIT 1), 'Analysis', 22, 'Planning', (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- Create some team members if they don't exist
DO $$
DECLARE
    company_uuid UUID;
    profile_count INTEGER;
BEGIN
    -- Get the company ID
    SELECT company_id INTO company_uuid FROM profiles WHERE id = auth.uid();
    
    -- Check if we have team members
    SELECT COUNT(*) INTO profile_count FROM profiles WHERE company_id = company_uuid;
    
    -- If no team members exist, create some
    IF profile_count <= 1 THEN
        INSERT INTO profiles (
            id, email, first_name, last_name, company_id, role, weekly_capacity, department, location, job_title
        ) VALUES 
            (gen_random_uuid(), 'sarah.developer@company.com', 'Sarah', 'Developer', company_uuid, 'member', 40, 'Engineering', 'New York', 'Senior Developer'),
            (gen_random_uuid(), 'mike.designer@company.com', 'Mike', 'Designer', company_uuid, 'member', 40, 'Design', 'New York', 'UX Designer'),
            (gen_random_uuid(), 'lisa.analyst@company.com', 'Lisa', 'Analyst', company_uuid, 'member', 40, 'Analytics', 'New York', 'Data Analyst'),
            (gen_random_uuid(), 'tom.manager@company.com', 'Tom', 'Manager', company_uuid, 'member', 40, 'Management', 'New York', 'Project Manager'),
            (gen_random_uuid(), 'anna.consultant@company.com', 'Anna', 'Consultant', company_uuid, 'member', 40, 'Consulting', 'New York', 'Senior Consultant');
    END IF;
    
    -- Also create some pre-registered members for variety
    INSERT INTO invites (
        code, email, first_name, last_name, company_id, created_by, status, invitation_type, 
        weekly_capacity, department, location, job_title, role
    ) VALUES 
        ('INV001', 'james.frontend@company.com', 'James', 'Frontend', company_uuid, auth.uid(), 'pending', 'pre_registered', 40, 'Engineering', 'New York', 'Frontend Developer', 'member'),
        ('INV002', 'emma.backend@company.com', 'Emma', 'Backend', company_uuid, auth.uid(), 'pending', 'pre_registered', 40, 'Engineering', 'New York', 'Backend Developer', 'member');
END $$;