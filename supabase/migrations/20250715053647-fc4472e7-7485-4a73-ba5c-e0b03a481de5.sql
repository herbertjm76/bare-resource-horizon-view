-- First, insert the office if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM offices WHERE name = 'New York' AND country = 'USA') THEN
        INSERT INTO offices (name, country) VALUES ('New York', 'USA');
    END IF;
END $$;

-- Now create projects and team members
DO $$
DECLARE
    company_uuid UUID;
    office_uuid UUID;
    profile_count INTEGER;
BEGIN
    -- Get the company ID and office ID
    SELECT company_id INTO company_uuid FROM profiles WHERE id = auth.uid();
    SELECT id INTO office_uuid FROM offices WHERE name = 'New York' AND country = 'USA' LIMIT 1;
    
    -- Create projects with the office ID
    INSERT INTO projects (
        code, name, country, office_id, current_stage, target_profit_percentage, status, company_id
    ) VALUES 
        ('PROJ001', 'Digital Transformation Initiative', 'USA', office_uuid, 'Planning', 15, 'In Progress', company_uuid),
        ('PROJ002', 'E-commerce Platform Upgrade', 'USA', office_uuid, 'Development', 20, 'In Progress', company_uuid),
        ('PROJ003', 'Mobile App Development', 'USA', office_uuid, 'Design', 25, 'In Progress', company_uuid),
        ('PROJ004', 'Data Analytics Platform', 'USA', office_uuid, 'Implementation', 18, 'In Progress', company_uuid),
        ('PROJ005', 'Security Audit & Compliance', 'USA', office_uuid, 'Analysis', 22, 'Planning', company_uuid);
    
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