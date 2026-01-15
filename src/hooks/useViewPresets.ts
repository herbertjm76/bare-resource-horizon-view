import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from './useCompanyId';
import { toast } from 'sonner';

export interface ViewPreset {
  id: string;
  name: string;
  viewType: string;
  filters: Record<string, any>;
  isDefault: boolean;
  createdAt: string;
}

export type ViewType = 'resource_scheduling' | 'resource_planning' | 'by_project' | 'by_person';

interface UseViewPresetsOptions {
  viewType: ViewType;
  onApplyPreset?: (filters: Record<string, any>) => void;
}

export const useViewPresets = ({ viewType, onApplyPreset }: UseViewPresetsOptions) => {
  const { companyId, isReady } = useCompanyId();
  const queryClient = useQueryClient();
  const [currentPresetId, setCurrentPresetId] = useState<string | null>(null);

  const queryKey = ['view-presets', companyId, viewType];

  // Fetch presets for this view type
  const { data: presets = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !companyId) return [];

      const { data, error } = await supabase
        .from('user_view_presets')
        .select('*')
        .eq('company_id', companyId)
        .eq('user_id', user.id)
        .eq('view_type', viewType)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        viewType: p.view_type,
        filters: p.filters as Record<string, any>,
        isDefault: p.is_default || false,
        createdAt: p.created_at || '',
      }));
    },
    enabled: isReady && !!companyId,
  });

  // Get default preset
  const defaultPreset = presets.find(p => p.isDefault);

  // Auto-apply default preset on load
  useEffect(() => {
    if (defaultPreset && onApplyPreset && !currentPresetId) {
      setCurrentPresetId(defaultPreset.id);
      onApplyPreset(defaultPreset.filters);
    }
  }, [defaultPreset?.id]);

  // Save new preset
  const savePresetMutation = useMutation({
    mutationFn: async ({ name, filters, setAsDefault }: { name: string; filters: Record<string, any>; setAsDefault?: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !companyId) throw new Error('Not authenticated');

      // If setting as default, unset other defaults first
      if (setAsDefault) {
        await supabase
          .from('user_view_presets')
          .update({ is_default: false })
          .eq('company_id', companyId)
          .eq('user_id', user.id)
          .eq('view_type', viewType);
      }

      const { data, error } = await supabase
        .from('user_view_presets')
        .insert({
          user_id: user.id,
          company_id: companyId,
          name,
          view_type: viewType,
          filters,
          is_default: setAsDefault || false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey });
      setCurrentPresetId(data.id);
      toast.success('Preset saved');
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error('A preset with this name already exists');
      } else {
        toast.error('Failed to save preset');
      }
    },
  });

  // Update preset
  const updatePresetMutation = useMutation({
    mutationFn: async ({ id, name, filters }: { id: string; name?: string; filters?: Record<string, any> }) => {
      const updates: any = { updated_at: new Date().toISOString() };
      if (name !== undefined) updates.name = name;
      if (filters !== undefined) updates.filters = filters;

      const { error } = await supabase
        .from('user_view_presets')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Preset updated');
    },
    onError: () => {
      toast.error('Failed to update preset');
    },
  });

  // Set default preset
  const setDefaultMutation = useMutation({
    mutationFn: async (presetId: string | null) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !companyId) throw new Error('Not authenticated');

      // Unset all defaults first
      await supabase
        .from('user_view_presets')
        .update({ is_default: false })
        .eq('company_id', companyId)
        .eq('user_id', user.id)
        .eq('view_type', viewType);

      // Set new default if provided
      if (presetId) {
        const { error } = await supabase
          .from('user_view_presets')
          .update({ is_default: true })
          .eq('id', presetId);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Default preset updated');
    },
    onError: () => {
      toast.error('Failed to update default');
    },
  });

  // Delete preset
  const deletePresetMutation = useMutation({
    mutationFn: async (presetId: string) => {
      const { error } = await supabase
        .from('user_view_presets')
        .delete()
        .eq('id', presetId);

      if (error) throw error;
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey });
      if (currentPresetId === deletedId) {
        setCurrentPresetId(null);
      }
      toast.success('Preset deleted');
    },
    onError: () => {
      toast.error('Failed to delete preset');
    },
  });

  // Apply a preset
  const applyPreset = (preset: ViewPreset) => {
    setCurrentPresetId(preset.id);
    onApplyPreset?.(preset.filters);
  };

  // Clear current preset (when filters are manually changed)
  const clearCurrentPreset = () => {
    setCurrentPresetId(null);
  };

  return {
    presets,
    isLoading,
    currentPresetId,
    defaultPreset,
    savePreset: savePresetMutation.mutate,
    updatePreset: updatePresetMutation.mutate,
    setDefault: setDefaultMutation.mutate,
    deletePreset: deletePresetMutation.mutate,
    applyPreset,
    clearCurrentPreset,
    isSaving: savePresetMutation.isPending,
    isDeleting: deletePresetMutation.isPending,
  };
};
