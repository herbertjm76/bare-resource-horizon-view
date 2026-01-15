-- Add assigned_member_id column to project_stage_team_composition
-- This allows assigning a real person to a role-based allocation

ALTER TABLE project_stage_team_composition
ADD COLUMN assigned_member_id uuid REFERENCES profiles(id) ON DELETE SET NULL;

-- Add index for performance when querying by assigned member
CREATE INDEX idx_pstc_assigned_member ON project_stage_team_composition(assigned_member_id);