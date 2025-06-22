
-- Update Melody Koh's avatar URL with the new uploaded image
UPDATE public.invites 
SET avatar_url = '/lovable-uploads/94d7d898-7abd-4c39-bf7e-d4f9205a6f65.png'
WHERE first_name = 'Melody' 
  AND last_name = 'Koh' 
  AND invitation_type = 'pre_registered';

-- Also handle any variations in the name
UPDATE public.invites 
SET avatar_url = '/lovable-uploads/94d7d898-7abd-4c39-bf7e-d4f9205a6f65.png'
WHERE (first_name ILIKE '%melody%')
  AND last_name ILIKE '%koh%' 
  AND invitation_type = 'pre_registered';

-- Verify the update was successful
SELECT id, first_name, last_name, avatar_url, email
FROM public.invites 
WHERE (first_name ILIKE '%melody%')
  AND last_name ILIKE '%koh%' 
  AND invitation_type = 'pre_registered';
