import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProjectType } from '@/context/officeSettings/types';

export const useProjectTypeOperations = (
  projectTypes: ProjectType[],
  setProjectTypes: React.Dispatch<React.SetStateAction<ProjectType[]>>,
  companyId?: string
) => {
  const [editingProjectType, setEditingProjectType] = useState<ProjectType | null>(null);
  const [newProjectTypeName, setNewProjectTypeName] = useState('');
  const [newProjectTypeIcon, setNewProjectTypeIcon] = useState('');
  const [newProjectTypeColor, setNewProjectTypeColor] = useState('#6366f1');
  const [editMode, setEditMode] = useState(false);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!newProjectTypeName.trim() || !companyId) return;
    
    setIsSubmitting(true);
    try {
      if (editingProjectType) {
        const { error } = await supabase
          .from('office_project_types')
          .update({ 
            name: newProjectTypeName.trim(),
            icon: newProjectTypeIcon || null,
            color: newProjectTypeColor || null
          })
          .eq('id', editingProjectType.id);

        if (error) throw error;

        setProjectTypes(prev => 
          prev.map(pt => 
            pt.id === editingProjectType.id 
              ? { ...pt, name: newProjectTypeName.trim(), icon: newProjectTypeIcon, color: newProjectTypeColor }
              : pt
          )
        );
        toast.success('Project type updated successfully');
      } else {
        const nextOrderIndex = projectTypes.length > 0 
          ? Math.max(...projectTypes.map(pt => pt.order_index)) + 1 
          : 0;

        const { data, error } = await supabase
          .from('office_project_types')
          .insert([{ 
            name: newProjectTypeName.trim(), 
            company_id: companyId,
            icon: newProjectTypeIcon || null,
            color: newProjectTypeColor || null,
            order_index: nextOrderIndex
          }])
          .select()
          .single();

        if (error) throw error;

        setProjectTypes(prev => [...prev, {
          id: data.id,
          name: data.name,
          company_id: data.company_id,
          icon: data.icon,
          color: data.color,
          order_index: data.order_index
        }]);
        toast.success('Project type created successfully');
      }

      handleCancel();
    } catch (error: any) {
      console.error('Error saving project type:', error);
      toast.error(error.message || 'Failed to save project type');
    } finally {
      setIsSubmitting(false);
    }
  }, [newProjectTypeName, newProjectTypeIcon, newProjectTypeColor, editingProjectType, companyId, projectTypes, setProjectTypes]);

  const handleEdit = useCallback((projectType: ProjectType) => {
    setEditingProjectType(projectType);
    setNewProjectTypeName(projectType.name);
    setNewProjectTypeIcon(projectType.icon || '');
    setNewProjectTypeColor(projectType.color || '#6366f1');
    setShowAddForm(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('office_project_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjectTypes(prev => prev.filter(pt => pt.id !== id));
      toast.success('Project type deleted successfully');
    } catch (error: any) {
      console.error('Error deleting project type:', error);
      toast.error(error.message || 'Failed to delete project type');
    }
  }, [setProjectTypes]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedProjectTypes.length === 0) return;

    try {
      const { error } = await supabase
        .from('office_project_types')
        .delete()
        .in('id', selectedProjectTypes);

      if (error) throw error;

      setProjectTypes(prev => prev.filter(pt => !selectedProjectTypes.includes(pt.id)));
      setSelectedProjectTypes([]);
      toast.success(`${selectedProjectTypes.length} project types deleted successfully`);
    } catch (error: any) {
      console.error('Error deleting project types:', error);
      toast.error(error.message || 'Failed to delete project types');
    }
  }, [selectedProjectTypes, setProjectTypes]);

  const handleSelectProjectType = useCallback((id: string) => {
    setSelectedProjectTypes(prev => 
      prev.includes(id) ? prev.filter(ptId => ptId !== id) : [...prev, id]
    );
  }, []);

  const handleCancel = useCallback(() => {
    setEditingProjectType(null);
    setNewProjectTypeName('');
    setNewProjectTypeIcon('');
    setNewProjectTypeColor('#6366f1');
    setShowAddForm(false);
  }, []);

  const toggleEditMode = useCallback(() => {
    setEditMode(prev => !prev);
    setSelectedProjectTypes([]);
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingProjectType(null);
    setNewProjectTypeName('');
    setNewProjectTypeIcon('');
    setNewProjectTypeColor('#6366f1');
    setShowAddForm(true);
  }, []);

  return {
    editingProjectType,
    newProjectTypeName,
    setNewProjectTypeName,
    newProjectTypeIcon,
    setNewProjectTypeIcon,
    newProjectTypeColor,
    setNewProjectTypeColor,
    editMode,
    selectedProjectTypes,
    isSubmitting,
    showAddForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleSelectProjectType,
    handleCancel,
    toggleEditMode,
    handleAddNew
  };
};
