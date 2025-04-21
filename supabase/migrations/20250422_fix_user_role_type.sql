
-- Create a function to handle new user creation with proper enum handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Log what we're trying to do
  RAISE LOG 'Creating profile for user: % with email: %', NEW.id, NEW.email;
  
  -- Log the metadata we're attempting to extract
  RAISE LOG 'User metadata: %', NEW.raw_user_meta_data;
  RAISE LOG 'First name: %', NEW.raw_user_meta_data->>'first_name';
  RAISE LOG 'Last name: %', NEW.raw_user_meta_data->>'last_name';
  RAISE LOG 'Company ID: %', NEW.raw_user_meta_data->>'company_id';
  RAISE LOG 'Role: %', NEW.raw_user_meta_data->>'role';
  
  -- Set the role - ensure it's a valid enum value
  DECLARE
    user_role public.user_role;
  BEGIN
    -- Cast role to enum or use default 'member'
    IF NEW.raw_user_meta_data->>'role' IN ('owner', 'admin', 'member') THEN
      user_role := (NEW.raw_user_meta_data->>'role')::public.user_role;
    ELSE
      user_role := 'member'::public.user_role;
    END IF;
    
    -- Handle case where company_id might be null
    IF NEW.raw_user_meta_data->>'company_id' IS NULL THEN
      RAISE LOG 'No company_id found in metadata';
      
      -- Insert profile without company_id
      INSERT INTO public.profiles (
        id, 
        email, 
        first_name, 
        last_name,
        role
      )
      VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        user_role
      );
    ELSE
      -- Insert complete profile with company_id
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
        (NEW.raw_user_meta_data->>'company_id')::uuid,
        user_role
      );
      RAISE LOG 'Profile created successfully with company_id';
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in role handling: %', SQLERRM;
    -- Fallback to member role if there's any issue
    IF NEW.raw_user_meta_data->>'company_id' IS NULL THEN
      INSERT INTO public.profiles (
        id, 
        email, 
        first_name, 
        last_name,
        role
      )
      VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        'member'::public.user_role
      );
    ELSE
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
        (NEW.raw_user_meta_data->>'company_id')::uuid,
        'member'::public.user_role
      );
    END IF;
  END;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log any errors that occur
  RAISE LOG 'Error in handle_new_user function: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the trigger to call the function when a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
