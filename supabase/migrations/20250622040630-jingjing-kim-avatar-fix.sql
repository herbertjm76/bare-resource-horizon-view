
-- Update Jingjing Kim's avatar URL to match the working pattern used for Rob Night
UPDATE public.invites 
SET avatar_url = '/lovable-uploads/198ab1e1-e512-41b3-8ed6-db105491574a.png'
WHERE first_name = 'Jingjing' 
  AND last_name = 'Kim' 
  AND invitation_type = 'pre_registered';

-- Also handle any variations in the name (like JingJing vs Jingjing)
UPDATE public.invites 
SET avatar_url = '/lovable-uploads/198ab1e1-e512-41b3-8ed6-db105491574a.png'
WHERE (first_name ILIKE '%jingjing%' OR first_name ILIKE '%jing%')
  AND last_name ILIKE '%kim%' 
  AND invitation_type = 'pre_registered';

-- Verify the update was successful
SELECT id, first_name, last_name, avatar_url, email
FROM public.invites 
WHERE (first_name ILIKE '%jingjing%' OR first_name ILIKE '%jing%')
  AND last_name ILIKE '%kim%' 
  AND invitation_type = 'pre_registered';
