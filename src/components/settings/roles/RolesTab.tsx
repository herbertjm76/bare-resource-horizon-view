
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useCompany } from "@/context/CompanyContext";
import { AddRoleDialog } from './AddRoleDialog';
import { BulkOperations } from './BulkOperations';
import { RoleList } from './RoleList';
import { useRoleOperations } from './useRoleOperations';

export const RolesTab = () => {
  const { roles, setRoles, loading } = useOfficeSettings();
  const { company } = useCompany();
  
  const {
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
  } = useRoleOperations(roles, setRoles, company?.id);

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
            onClick={toggleEditMode}
          >
            <Edit className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">{editMode ? "Done" : "Edit"}</span>
          </Button>
          <Button 
            size="sm" 
            onClick={handleAddNew}
          >
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Add Role</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Define roles that team members can be assigned to within your organization.
          </div>
          
          {editMode && (
            <BulkOperations
              selectedRoles={selectedRoles}
              onBulkDelete={handleBulkDelete}
            />
          )}

          <AddRoleDialog
            open={showAddForm}
            onOpenChange={(open) => !open && handleCancel()}
            newRoleName={newRoleName}
            setNewRoleName={setNewRoleName}
            onSubmit={handleSubmit}
            editingRole={editingRole}
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
          />

          <RoleList
            roles={roles}
            editMode={editMode}
            selectedRoles={selectedRoles}
            onSelectRole={handleSelectRole}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesTab;
