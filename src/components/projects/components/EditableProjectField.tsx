
import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOfficeSettings } from '@/context/OfficeSettingsContext';

interface EditableFieldProps {
  type: 'text' | 'select';
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  options?: Array<{ value: string; label: string; color?: string }>;
  className?: string;
}

export const EditableProjectField: React.FC<EditableFieldProps> = ({
  type,
  value,
  onChange,
  onBlur,
  options,
  className
}) => {
  if (type === 'select' && options) {
    return (
      <Select
        defaultValue={value}
        onValueChange={onChange}
      >
        <SelectTrigger className={`h-8 w-40 ${className}`}>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
            >
              <div 
                className="px-2 py-0.5 rounded w-full"
                style={{
                  backgroundColor: option.color || "#E5DEFF"
                }}
              >
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input
      className={`h-8 ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  );
};
