
-- Add admin role to Sofie Tan
INSERT INTO public.user_roles (user_id, role, company_id)
VALUES ('de07d9ef-79a1-4716-a9ca-68f5f1ec3c63', 'admin', '1cd60548-fd91-46f2-acb4-61362d71c7af')
ON CONFLICT (user_id, role, company_id) DO NOTHING;
