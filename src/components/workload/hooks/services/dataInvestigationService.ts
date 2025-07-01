
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const investigateDataConsistency = async (companyId: string, memberIds: string[]) => {
  console.log('🔍 DATA INVESTIGATION: Starting comprehensive data analysis...');
  
  // 1. Check what resource types actually exist in the database
  const { data: resourceTypes, error: rtError } = await supabase
    .from('project_resource_allocations')
    .select('resource_type')
    .eq('company_id', companyId);
    
  const uniqueResourceTypes = [...new Set(resourceTypes?.map(r => r.resource_type) || [])];
  console.log('🔍 ACTUAL RESOURCE TYPES in database:', uniqueResourceTypes);
  
  // 2. Check what member IDs actually exist in allocations
  const { data: actualMembers, error: amError } = await supabase
    .from('project_resource_allocations')
    .select('resource_id, resource_type')
    .eq('company_id', companyId)
    .in('resource_id', memberIds);
    
  console.log('🔍 ACTUAL MEMBER IDs in allocations:', actualMembers);
  
  // 3. Check if there are ANY allocations for this company with ANY resource type
  const { data: anyAllocations, error: aaError } = await supabase
    .from('project_resource_allocations')
    .select('*')
    .eq('company_id', companyId)
    .limit(5);
    
  console.log('🔍 ANY ALLOCATIONS for company:', anyAllocations);
  
  // 4. Check profiles to see if member IDs match
  const { data: profiles, error: pError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, company_id')
    .eq('company_id', companyId)
    .in('id', memberIds);
    
  console.log('🔍 PROFILES for member IDs:', profiles);
  
  // 5. Cross-reference: Check if we have allocations for ANY of the profile IDs
  if (profiles && profiles.length > 0) {
    const profileIds = profiles.map(p => p.id);
    const { data: allocationsForProfiles, error: afpError } = await supabase
      .from('project_resource_allocations')
      .select('*')
      .eq('company_id', companyId)
      .in('resource_id', profileIds);
      
    console.log('🔍 ALLOCATIONS for profile IDs:', allocationsForProfiles);
  }
  
  return {
    uniqueResourceTypes,
    actualMembers,
    anyAllocations,
    profiles
  };
};
