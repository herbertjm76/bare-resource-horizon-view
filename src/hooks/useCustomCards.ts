import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

export interface CustomCardType {
  id: string;
  company_id: string;
  label: string;
  icon?: string;
  color?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomCardEntry {
  id: string;
  card_type_id: string;
  member_id: string;
  member_type: 'active' | 'pre_registered';
  week_start_date: string;
  notes?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export const useCustomCardTypes = () => {
  const { company } = useCompany();

  return useQuery({
    queryKey: ['custom-card-types', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('weekly_custom_card_types')
        .select('*')
        .eq('company_id', company.id)
        .eq('is_active', true)
        .order('order_index');
      if (error) throw error;
      return data as CustomCardType[];
    },
    enabled: !!company?.id
  });
};

export const useCustomCardEntries = (cardTypeId: string, weekStartDate: string) => {
  const { company } = useCompany();

  return useQuery({
    queryKey: ['custom-card-entries', cardTypeId, weekStartDate, company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('weekly_custom_card_entries')
        .select('*')
        .eq('card_type_id', cardTypeId)
        .eq('week_start_date', weekStartDate)
        .eq('company_id', company.id);
      if (error) throw error;
      return data as CustomCardEntry[];
    },
    enabled: !!company?.id && !!cardTypeId
  });
};

export const useAddCardEntry = () => {
  const queryClient = useQueryClient();
  const { company } = useCompany();

  return useMutation({
    mutationFn: async (entry: Omit<CustomCardEntry, 'id' | 'created_at' | 'updated_at' | 'company_id'>) => {
      if (!company?.id) throw new Error('No company ID');
      const { data, error } = await supabase
        .from('weekly_custom_card_entries')
        .insert({ ...entry, company_id: company.id })
        .select()
        .single();
      if (error) throw error;
      return data as CustomCardEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-card-entries'] });
    }
  });
};

export const useRemoveCardEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: string) => {
      const { error } = await supabase
        .from('weekly_custom_card_entries')
        .delete()
        .eq('id', entryId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-card-entries'] });
    }
  });
};

export const useUpdateCardEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entryId, notes }: { entryId: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('weekly_custom_card_entries')
        .update({ notes })
        .eq('id', entryId)
        .select()
        .single();
      if (error) throw error;
      return data as CustomCardEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-card-entries'] });
    }
  });
};
