import React from 'react';
import { Check } from 'lucide-react';
import * as Icons from 'lucide-react';

const projectTypeIcons = [
  'Circle',
  'Star',
  'Briefcase',
  'Folder',
  'FolderOpen',
  'Package',
  'Rocket',
  'Target',
  'TrendingUp',
  'Zap',
  'Flag',
  'CheckCircle',
  'Clock',
  'Calendar',
  'Users',
  'Building',
  'Home',
  'MapPin',
  'Globe',
  'Award',
  'Heart',
  'Sparkles',
  'Lightbulb',
  'Shield'
];

interface IconPickerProps {
  selectedIcon: string;
  onIconChange: (icon: string) => void;
  className?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onIconChange,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-8 gap-2 p-2 ${className}`}>
      {projectTypeIcons.map((iconName) => {
        const IconComponent = (Icons as any)[iconName];
        const isSelected = selectedIcon.toLowerCase() === iconName.toLowerCase();
        
        return (
          <button
            key={iconName}
            type="button"
            className={`w-10 h-10 rounded-md flex items-center justify-center transition-all hover:scale-110 border ${
              isSelected 
                ? 'border-primary bg-primary text-primary-foreground' 
                : 'border-border hover:border-primary/50 hover:bg-accent'
            }`}
            onClick={() => onIconChange(iconName)}
            title={iconName}
          >
            {IconComponent && <IconComponent className="h-5 w-5" />}
            {isSelected && (
              <Check className="h-3 w-3 absolute top-0 right-0" />
            )}
          </button>
        );
      })}
    </div>
  );
};