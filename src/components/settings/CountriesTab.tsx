
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProjectAreaForm from './ProjectAreaForm';
import ProjectAreaList from './ProjectAreaList';
import { useProjectAreas } from './useProjectAreas';
import { ProjectArea } from './projectAreaTypes';
import { toast } from 'sonner';

export const CountriesTab = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState<ProjectArea | null>(null);
  const { areas, loading, addArea, updateArea, deleteArea } = useProjectAreas();

  const handleSubmit = async (data: Omit<ProjectArea, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      let success = false;
      
      if (editingArea) {
        success = await updateArea(editingArea.id, data);
      } else {
        success = await addArea(data);
      }

      if (success) {
        setShowForm(false);
        setEditingArea(null);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('An error occurred while saving the project area');
    }
  };

  const handleEdit = (area: ProjectArea) => {
    setEditingArea(area);
    setShowForm(true);
  };

  const handleDelete = async (area: ProjectArea) => {
    if (window.confirm('Are you sure you want to delete this project area?')) {
      await deleteArea(area.id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingArea(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading project areas...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Project Areas</CardTitle>
        <Button 
          size="sm" 
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Area
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Manage project areas or countries where your company operates. These can be used to categorize and organize your projects.
          </div>
          
          {showForm && (
            <ProjectAreaForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialData={editingArea}
            />
          )}
          
          <ProjectAreaList
            areas={areas}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </CardContent>
    </Card>
  );
};
