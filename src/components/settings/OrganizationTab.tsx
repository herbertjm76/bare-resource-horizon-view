import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Building, Shapes } from "lucide-react";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useCompany } from "@/context/CompanyContext";
import { AddDepartmentDialog } from './departments/AddDepartmentDialog';
import { BulkOperations as DepartmentBulkOperations } from './departments/BulkOperations';
import { DepartmentList } from './departments/DepartmentList';
import { useDepartmentOperations } from './departments/useDepartmentOperations';
import { AddSectorDialog } from './sectors/AddSectorDialog';
import { BulkOperations as SectorBulkOperations } from './sectors/BulkOperations';
import { SectorList } from './sectors/SectorList';
import { useSectorOperations } from './sectors/useSectorOperations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ViewType = 'departments' | 'sectors';

export const OrganizationTab = () => {
  const { departments, setDepartments, sectors, setSectors, loading } = useOfficeSettings();
  const { company } = useCompany();
  const [viewType, setViewType] = useState<ViewType>('departments');

  const departmentOps = useDepartmentOperations(departments, setDepartments, company?.id);
  const sectorOps = useSectorOperations(sectors, setSectors, company?.id);

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
  const currentOps = isDepartmentView ? departmentOps : sectorOps;

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
            <span className="hidden md:inline">Add {isDepartmentView ? 'Department' : 'Sector'}</span>
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
                <SelectItem value="sectors">
                  <div className="flex items-center gap-2">
                    <Shapes className="h-4 w-4" />
                    <span>Sectors</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {isDepartmentView 
                ? 'Define organizational departments to categorize team members and projects.'
                : 'Define organizational sectors to categorize at a higher level than departments.'}
            </div>
          </div>
          
          {currentOps.editMode && (
            isDepartmentView ? (
              <DepartmentBulkOperations
                selectedDepartments={departmentOps.selectedDepartments}
                onBulkDelete={departmentOps.handleBulkDelete}
              />
            ) : (
              <SectorBulkOperations
                selectedSectors={sectorOps.selectedSectors}
                onBulkDelete={sectorOps.handleBulkDelete}
              />
            )
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
              />
            </>
          ) : (
            <>
              <AddSectorDialog
                open={sectorOps.showAddForm}
                onOpenChange={(open) => !open && sectorOps.handleCancel()}
                newSectorName={sectorOps.newSectorName}
                setNewSectorName={sectorOps.setNewSectorName}
                newSectorIcon={sectorOps.newSectorIcon}
                setNewSectorIcon={sectorOps.setNewSectorIcon}
                onSubmit={sectorOps.handleSubmit}
                editingSector={sectorOps.editingSector}
                isSubmitting={sectorOps.isSubmitting}
                onCancel={sectorOps.handleCancel}
              />

              <SectorList
                sectors={sectors}
                editMode={sectorOps.editMode}
                selectedSectors={sectorOps.selectedSectors}
                onSelectSector={sectorOps.handleSelectSector}
                onEdit={sectorOps.handleEdit}
                onDelete={sectorOps.handleDelete}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationTab;
