
-- First check if the function already exists and drop it if it does
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create an improved function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  max_attempts INTEGER := 3;
  current_attempt INTEGER := 0;
  success BOOLEAN := FALSE;
BEGIN
  -- Log what we're trying to do for debugging
  RAISE LOG 'Creating profile for user: % with email: %', NEW.id, NEW.email;
  
  -- Log the metadata we're attempting to extract
  RAISE LOG 'User metadata: %', NEW.raw_user_meta_data;
  RAISE LOG 'First name: %', NEW.raw_user_meta_data->>'first_name';
  RAISE LOG 'Last name: %', NEW.raw_user_meta_data->>'last_name';
  RAISE LOG 'Company ID: %', NEW.raw_user_meta_data->>'company_id';
  
  -- Loop with retries to handle potential timing issues
  WHILE current_attempt < max_attempts AND NOT success LOOP
    BEGIN
      current_attempt := current_attempt + 1;
      RAISE LOG 'Attempt % to create profile', current_attempt;
      
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
          'member'
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
          COALESCE(NEW.raw_user_meta_data->>'role', 'owner')
        );
        RAISE LOG 'Profile created successfully with company_id';
      END IF;
      
      success := TRUE;
      EXIT;
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG 'Error in attempt %: %', current_attempt, SQLERRM;
      -- Wait a short time before trying again
      PERFORM pg_sleep(0.5);
    END;
  END LOOP;
  
  IF NOT success THEN
    RAISE LOG 'Failed to create profile after % attempts: %', max_attempts, SQLERRM;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the trigger to call the function when a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
