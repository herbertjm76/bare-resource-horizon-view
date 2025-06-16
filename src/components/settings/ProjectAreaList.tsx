
import React from 'react';
import { ProjectArea } from './projectAreaTypes';
import { Checkbox } from "@/components/ui/checkbox";
import { ItemActions } from './common/ItemActions';

interface ProjectAreaListProps {
  areas: ProjectArea[];
  onEdit: (area: ProjectArea) => void;
  onDelete: (area: ProjectArea) => void;
  editMode?: boolean;
  selectedAreas?: string[];
  onSelectArea?: (areaId: string) => void;
}

export const ProjectAreaList: React.FC<ProjectAreaListProps> = ({
  areas,
  onEdit,
  onDelete,
  editMode = false,
  selectedAreas = [],
  onSelectArea
}) => {
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
        >
          <div className="flex items-center gap-3">
            {editMode && onSelectArea && (
              <Checkbox
                checked={selectedAreas.includes(area.id)}
                onCheckedChange={() => onSelectArea(area.id)}
              />
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
          {!editMode && (
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
