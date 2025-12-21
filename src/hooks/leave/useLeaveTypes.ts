import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { LeaveType } from '@/types/leave';

export const useLeaveTypes = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();

  const fetchLeaveTypes = useCallback(async () => {
    if (!company?.id) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('leave_types')
        .select('*')
        .eq('company_id', company.id)
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
  }, [company?.id]);

  const seedDefaultLeaveTypes = useCallback(async () => {
    if (!company?.id) return;

    try {
      const { error } = await supabase.rpc('seed_default_leave_types', {
        p_company_id: company.id
      });

      if (error) {
        console.error('Error seeding leave types:', error);
        return;
      }

      await fetchLeaveTypes();
    } catch (error) {
      console.error('Error seeding leave types:', error);
    }
  }, [company?.id, fetchLeaveTypes]);

  useEffect(() => {
    if (company?.id) {
      fetchLeaveTypes();
    }
  }, [company?.id, fetchLeaveTypes]);

  // Auto-seed if no leave types exist
  useEffect(() => {
    if (!isLoading && leaveTypes.length === 0 && company?.id) {
      seedDefaultLeaveTypes();
    }
  }, [isLoading, leaveTypes.length, company?.id, seedDefaultLeaveTypes]);

  return {
    leaveTypes,
    isLoading,
    refreshLeaveTypes: fetchLeaveTypes,
    seedDefaultLeaveTypes
  };
};
