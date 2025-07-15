-- First, insert the office if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM offices WHERE name = 'New York' AND country = 'USA') THEN
        INSERT INTO offices (name, country) VALUES ('New York', 'USA');
    END IF;
END $$;

-- Create a sample company if none exists
DO $$
DECLARE
    company_uuid UUID;
    office_uuid UUID;
    project_count INTEGER;
    user_uuid UUID := auth.uid();
BEGIN
    -- Get or create a company
    SELECT id INTO company_uuid FROM companies LIMIT 1;
    
    IF company_uuid IS NULL THEN
        INSERT INTO companies (name, subdomain, country) 
        VALUES ('Sample Company', 'sample-company', 'USA')
        RETURNING id INTO company_uuid;
    END IF;
    
    -- Create a profile for the current user if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_uuid) THEN
        INSERT INTO profiles (id, email, first_name, last_name, company_id, role, weekly_capacity)
        VALUES (user_uuid, 'user@company.com', 'Paul', 'Julius', company_uuid, 'owner', 40);
    END IF;
    
    -- Get the office ID
    SELECT id INTO office_uuid FROM offices WHERE name = 'New York' AND country = 'USA' LIMIT 1;
    
    -- Check if projects already exist
    SELECT COUNT(*) INTO project_count FROM projects WHERE company_id = company_uuid;
    
    -- Create projects only if they don't exist
    IF project_count = 0 THEN
        INSERT INTO projects (
            code, name, country, office_id, current_stage, target_profit_percentage, status, company_id
        ) VALUES 
            ('PROJ001', 'Digital Transformation Initiative', 'USA', office_uuid, 'Planning', 15, 'In Progress', company_uuid),
            ('PROJ002', 'E-commerce Platform Upgrade', 'USA', office_uuid, 'Development', 20, 'In Progress', company_uuid),
            ('PROJ003', 'Mobile App Development', 'USA', office_uuid, 'Design', 25, 'In Progress', company_uuid),
            ('PROJ004', 'Data Analytics Platform', 'USA', office_uuid, 'Implementation', 18, 'In Progress', company_uuid),
            ('PROJ005', 'Security Audit & Compliance', 'USA', office_uuid, 'Analysis', 22, 'Planning', company_uuid);
    END IF;
    
    -- Create some pre-registered members for the workload
    INSERT INTO invites (
        code, email, first_name, last_name, company_id, created_by, status, invitation_type, 
        weekly_capacity, department, location, job_title, role
    ) VALUES 
        ('INV001', 'sarah.developer@company.com', 'Sarah', 'Developer', company_uuid, user_uuid, 'pending', 'pre_registered', 40, 'Engineering', 'New York', 'Senior Developer', 'member'),
        ('INV002', 'mike.designer@company.com', 'Mike', 'Designer', company_uuid, user_uuid, 'pending', 'pre_registered', 40, 'Design', 'New York', 'UX Designer', 'member'),
        ('INV003', 'lisa.analyst@company.com', 'Lisa', 'Analyst', company_uuid, user_uuid, 'pending', 'pre_registered', 40, 'Analytics', 'New York', 'Data Analyst', 'member'),
        ('INV004', 'james.frontend@company.com', 'James', 'Frontend', company_uuid, user_uuid, 'pending', 'pre_registered', 40, 'Engineering', 'New York', 'Frontend Developer', 'member'),
        ('INV005', 'emma.backend@company.com', 'Emma', 'Backend', company_uuid, user_uuid, 'pending', 'pre_registered', 40, 'Engineering', 'New York', 'Backend Developer', 'member');
END $$;