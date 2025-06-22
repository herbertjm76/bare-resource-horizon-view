

-- Add the missing updated_at column to the invites table
ALTER TABLE public.invites 
ADD COLUMN updated_at timestamp with time zone DEFAULT now();

-- Add avatar_url column to the invites table
ALTER TABLE public.invites 
ADD COLUMN avatar_url text;

-- Update Rob Night's avatar URL in the invites table
UPDATE public.invites 
SET avatar_url = '/lovable-uploads/a408b88c-6a1d-4e6d-aa32-a365c2c434ce.png'
WHERE first_name = 'Rob' 
  AND last_name = 'Night' 
  AND invitation_type = 'pre_registered';

