-- Ensure authenticated users can call security definer RPCs used by the app

GRANT EXECUTE ON FUNCTION public.get_projects_secure(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_company_id_safe() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_company_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_company_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_is_admin_safe() TO authenticated;

-- Optional: allow service role as well (usually already has privileges)
GRANT EXECUTE ON FUNCTION public.get_projects_secure(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.user_is_admin_safe() TO service_role;