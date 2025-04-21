
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Define user role type to match the database enum
type UserRole = Database['public']['Enums']['user_role'];

/**
 * Ensures a user profile exists or creates one if it doesn't
 */
export const ensureUserProfile = async (userId: string, userData?: any) => {
  if (!userId) {
    console.error('Cannot ensure profile: No user ID provided');
    return false;
  }
  
  console.log('Ensuring profile exists for user:', userId);
  
  try {
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking profile existence:', checkError);
      return false;
    }
    
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
    
    // Ensure role is always a valid UserRole enum value
    const userRole: UserRole = (userData?.role || metaData.role || 'member') as UserRole;
    
    // Make sure the role is one of the valid enum values
    const validRoles: UserRole[] = ['owner', 'admin', 'member'];
    const role: UserRole = validRoles.includes(userRole) ? userRole : 'member';
    
    const profileData = {
      id: userId,
      email: userData?.email || user?.email,
      first_name: userData?.firstName || metaData.first_name,
      last_name: userData?.lastName || metaData.last_name,
      company_id: userData?.companyId || metaData.company_id,
      role
    };
    
    console.log('Creating profile with data:', profileData);
    
    // Try insert operation first
    const { error: insertError } = await supabase
      .from('profiles')
      .insert(profileData);
    
    // If insert fails, try upsert as fallback
    if (insertError) {
      console.log('Profile insert failed, trying upsert:', insertError);
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
    console.error('Unexpected error in ensureUserProfile:', error);
    return false;
  }
};
