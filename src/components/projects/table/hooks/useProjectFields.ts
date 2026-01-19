
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

const AUTO_SAVE_DELAY = 1500; // 1.5 seconds after user stops typing

export const useProjectFields = (project: any, refetch: () => void) => {
  const [editableFields, setEditableFields] = useState<Record<string, any>>({});
  const [initialFields, setInitialFields] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const initializedRef = useRef<Set<string>>(new Set());
  const autoSaveTimerRef = useRef<Record<string, NodeJS.Timeout>>({});
  const pendingFieldsRef = useRef<Record<string, Set<string>>>({});

  useEffect(() => {
    // Only initialize once per project ID to prevent overwriting user edits
    if (initializedRef.current.has(project.id)) {
      return;
    }

    const snapshot = {
      name: project.name,
      code: project.code,
      abbreviation: project.abbreviation || '',
      profit: project.target_profit_percentage || 0,
      country: project.country,
      department: project.department || '',
      status: project.status,
      current_stage: project.current_stage || '',
      project_manager_id: project.project_manager_id || ''
    };

    setEditableFields(prev => ({ ...prev, [project.id]: snapshot }));
    setInitialFields(prev => ({ ...prev, [project.id]: snapshot }));
    initializedRef.current.add(project.id);
  }, [project.id]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(autoSaveTimerRef.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

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
        case 'abbreviation':
          updateData.abbreviation = value;
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

  const getPendingUpdates = useCallback((projectId: string, currentFields: Record<string, any>) => {
    const current = currentFields[projectId] || {};
    const initial = initialFields[projectId] || {};
    const updateData: Record<string, any> = {};

    const mapField = (key: string, dbKey: string = key, transform?: (v: any) => any) => {
      if (current[key] !== undefined && current[key] !== initial[key]) {
        updateData[dbKey] = transform ? transform(current[key]) : current[key];
      }
    };

    mapField('name');
    mapField('code');
    mapField('abbreviation');
    mapField('profit', 'target_profit_percentage', (v) => (v === '' ? null : Number(v)));
    mapField('country');
    mapField('department');
    mapField('current_stage', 'current_stage', (v) => v ?? '');
    mapField('status');
    mapField('project_manager_id');

    return updateData;
  }, [initialFields]);

  const autoSave = useCallback(async (projectId: string) => {
    setIsSaving(true);
    try {
      // Get latest editable fields from state
      let currentFields: Record<string, any> = {};
      setEditableFields(prev => {
        currentFields = prev;
        return prev;
      });

      const updateData = getPendingUpdates(projectId, currentFields);
      if (Object.keys(updateData).length === 0) {
        setIsSaving(false);
        return;
      }

      logger.debug(`Auto-saving project ${projectId} with updates:`, updateData);

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId);

      if (error) {
        console.error(`Error auto-saving project ${projectId}:`, error);
        toast.error('Auto-save failed', { 
          description: error.message 
        });
      } else {
        // Update initial snapshot to current
        setInitialFields(prev => ({
          ...prev,
          [projectId]: { ...currentFields[projectId] }
        }));
        toast.success('Changes saved', { duration: 2000 });
        logger.debug(`Auto-saved project ${projectId}`);
      }
    } catch (err: any) {
      console.error(`Error auto-saving project ${projectId}:`, err);
      toast.error('Auto-save failed');
    } finally {
      setIsSaving(false);
      // Clear pending fields for this project
      if (pendingFieldsRef.current[projectId]) {
        pendingFieldsRef.current[projectId].clear();
      }
    }
  }, [getPendingUpdates]);

  const scheduleAutoSave = useCallback((projectId: string, field: string) => {
    // Track which fields have pending changes
    if (!pendingFieldsRef.current[projectId]) {
      pendingFieldsRef.current[projectId] = new Set();
    }
    pendingFieldsRef.current[projectId].add(field);

    // Clear existing timer for this project
    if (autoSaveTimerRef.current[projectId]) {
      clearTimeout(autoSaveTimerRef.current[projectId]);
    }

    // Schedule new auto-save
    autoSaveTimerRef.current[projectId] = setTimeout(() => {
      autoSave(projectId);
      delete autoSaveTimerRef.current[projectId];
    }, AUTO_SAVE_DELAY);
  }, [autoSave]);

  const updateEditableField = useCallback((projectId: string, field: string, value: any) => {
    setEditableFields(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value
      }
    }));

    // Schedule auto-save after user stops typing
    scheduleAutoSave(projectId, field);
  }, [scheduleAutoSave]);

  const flushPendingUpdates = async (projectId: string) => {
    // Cancel any pending auto-save timer
    if (autoSaveTimerRef.current[projectId]) {
      clearTimeout(autoSaveTimerRef.current[projectId]);
      delete autoSaveTimerRef.current[projectId];
    }

    try {
      const updateData = getPendingUpdates(projectId, editableFields);
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

  return { 
    editableFields, 
    handleFieldUpdate, 
    updateEditableField, 
    setEditableFields, 
    flushPendingUpdates,
    isSaving 
  };
};