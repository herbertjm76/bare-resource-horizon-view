
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useOfficeSettings } from "@/context/OfficeSettingsContext";
import { useCompany } from "@/context/CompanyContext";
import { StageForm } from './stages/StageForm';
import { BulkOperations } from './stages/BulkOperations';
import { StageList } from './stages/StageList';
import { useStageOperations } from './stages/useStageOperations';

export const StagesTab = () => {
  const { office_stages, setOfficeStages, loading } = useOfficeSettings();
  const { company } = useCompany();

  const {
    editingStage,
    newStageName,
    setNewStageName,
    newStageColor,
    setNewStageColor,
    editMode,
    selectedStages,
    isSubmitting,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleSelectStage,
    handleCancel,
    toggleEditMode
  } = useStageOperations(office_stages, setOfficeStages, company?.id);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading stages...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Project Stages</CardTitle>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={editMode ? "secondary" : "outline"}
            onClick={toggleEditMode}
          >
            <Edit className="h-4 w-4 mr-2" />
            {editMode ? "Done" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Define project stages that represent different phases of your project workflow.
          </div>
          
          {editMode && (
            <BulkOperations
              selectedStages={selectedStages}
              onBulkDelete={handleBulkDelete}
            />
          )}

          <StageForm
            newStageName={newStageName}
            setNewStageName={setNewStageName}
            newStageColor={newStageColor}
            setNewStageColor={setNewStageColor}
            onSubmit={handleSubmit}
            editingStage={editingStage}
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
          />

          <StageList
            stages={office_stages}
            editMode={editMode}
            selectedStages={selectedStages}
            onSelectStage={handleSelectStage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StagesTab;
