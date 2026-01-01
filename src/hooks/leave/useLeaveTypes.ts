import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_LEAVE_TYPES } from '@/data/demoData';
import { toast } from 'sonner';
import { LeaveType } from '@/types/leave';

export const useLeaveTypes = () => {
  const { isDemoMode } = useDemoAuth();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { companyId } = useCompanyId();
  
  // Return demo data in demo mode
  if (isDemoMode) {
    return {
      leaveTypes: DEMO_LEAVE_TYPES as LeaveType[],
      isLoading: false,
      refreshLeaveTypes: () => {},
      seedDefaultLeaveTypes: () => {}
    };
  }

  const fetchLeaveTypes = useCallback(async () => {
    if (!companyId) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('leave_types')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching leave types:', error);
        toast.error('Failed to load leave types');
        return;
      }

      setLeaveTypes(data || []);
    } catch (error) {
      console.error('Error in fetchLeaveTypes:', error);
      toast.error('Failed to load leave types');
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  const seedDefaultLeaveTypes = useCallback(async () => {
    if (!companyId) return;

    try {
      const { error } = await supabase.rpc('seed_default_leave_types', {
        p_company_id: companyId
      });

      if (error) {
        console.error('Error seeding leave types:', error);
        return;
      }

      await fetchLeaveTypes();
    } catch (error) {
      console.error('Error seeding leave types:', error);
    }
  }, [companyId, fetchLeaveTypes]);

  useEffect(() => {
    if (companyId) {
      fetchLeaveTypes();
    }
  }, [companyId, fetchLeaveTypes]);

  // Auto-seed if no leave types exist
  useEffect(() => {
    if (!isLoading && leaveTypes.length === 0 && companyId) {
      seedDefaultLeaveTypes();
    }
  }, [isLoading, leaveTypes.length, companyId, seedDefaultLeaveTypes]);

  return {
    leaveTypes,
    isLoading,
    refreshLeaveTypes: fetchLeaveTypes,
    seedDefaultLeaveTypes
  };
};
