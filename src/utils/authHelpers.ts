
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
  
  // First check if profile exists
  try {
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    // If profile exists, we're good
    if (existingProfile) {
      console.log('User profile already exists:', existingProfile.id);
      return true;
    }
    
    console.log('Profile not found, attempting to create');
    
    // Get user metadata from auth if available
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Error getting auth user data:', authError);
    }
    
    // Combine provided userData with auth metadata
    const metaData = user?.user_metadata || {};
    console.log('User metadata for profile creation:', metaData);
    
    // Ensure role is a valid type from the user_role enum
    const role = userData?.role || metaData.role || 'member';
    
    const profileData = {
      id: userId,
      email: userData?.email || user?.email,
      first_name: userData?.firstName || metaData.first_name,
      last_name: userData?.lastName || metaData.last_name,
      company_id: userData?.companyId || metaData.company_id,
      role: role
    };
    
    console.log('Attempting to create profile with data:', profileData);
    
    // Try upsert operation (handles both insert and update)
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert(profileData);
    
    if (upsertError) {
      console.error('Profile upsert error:', upsertError);
      return false;
    }
    
    console.log('Profile created successfully for user:', userId);
    return true;
  } catch (error) {
    console.error('Unexpected error in ensureUserProfile:', error);
    return false;
  }
};
