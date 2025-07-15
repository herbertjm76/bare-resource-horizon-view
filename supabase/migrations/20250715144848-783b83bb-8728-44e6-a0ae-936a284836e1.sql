-- Revert project resource allocations changes
-- This will clean up the demo data that was inserted in previous migrations

DELETE FROM public.project_resource_allocations 
WHERE week_start_date >= '2024-06-03' 
AND week_start_date <= '2024-11-25';