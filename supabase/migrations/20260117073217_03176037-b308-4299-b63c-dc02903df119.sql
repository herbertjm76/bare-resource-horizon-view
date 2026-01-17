-- Part 1: Fix existing NULL roles in invites table
UPDATE invites SET role = 'member' WHERE role IS NULL;

-- Part 2: Add NOT NULL constraint with default to invites.role
ALTER TABLE invites ALTER COLUMN role SET DEFAULT 'member';
ALTER TABLE invites ALTER COLUMN role SET NOT NULL;

-- Part 3: Insert missing user_roles for existing profiles that don't have any role
INSERT INTO user_roles (user_id, company_id, role)
SELECT p.id, p.company_id, 'member'::app_role
FROM profiles p
WHERE p.company_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = p.id AND ur.company_id = p.company_id
  );