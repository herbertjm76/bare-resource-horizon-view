
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useCompany } from "@/context/CompanyContext";
import { AddSectorDialog } from './sectors/AddSectorDialog';
import { BulkOperations } from './sectors/BulkOperations';
import { SectorList } from './sectors/SectorList';
import { useSectorOperations } from './sectors/useSectorOperations';

export const SectorsTab = () => {
  const { sectors, setSectors, loading } = useOfficeSettings();
  const { company } = useCompany();

  const {
    editingSector,
    newSectorName,
    setNewSectorName,
    newSectorIcon,
    setNewSectorIcon,
    editMode,
    selectedSectors,
    isSubmitting,
    showAddForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleSelectSector,
    handleCancel,
    toggleEditMode,
    handleAddNew,
    handleConvertToDepartment
  } = useSectorOperations(sectors, setSectors, company?.id);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading sectors...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle style={{ color: 'hsl(var(--theme-primary))' }}>Sectors</CardTitle>
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
            <span className="hidden md:inline">Add Sector</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Define organizational sectors to categorize at a higher level than departments.
          </div>
          
          {editMode && (
            <BulkOperations
              selectedSectors={selectedSectors}
              onBulkDelete={handleBulkDelete}
            />
          )}

          <AddSectorDialog
            open={showAddForm}
            onOpenChange={(open) => !open && handleCancel()}
            newSectorName={newSectorName}
            setNewSectorName={setNewSectorName}
            newSectorIcon={newSectorIcon}
            setNewSectorIcon={setNewSectorIcon}
            onSubmit={handleSubmit}
            editingSector={editingSector}
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
          />

          <SectorList
            sectors={sectors}
            editMode={editMode}
            selectedSectors={selectedSectors}
            onSelectSector={handleSelectSector}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onConvertToDepartment={handleConvertToDepartment}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorsTab;
