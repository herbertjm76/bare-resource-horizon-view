import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ProjectStatus } from '@/context/officeSettings/types';

export const useStatusOperations = (
  statuses: ProjectStatus[],
  setStatuses: (statuses: ProjectStatus[]) => void,
  companyId: string | undefined
) => {
  const [editingStatus, setEditingStatus] = useState<ProjectStatus | null>(null);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusColor, setNewStatusColor] = useState('#6366f1');
  const [editMode, setEditMode] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = async () => {
    if (!newStatusName.trim() || !companyId) return;

    setIsSubmitting(true);
    try {
      if (editingStatus) {
        const { error } = await supabase
          .from('project_statuses')
          .update({ 
            name: newStatusName.trim(),
            color: newStatusColor,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingStatus.id);

        if (error) throw error;

        setStatuses(
          statuses.map((s) =>
            s.id === editingStatus.id
              ? { ...s, name: newStatusName.trim(), color: newStatusColor }
              : s
          )
        );
        toast.success('Status updated successfully');
      } else {
        const maxOrder = statuses.reduce((max, s) => Math.max(max, s.order_index), 0);
        
        const { data, error } = await supabase
          .from('project_statuses')
          .insert({
            name: newStatusName.trim(),
            color: newStatusColor,
            order_index: maxOrder + 1,
            company_id: companyId,
          })
          .select()
          .single();

        if (error) throw error;

        setStatuses([...statuses, data]);
        toast.success('Status added successfully');
      }

      setNewStatusName('');
      setNewStatusColor('#6366f1');
      setEditingStatus(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving status:', error);
      toast.error('Failed to save status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (status: ProjectStatus) => {
    setEditingStatus(status);
    setNewStatusName(status.name);
    setNewStatusColor(status.color || '#6366f1');
    setShowAddForm(true);
  };

  const handleDelete = async (status: ProjectStatus) => {
    if (!confirm(`Are you sure you want to delete "${status.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('project_statuses')
        .delete()
        .eq('id', status.id);

      if (error) throw error;

      setStatuses(statuses.filter((s) => s.id !== status.id));
      toast.success('Status deleted successfully');
    } catch (error) {
      console.error('Error deleting status:', error);
      toast.error('Failed to delete status');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStatuses.length === 0) return;
    if (!confirm(`Delete ${selectedStatuses.length} selected status(es)?`)) return;

    try {
      const { error } = await supabase
        .from('project_statuses')
        .delete()
        .in('id', selectedStatuses);

      if (error) throw error;

      setStatuses(statuses.filter((s) => !selectedStatuses.includes(s.id)));
      setSelectedStatuses([]);
      toast.success(`${selectedStatuses.length} status(es) deleted`);
    } catch (error) {
      console.error('Error deleting statuses:', error);
      toast.error('Failed to delete statuses');
    }
  };

  const handleSelectStatus = (statusId: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  const handleCancel = () => {
    setEditingStatus(null);
    setNewStatusName('');
    setNewStatusColor('#6366f1');
    setShowAddForm(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSelectedStatuses([]);
    if (editMode) {
      setShowAddForm(false);
      setEditingStatus(null);
      setNewStatusName('');
      setNewStatusColor('#6366f1');
    }
  };

  const handleAddNew = () => {
    setShowAddForm(!showAddForm);
    if (!showAddForm) {
      setEditingStatus(null);
      setNewStatusName('');
      setNewStatusColor('#6366f1');
    }
  };

  const handleInlineUpdate = async (status: ProjectStatus, updates: { name: string; color: string }) => {
    try {
      const { error } = await supabase
        .from('project_statuses')
        .update({ 
          name: updates.name,
          color: updates.color,
          updated_at: new Date().toISOString()
        })
        .eq('id', status.id);

      if (error) throw error;

      setStatuses(
        statuses.map((s) =>
          s.id === status.id
            ? { ...s, name: updates.name, color: updates.color }
            : s
        )
      );
      toast.success('Status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
      throw error;
    }
  };

  return {
    editingStatus,
    newStatusName,
    setNewStatusName,
    newStatusColor,
    setNewStatusColor,
    editMode,
    selectedStatuses,
    isSubmitting,
    showAddForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleSelectStatus,
    handleCancel,
    toggleEditMode,
    handleAddNew,
    handleInlineUpdate,
  };
};
