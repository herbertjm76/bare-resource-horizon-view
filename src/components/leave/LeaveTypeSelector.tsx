import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LeaveType } from '@/types/leave';
import { 
  Palmtree, 
  Thermometer, 
  Baby, 
  Heart, 
  GraduationCap, 
  FileText,
  LucideIcon
} from 'lucide-react';

interface LeaveTypeSelectorProps {
  leaveTypes: LeaveType[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  'palmtree': Palmtree,
  'thermometer': Thermometer,
  'baby': Baby,
  'heart': Heart,
  'graduation-cap': GraduationCap,
  'file-text': FileText,
};

export const LeaveTypeSelector: React.FC<LeaveTypeSelectorProps> = ({
  leaveTypes,
  value,
  onChange,
  disabled = false
}) => {
  const getIcon = (iconName: string | null) => {
    if (!iconName) return FileText;
    return iconMap[iconName] || FileText;
  };

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select type of absence" />
      </SelectTrigger>
      <SelectContent>
        {leaveTypes.map((type) => {
          const Icon = getIcon(type.icon);
          return (
            <SelectItem key={type.id} value={type.id}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: type.color }}
                />
                <Icon className="w-4 h-4" style={{ color: type.color }} />
                <span>{type.name}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
