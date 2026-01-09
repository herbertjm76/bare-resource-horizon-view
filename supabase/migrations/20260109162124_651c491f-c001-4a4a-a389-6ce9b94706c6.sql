-- Normalize all allocation dates to Monday of their respective week
-- This fixes historical data where dates were saved on incorrect days

-- First, update Sunday allocations (DOW = 0) to Monday (add 1 day)
UPDATE project_resource_allocations
SET allocation_date = allocation_date + INTERVAL '1 day'
WHERE EXTRACT(DOW FROM allocation_date) = 0;

-- Update Saturday allocations (DOW = 6) to next Monday (add 2 days)
UPDATE project_resource_allocations
SET allocation_date = allocation_date + INTERVAL '2 days'
WHERE EXTRACT(DOW FROM allocation_date) = 6;

-- Update Tuesday allocations (DOW = 2) to previous Monday (subtract 1 day)
UPDATE project_resource_allocations
SET allocation_date = allocation_date - INTERVAL '1 day'
WHERE EXTRACT(DOW FROM allocation_date) = 2;

-- Update Wednesday allocations (DOW = 3) to previous Monday (subtract 2 days)
UPDATE project_resource_allocations
SET allocation_date = allocation_date - INTERVAL '2 days'
WHERE EXTRACT(DOW FROM allocation_date) = 3;

-- Update Thursday allocations (DOW = 4) to previous Monday (subtract 3 days)
UPDATE project_resource_allocations
SET allocation_date = allocation_date - INTERVAL '3 days'
WHERE EXTRACT(DOW FROM allocation_date) = 4;

-- Update Friday allocations (DOW = 5) to previous Monday (subtract 4 days)
UPDATE project_resource_allocations
SET allocation_date = allocation_date - INTERVAL '4 days'
WHERE EXTRACT(DOW FROM allocation_date) = 5;