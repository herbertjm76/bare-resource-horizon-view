-- Create balanced project resource allocations from June to October 2024
-- This will distribute workload to achieve optimal (green) utilization rates
-- Target: 30-35 hours per week for optimal green utilization (75-87.5%)

DO $$
DECLARE
    company_uuid UUID;
    proj1_uuid UUID;
    proj2_uuid UUID;
    proj3_uuid UUID;
    proj4_uuid UUID;
    proj5_uuid UUID;
    user_uuid UUID := auth.uid();
    invite1_uuid UUID;
    invite2_uuid UUID;
    invite3_uuid UUID;
    invite4_uuid UUID;
    invite5_uuid UUID;
    week_date DATE;
BEGIN
    -- Get company and project IDs using actual existing project codes
    SELECT id INTO company_uuid FROM companies LIMIT 1;
    SELECT id INTO proj1_uuid FROM projects WHERE code = 'ABC' LIMIT 1;
    SELECT id INTO proj2_uuid FROM projects WHERE code = 'ABRZ' LIMIT 1;
    SELECT id INTO proj3_uuid FROM projects WHERE code = 'ALD' LIMIT 1;
    SELECT id INTO proj4_uuid FROM projects WHERE code = 'ASD' LIMIT 1;
    SELECT id INTO proj5_uuid FROM projects WHERE code = 'AYK' LIMIT 1;
    
    -- Get invite IDs for pre-registered members
    SELECT id INTO invite1_uuid FROM invites WHERE email = 'sarah.developer@company.com' LIMIT 1;
    SELECT id INTO invite2_uuid FROM invites WHERE email = 'mike.designer@company.com' LIMIT 1;
    SELECT id INTO invite3_uuid FROM invites WHERE email = 'lisa.analyst@company.com' LIMIT 1;
    SELECT id INTO invite4_uuid FROM invites WHERE email = 'james.frontend@company.com' LIMIT 1;
    SELECT id INTO invite5_uuid FROM invites WHERE email = 'emma.backend@company.com' LIMIT 1;
    
    -- Debug: Log what we found
    RAISE NOTICE 'Company ID: %', company_uuid;
    RAISE NOTICE 'Project 1 (ABC): %', proj1_uuid;
    RAISE NOTICE 'Project 2 (ABRZ): %', proj2_uuid;
    RAISE NOTICE 'Project 3 (ALD): %', proj3_uuid;
    RAISE NOTICE 'Project 4 (ASD): %', proj4_uuid;
    RAISE NOTICE 'Project 5 (AYK): %', proj5_uuid;
    
    -- Only proceed if we have projects
    IF proj1_uuid IS NULL OR proj2_uuid IS NULL OR proj3_uuid IS NULL OR proj4_uuid IS NULL OR proj5_uuid IS NULL THEN
        RAISE EXCEPTION 'One or more projects not found';
    END IF;
    
    -- Clear existing allocations for June-November 2024 (including November to clean up)
    DELETE FROM project_resource_allocations 
    WHERE week_start_date >= '2024-06-03' 
    AND week_start_date <= '2024-11-25'
    AND company_id = company_uuid;
    
    -- Loop through weeks from June to October 2024 (stop before November)
    week_date := '2024-06-03'; -- First Monday of June
    
    WHILE week_date <= '2024-10-28' LOOP -- End in October, no November data
        -- Paul Julius (owner) - 32 hours total for optimal utilization
        INSERT INTO project_resource_allocations (project_id, resource_id, resource_type, week_start_date, hours, company_id)
        VALUES 
            (proj1_uuid, user_uuid, 'active', week_date, 12, company_uuid),
            (proj2_uuid, user_uuid, 'active', week_date, 12, company_uuid),
            (proj5_uuid, user_uuid, 'active', week_date, 8, company_uuid);
        
        -- Sarah Developer - 34 hours total for optimal utilization
        INSERT INTO project_resource_allocations (project_id, resource_id, resource_type, week_start_date, hours, company_id)
        VALUES 
            (proj1_uuid, invite1_uuid, 'pre_registered', week_date, 18, company_uuid),
            (proj2_uuid, invite1_uuid, 'pre_registered', week_date, 16, company_uuid);
        
        -- Mike Designer - 33 hours total for optimal utilization
        INSERT INTO project_resource_allocations (project_id, resource_id, resource_type, week_start_date, hours, company_id)
        VALUES 
            (proj3_uuid, invite2_uuid, 'pre_registered', week_date, 20, company_uuid),
            (proj2_uuid, invite2_uuid, 'pre_registered', week_date, 13, company_uuid);
        
        -- Lisa Analyst - 35 hours total for optimal utilization
        INSERT INTO project_resource_allocations (project_id, resource_id, resource_type, week_start_date, hours, company_id)
        VALUES 
            (proj4_uuid, invite3_uuid, 'pre_registered', week_date, 22, company_uuid),
            (proj1_uuid, invite3_uuid, 'pre_registered', week_date, 13, company_uuid);
        
        -- James Frontend - 32 hours total for optimal utilization
        INSERT INTO project_resource_allocations (project_id, resource_id, resource_type, week_start_date, hours, company_id)
        VALUES 
            (proj3_uuid, invite4_uuid, 'pre_registered', week_date, 18, company_uuid),
            (proj2_uuid, invite4_uuid, 'pre_registered', week_date, 14, company_uuid);
        
        -- Emma Backend - 34 hours total for optimal utilization
        INSERT INTO project_resource_allocations (project_id, resource_id, resource_type, week_start_date, hours, company_id)
        VALUES 
            (proj4_uuid, invite5_uuid, 'pre_registered', week_date, 20, company_uuid),
            (proj2_uuid, invite5_uuid, 'pre_registered', week_date, 14, company_uuid);
        
        -- Move to next week
        week_date := week_date + INTERVAL '7 days';
    END LOOP;
    
END $$;