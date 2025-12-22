-- Fix linter: SECURITY DEFINER view
-- Make the public.weekly_resource_allocations view run with the querying user's permissions
ALTER VIEW public.weekly_resource_allocations SET (security_invoker = true);
