
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

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
      if (checkError.code === 'PGRST301') {
        // This is an RLS error - could be policy issue
        console.error('This appears to be an RLS permission error. Check policies.');
      }
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

    // Try multiple approaches to create the profile with retries
    let profileCreated = false;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (!profileCreated && attempts < maxAttempts) {
      attempts++;
      console.log(`Profile creation attempt ${attempts}/${maxAttempts}`);
      
      try {
        // Prepare profile data
        const profileData = {
          id: userId,
          email: userData?.email || user?.email || '',
          first_name: userData?.firstName || metaData.first_name || '',
          last_name: userData?.lastName || metaData.last_name || '',
          company_id: userData?.companyId || metaData.company_id || null,
          role: userRole
        };
        
        console.log('Attempting to create profile with data:', JSON.stringify(profileData));
        
        // Try insert operation
        const { data: insertData, error: insertError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();
        
        if (!insertError) {
          console.log('Profile insert successful on attempt', attempts, insertData);
          profileCreated = true;
          break;
        }
        
        console.log('Profile insert failed:', insertError);
        
        if (insertError.code === 'PGRST301') {
          console.error('RLS policy blocking profile creation. This may be a permissions issue.');
          // Try again after a small delay, maybe auth state is still propagating
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // If first attempt fails, try upsert on subsequent attempts
        if (attempts > 1) {
          console.log('Trying upsert as fallback...');
          
          const { data: upsertData, error: upsertError } = await supabase
            .from('profiles')
            .upsert(profileData)
            .select()
            .single();
          
          if (!upsertError) {
            console.log('Profile upsert successful:', upsertData);
            profileCreated = true;
            break;
          }
          
          console.error('Profile upsert error:', upsertError);
        }
        
        // Small delay between attempts
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error('Unexpected error in profile creation attempt', attempts, error);
      }
    }
    
    return profileCreated;
  } catch (error) {
    console.error('Unexpected error in ensureUserProfile:', error);
    return false;
  }
};

/**
 * Check if the user has a valid session and profile
 * @returns Promise<boolean> True if user has valid session and profile
 */
export const checkUserSessionAndProfile = async (): Promise<boolean> => {
  try {
    // First check session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session check error:', sessionError);
      return false;
    }
    
    if (!session) {
      console.log('No active session');
      return false;
    }
    
    // Then check profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .maybeSingle();
      
    if (profileError) {
      console.error('Profile check error:', profileError);
      // Try to create profile if it doesn't exist
      return await ensureUserProfile(session.user.id);
    }
    
    if (!profile) {
      console.log('No profile found, creating one');
      return await ensureUserProfile(session.user.id);
    }
    
    return true;
  } catch (error) {
    console.error('Error checking user session and profile:', error);
    return false;
  }
};
