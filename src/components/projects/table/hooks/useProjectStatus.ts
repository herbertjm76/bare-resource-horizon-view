
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProjectStatus = (refetch: () => void) => {
  const handleStatusChange = async (projectId: string, statusName: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: statusName })
        .eq('id', projectId);
        
      if (error) {
        toast.error('Failed to update status', { description: error.message });
      } else {
        toast.success('Status updated');
        refetch();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('An error occurred while updating the status');
    }
  };

  const handleStageChange = async (projectId: string, newStage: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ current_stage: newStage })
        .eq('id', projectId);
        
      if (error) {
        console.error('Database error:', error);
        toast.error('Failed to update current stage', { description: error.message });
      } else {
        toast.success('Current stage updated');
        refetch();
      }
    } catch (err) {
      console.error('Error updating stage:', err);
      toast.error('An error occurred while updating the stage');
    }
  };

  return { handleStatusChange, handleStageChange };
};
