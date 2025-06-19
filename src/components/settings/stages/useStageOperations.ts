
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProjectStage } from "@/context/officeSettings/types";

export const useStageOperations = (
  office_stages: ProjectStage[],
  setOfficeStages: (stages: ProjectStage[]) => void,
  companyId: string | undefined
) => {
  const [editingStage, setEditingStage] = useState<ProjectStage | null>(null);
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState("#E5DEFF");
  const [editMode, setEditMode] = useState(false);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getNextOrderIndex = () => {
    if (office_stages.length === 0) return 0;
    return Math.max(...office_stages.map(stage => stage.order_index || 0)) + 1;
  };

  const handleSubmit = async () => {
    if (!newStageName.trim() || !companyId) return;

    setIsSubmitting(true);
    try {
      if (editingStage) {
        const { data, error } = await supabase
          .from('office_stages')
          .update({ 
            name: newStageName.trim(),
            color: newStageColor
          })
          .eq('id', editingStage.id)
          .select()
          .single();

        if (error) throw error;

        setOfficeStages(office_stages.map(stage => 
          stage.id === editingStage.id ? data : stage
        ));
        toast.success('Stage updated successfully');
      } else {
        const { data, error } = await supabase
          .from('office_stages')
          .insert([{
            name: newStageName.trim(),
            color: newStageColor,
            company_id: companyId,
            order_index: getNextOrderIndex()
          }])
          .select()
          .single();

        if (error) throw error;

        setOfficeStages([...office_stages, data]);
        toast.success('Stage added successfully');
      }

      setNewStageName("");
      setNewStageColor("#E5DEFF");
      setEditingStage(null);
    } catch (error) {
      console.error('Error saving stage:', error);
      toast.error('Failed to save stage');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (stage: ProjectStage) => {
    setEditingStage(stage);
    setNewStageName(stage.name);
    setNewStageColor(stage.color || "#E5DEFF");
  };

  const handleDelete = async (stage: ProjectStage) => {
    if (!confirm('Are you sure you want to delete this stage?')) return;

    try {
      const { error } = await supabase
        .from('office_stages')
        .delete()
        .eq('id', stage.id);

      if (error) throw error;

      setOfficeStages(office_stages.filter(s => s.id !== stage.id));
      toast.success('Stage deleted successfully');
    } catch (error) {
      console.error('Error deleting stage:', error);
      toast.error('Failed to delete stage');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStages.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedStages.length} stage(s)?`)) return;

    try {
      const { error } = await supabase
        .from('office_stages')
        .delete()
        .in('id', selectedStages);

      if (error) throw error;

      setOfficeStages(office_stages.filter(stage => !selectedStages.includes(stage.id)));
      setSelectedStages([]);
      setEditMode(false);
      toast.success('Stages deleted successfully');
    } catch (error) {
      console.error('Error deleting stages:', error);
      toast.error('Failed to delete stages');
    }
  };

  const handleSelectStage = (stageId: string) => {
    setSelectedStages(prev => 
      prev.includes(stageId) 
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    );
  };

  const handleCancel = () => {
    setEditingStage(null);
    setNewStageName("");
    setNewStageColor("#E5DEFF");
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSelectedStages([]);
  };

  return {
    editingStage,
    newStageName,
    setNewStageName,
    newStageColor,
    setNewStageColor,
    editMode,
    selectedStages,
    isSubmitting,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleSelectStage,
    handleCancel,
    toggleEditMode
  };
};
