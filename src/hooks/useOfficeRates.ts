import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

export interface OfficeRate {
  id: string;
  referenceId: string;
  type: 'role' | 'location';
  value: number;
  unit: string;
}

export const useOfficeRates = () => {
  const { company } = useCompany();

  return useQuery({
    queryKey: ['office-rates', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('office_rates')
        .select('id, reference_id, type, value, unit')
        .eq('company_id', company.id);

      if (error) throw error;
      
      return (data || []).map(r => ({
        id: r.id,
        referenceId: r.reference_id,
        type: r.type as 'role' | 'location',
        value: r.value,
        unit: r.unit
      })) as OfficeRate[];
    },
    enabled: !!company?.id,
  });
};

// Helper function to get rate for a specific reference
export const getRateForReference = (
  rates: OfficeRate[],
  referenceId: string,
  type: 'role' | 'location' | 'member'
): number => {
  // For members, we'd need to look up their location or role rate
  // For now, we check if there's a direct rate for the reference
  const rate = rates.find(
    r => r.referenceId === referenceId && (r.type === type || (type === 'member' && r.type === 'role'))
  );
  return rate?.value || 0;
};
