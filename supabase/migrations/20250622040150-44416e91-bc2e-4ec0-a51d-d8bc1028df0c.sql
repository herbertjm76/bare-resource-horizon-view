
-- Update Jingjing Kim's avatar URL with the new uploaded image
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
