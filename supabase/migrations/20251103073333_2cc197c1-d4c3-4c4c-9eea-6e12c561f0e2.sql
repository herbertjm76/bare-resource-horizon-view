-- Remove sensitive personal data columns from profiles table
-- These fields should only be stored in the personal_information table

ALTER TABLE profiles 
DROP COLUMN IF EXISTS phone,
DROP COLUMN IF EXISTS address,
DROP COLUMN IF EXISTS city, 
DROP COLUMN IF EXISTS state,
DROP COLUMN IF EXISTS postal_code,
DROP COLUMN IF EXISTS country,
DROP COLUMN IF EXISTS date_of_birth,
DROP COLUMN IF EXISTS emergency_contact_name,
DROP COLUMN IF EXISTS emergency_contact_phone,
DROP COLUMN IF EXISTS social_linkedin,
DROP COLUMN IF EXISTS social_twitter;