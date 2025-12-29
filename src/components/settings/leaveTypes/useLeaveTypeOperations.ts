import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LeaveType } from '@/types/leave';

export const useLeaveTypeOperations = (
  leaveTypes: LeaveType[],
  setLeaveTypes: React.Dispatch<React.SetStateAction<LeaveType[]>>,
  companyId: string | undefined
) => {
  const [editingType, setEditingType] = useState<LeaveType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleAddNew = () => {
    setEditingType(null);
    setShowDialog(true);
  };

  const handleEdit = (type: LeaveType) => {
    setEditingType(type);
    setShowDialog(true);
  };

  const handleCancel = () => {
    setEditingType(null);
    setShowDialog(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSelectedTypes([]);
  };

  const handleSelectType = (id: string) => {
    setSelectedTypes(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id) 
        : [...prev, id]
    );
  };

  const handleSubmit = useCallback(async (data: {
    name: string;
    code: string;
    color: string;
    icon: string;
    requires_attachment: boolean;
  }) => {
    if (!companyId) return;

    setIsSubmitting(true);

    try {
      if (editingType) {
        // Update existing
        const { error } = await supabase
          .from('leave_types')
          .update({
            name: data.name,
            code: data.code,
            color: data.color,
            icon: data.icon,
            requires_attachment: data.requires_attachment,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingType.id);

        if (error) throw error;

        setLeaveTypes(prev => 
          prev.map(t => t.id === editingType.id ? { ...t, ...data } : t)
        );
        toast.success('Leave type updated');
      } else {
        // Create new
        const maxOrder = Math.max(...leaveTypes.map(t => t.order_index), 0);
        
        const { data: newType, error } = await supabase
          .from('leave_types')
          .insert({
            company_id: companyId,
            name: data.name,
            code: data.code,
            color: data.color,
            icon: data.icon,
            requires_attachment: data.requires_attachment,
            order_index: maxOrder + 1,
            is_active: true
          })
          .select()
          .single();

        if (error) throw error;

        setLeaveTypes(prev => [...prev, newType]);
        toast.success('Leave type created');
      }

      setShowDialog(false);
      setEditingType(null);
    } catch (error) {
      console.error('Error saving leave type:', error);
      toast.error('Failed to save leave type');
    } finally {
      setIsSubmitting(false);
    }
  }, [companyId, editingType, leaveTypes, setLeaveTypes]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('leave_types')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      setLeaveTypes(prev => prev.filter(t => t.id !== id));
      toast.success('Leave type removed');
    } catch (error) {
      console.error('Error deleting leave type:', error);
      toast.error('Failed to delete leave type');
    }
  }, [setLeaveTypes]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedTypes.length === 0) return;

    try {
      const { error } = await supabase
        .from('leave_types')
        .update({ is_active: false })
        .in('id', selectedTypes);

      if (error) throw error;

      setLeaveTypes(prev => prev.filter(t => !selectedTypes.includes(t.id)));
      setSelectedTypes([]);
      toast.success(`${selectedTypes.length} leave types removed`);
    } catch (error) {
      console.error('Error bulk deleting leave types:', error);
      toast.error('Failed to delete leave types');
    }
  }, [selectedTypes, setLeaveTypes]);

  const handleReorder = useCallback(async (fromIndex: number, toIndex: number) => {
    // Reorder locally first for immediate feedback
    const reordered = [...leaveTypes];
    const [movedItem] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedItem);
    
    // Update order_index for all items
    const updatedTypes = reordered.map((type, index) => ({
      ...type,
      order_index: index + 1
    }));
    
    setLeaveTypes(updatedTypes);

    // Persist to database
    try {
      const updates = updatedTypes.map(type => 
        supabase
          .from('leave_types')
          .update({ order_index: type.order_index })
          .eq('id', type.id)
      );

      await Promise.all(updates);
      toast.success('Order updated');
    } catch (error) {
      console.error('Error reordering leave types:', error);
      toast.error('Failed to save order');
      // Revert on error
      setLeaveTypes(leaveTypes);
    }
  }, [leaveTypes, setLeaveTypes]);

  return {
    editingType,
    isSubmitting,
    showDialog,
    setShowDialog,
    editMode,
    selectedTypes,
    handleAddNew,
    handleEdit,
    handleCancel,
    toggleEditMode,
    handleSelectType,
    handleSubmit,
    handleDelete,
    handleBulkDelete,
    handleReorder
  };
};
