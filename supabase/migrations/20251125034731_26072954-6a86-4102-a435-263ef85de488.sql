
-- Swap data between office_departments and office_practice_areas

-- Step 1: Store current departments in a temp table
CREATE TEMP TABLE temp_departments AS SELECT * FROM office_departments;

-- Step 2: Store current practice areas in a temp table  
CREATE TEMP TABLE temp_practice_areas AS SELECT * FROM office_practice_areas;

-- Step 3: Clear both tables
DELETE FROM office_departments;
DELETE FROM office_practice_areas;

-- Step 4: Move old practice areas to departments table
INSERT INTO office_departments (id, name, icon, company_id, created_at, updated_at)
SELECT id, name, icon, company_id, created_at, updated_at 
FROM temp_practice_areas;

-- Step 5: Move old departments to practice areas table
INSERT INTO office_practice_areas (id, name, icon, company_id, created_at, updated_at)
SELECT id, name, icon, company_id, created_at, updated_at
FROM temp_departments;

-- Clean up temp tables
DROP TABLE temp_departments;
DROP TABLE temp_practice_areas;
