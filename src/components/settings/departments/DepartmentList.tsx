
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Briefcase, Building, Users, Wrench, Heart, GraduationCap, Landmark, ShoppingBag, Truck, Leaf, Coffee, Palette } from "lucide-react";
import { Department } from "@/context/officeSettings/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'briefcase': Briefcase,
  'building': Building,
  'users': Users,
  'wrench': Wrench,
  'heart': Heart,
  'graduation-cap': GraduationCap,
  'landmark': Landmark,
  'shopping-bag': ShoppingBag,
  'truck': Truck,
  'leaf': Leaf,
  'coffee': Coffee,
  'palette': Palette,
};

interface DepartmentListProps {
  departments: Department[];
  editMode: boolean;
  selectedDepartments: string[];
  onSelectDepartment: (deptId: string) => void;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

export const DepartmentList: React.FC<DepartmentListProps> = ({
  departments,
  editMode,
  selectedDepartments,
  onSelectDepartment,
  onEdit,
  onDelete
}) => {
  if (departments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No departments defined yet. Add your first department above.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {departments.map((department) => {
        const IconComponent = ICON_MAP[department.icon || 'briefcase'] || Briefcase;
        
        return (
          <Card key={department.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {editMode && (
                  <input
                    type="checkbox"
                    checked={selectedDepartments.includes(department.id)}
                    onChange={() => onSelectDepartment(department.id)}
                    className="rounded"
                  />
                )}
                <IconComponent className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">{department.name}</span>
              </div>
            {editMode && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(department)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(department)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
