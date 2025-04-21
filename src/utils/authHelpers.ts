
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensures a user profile exists or creates one if it doesn't
 * This function will implement retry logic and better error handling
 */
export const ensureUserProfile = async (userId: string, userData?: any) => {
  if (!userId) {
    console.error('Cannot ensure profile: No user ID provided');
    return false;
  }
  
  console.log('Ensuring profile exists for user:', userId);
  
  // Add a delay to allow auth.users record to be fully created
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (checkError) {
      console.log('Profile check error (expected if not exists):', checkError.message);
    }
    
    // If profile exists, we're good
    if (existingProfile) {
      console.log('User profile already exists:', existingProfile.id);
      return true;
    }
    
    console.log('Profile not found, attempting to create');
    
    // Retry logic for profile creation
    let retryCount = 0;
    const maxRetries = 3;
    let profileCreated = false;
    
    while (retryCount < maxRetries && !profileCreated) {
      try {
        retryCount++;
        console.log(`Profile creation attempt ${retryCount} of ${maxRetries}`);
        
        // Get user metadata from auth if available
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Error getting auth user data:', authError);
        }
        
        // Combine provided userData with auth metadata
        const metaData = user?.user_metadata || {};
        console.log('User metadata for profile creation:', metaData);
        
        const profileData = {
          id: userId,
          email: userData?.email || user?.email,
          first_name: userData?.firstName || metaData.first_name,
          last_name: userData?.lastName || metaData.last_name,
          company_id: userData?.companyId || metaData.company_id,
          role: userData?.role || metaData.role || 'member'
        };
        
        console.log('Attempting to create profile with data:', profileData);
        
        // Try upsert operation (handles both insert and update)
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert(profileData);
        
        if (upsertError) {
          console.error(`Profile upsert error (attempt ${retryCount}):`, upsertError);
          
          // Wait before retrying
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1500 * retryCount));
          }
        } else {
          console.log('Profile created successfully for user:', userId);
          profileCreated = true;
          break;
        }
      } catch (retryError) {
        console.error(`Unexpected error in profile creation attempt ${retryCount}:`, retryError);
        
        // Wait before retrying
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1500 * retryCount));
        }
      }
    }
    
    // Verify the profile was actually created as a final check
    if (profileCreated) {
      const { data: verifyProfile, error: verifyError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (verifyError || !verifyProfile) {
        console.error('Profile verification failed after creation:', verifyError);
        return false;
      }
      
      console.log('Profile verified after creation:', verifyProfile.id);
      return true;
    }
    
    return profileCreated;
  } catch (error) {
    console.error('Unexpected error in ensureUserProfile:', error);
    return false;
  }
};
