
import React from 'react';
import { ProjectArea } from './projectAreaTypes';
import { Checkbox } from "@/components/ui/checkbox";
import { ItemActions } from './common/ItemActions';
import { GripVertical, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProjectAreaListProps {
  areas: ProjectArea[];
  onEdit: (area: ProjectArea) => void;
  onDelete: (area: ProjectArea) => void;
  editMode?: boolean;
  selectedAreas?: string[];
  onSelectArea?: (areaId: string) => void;
  onReorder?: (draggedId: string, targetId: string) => void;
}

export const ProjectAreaList: React.FC<ProjectAreaListProps> = ({
  areas,
  onEdit,
  onDelete,
  editMode = false,
  selectedAreas = [],
  onSelectArea,
  onReorder
}) => {
  const [draggedItem, setDraggedItem] = React.useState<ProjectArea | null>(null);

  const handleDragStart = (e: React.DragEvent, area: ProjectArea) => {
    setDraggedItem(area);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetArea: ProjectArea) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetArea.id || !onReorder) return;
    
    onReorder(draggedItem.id, targetArea.id);
    setDraggedItem(null);
  };

  if (areas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No project areas defined yet. Click "Add Area" to create your first project area.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {areas.map((area) => (
        <div
          key={area.id}
          className={`group flex items-center justify-between p-4 border rounded-lg transition-all duration-200 ${
            editMode ? 'hover:bg-accent/30' : 'hover:border-[#6E59A5]/20 hover:bg-[#6E59A5]/5'
          }`}
          draggable={editMode}
          onDragStart={(e) => handleDragStart(e, area)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, area)}
        >
          <div className="flex items-center gap-3">
            {editMode && onSelectArea && (
              <>
                <Checkbox
                  checked={selectedAreas.includes(area.id)}
                  onCheckedChange={() => onSelectArea(area.id)}
                />
                {onReorder && (
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                )}
              </>
            )}
            <div
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: area.color }}
            />
            <div>
              <div className="font-medium">{area.code}</div>
              <div className="text-sm text-muted-foreground">
                {area.country}
                {area.region && `, ${area.region}`}
                {area.city && `, ${area.city}`}
              </div>
            </div>
          </div>
          
          {editMode ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(area)}
              className="h-8 px-3"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <ItemActions 
              onEdit={() => onEdit(area)}
              onDelete={() => onDelete(area)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectAreaList;
