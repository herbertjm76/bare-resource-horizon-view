-- Phase 2: Add database constraints and triggers to prevent duplicate allocations
-- This enforces the Rule Book at the database level

-- Step 1: Clean up any existing duplicates before adding constraint
-- Keep only the most recently updated row for each unique key
DO $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    WITH duplicates AS (
        SELECT id,
               ROW_NUMBER() OVER (
                   PARTITION BY company_id, project_id, resource_id, allocation_date
                   ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST, id
               ) as rn
        FROM project_resource_allocations
    ),
    to_delete AS (
        DELETE FROM project_resource_allocations
        WHERE id IN (SELECT id FROM duplicates WHERE rn > 1)
        RETURNING id
    )
    SELECT COUNT(*) INTO deleted_count FROM to_delete;
    
    RAISE NOTICE 'Cleaned up % duplicate allocation rows', deleted_count;
END $$;

-- Step 2: Create the normalization trigger if it doesn't exist
DROP TRIGGER IF EXISTS trg_normalize_allocation_date ON project_resource_allocations;

CREATE TRIGGER trg_normalize_allocation_date
    BEFORE INSERT OR UPDATE ON project_resource_allocations
    FOR EACH ROW
    EXECUTE FUNCTION normalize_allocation_date_to_company_week_start();

-- Step 3: Create the validation trigger if it doesn't exist  
DROP TRIGGER IF EXISTS trg_validate_allocation_week_start ON project_resource_allocations;

CREATE TRIGGER trg_validate_allocation_week_start
    BEFORE INSERT OR UPDATE ON project_resource_allocations
    FOR EACH ROW
    EXECUTE FUNCTION validate_allocation_week_start();

-- Step 4: Add unique constraint to prevent future duplicates
-- This is the critical constraint that enforces ONE row per (company, project, resource, date)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_allocation_per_resource_week'
    ) THEN
        ALTER TABLE project_resource_allocations
        ADD CONSTRAINT unique_allocation_per_resource_week 
        UNIQUE (company_id, project_id, resource_id, allocation_date);
        
        RAISE NOTICE 'Added unique constraint unique_allocation_per_resource_week';
    ELSE
        RAISE NOTICE 'Constraint unique_allocation_per_resource_week already exists';
    END IF;
END $$;

-- Step 5: Create an index to support the constraint if not exists
CREATE INDEX IF NOT EXISTS idx_allocations_unique_lookup 
ON project_resource_allocations (company_id, project_id, resource_id, allocation_date);