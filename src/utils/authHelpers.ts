
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensures a user profile exists or creates one if it doesn't
 * This can be called whenever a user's auth state is verified
 */
export const ensureUserProfile = async (userId: string, userData?: any) => {
  if (!userId) return false;
  
  try {
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    // If profile exists, we're good
    if (existingProfile) {
      console.log('User profile exists:', existingProfile.id);
      return true;
    }
    
    // If no profile and no user data, we can't create one
    if (!userData) {
      console.error('Cannot create profile: No user data provided and no existing profile found');
      return false;
    }
    
    // Get user data from auth if available
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Error getting auth user data:', authError);
    }
    
    // Merge metadata from auth with provided userData
    const metaData = authData?.user?.user_metadata || {};
    const profileData = {
      id: userId,
      email: userData.email || authData?.user?.email,
      first_name: userData.firstName || metaData.first_name,
      last_name: userData.lastName || metaData.last_name,
      company_id: userData.companyId || metaData.company_id,
      role: userData.role || metaData.role || 'member'
    };
    
    // Insert profile
    const { error: insertError } = await supabase
      .from('profiles')
      .insert(profileData);
    
    if (insertError) {
      console.error('Profile insert error:', insertError);
      
      // Try with upsert as fallback
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(profileData);
      
      if (upsertError) {
        console.error('Profile upsert error:', upsertError);
        return false;
      }
    }
    
    console.log('Profile created successfully for user:', userId);
    return true;
  } catch (error) {
    console.error('Error in ensureUserProfile:', error);
    return false;
  }
};
