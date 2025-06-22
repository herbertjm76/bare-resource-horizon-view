
-- Update Jingjing Kim's avatar URL with the new uploaded image
UPDATE public.invites 
SET avatar_url = '/lovable-uploads/4c0376b8-88f0-4c1d-9c81-49027ab2ed11.png'
WHERE first_name = 'Jingjing' 
  AND last_name = 'Kim' 
  AND invitation_type = 'pre_registered';
