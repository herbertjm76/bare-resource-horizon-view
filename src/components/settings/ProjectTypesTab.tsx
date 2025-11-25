import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useCompany } from "@/context/CompanyContext";
import { AddProjectTypeDialog } from './projectTypes/AddProjectTypeDialog';
import { BulkOperations } from './projectTypes/BulkOperations';
import { ProjectTypeList } from './projectTypes/ProjectTypeList';
import { useProjectTypeOperations } from './projectTypes/useProjectTypeOperations';

export const ProjectTypesTab = () => {
  const { project_types, setProjectTypes, loading } = useOfficeSettings();
  const { company } = useCompany();

  const {
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
  } = useProjectTypeOperations(project_types, setProjectTypes, company?.id);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading project types...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle style={{ color: 'hsl(var(--theme-primary))' }}>Project Types</CardTitle>
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
            <span className="hidden md:inline">Add Project Type</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Define project types to categorize projects by status (Active Projects, Active Pursuits, Inactive, etc.).
          </div>
          
          {editMode && (
            <BulkOperations
              selectedProjectTypes={selectedProjectTypes}
              onBulkDelete={handleBulkDelete}
            />
          )}

          <AddProjectTypeDialog
            open={showAddForm}
            onOpenChange={(open) => !open && handleCancel()}
            newProjectTypeName={newProjectTypeName}
            setNewProjectTypeName={setNewProjectTypeName}
            newProjectTypeIcon={newProjectTypeIcon}
            setNewProjectTypeIcon={setNewProjectTypeIcon}
            newProjectTypeColor={newProjectTypeColor}
            setNewProjectTypeColor={setNewProjectTypeColor}
            onSubmit={handleSubmit}
            editingProjectType={editingProjectType}
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
          />

          <ProjectTypeList
            projectTypes={project_types}
            editMode={editMode}
            selectedProjectTypes={selectedProjectTypes}
            onSelectProjectType={handleSelectProjectType}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTypesTab;
