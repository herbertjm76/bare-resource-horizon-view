
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Edit, Trash2, Briefcase, Building, Users, Wrench, Heart, GraduationCap, 
  Landmark, ShoppingBag, Truck, Leaf, Coffee, Palette, Building2, Hammer, 
  Package, Microscope, Stethoscope, Cpu, Plane, Ship, Train, Factory, Store, 
  Home, Warehouse, DollarSign, PieChart, TrendingUp, Target, Award, Shield,
  Zap, Lightbulb, Rocket, Star, Music, Film, BookOpen, Newspaper
} from "lucide-react";
import { Department } from "@/context/officeSettings/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'briefcase': Briefcase,
  'building': Building,
  'building-2': Building2,
  'users': Users,
  'wrench': Wrench,
  'hammer': Hammer,
  'heart': Heart,
  'stethoscope': Stethoscope,
  'graduation-cap': GraduationCap,
  'landmark': Landmark,
  'shopping-bag': ShoppingBag,
  'store': Store,
  'truck': Truck,
  'plane': Plane,
  'ship': Ship,
  'train': Train,
  'leaf': Leaf,
  'coffee': Coffee,
  'palette': Palette,
  'package': Package,
  'microscope': Microscope,
  'cpu': Cpu,
  'factory': Factory,
  'warehouse': Warehouse,
  'home': Home,
  'dollar-sign': DollarSign,
  'pie-chart': PieChart,
  'trending-up': TrendingUp,
  'target': Target,
  'award': Award,
  'shield': Shield,
  'zap': Zap,
  'lightbulb': Lightbulb,
  'rocket': Rocket,
  'star': Star,
  'music': Music,
  'film': Film,
  'book-open': BookOpen,
  'newspaper': Newspaper,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {departments.map((department) => {
        const IconComponent = ICON_MAP[department.icon || 'briefcase'] || Briefcase;
        
        return (
          <Card key={department.id} className="p-3 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {editMode && (
                  <input
                    type="checkbox"
                    checked={selectedDepartments.includes(department.id)}
                    onChange={() => onSelectDepartment(department.id)}
                    className="rounded flex-shrink-0"
                  />
                )}
                <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="font-medium text-sm truncate">{department.name}</span>
              </div>
              {editMode && (
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(department)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete(department)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
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
