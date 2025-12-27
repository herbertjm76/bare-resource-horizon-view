import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit2, Trash2, Paperclip } from 'lucide-react';
import { LeaveType } from '@/types/leave';
import { 
  Palmtree, 
  Thermometer, 
  Baby, 
  Heart, 
  GraduationCap, 
  FileText,
  Briefcase,
  Home,
  Plane,
  Clock,
  LucideIcon
} from 'lucide-react';

interface LeaveTypeListProps {
  leaveTypes: LeaveType[];
  editMode: boolean;
  selectedTypes: string[];
  onSelectType: (id: string) => void;
  onEdit: (type: LeaveType) => void;
  onDelete: (id: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
  'palmtree': Palmtree,
  'thermometer': Thermometer,
  'baby': Baby,
  'heart': Heart,
  'graduation-cap': GraduationCap,
  'file-text': FileText,
  'briefcase': Briefcase,
  'home': Home,
  'plane': Plane,
  'clock': Clock,
};

export const LeaveTypeList: React.FC<LeaveTypeListProps> = ({
  leaveTypes,
  editMode,
  selectedTypes,
  onSelectType,
  onEdit,
  onDelete
}) => {
  const getIcon = (iconName: string | null): LucideIcon => {
    if (!iconName) return FileText;
    return iconMap[iconName] || FileText;
  };

  if (leaveTypes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No leave types configured. Add your first leave type to get started.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {leaveTypes.map((type) => {
        const Icon = getIcon(type.icon);
        
        return (
          <div
            key={type.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {editMode && (
                <Checkbox
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={() => onSelectType(type.id)}
                />
              )}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${type.color}20` }}
              >
                <Icon className="w-4 h-4" style={{ color: type.color }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{type.name}</span>
                  <Badge variant="secondary" className="text-xs uppercase font-mono">
                    {type.code}
                  </Badge>
                  {type.requires_attachment && (
                    <Paperclip className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: type.color }}
              />
              {editMode && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(type)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(type.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
