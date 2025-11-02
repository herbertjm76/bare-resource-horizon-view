import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useEffect, useState } from 'react';

export interface CardVisibility {
  holidays: boolean;
  annualLeave: boolean;
  otherLeave: boolean;
  notes: boolean;
  available: boolean;
  [key: string]: boolean; // For custom cards: custom_${cardId}
}

const DEFAULT_VISIBILITY: CardVisibility = {
  holidays: true,
  annualLeave: true,
  otherLeave: true,
  notes: true,
  available: true,
};

export const useCardVisibility = () => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['user-rundown-preferences', userId, company?.id],
    queryFn: async () => {
      if (!userId || !company?.id) return null;
      const { data, error } = await supabase
        .from('user_rundown_preferences')
        .select('visible_cards')
        .eq('user_id', userId)
        .eq('company_id', company.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" error
      return data?.visible_cards as CardVisibility | null;
    },
    enabled: !!userId && !!company?.id
  });

  const updateMutation = useMutation({
    mutationFn: async (visibility: CardVisibility) => {
      if (!userId || !company?.id) throw new Error('Missing user or company');
      const { data, error } = await supabase
        .from('user_rundown_preferences')
        .upsert({
          user_id: userId,
          company_id: company.id,
          visible_cards: visibility
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-rundown-preferences'] });
    }
  });

  // Merge saved preferences with defaults
  const visibility = { ...DEFAULT_VISIBILITY, ...preferences };

  console.log('Card Visibility State:', visibility);
  console.log('Preferences from DB:', preferences);

  const toggleCard = (cardKey: string, isVisible: boolean) => {
    console.log(`Toggling ${cardKey} to ${isVisible}`);
    const newVisibility = { ...visibility, [cardKey]: isVisible };
    console.log('New visibility state:', newVisibility);
    updateMutation.mutate(newVisibility);
  };

  return {
    visibility,
    toggleCard,
    isLoading
  };
};
