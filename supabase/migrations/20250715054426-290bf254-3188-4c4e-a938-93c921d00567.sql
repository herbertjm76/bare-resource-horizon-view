-- Create balanced project resource allocations from June to November 2024
-- This will distribute workload evenly across team members for optimal utilization

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
    -- Get company and project IDs
    SELECT id INTO company_uuid FROM companies LIMIT 1;
    SELECT id INTO proj1_uuid FROM projects WHERE code = 'PROJ001' LIMIT 1;
    SELECT id INTO proj2_uuid FROM projects WHERE code = 'PROJ002' LIMIT 1;
    SELECT id INTO proj3_uuid FROM projects WHERE code = 'PROJ003' LIMIT 1;
    SELECT id INTO proj4_uuid FROM projects WHERE code = 'PROJ004' LIMIT 1;
    SELECT id INTO proj5_uuid FROM projects WHERE code = 'PROJ005' LIMIT 1;
    
    -- Get invite IDs for pre-registered members
    SELECT id INTO invite1_uuid FROM invites WHERE email = 'sarah.developer@company.com' LIMIT 1;
    SELECT id INTO invite2_uuid FROM invites WHERE email = 'mike.designer@company.com' LIMIT 1;
    SELECT id INTO invite3_uuid FROM invites WHERE email = 'lisa.analyst@company.com' LIMIT 1;
    SELECT id INTO invite4_uuid FROM invites WHERE email = 'james.frontend@company.com' LIMIT 1;
    SELECT id INTO invite5_uuid FROM invites WHERE email = 'emma.backend@company.com' LIMIT 1;
    
    -- Clear existing allocations for June-November 2024
    DELETE FROM project_resource_allocations 
    WHERE week_start_date >= '2024-06-03' 
    AND week_start_date <= '2024-11-25'
    AND company_id = company_uuid;
    
    -- Loop through weeks from June to November 2024
    week_date := '2024-06-03'; -- First Monday of June
    
    WHILE week_date <= '2024-11-25' LOOP
        -- Paul Julius (owner) - balanced across multiple projects
        INSERT INTO project_resource_allocations (project_id, resource_id, resource_type, week_start_date, hours, company_id)
        VALUES 
            (proj1_uuid, user_uuid, 'active', week_date, 15, company_uuid),
            (proj2_uuid, user_uuid, 'active', week_date, 15, company_uuid),
            (proj5_uuid, user_uuid, 'active', week_date, 10, company_uuid);
        
        -- Sarah Developer - focus on digital transformation and e-commerce
        INSERT INTO project_resource_allocations (project_id, resource_id, resource_type, week_start_date, hours, company_id)
        VALUES 
            (proj1_uuid, invite1_uuid, 'pre_registered', week_date, 20, company_uuid),
            (proj2_uuid, invite1_uuid, 'pre_registered', week_date, 20, company_uuid);
        
        -- Mike Designer - focus on mobile app and some e-commerce
        INSERT INTO project_resource_allocations (project_id, resource_id, resource_type, week_start_date, hours, company_id)
        VALUES 
            (proj3_uuid, invite2_uuid, 'pre_registered', week_date, 25, company_uuid),
            (proj2_uuid, invite2_uuid, 'pre_registered', week_date, 15, company_uuid);
        
        -- Lisa Analyst - focus on data analytics and some transformation work
        INSERT INTO project_resource_allocations (project_id, resource_id, resource_type, week_start_date, hours, company_id)
        VALUES 
            (proj4_uuid, invite3_uuid, 'pre_registered', week_date, 25, company_uuid),
            (proj1_uuid, invite3_uuid, 'pre_registered', week_date, 15, company_uuid);
        
        -- James Frontend - focus on mobile app and e-commerce frontend
        INSERT INTO project_resource_allocations (project_id, resource_id, resource_type, week_start_date, hours, company_id)
        VALUES 
            (proj3_uuid, invite4_uuid, 'pre_registered', week_date, 20, company_uuid),
            (proj2_uuid, invite4_uuid, 'pre_registered', week_date, 18, company_uuid);
        
        -- Emma Backend - focus on data platform and e-commerce backend
        INSERT INTO project_resource_allocations (project_id, resource_id, resource_type, week_start_date, hours, company_id)
        VALUES 
            (proj4_uuid, invite5_uuid, 'pre_registered', week_date, 22, company_uuid),
            (proj2_uuid, invite5_uuid, 'pre_registered', week_date, 16, company_uuid);
        
        -- Move to next week
        week_date := week_date + INTERVAL '7 days';
    END LOOP;
    
END $$;