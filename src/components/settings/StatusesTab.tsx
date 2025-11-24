import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useCompany } from "@/context/CompanyContext";
import { AddStatusDialog } from './statuses/AddStatusDialog';
import { BulkOperations } from './statuses/BulkOperations';
import { StatusList } from './statuses/StatusList';
import { useStatusOperations } from './statuses/useStatusOperations';

export const StatusesTab = () => {
  const { project_statuses, setProjectStatuses, loading } = useOfficeSettings();
  const { company } = useCompany();

  const {
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
  } = useStatusOperations(project_statuses, setProjectStatuses, company?.id);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading project statuses...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle style={{ color: 'hsl(var(--theme-primary))' }}>
          Project Statuses
        </CardTitle>
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
            <span className="hidden md:inline">Add Status</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Define the statuses that projects can have throughout their lifecycle.
          </div>
          
          {editMode && (
            <BulkOperations
              selectedStatuses={selectedStatuses}
              onBulkDelete={handleBulkDelete}
            />
          )}

          <AddStatusDialog
            open={showAddForm}
            onOpenChange={(open) => !open && handleCancel()}
            newStatusName={newStatusName}
            setNewStatusName={setNewStatusName}
            newStatusColor={newStatusColor}
            setNewStatusColor={setNewStatusColor}
            onSubmit={handleSubmit}
            editingStatus={editingStatus}
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
          />

          <StatusList
            statuses={project_statuses}
            editMode={editMode}
            selectedStatuses={selectedStatuses}
            onSelectStatus={handleSelectStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusesTab;
