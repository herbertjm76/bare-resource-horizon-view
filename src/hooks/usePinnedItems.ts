import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from './useCompanyId';
import { toast } from 'sonner';
import { useCallback, useMemo } from 'react';

export type ItemType = 'project' | 'person';

interface PinnedItem {
  id: string;
  itemId: string;
  itemType: ItemType;
  displayOrder: number;
}

interface UsePinnedItemsOptions {
  viewContext: string;
  itemType: ItemType;
}

export const usePinnedItems = ({ viewContext, itemType }: UsePinnedItemsOptions) => {
  const { companyId, isReady } = useCompanyId();
  const queryClient = useQueryClient();

  const queryKey = ['pinned-items', companyId, viewContext, itemType];

  // Fetch pinned items for this context
  const { data: pinnedItems = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !companyId) return [];

      const { data, error } = await supabase
        .from('user_pinned_items')
        .select('*')
        .eq('company_id', companyId)
        .eq('user_id', user.id)
        .eq('view_context', viewContext)
        .eq('item_type', itemType)
        .order('display_order', { ascending: true });

      if (error) throw error;

      return (data || []).map(p => ({
        id: p.id,
        itemId: p.item_id,
        itemType: p.item_type as ItemType,
        displayOrder: p.display_order || 0,
      }));
    },
    enabled: isReady && !!companyId,
  });

  // Get array of pinned IDs for easy lookup
  const pinnedIds = useMemo(() => pinnedItems.map(p => p.itemId), [pinnedItems]);

  // Check if an item is pinned
  const isPinned = useCallback((itemId: string) => pinnedIds.includes(itemId), [pinnedIds]);

  // Pin an item
  const pinMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !companyId) throw new Error('Not authenticated');

      // Get max display order
      const maxOrder = pinnedItems.length > 0 
        ? Math.max(...pinnedItems.map(p => p.displayOrder)) 
        : 0;

      const { error } = await supabase
        .from('user_pinned_items')
        .insert({
          user_id: user.id,
          company_id: companyId,
          item_type: itemType,
          item_id: itemId,
          view_context: viewContext,
          display_order: maxOrder + 1,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Pinned to top');
    },
    onError: () => {
      toast.error('Failed to pin item');
    },
  });

  // Unpin an item
  const unpinMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !companyId) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_pinned_items')
        .delete()
        .eq('user_id', user.id)
        .eq('company_id', companyId)
        .eq('item_id', itemId)
        .eq('view_context', viewContext);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Unpinned');
    },
    onError: () => {
      toast.error('Failed to unpin item');
    },
  });

  // Toggle pin state
  const togglePin = useCallback((itemId: string) => {
    if (isPinned(itemId)) {
      unpinMutation.mutate(itemId);
    } else {
      pinMutation.mutate(itemId);
    }
  }, [isPinned, pinMutation, unpinMutation]);

  // Utility function to sort items with pinned at top
  const sortWithPinnedFirst = useCallback(<T extends { id: string }>(items: T[]): T[] => {
    if (pinnedIds.length === 0) return items;

    const pinned: T[] = [];
    const unpinned: T[] = [];

    // Maintain pin order based on display_order
    const pinnedOrderMap = new Map(pinnedItems.map(p => [p.itemId, p.displayOrder]));

    items.forEach(item => {
      if (pinnedIds.includes(item.id)) {
        pinned.push(item);
      } else {
        unpinned.push(item);
      }
    });

    // Sort pinned items by their display order
    pinned.sort((a, b) => {
      const orderA = pinnedOrderMap.get(a.id) || 0;
      const orderB = pinnedOrderMap.get(b.id) || 0;
      return orderA - orderB;
    });

    return [...pinned, ...unpinned];
  }, [pinnedIds, pinnedItems]);

  return {
    pinnedItems,
    pinnedIds,
    isLoading,
    isPinned,
    togglePin,
    pin: pinMutation.mutate,
    unpin: unpinMutation.mutate,
    sortWithPinnedFirst,
    isPinning: pinMutation.isPending,
    isUnpinning: unpinMutation.isPending,
  };
};
