import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StageSelectorProps {
  projectId: string;
  currentStage: string;
  availableStages: string[];
  onStageChange: (newStage: string) => void;
  disabled?: boolean;
}

export const StageSelector: React.FC<StageSelectorProps> = ({
  projectId,
  currentStage,
  availableStages,
  onStageChange,
  disabled = false
}) => {
  const handleStageChange = async (newStage: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ current_stage: newStage })
        .eq('id', projectId);

      if (error) {
        toast.error('Failed to update project stage');
        return;
      }

      onStageChange(newStage);
      toast.success('Project stage updated');
    } catch (error) {
      console.error('Error updating stage:', error);
      toast.error('Failed to update project stage');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentStage}
        onValueChange={handleStageChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-32 h-6 text-xs bg-white/10 border-white/20 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableStages.map((stage) => (
            <SelectItem key={stage} value={stage} className="text-xs">
              {stage}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};