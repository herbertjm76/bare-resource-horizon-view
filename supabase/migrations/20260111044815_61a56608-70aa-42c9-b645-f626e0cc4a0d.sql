-- Speed up weekly allocation reads/writes (critical for edit dialog responsiveness)
-- Composite index supports queries filtered by company/project/resource/type and week range on allocation_date.
CREATE INDEX IF NOT EXISTS idx_pra_company_project_resource_type_date
ON public.project_resource_allocations (company_id, project_id, resource_id, resource_type, allocation_date);

-- Helpful for week-range scans per company (used by overview aggregations)
CREATE INDEX IF NOT EXISTS idx_pra_company_date
ON public.project_resource_allocations (company_id, allocation_date);
