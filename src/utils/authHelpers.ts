
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensures a user profile exists or creates one if it doesn't
 * This can be called whenever a user's auth state is verified
 */
export const ensureUserProfile = async (userId: string, userData?: any) => {
  if (!userId) {
    console.error('Cannot ensure profile: No user ID provided');
    return false;
  }
  
  console.log('Ensuring profile exists for user:', userId);
  
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
    
    // Get user data from auth if available
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Error getting auth user data:', authError);
    }
    
    // Combine provided userData with auth metadata
    const userEmail = userData?.email || authData?.user?.email;
    const metaData = authData?.user?.user_metadata || {};
    console.log('User metadata for profile creation:', metaData);
    
    const profileData = {
      id: userId,
      email: userEmail,
      first_name: userData?.firstName || metaData.first_name,
      last_name: userData?.lastName || metaData.last_name,
      company_id: userData?.companyId || metaData.company_id,
      role: userData?.role || metaData.role || 'member'
    };
    
    console.log('Attempting to create profile with data:', profileData);
    
    // Try insert first
    const { error: insertError } = await supabase
      .from('profiles')
      .insert(profileData);
    
    if (insertError) {
      console.error('Profile insert error:', insertError);
      
      // Try with upsert as fallback
      console.log('Trying upsert instead');
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(profileData);
      
      if (upsertError) {
        console.error('Profile upsert also failed:', upsertError);
        return false;
      }
    }
    
    console.log('Profile created successfully for user:', userId);
    
    // Verify the profile was actually created
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
  } catch (error) {
    console.error('Unexpected error in ensureUserProfile:', error);
    return false;
  }
};
