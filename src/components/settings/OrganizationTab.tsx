import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Building, Target } from "lucide-react";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useCompany } from "@/context/CompanyContext";
import { AddDepartmentDialog } from './departments/AddDepartmentDialog';
import { BulkOperations as DepartmentBulkOperations } from './departments/BulkOperations';
import { DepartmentList } from './departments/DepartmentList';
import { useDepartmentOperations } from './departments/useDepartmentOperations';
import { AddPracticeAreaDialog } from './practiceAreas/AddPracticeAreaDialog';
import { BulkOperations as PracticeAreaBulkOperations } from './practiceAreas/BulkOperations';
import { PracticeAreaList } from './practiceAreas/PracticeAreaList';
import { usePracticeAreaOperations } from './practiceAreas/usePracticeAreaOperations';
import { AddPracticeAreasButton } from './AddPracticeAreasButton';
import { AddProjectTypeDialog } from './projectTypes/AddProjectTypeDialog';
import { BulkOperations as ProjectTypeBulkOperations } from './projectTypes/BulkOperations';
import { ProjectTypeList } from './projectTypes/ProjectTypeList';
import { useProjectTypeOperations } from './projectTypes/useProjectTypeOperations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ViewType = 'departments' | 'practiceAreas' | 'projectTypes';

export const OrganizationTab = () => {
  const { departments, setDepartments, practice_areas, setPracticeAreas, project_types, setProjectTypes, loading } = useOfficeSettings();
  const { company } = useCompany();
  const [viewType, setViewType] = useState<ViewType>('departments');

  const departmentOps = useDepartmentOperations(departments, setDepartments, company?.id);
  const practiceAreaOps = usePracticeAreaOperations(practice_areas, setPracticeAreas, company?.id);
  const projectTypeOps = useProjectTypeOperations(project_types, setProjectTypes, company?.id);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading organization structure...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isDepartmentView = viewType === 'departments';
  const isPracticeAreaView = viewType === 'practiceAreas';
  const isProjectTypeView = viewType === 'projectTypes';
  
  const currentOps = isDepartmentView 
    ? departmentOps 
    : isPracticeAreaView 
    ? practiceAreaOps 
    : projectTypeOps;

  const getViewLabel = () => {
    if (isDepartmentView) return 'Department';
    if (isPracticeAreaView) return 'Practice Area';
    return 'Project Type';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle style={{ color: 'hsl(var(--theme-primary))' }}>
          Organization Structure
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={currentOps.editMode ? "secondary" : "outline"}
            onClick={currentOps.toggleEditMode}
          >
            <Edit className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">{currentOps.editMode ? "Done" : "Edit"}</span>
          </Button>
          <Button 
            size="sm" 
            onClick={currentOps.handleAddNew}
          >
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Add {getViewLabel()}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Select value={viewType} onValueChange={(value) => setViewType(value as ViewType)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="departments">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>Departments</span>
                  </div>
                </SelectItem>
                <SelectItem value="practiceAreas">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>Practice Areas</span>
                  </div>
                </SelectItem>
                <SelectItem value="projectTypes">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>Project Types</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {isDepartmentView 
                ? 'Industry categories (Enterprise, Healthcare, etc.)'
                : isPracticeAreaView
                ? 'Functional teams (Architecture, BIM, Operations, etc.)'
                : 'Project status types (Active Projects, Active Pursuits, etc.)'}
            </div>
          </div>
          
          {currentOps.editMode && (
            <>
              {isDepartmentView && (
                <DepartmentBulkOperations
                  selectedDepartments={departmentOps.selectedDepartments}
                  onBulkDelete={departmentOps.handleBulkDelete}
                />
              )}
              {isPracticeAreaView && (
                <PracticeAreaBulkOperations
                  selectedPracticeAreas={practiceAreaOps.selectedPracticeAreas}
                  onBulkDelete={practiceAreaOps.handleBulkDelete}
                />
              )}
              {isProjectTypeView && (
                <ProjectTypeBulkOperations
                  selectedProjectTypes={projectTypeOps.selectedProjectTypes}
                  onBulkDelete={projectTypeOps.handleBulkDelete}
                />
              )}
            </>
          )}

          {isDepartmentView ? (
            <>
              <AddDepartmentDialog
                open={departmentOps.showAddForm}
                onOpenChange={(open) => !open && departmentOps.handleCancel()}
                newDepartmentName={departmentOps.newDepartmentName}
                setNewDepartmentName={departmentOps.setNewDepartmentName}
                newDepartmentIcon={departmentOps.newDepartmentIcon}
                setNewDepartmentIcon={departmentOps.setNewDepartmentIcon}
                onSubmit={departmentOps.handleSubmit}
                editingDepartment={departmentOps.editingDepartment}
                isSubmitting={departmentOps.isSubmitting}
                onCancel={departmentOps.handleCancel}
              />

              <DepartmentList
                departments={departments}
                editMode={departmentOps.editMode}
                selectedDepartments={departmentOps.selectedDepartments}
                onSelectDepartment={departmentOps.handleSelectDepartment}
                onEdit={departmentOps.handleEdit}
                onDelete={departmentOps.handleDelete}
                onConvertToPracticeArea={departmentOps.handleConvertToPracticeArea}
              />
            </>
          ) : isPracticeAreaView ? (
            <>
              <AddPracticeAreaDialog
                open={practiceAreaOps.showAddForm}
                onOpenChange={(open) => !open && practiceAreaOps.handleCancel()}
                newPracticeAreaName={practiceAreaOps.newPracticeAreaName}
                setNewPracticeAreaName={practiceAreaOps.setNewPracticeAreaName}
                newPracticeAreaIcon={practiceAreaOps.newPracticeAreaIcon}
                setNewPracticeAreaIcon={practiceAreaOps.setNewPracticeAreaIcon}
                onSubmit={practiceAreaOps.handleSubmit}
                editingPracticeArea={practiceAreaOps.editingPracticeArea}
                isSubmitting={practiceAreaOps.isSubmitting}
                onCancel={practiceAreaOps.handleCancel}
              />

              <div className="mb-4">
                <AddPracticeAreasButton />
              </div>

              <PracticeAreaList
                practiceAreas={practice_areas}
                editMode={practiceAreaOps.editMode}
                selectedPracticeAreas={practiceAreaOps.selectedPracticeAreas}
                onSelectPracticeArea={practiceAreaOps.handleSelectPracticeArea}
                onEdit={practiceAreaOps.handleEdit}
                onDelete={practiceAreaOps.handleDelete}
                onConvertToDepartment={practiceAreaOps.handleConvertToDepartment}
              />
            </>
          ) : (
            <>
              <AddProjectTypeDialog
                open={projectTypeOps.showAddForm}
                onOpenChange={(open) => !open && projectTypeOps.handleCancel()}
                newProjectTypeName={projectTypeOps.newProjectTypeName}
                setNewProjectTypeName={projectTypeOps.setNewProjectTypeName}
                newProjectTypeIcon={projectTypeOps.newProjectTypeIcon}
                setNewProjectTypeIcon={projectTypeOps.setNewProjectTypeIcon}
                newProjectTypeColor={projectTypeOps.newProjectTypeColor}
                setNewProjectTypeColor={projectTypeOps.setNewProjectTypeColor}
                onSubmit={projectTypeOps.handleSubmit}
                editingProjectType={projectTypeOps.editingProjectType}
                isSubmitting={projectTypeOps.isSubmitting}
                onCancel={projectTypeOps.handleCancel}
              />

              <ProjectTypeList
                projectTypes={project_types}
                editMode={projectTypeOps.editMode}
                selectedProjectTypes={projectTypeOps.selectedProjectTypes}
                onSelectProjectType={projectTypeOps.handleSelectProjectType}
                onEdit={projectTypeOps.handleEdit}
                onDelete={projectTypeOps.handleDelete}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationTab;
