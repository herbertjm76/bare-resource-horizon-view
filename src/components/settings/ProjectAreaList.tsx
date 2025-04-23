
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { getPastelColor } from "./projectAreaHelpers";
import type { ProjectArea } from "./projectAreaTypes";

interface ProjectAreaListProps {
  areas: ProjectArea[];
  loading: boolean;
  error: string | null;
  editMode: boolean;
  selected: string[];
  onEdit: (area: ProjectArea) => void;
  onSelect: (id: string) => void;
  onBulkDelete: () => void;
}

export const ProjectAreaList: React.FC<ProjectAreaListProps> = ({
  areas, loading, error, editMode, selected, onEdit, onSelect, onBulkDelete
}) => {
  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-center text-destructive">{error}</div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground mb-4">
            Track which locations you operate projects in, by code, country, city (optional), and region.
          </div>
          {editMode && (
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="destructive"
                size="sm"
                disabled={selected.length === 0}
                onClick={onBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete Selected
              </Button>
              <span className="text-xs text-muted-foreground">{selected.length} selected</span>
            </div>
          )}
          {areas.length > 0 ? (
            <div className="grid gap-4">
              {areas.map((area) => {
                // Use the area's color, or generate a color based on its code
                const bg = area.color || getPastelColor(area.code);
                return (
                  <div
                    key={area.id}
                    className={`flex items-center justify-between p-3 border rounded-md ${editMode ? "ring-2" : ""}`}
                    style={editMode && selected.includes(area.id) ? { borderColor: "#dc2626", background: "#fee2e2" } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="font-bold px-3 py-1 rounded text-base"
                        style={{ background: bg }}
                      >
                        {area.code}
                      </span>
                      <span className="font-medium">{area.country}</span>
                      {area.city && <span className="ml-2 text-muted-foreground text-xs">{area.city}</span>}
                      <span className="bg-muted-foreground/10 px-2 py-0.5 rounded text-xs text-muted-foreground ml-2">
                        {area.region}
                      </span>
                    </div>
                    {editMode ? (
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-purple-600"
                        checked={selected.includes(area.id)}
                        onChange={() => onSelect(area.id)}
                      />
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => onEdit(area)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center p-4 border rounded-md border-dashed">
              No project areas yet. Click "Add Area" to get started.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectAreaList;
