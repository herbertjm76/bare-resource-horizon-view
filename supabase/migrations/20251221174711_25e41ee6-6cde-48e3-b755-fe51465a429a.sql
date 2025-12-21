-- Add column to store the requested approver (PM) for leave requests
ALTER TABLE public.leave_requests 
ADD COLUMN requested_approver_id uuid REFERENCES public.profiles(id);

-- Add index for faster lookups
CREATE INDEX idx_leave_requests_requested_approver ON public.leave_requests(requested_approver_id);