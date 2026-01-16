
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { logger } from '@/utils/logger';

// Define user role type to match the database enum
type UserRole = Database['public']['Enums']['app_role'];

interface UserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  companyId?: string;
  role?: string;
  avatarUrl?: string | null;
}

interface ProfileData {
  id: string;
  email: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  company_id: string | undefined;
  avatar_url?: string | null;
}

/**
 * Ensures a user profile exists or creates one if it doesn't
 */
export const ensureUserProfile = async (userId: string, userData?: UserData): Promise<boolean> => {
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
    const validRoles: UserRole[] = ['owner', 'admin', 'member'];
    const providedRole = userData?.role || metaData.role;
    
    // We don't store role in profiles table directly anymore (it's in user_roles table)
    // But we may still need it for initial setup
    let userRole: UserRole = 'member';
    if (providedRole && validRoles.includes(providedRole as UserRole)) {
      userRole = providedRole as UserRole;
    }
    
    const profileData: ProfileData = {
      id: userId,
      email: userData?.email || user?.email,
      first_name: userData?.firstName || metaData.first_name,
      last_name: userData?.lastName || metaData.last_name,
      company_id: userData?.companyId || metaData.company_id,
      avatar_url: userData?.avatarUrl,
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
