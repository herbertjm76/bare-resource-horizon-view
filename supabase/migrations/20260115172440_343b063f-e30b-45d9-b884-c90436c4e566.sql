-- Update the check constraint to allow 'member' as a reference type
ALTER TABLE project_stage_team_composition
DROP CONSTRAINT project_stage_team_composition_reference_type_check;

ALTER TABLE project_stage_team_composition
ADD CONSTRAINT project_stage_team_composition_reference_type_check 
CHECK (reference_type = ANY (ARRAY['role'::text, 'location'::text, 'member'::text]));