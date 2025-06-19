import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useCompany } from "@/context/CompanyContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const RolesTab = () => {
  const { roles, setRoles, loading } = useOfficeSettings();
  const { company } = useCompany();
  const [editingRole, setEditingRole] = useState<any>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateRoleCode = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '_');
  };

  const handleSubmit = async () => {
    if (!newRoleName.trim() || !company) return;

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
            company_id: company.id
          }])
          .select()
          .single();

        if (error) throw error;

        setRoles([...roles, data]);
        toast.success('Role added successfully');
      }

      setNewRoleName("");
      setEditingRole(null);
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('Failed to save role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setNewRoleName(role.name);
  };

  const handleDelete = async (role: any) => {
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading roles...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Team Roles</CardTitle>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={editMode ? "secondary" : "outline"}
            onClick={() => {
              setEditMode(!editMode);
              setSelectedRoles([]);
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            {editMode ? "Done" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Define roles that team members can be assigned to within your organization.
          </div>
          
          {editMode && selectedRoles.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">
                {selectedRoles.length} role(s) selected
              </span>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Enter role name..."
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button onClick={handleSubmit} disabled={isSubmitting || !newRoleName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              {editingRole ? 'Update' : 'Add'} Role
            </Button>
            {editingRole && (
              <Button variant="outline" onClick={() => {
                setEditingRole(null);
                setNewRoleName("");
              }}>
                Cancel
              </Button>
            )}
          </div>

          {roles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No roles defined yet. Add your first role above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {roles.map((role) => (
                <Card key={role.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {editMode && (
                        <input
                          type="checkbox"
                          checked={selectedRoles.includes(role.id)}
                          onChange={() => handleSelectRole(role.id)}
                          className="rounded"
                        />
                      )}
                      <span className="font-medium text-sm">{role.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(role)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(role)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesTab;
