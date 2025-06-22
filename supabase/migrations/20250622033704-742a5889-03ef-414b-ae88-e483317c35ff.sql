
-- Update Jingjing Kim's avatar URL in the invites table
UPDATE public.invites 
SET avatar_url = '/lovable-uploads/debd7440-994c-4c76-b35e-f5860248b4e1.png'
WHERE first_name = 'Jingjing' 
  AND last_name = 'Kim' 
  AND invitation_type = 'pre_registered';
