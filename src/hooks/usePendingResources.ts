import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { useDemoAuth } from '@/hooks/useDemoAuth';

export const usePendingResources = (companyId: string | undefined) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const { isDemoMode } = useDemoAuth();

  const assignResources = async (inviteId: string, projectId: string, hours: number) => {
    if (!companyId) return false;
    
    // Demo mode - simulate success
    if (isDemoMode) {
      logger.log('Demo mode: Simulating resource assignment');
      toast.success('Resources assigned successfully');
      return true;
    }
    
    setIsAssigning(true);
    try {
      const { error } = await supabase
        .from('pending_resources')
        .insert({
          invite_id: inviteId,
          company_id: companyId,
          project_id: projectId,
          hours
        });

      if (error) throw error;
      toast.success('Resources assigned successfully');
      return true;
    } catch (error: any) {
      logger.error('Error assigning resources:', error);
      toast.error(error.message || 'Error assigning resources');
      return false;
    } finally {
      setIsAssigning(false);
    }
  };

  return {
    assignResources,
    isAssigning
  };
};
