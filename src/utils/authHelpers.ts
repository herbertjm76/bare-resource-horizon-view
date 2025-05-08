
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Define user role type to match the database enum
type UserRole = Database['public']['Enums']['user_role'];

interface ProfileData {
  email?: string;
  firstName?: string;
  lastName?: string;
  companyId?: string;
  role?: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Ensures a user profile exists or creates one if it doesn't
 */
export const ensureUserProfile = async (userId: string, userData?: ProfileData): Promise<boolean> => {
  if (!userId) {
    console.error('Cannot ensure profile: No user ID provided');
    return false;
  }
  
  console.log('Ensuring profile exists for user:', userId);
  
  try {
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, company_id, role')
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
    let userRole: UserRole = 'member';
    const providedRole = userData?.role || metaData.role;
    
    // Make sure the role is one of the valid enum values
    const validRoles: UserRole[] = ['owner', 'admin', 'member'];
    if (providedRole && validRoles.includes(providedRole as UserRole)) {
      userRole = providedRole as UserRole;
    }
    
    const profileData = {
      id: userId,
      email: userData?.email || user?.email || '',
      first_name: userData?.firstName || metaData.first_name || '',
      last_name: userData?.lastName || metaData.last_name || '',
      company_id: userData?.companyId || metaData.company_id || null,
      role: userRole
    };
    
    console.log('Creating profile with data:', profileData);
    
    // Try insert operation first
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();
    
    // If insert fails, try upsert as fallback
    if (insertError) {
      console.log('Profile insert failed:', insertError);
      console.log('Trying upsert as fallback...');
      
      const { data: upsertData, error: upsertError } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select()
        .single();
      
      if (upsertError) {
        console.error('Profile upsert error:', upsertError);
        return false;
      }
      
      console.log('Profile upsert successful:', upsertData);
      return true;
    }
    
    console.log('Profile insert successful:', insertData);
    return true;
  } catch (error) {
    console.error('Unexpected error in ensureUserProfile:', error);
    return false;
  }
};
