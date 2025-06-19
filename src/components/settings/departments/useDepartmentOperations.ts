
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Department } from "@/context/officeSettings/types";

export const useDepartmentOperations = (
  departments: Department[],
  setDepartments: (departments: Department[]) => void,
  companyId: string | undefined
) => {
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newDepartmentName.trim() || !companyId) return;

    setIsSubmitting(true);
    try {
      if (editingDepartment) {
        const { data, error } = await supabase
          .from('office_departments')
          .update({ name: newDepartmentName.trim() })
          .eq('id', editingDepartment.id)
          .select()
          .single();

        if (error) throw error;

        setDepartments(departments.map(dept => 
          dept.id === editingDepartment.id ? data : dept
        ));
        toast.success('Department updated successfully');
      } else {
        const { data, error } = await supabase
          .from('office_departments')
          .insert([{
            name: newDepartmentName.trim(),
            company_id: companyId
          }])
          .select()
          .single();

        if (error) throw error;

        setDepartments([...departments, data]);
        toast.success('Department added successfully');
      }

      setNewDepartmentName("");
      setEditingDepartment(null);
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error('Failed to save department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setNewDepartmentName(department.name);
  };

  const handleDelete = async (department: Department) => {
    if (!confirm('Are you sure you want to delete this department?')) return;

    try {
      const { error } = await supabase
        .from('office_departments')
        .delete()
        .eq('id', department.id);

      if (error) throw error;

      setDepartments(departments.filter(d => d.id !== department.id));
      toast.success('Department deleted successfully');
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Failed to delete department');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDepartments.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedDepartments.length} department(s)?`)) return;

    try {
      const { error } = await supabase
        .from('office_departments')
        .delete()
        .in('id', selectedDepartments);

      if (error) throw error;

      setDepartments(departments.filter(dept => !selectedDepartments.includes(dept.id)));
      setSelectedDepartments([]);
      setEditMode(false);
      toast.success('Departments deleted successfully');
    } catch (error) {
      console.error('Error deleting departments:', error);
      toast.error('Failed to delete departments');
    }
  };

  const handleSelectDepartment = (deptId: string) => {
    setSelectedDepartments(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  const handleCancel = () => {
    setEditingDepartment(null);
    setNewDepartmentName("");
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSelectedDepartments([]);
  };

  return {
    editingDepartment,
    newDepartmentName,
    setNewDepartmentName,
    editMode,
    selectedDepartments,
    isSubmitting,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleSelectDepartment,
    handleCancel,
    toggleEditMode
  };
};
