
-- Create a trigger function to create profiles when users register
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  role_value text;
  company_id_value uuid;
BEGIN
  -- Log what we're trying to do
  RAISE LOG 'Creating profile for user: % with email: %', NEW.id, NEW.email;
  RAISE LOG 'User metadata: %', NEW.raw_user_meta_data;
  
  -- Get the role value from metadata
  role_value := NEW.raw_user_meta_data->>'role';
  
  -- Validate role value - default to 'member' if invalid
  IF role_value IS NULL OR role_value NOT IN ('owner', 'admin', 'member') THEN
    role_value := 'member';
    RAISE LOG 'Invalid or missing role, using default: %', role_value;
  END IF;
  
  -- Try to parse company_id from metadata
  BEGIN
    IF NEW.raw_user_meta_data->>'company_id' IS NOT NULL THEN
      company_id_value := (NEW.raw_user_meta_data->>'company_id')::uuid;
    ELSE
      company_id_value := NULL;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error parsing company_id: %', SQLERRM;
    company_id_value := NULL;
  END;
  
  -- Insert profile
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name,
    company_id,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    company_id_value,
    role_value::public.user_role
  );
  
  RAISE LOG 'Created profile for user: %', NEW.id;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log any errors that occur
  RAISE LOG 'Error in handle_new_user function: %', SQLERRM;
  -- Don't block the user creation even if profile creation fails
  RETURN NEW;
END;
$$;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
