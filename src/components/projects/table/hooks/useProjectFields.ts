
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export const useProjectFields = (project: any, refetch: () => void) => {
  const [editableFields, setEditableFields] = useState<Record<string, any>>({});
  const [initialFields, setInitialFields] = useState<Record<string, any>>({});

  useEffect(() => {
    const snapshot = {
      name: project.name,
      code: project.code,
      profit: project.target_profit_percentage || 0,
      country: project.country,
      department: project.department || '',
      status: project.status,
      current_stage: project.current_stage || ''
    };

    setEditableFields({ [project.id]: snapshot });
    setInitialFields({ [project.id]: snapshot });
  }, [project]);

  const handleFieldUpdate = async (projectId: string, field: string, value: any) => {
    try {
      const updateData: Record<string, any> = {};
      
      switch(field) {
        case 'name':
          updateData.name = value;
          break;
        case 'code':
          updateData.code = value;
          break;
        case 'profit':
          updateData.target_profit_percentage = value;
          break;
        case 'country':
          updateData.country = value;
          break;
        case 'department':
          updateData.department = value;
          break;
        case 'current_stage':
          updateData.current_stage = value;
          setEditableFields(prev => ({
            ...prev,
            [projectId]: {
              ...prev[projectId],
              current_stage: value
            }
          }));
          break;
        default:
          break;
      }
      
      if (Object.keys(updateData).length === 0) return;
      
      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId);
        
      if (error) {
        console.error(`Error updating ${field}:`, error);
        toast.error(`Failed to update ${field}`, { description: error.message });
      } else {
        toast.success(`${field} updated`);
        refetch();
      }
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      toast.error(`An error occurred while updating ${field}`);
    }
  };

  const updateEditableField = (projectId: string, field: string, value: any) => {
    setEditableFields(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value
      }
    }));
  };

  const getPendingUpdates = (projectId: string) => {
    const current = editableFields[projectId] || {};
    const initial = initialFields[projectId] || {};
    const updateData: Record<string, any> = {};

    const mapField = (key: string, dbKey: string = key, transform?: (v: any) => any) => {
      if (current[key] !== undefined && current[key] !== initial[key]) {
        updateData[dbKey] = transform ? transform(current[key]) : current[key];
      }
    };

    mapField('name');
    mapField('code');
    mapField('profit', 'target_profit_percentage', (v) => (v === '' ? null : Number(v)));
    mapField('country');
    mapField('department');
    mapField('current_stage', 'current_stage', (v) => v ?? '');
    mapField('status');

    return updateData;
  };

  const flushPendingUpdates = async (projectId: string) => {
    try {
      const updateData = getPendingUpdates(projectId);
      if (Object.keys(updateData).length === 0) return false;

      logger.debug(`Saving project ${projectId} with updates:`, updateData);

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId);

      if (error) {
        console.error(`Error saving project ${projectId}:`, error);
        toast.error('Failed to save changes', { 
          description: `${error.message} (Project: ${projectId.slice(0, 8)}...)` 
        });
        return false;
      }

      // Update initial snapshot to current
      setInitialFields(prev => ({
        ...prev,
        [projectId]: { ...editableFields[projectId] }
      }));

      logger.debug(`Successfully saved project ${projectId}`);
      return true;
    } catch (err: any) {
      console.error(`Error flushing updates for project ${projectId}:`, err);
      toast.error('An error occurred while saving changes', {
        description: `Project: ${projectId.slice(0, 8)}...`
      });
      return false;
    }
  };

  return { editableFields, handleFieldUpdate, updateEditableField, setEditableFields, flushPendingUpdates };
};