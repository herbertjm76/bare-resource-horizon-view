
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Role } from './types';
import { generateRoleCode } from './utils';

export const useRoleOperations = (
  roles: Role[],
  setRoles: (roles: Role[]) => void,
  companyId: string | undefined
) => {
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = async () => {
    if (!newRoleName.trim() || !companyId) return;

    setIsSubmitting(true);
    try {
      if (editingRole) {
        const { data, error } = await supabase
          .from('office_roles')
          .update({ 
            name: newRoleName.trim(),
            code: generateRoleCode(newRoleName.trim())
          })
          .eq('id', editingRole.id)
          .select()
          .single();

        if (error) throw error;

        setRoles(roles.map(role => 
          role.id === editingRole.id ? data : role
        ));
        toast.success('Role updated successfully');
      } else {
        const { data, error } = await supabase
          .from('office_roles')
          .insert([{
            name: newRoleName.trim(),
            code: generateRoleCode(newRoleName.trim()),
            company_id: companyId
          }])
          .select()
          .single();

        if (error) throw error;

        setRoles([...roles, data]);
        toast.success('Role added successfully');
      }

      setNewRoleName("");
      setEditingRole(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('Failed to save role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setNewRoleName(role.name);
    setShowAddForm(true);
  };

  const handleDelete = async (role: Role) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      const { error } = await supabase
        .from('office_roles')
        .delete()
        .eq('id', role.id);

      if (error) throw error;

      setRoles(roles.filter(r => r.id !== role.id));
      toast.success('Role deleted successfully');
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRoles.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedRoles.length} role(s)?`)) return;

    try {
      const { error } = await supabase
        .from('office_roles')
        .delete()
        .in('id', selectedRoles);

      if (error) throw error;

      setRoles(roles.filter(role => !selectedRoles.includes(role.id)));
      setSelectedRoles([]);
      setEditMode(false);
      toast.success('Roles deleted successfully');
    } catch (error) {
      console.error('Error deleting roles:', error);
      toast.error('Failed to delete roles');
    }
  };

  const handleSelectRole = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleCancel = () => {
    setEditingRole(null);
    setNewRoleName("");
    setShowAddForm(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSelectedRoles([]);
    if (!editMode) {
      setShowAddForm(false);
      setEditingRole(null);
      setNewRoleName("");
    }
  };

  const handleAddNew = () => {
    setShowAddForm(!showAddForm);
    if (!showAddForm) {
      setEditingRole(null);
      setNewRoleName("");
    }
  };

  return {
    editingRole,
    newRoleName,
    setNewRoleName,
    editMode,
    selectedRoles,
    isSubmitting,
    showAddForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleSelectRole,
    handleCancel,
    toggleEditMode,
    handleAddNew
  };
};
