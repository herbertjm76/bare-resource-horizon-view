-- Add calendar tracking fields to leave_requests table
ALTER TABLE public.leave_requests 
ADD COLUMN IF NOT EXISTS sent_to_calendar_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS calendar_uid UUID DEFAULT gen_random_uuid();

-- Update existing rows to have unique calendar_uid
UPDATE public.leave_requests 
SET calendar_uid = gen_random_uuid() 
WHERE calendar_uid IS NULL;