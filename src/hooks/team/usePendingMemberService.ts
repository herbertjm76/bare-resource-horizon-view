
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PendingMember } from '@/components/dashboard/types';
import { toast } from 'sonner';
import { useMemberPermissions } from './useMemberPermissions';
import { useCompany } from '@/context/CompanyContext';

/**
 * Service for managing pending team members in the invites table
 */
export const usePendingMemberService = (initialCompanyId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkUserPermissions } = useMemberPermissions();
  // Use the company context to get the company ID as a fallback
  const { company } = useCompany();
  const [companyId, setCompanyId] = useState<string | undefined>(initialCompanyId);
  
  // If initialCompanyId is not provided, try to get it from the company context
  useEffect(() => {
    if (!initialCompanyId && company?.id) {
      console.log('Using company ID from context:', company.id);
      setCompanyId(company.id);
    }
  }, [initialCompanyId, company]);

  /**
   * Update a pending member (pre-registered)
   */
  const updatePendingMember = async (memberData: Partial<PendingMember>) => {
    const effectiveCompanyId = companyId || company?.id;
    
    if (!effectiveCompanyId) {
      console.error('Company ID missing for updatePendingMember', {
        providedCompanyId: companyId,
        contextCompanyId: company?.id,
      });
      toast.error('Company ID is required');
      return false;
    }

    try {
      setIsLoading(true);
      
      // Check user permissions
      const permissionCheck = await checkUserPermissions();
      if (!permissionCheck.hasPermission) {
        toast.error('You do not have permission to update team members');
        return false;
      }

      console.log('Updating pre-registered member in invites table:', memberData);
      console.log('Using company ID:', effectiveCompanyId);
      
      // Extract only the fields we need to update
      const updateData = {
        first_name: memberData.first_name,
        last_name: memberData.last_name,
        email: memberData.email,
        role: memberData.role,
        department: memberData.department,
        location: memberData.location,
        job_title: memberData.job_title,
        weekly_capacity: memberData.weekly_capacity
      };
      
      console.log('Update data being sent to invites table:', updateData);
      
      const { error } = await supabase
        .from('invites')
        .update(updateData)
        .eq('id', memberData.id)
        .eq('company_id', effectiveCompanyId);  // Add company_id check for security

      if (error) {
        console.error('Error updating pre-registered member:', error);
        toast.error(`Failed to update member: ${error.message}`);
        return false;
      }
      
      console.log('Successfully updated pre-registered member');
      toast.success('Pre-registered member updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating pending member:', error);
      toast.error(error.message || 'Failed to update team member');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new pending member (pre-registered)
   */
  const createPendingMember = async (memberData: Partial<PendingMember>) => {
    const effectiveCompanyId = companyId || company?.id;
    
    if (!effectiveCompanyId) {
      console.error('Company ID missing for createPendingMember', {
        providedCompanyId: companyId,
        contextCompanyId: company?.id,
        memberData,
      });
      toast.error('Company ID is required');
      return false;
    }

    try {
      setIsLoading(true);
      
      // Check user permissions
      const permissionCheck = await checkUserPermissions();
      if (!permissionCheck.hasPermission) {
        toast.error('You do not have permission to add team members');
        return false;
      }

      // Get current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error('You must be logged in to invite team members');
        return false;
      }
      
      console.log('Creating new pre-registered member in invites table with company ID:', effectiveCompanyId);
      
      // Create new pre-registered member in invites table
      const { error } = await supabase
        .from('invites')
        .insert({
          email: memberData.email,
          company_id: effectiveCompanyId,
          code: Math.random().toString(36).substring(2, 10).toUpperCase(),
          created_by: session.user.id,
          invitation_type: 'pre_registered',
          first_name: memberData.first_name,
          last_name: memberData.last_name,
          department: memberData.department,
          location: memberData.location,
          job_title: memberData.job_title,
          role: memberData.role,
          weekly_capacity: memberData.weekly_capacity || 40
        });

      if (error) {
        console.error('Error creating pre-registered member:', error);
        toast.error(`Failed to create member: ${error.message}`);
        return false;
      }
      
      console.log('Successfully created pre-registered member');
      toast.success('Pre-registered new team member');
      return true;
    } catch (error: any) {
      console.error('Error creating pending member:', error);
      toast.error(error.message || 'Failed to create team member');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a pending member
   */
  const deletePendingMember = async (memberId: string) => {
    const effectiveCompanyId = companyId || company?.id;
    
    if (!effectiveCompanyId) {
      console.error('Company ID missing for deletePendingMember');
      toast.error('Company ID is required');
      return false;
    }

    try {
      setIsLoading(true);
      
      // Check user permissions
      const permissionCheck = await checkUserPermissions();
      if (!permissionCheck.hasPermission) {
        toast.error('You do not have permission to delete team members');
        return false;
      }
      
      console.log('Deleting pending member from invites table:', memberId);
      console.log('Using company ID:', effectiveCompanyId);
      
      // Delete from invites table
      const { error } = await supabase
        .from('invites')
        .delete()
        .eq('id', memberId)
        .eq('company_id', effectiveCompanyId); // Add company_id check for security
        
      if (error) {
        console.error('Error deleting from invites:', error);
        toast.error(`Failed to delete member: ${error.message}`);
        return false;
      }
      
      console.log('Successfully deleted from invites table');
      return true;
    } catch (error: any) {
      console.error('Error deleting pending member:', error);
      toast.error(error.message || 'Failed to delete team member');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updatePendingMember,
    createPendingMember,
    deletePendingMember,
    isLoading,
    companyId: effectiveCompanyId
  };
};
