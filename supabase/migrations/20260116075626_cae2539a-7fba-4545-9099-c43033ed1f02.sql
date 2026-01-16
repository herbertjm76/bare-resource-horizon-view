-- Add owner role for Sofie Tan (stan@hksinc.com) who is missing from user_roles
INSERT INTO user_roles (user_id, company_id, role, is_leave_admin)
VALUES ('de07d9ef-79a1-4716-a9ca-68f5f1ec3c63', '1cd60548-fd91-46f2-acb4-61362d71c7af', 'owner', true);