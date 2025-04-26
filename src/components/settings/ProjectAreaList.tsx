import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ProjectArea } from "./projectAreaTypes";
import { ItemActions } from './common/ItemActions';

interface ProjectAreaListProps {
  areas: ProjectArea[];
  loading: boolean;
  error: any;
  editMode: boolean;
  selected: string[];
  onEdit: (area: ProjectArea) => void;
  onSelect?: (id: string) => void;
  onBulkDelete?: () => void;
}

const ProjectAreaList = ({ 
  areas,
  loading,
  error,
  editMode,
  selected,
  onEdit,
  onSelect,
  onBulkDelete
}: ProjectAreaListProps) => {
  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-6">Loading areas...</div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">Error: {error.message}</div>
      ) : areas.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">No project areas defined yet.</div>
      ) : (
        <div className="space-y-2">
          {areas.map((area) => (
            <div
              key={area.id}
              className={cn(
                "group flex items-center justify-between p-4 border rounded-lg transition-colors",
                "hover:border-[#6E59A5]/20 hover:bg-[#6E59A5]/5",
                editMode && "cursor-pointer"
              )}
              onClick={() => editMode && onSelect && onSelect(area.id)}
            >
              <div className="flex items-center gap-4">
                {editMode && onSelect && (
                  <Checkbox
                    checked={selected.includes(area.id)}
                    onCheckedChange={() => onSelect(area.id)}
                    id={area.id}
                  />
                )}
                <div className="flex flex-col">
                  <div className="font-medium text-[#6E59A5]">{area.country}</div>
                  <div className="text-sm text-muted-foreground">
                    {area.city ? `${area.city}, ` : ''}{area.region} ({area.code})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {editMode ? (
                  <Checkbox
                    checked={selected.includes(area.id)}
                    onCheckedChange={() => onSelect(area.id)}
                    id={area.id}
                  />
                ) : (
                  <ItemActions 
                    onEdit={() => onEdit(area)}
                    onDelete={undefined}
                    showDelete={false}
                  />
                )}
              </div>
            </div>
          ))}
          {editMode && selected.length > 0 && onBulkDelete && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onBulkDelete}
              className="ml-auto block"
            >
              Delete Selected
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectAreaList;
