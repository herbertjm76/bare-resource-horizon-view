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
  announcements: boolean;
  celebrations: boolean;
  [key: string]: boolean; // For custom cards: custom_${cardId}
}

export type CardOrder = string[]; // Array of card IDs in display order

const DEFAULT_VISIBILITY: CardVisibility = {
  holidays: true,
  annualLeave: true,
  otherLeave: true,
  notes: true,
  available: true,
  announcements: true,
  celebrations: true,
};

export const useCardVisibility = () => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [localVisibility, setLocalVisibility] = useState<CardVisibility>(DEFAULT_VISIBILITY);
  const [localCardOrder, setLocalCardOrder] = useState<CardOrder>([]);

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
        .select('visible_cards, card_order')
        .eq('user_id', userId)
        .eq('company_id', company.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" error
      return data;
    },
    enabled: !!userId && !!company?.id
  });

  // Sync local state when preferences load/change
  useEffect(() => {
    if (preferences) {
      const visibleCards = preferences.visible_cards as CardVisibility | null;
      const cardOrder = preferences.card_order as CardOrder | null;
      setLocalVisibility({ ...DEFAULT_VISIBILITY, ...(visibleCards || {}) });
      setLocalCardOrder(cardOrder || []);
    }
  }, [preferences]);

  const updateVisibilityMutation = useMutation({
    mutationFn: async (visibility: CardVisibility) => {
      if (!userId || !company?.id) throw new Error('Missing user or company');
      const { data, error } = await supabase
        .from('user_rundown_preferences')
        .upsert({
          user_id: userId,
          company_id: company.id,
          visible_cards: visibility,
          card_order: localCardOrder
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

  const updateOrderMutation = useMutation({
    mutationFn: async (order: CardOrder) => {
      if (!userId || !company?.id) throw new Error('Missing user or company');
      const { data, error } = await supabase
        .from('user_rundown_preferences')
        .upsert({
          user_id: userId,
          company_id: company.id,
          visible_cards: localVisibility,
          card_order: order
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

  const toggleCard = (cardKey: string, isVisible: boolean) => {
    const newVisibility = { ...localVisibility, [cardKey]: isVisible };
    setLocalVisibility(newVisibility); // Optimistic update for responsive UI
    updateVisibilityMutation.mutate(newVisibility);
  };

  const reorderCards = (newOrder: CardOrder) => {
    setLocalCardOrder(newOrder); // Optimistic update
    updateOrderMutation.mutate(newOrder);
  };

  const moveCard = (cardId: string, direction: 'up' | 'down') => {
    const currentIndex = localCardOrder.indexOf(cardId);
    if (currentIndex === -1) return; // Card not in order array
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= localCardOrder.length) return; // Can't move further
    
    const newOrder = [...localCardOrder];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
    reorderCards(newOrder);
  };

  return {
    visibility: localVisibility,
    cardOrder: localCardOrder,
    toggleCard,
    reorderCards,
    moveCard,
    isLoading
  };
};
