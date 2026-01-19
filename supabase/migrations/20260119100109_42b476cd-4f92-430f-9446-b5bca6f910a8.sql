-- Drop the unique constraint that prevents duplicate roles per stage
ALTER TABLE public.project_stage_team_composition 
DROP CONSTRAINT project_stage_team_compositio_project_id_stage_id_reference_key;