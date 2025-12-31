
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { logger } from '@/utils/logger';

// Define user role type to match the database enum
type UserRole = Database['public']['Enums']['user_role'];

/**
 * Ensures a user profile exists or creates one if it doesn't
 */
export const ensureUserProfile = async (userId: string, userData?: any) => {
  if (!userId) {
    logger.error('Cannot ensure profile: No user ID provided');
    return false;
  }
  
  logger.info('Ensuring profile exists for user:', userId);
  
  try {
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (checkError) {
      logger.error('Error checking profile existence:', checkError);
      return false;
    }
    
    // If profile exists, we're good
    if (existingProfile) {
      logger.info('User profile already exists:', existingProfile.id);
      return true;
    }
    
    logger.info('Profile not found, attempting to create');
    
    // Get user metadata from auth if available
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      logger.error('Error getting auth user data:', authError);
    }
    
    // Combine provided userData with auth metadata
    const metaData = user?.user_metadata || {};
    logger.debug('User metadata for profile creation:', metaData);
    
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
      email: userData?.email || user?.email,
      first_name: userData?.firstName || metaData.first_name,
      last_name: userData?.lastName || metaData.last_name,
      company_id: userData?.companyId || metaData.company_id,
      role: userRole
    };
    
    logger.debug('Creating profile with data:', profileData);
    
    // Try insert operation first
    const { error: insertError } = await supabase
      .from('profiles')
      .insert(profileData);
    
    // If insert fails, try upsert as fallback
    if (insertError) {
      logger.warn('Profile insert failed, trying upsert:', insertError);
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(profileData);
      
      if (upsertError) {
        logger.error('Profile upsert error:', upsertError);
        return false;
      }
    }
    
    logger.info('Profile created successfully for user:', userId);
    return true;
  } catch (error) {
    logger.error('Unexpected error in ensureUserProfile:', error);
    return false;
  }
};
