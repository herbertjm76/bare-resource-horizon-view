
import React from "react";
import { ProjectArea } from "./projectAreaTypes";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { getDefaultColor } from './utils/colorUtils';

interface ProjectAreaListProps {
  areas: ProjectArea[];
  onEdit: (area: ProjectArea) => void;
  onDelete: (area: ProjectArea) => void;
}

const ProjectAreaList = ({ 
  areas,
  onEdit,
  onDelete
}: ProjectAreaListProps) => {
  if (areas.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No project areas defined yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {areas.map((area) => (
        <div
          key={area.id}
          className="group flex items-center justify-between p-4 border rounded-lg transition-colors hover:border-[#6E59A5]/20 hover:bg-[#6E59A5]/5"
        >
          <div className="flex items-center gap-3">
            <div 
              className="text-white font-bold px-2 py-1 rounded text-xs uppercase"
              style={{ 
                backgroundColor: getDefaultColor(area.color) 
              }}
            >
              {area.code}
            </div>
            <div className="flex flex-col">
              <div className="font-medium text-[#6E59A5]">{area.country}</div>
              {area.region && (
                <div className="text-sm text-muted-foreground">
                  {area.city ? `${area.city}, ` : ''}{area.region} 
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(area)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(area)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectAreaList;
