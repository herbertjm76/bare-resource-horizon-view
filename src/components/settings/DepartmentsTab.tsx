
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useCompany } from "@/context/CompanyContext";
import { AddDepartmentDialog } from './departments/AddDepartmentDialog';
import { BulkOperations } from './departments/BulkOperations';
import { DepartmentList } from './departments/DepartmentList';
import { useDepartmentOperations } from './departments/useDepartmentOperations';

export const DepartmentsTab = () => {
  const { departments, setDepartments, loading } = useOfficeSettings();
  const { company } = useCompany();

  const {
    editingDepartment,
    newDepartmentName,
    setNewDepartmentName,
    newDepartmentIcon,
    setNewDepartmentIcon,
    editMode,
    selectedDepartments,
    isSubmitting,
    showAddForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleSelectDepartment,
    handleCancel,
    toggleEditMode,
    handleAddNew,
    handleConvertToPracticeArea
  } = useDepartmentOperations(departments, setDepartments, company?.id);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading departments...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle style={{ color: 'hsl(var(--theme-primary))' }}>Departments</CardTitle>
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
            <span className="hidden md:inline">Add Department</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Define organizational departments to categorize team members and projects.
          </div>
          
          {editMode && (
            <BulkOperations
              selectedDepartments={selectedDepartments}
              onBulkDelete={handleBulkDelete}
            />
          )}

          <AddDepartmentDialog
            open={showAddForm}
            onOpenChange={(open) => !open && handleCancel()}
            newDepartmentName={newDepartmentName}
            setNewDepartmentName={setNewDepartmentName}
            newDepartmentIcon={newDepartmentIcon}
            setNewDepartmentIcon={setNewDepartmentIcon}
            onSubmit={handleSubmit}
            editingDepartment={editingDepartment}
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
          />

          <DepartmentList
            departments={departments}
            editMode={editMode}
            selectedDepartments={selectedDepartments}
            onSelectDepartment={handleSelectDepartment}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onConvertToPracticeArea={handleConvertToPracticeArea}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentsTab;
