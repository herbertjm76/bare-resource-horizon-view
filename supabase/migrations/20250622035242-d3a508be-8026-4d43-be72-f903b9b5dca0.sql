
-- First, let's check what's currently in the database for Jingjing Kim
-- Then update with the new avatar URL
UPDATE public.invites 
SET avatar_url = '/lovable-uploads/91dd3afd-bdab-4734-b1a7-5ba7be986453.png'
WHERE first_name = 'Jingjing' 
  AND last_name = 'Kim' 
  AND invitation_type = 'pre_registered';

-- Also check if there are any variations in the name
UPDATE public.invites 
SET avatar_url = '/lovable-uploads/91dd3afd-bdab-4734-b1a7-5ba7be986453.png'
WHERE (first_name ILIKE '%jingjing%' OR first_name ILIKE '%jing%')
  AND last_name ILIKE '%kim%' 
  AND invitation_type = 'pre_registered';
