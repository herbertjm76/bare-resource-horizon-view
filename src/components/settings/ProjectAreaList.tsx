
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, GripVertical } from "lucide-react";
import { ProjectArea } from './projectAreaTypes';

interface ProjectAreaListProps {
  areas: ProjectArea[];
  onEdit: (area: ProjectArea) => void;
  onDelete: (area: ProjectArea) => void;
  editMode: boolean;
  selectedAreas: string[];
  onSelectArea: (areaId: string) => void;
  onReorder: (draggedId: string, targetId: string) => void;
}

export const ProjectAreaList: React.FC<ProjectAreaListProps> = ({
  areas,
  onEdit,
  onDelete,
  editMode,
  selectedAreas,
  onSelectArea,
  onReorder
}) => {
  if (areas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No project areas defined yet. Click "Add Area" to create your first project area.
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent, areaId: string) => {
    e.dataTransfer.setData('text/plain', areaId);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId !== targetId) {
      onReorder(draggedId, targetId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {areas.map((area) => (
        <Card
          key={area.id}
          className={`p-4 ${editMode ? 'cursor-move' : ''}`}
          draggable={editMode}
          onDragStart={(e) => editMode && handleDragStart(e, area.id)}
          onDrop={(e) => editMode && handleDrop(e, area.id)}
          onDragOver={editMode ? handleDragOver : undefined}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1">
              {editMode && (
                <>
                  <Checkbox
                    checked={selectedAreas.includes(area.id)}
                    onCheckedChange={() => onSelectArea(area.id)}
                  />
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </>
              )}
            </div>
            {editMode && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(area)}
                >
                  <Edit className="h-3 w-3" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(area)}
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: area.color }}
              />
              <span className="font-medium text-sm">{area.code}</span>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              <div><span className="font-medium">Country:</span> {area.country}</div>
              {area.region && <div><span className="font-medium">Region:</span> {area.region}</div>}
              {area.city && <div><span className="font-medium">City:</span> {area.city}</div>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProjectAreaList;
