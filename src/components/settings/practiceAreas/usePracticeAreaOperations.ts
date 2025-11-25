
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PracticeArea } from "@/context/officeSettings/types";

export const usePracticeAreaOperations = (
  practiceAreas: PracticeArea[],
  setPracticeAreas: (practiceAreas: PracticeArea[]) => void,
  companyId: string | undefined
) => {
  const [editingPracticeArea, setEditingPracticeArea] = useState<PracticeArea | null>(null);
  const [newPracticeAreaName, setNewPracticeAreaName] = useState("");
  const [newPracticeAreaIcon, setNewPracticeAreaIcon] = useState("target");
  const [editMode, setEditMode] = useState(false);
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = async () => {
    if (!newPracticeAreaName.trim() || !companyId) return;

    setIsSubmitting(true);
    try {
      if (editingPracticeArea) {
        const { data, error } = await supabase
          .from('office_practice_areas')
          .update({ 
            name: newPracticeAreaName.trim(),
            icon: newPracticeAreaIcon
          })
          .eq('id', editingPracticeArea.id)
          .select()
          .single();

        if (error) throw error;

        setPracticeAreas(practiceAreas.map(practiceArea => 
          practiceArea.id === editingPracticeArea.id ? data : practiceArea
        ));
        toast.success('Practice area updated successfully');
      } else {
        const { data, error } = await supabase
          .from('office_practice_areas')
          .insert([{
            name: newPracticeAreaName.trim(),
            icon: newPracticeAreaIcon,
            company_id: companyId
          }])
          .select()
          .single();

        if (error) throw error;

        setPracticeAreas([...practiceAreas, data]);
        toast.success('Practice area added successfully');
      }

      setNewPracticeAreaName("");
      setNewPracticeAreaIcon("target");
      setEditingPracticeArea(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving practice area:', error);
      toast.error('Failed to save practice area');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (practiceArea: PracticeArea) => {
    setEditingPracticeArea(practiceArea);
    setNewPracticeAreaName(practiceArea.name);
    setNewPracticeAreaIcon(practiceArea.icon || "target");
    setShowAddForm(true);
  };

  const handleDelete = async (practiceArea: PracticeArea) => {
    if (!confirm('Are you sure you want to delete this practice area?')) return;

    try {
      const { error } = await supabase
        .from('office_practice_areas')
        .delete()
        .eq('id', practiceArea.id);

      if (error) throw error;

      setPracticeAreas(practiceAreas.filter(pa => pa.id !== practiceArea.id));
      toast.success('Practice area deleted successfully');
    } catch (error) {
      console.error('Error deleting practice area:', error);
      toast.error('Failed to delete practice area');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPracticeAreas.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedPracticeAreas.length} practice area(s)?`)) return;

    try {
      const { error } = await supabase
        .from('office_practice_areas')
        .delete()
        .in('id', selectedPracticeAreas);

      if (error) throw error;

      setPracticeAreas(practiceAreas.filter(practiceArea => !selectedPracticeAreas.includes(practiceArea.id)));
      setSelectedPracticeAreas([]);
      setEditMode(false);
      toast.success('Practice areas deleted successfully');
    } catch (error) {
      console.error('Error deleting practice areas:', error);
      toast.error('Failed to delete practice areas');
    }
  };

  const handleSelectPracticeArea = (practiceAreaId: string) => {
    setSelectedPracticeAreas(prev => 
      prev.includes(practiceAreaId) 
        ? prev.filter(id => id !== practiceAreaId)
        : [...prev, practiceAreaId]
    );
  };

  const handleCancel = () => {
    setEditingPracticeArea(null);
    setNewPracticeAreaName("");
    setNewPracticeAreaIcon("target");
    setShowAddForm(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSelectedPracticeAreas([]);
    if (!editMode) {
      setShowAddForm(false);
      setEditingPracticeArea(null);
      setNewPracticeAreaName("");
      setNewPracticeAreaIcon("target");
    }
  };

  const handleAddNew = () => {
    setShowAddForm(!showAddForm);
    if (!showAddForm) {
      setEditingPracticeArea(null);
      setNewPracticeAreaName("");
      setNewPracticeAreaIcon("target");
    }
  };

  const handleConvertToDepartment = async (practiceArea: PracticeArea) => {
    if (!companyId) return;
    
    if (!confirm(`Convert "${practiceArea.name}" to a department?`)) return;

    try {
      const { error: insertError } = await supabase
        .from('office_departments')
        .insert({
          name: practiceArea.name,
          icon: practiceArea.icon,
          company_id: companyId
        });

      if (insertError) throw insertError;

      const { error: deleteError } = await supabase
        .from('office_practice_areas')
        .delete()
        .eq('id', practiceArea.id);

      if (deleteError) throw deleteError;

      setPracticeAreas(practiceAreas.filter(pa => pa.id !== practiceArea.id));
      toast.success("Practice area converted to department successfully");
    } catch (error) {
      console.error('Error converting practice area to department:', error);
      toast.error("Failed to convert practice area to department");
    }
  };

  return {
    editingPracticeArea,
    newPracticeAreaName,
    setNewPracticeAreaName,
    newPracticeAreaIcon,
    setNewPracticeAreaIcon,
    editMode,
    selectedPracticeAreas,
    isSubmitting,
    showAddForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleSelectPracticeArea,
    handleCancel,
    toggleEditMode,
    handleAddNew,
    handleConvertToDepartment
  };
};