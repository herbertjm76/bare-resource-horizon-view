-- Make profiles.weekly_capacity nullable (exception-only pattern)
-- NULL = use company's work_week_hours setting
-- Set value = exception (part-time, intern, etc.)

ALTER TABLE profiles ALTER COLUMN weekly_capacity DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN weekly_capacity DROP DEFAULT;

-- Also update invites table to match the pattern
ALTER TABLE invites ALTER COLUMN weekly_capacity DROP DEFAULT;

-- Add a comment to document the pattern
COMMENT ON COLUMN profiles.weekly_capacity IS 'Weekly capacity in hours. NULL means use company work_week_hours setting. Only set for exceptions (part-time, interns, etc.)';
COMMENT ON COLUMN invites.weekly_capacity IS 'Weekly capacity in hours. NULL means use company work_week_hours setting. Only set for exceptions (part-time, interns, etc.)';