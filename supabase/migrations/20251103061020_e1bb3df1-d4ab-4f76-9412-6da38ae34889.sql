-- Step 1: Create the app_role enum (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'member');
    END IF;
END $$;

-- Step 2: Create the user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  company_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role, company_id)
);

-- Step 3: Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create security definer function to check roles securely
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 5: Create function to get user role securely
CREATE OR REPLACE FUNCTION public.get_user_role_secure(_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE 
      WHEN role = 'owner' THEN 1
      WHEN role = 'admin' THEN 2
      WHEN role = 'member' THEN 3
    END
  LIMIT 1
$$;

-- Step 6: Migrate existing role data from profiles to user_roles
INSERT INTO public.user_roles (user_id, role, company_id)
SELECT 
  id, 
  role::TEXT::public.app_role,
  company_id
FROM public.profiles
WHERE company_id IS NOT NULL
ON CONFLICT (user_id, role, company_id) DO NOTHING;

-- Step 7: Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Company admins can view company roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
  )
);

-- Step 8: Update get_user_role function to use secure table
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT
  FROM public.user_roles
  WHERE user_id = user_id
  ORDER BY 
    CASE 
      WHEN role = 'owner' THEN 1
      WHEN role = 'admin' THEN 2
      WHEN role = 'member' THEN 3
    END
  LIMIT 1
$$;

-- Step 9: Update user_has_admin_role to use secure table
CREATE OR REPLACE FUNCTION public.user_has_admin_role(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = user_has_admin_role.user_id 
      AND role IN ('admin', 'owner')
  )
$$;

-- Step 10: Update user_has_owner_role to use secure table
CREATE OR REPLACE FUNCTION public.user_has_owner_role(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = user_has_owner_role.user_id 
      AND role = 'owner'
  )
$$;

-- Step 11: Update user_is_admin_safe to use secure table
CREATE OR REPLACE FUNCTION public.user_is_admin_safe()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner')
  )
$$;

-- Step 12: Update get_user_role_safe to use secure table
CREATE OR REPLACE FUNCTION public.get_user_role_safe()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT
  FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY 
    CASE 
      WHEN role = 'owner' THEN 1
      WHEN role = 'admin' THEN 2
      WHEN role = 'member' THEN 3
    END
  LIMIT 1
$$;

-- Step 13: Update handle_new_user trigger to use user_roles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  role_value TEXT;
  company_id_value UUID;
  invite RECORD;
BEGIN
  RAISE LOG 'Creating profile for user: % with email: %', NEW.id, NEW.email;
  
  -- Check for pre-registered invite
  SELECT * INTO invite 
  FROM public.invites 
  WHERE email = NEW.email 
    AND invitation_type = 'pre_registered' 
    AND status = 'pending';
  
  role_value := NEW.raw_user_meta_data->>'role';
  
  IF role_value IS NULL OR role_value NOT IN ('owner', 'admin', 'member') THEN
    role_value := 'member';
  END IF;
  
  IF invite.id IS NOT NULL THEN
    company_id_value := invite.company_id;
    
    UPDATE public.invites
    SET status = 'accepted', accepted_at = now(), accepted_by = NEW.id
    WHERE id = invite.id;
    
    -- Create profile WITHOUT role column
    INSERT INTO public.profiles (
      id, email, first_name, last_name, company_id,
      job_title, department, location
    )
    VALUES (
      NEW.id, NEW.email,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name',
      company_id_value,
      invite.job_title, invite.department, invite.location
    );
    
    -- Add role to user_roles table
    INSERT INTO public.user_roles (user_id, role, company_id)
    VALUES (NEW.id, role_value::public.app_role, company_id_value)
    ON CONFLICT (user_id, role, company_id) DO NOTHING;
    
    UPDATE public.project_resource_allocations
    SET resource_id = NEW.id, resource_type = 'active', updated_at = now()
    WHERE resource_id = invite.id AND resource_type = 'pre_registered';
    
    INSERT INTO public.project_resources (staff_id, project_id, company_id, hours)
    SELECT NEW.id, project_id, company_id, hours
    FROM public.pending_resources
    WHERE invite_id = invite.id;
    
    DELETE FROM public.pending_resources WHERE invite_id = invite.id;
    
  ELSE
    BEGIN
      IF NEW.raw_user_meta_data->>'company_id' IS NOT NULL THEN
        company_id_value := (NEW.raw_user_meta_data->>'company_id')::UUID;
      ELSE
        company_id_value := NULL;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      company_id_value := NULL;
    END;
    
    -- Create profile WITHOUT role column
    INSERT INTO public.profiles (
      id, email, first_name, last_name, company_id
    )
    VALUES (
      NEW.id, NEW.email,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name',
      company_id_value
    );
    
    -- Add role to user_roles table if company exists
    IF company_id_value IS NOT NULL THEN
      INSERT INTO public.user_roles (user_id, role, company_id)
      VALUES (NEW.id, role_value::public.app_role, company_id_value)
      ON CONFLICT (user_id, role, company_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_new_user function: %', SQLERRM;
  RETURN NEW;
END;
$function$;