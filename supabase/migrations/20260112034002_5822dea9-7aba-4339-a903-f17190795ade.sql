-- Fix corrupted resource_type for pending invites
-- Any allocation where resource_id is a pending invite should be 'pre_registered', not 'active'
UPDATE project_resource_allocations pra
SET resource_type = 'pre_registered', updated_at = now()
FROM invites i
WHERE pra.resource_id = i.id
  AND pra.resource_type = 'active'
  AND i.status = 'pending';