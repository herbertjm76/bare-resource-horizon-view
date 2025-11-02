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
  const [localVisibility, setLocalVisibility] = useState<CardVisibility>(DEFAULT_VISIBILITY);

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

  // Sync local state when preferences load/change
  useEffect(() => {
    setLocalVisibility({ ...DEFAULT_VISIBILITY, ...(preferences || {}) });
  }, [preferences]);

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

  console.log('Card Visibility State:', localVisibility);
  console.log('Preferences from DB:', preferences ?? { _type: 'undefined', value: 'undefined' });

  const toggleCard = (cardKey: string, isVisible: boolean) => {
    console.log(`Toggling ${cardKey} to ${isVisible}`);
    const newVisibility = { ...localVisibility, [cardKey]: isVisible };
    console.log('New visibility state:', newVisibility);
    setLocalVisibility(newVisibility); // Optimistic update for responsive UI
    updateMutation.mutate(newVisibility);
  };

  return {
    visibility: localVisibility,
    toggleCard,
    isLoading
  };
};
