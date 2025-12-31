
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export const usePendingResources = (companyId: string | undefined) => {
  const [isAssigning, setIsAssigning] = useState(false);

  const assignResources = async (inviteId: string, projectId: string, hours: number) => {
    if (!companyId) return false;
    
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
