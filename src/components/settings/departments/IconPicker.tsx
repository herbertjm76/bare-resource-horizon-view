import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Briefcase, Building, Users, Wrench, Heart, GraduationCap, 
  Landmark, ShoppingBag, Truck, Leaf, Coffee, Palette,
  Check
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { name: 'briefcase', Icon: Briefcase, label: 'Briefcase' },
  { name: 'building', Icon: Building, label: 'Building' },
  { name: 'users', Icon: Users, label: 'Users' },
  { name: 'wrench', Icon: Wrench, label: 'Wrench' },
  { name: 'heart', Icon: Heart, label: 'Heart' },
  { name: 'graduation-cap', Icon: GraduationCap, label: 'Education' },
  { name: 'landmark', Icon: Landmark, label: 'Landmark' },
  { name: 'shopping-bag', Icon: ShoppingBag, label: 'Shopping' },
  { name: 'truck', Icon: Truck, label: 'Truck' },
  { name: 'leaf', Icon: Leaf, label: 'Leaf' },
  { name: 'coffee', Icon: Coffee, label: 'Coffee' },
  { name: 'palette', Icon: Palette, label: 'Palette' },
];

interface IconPickerProps {
  selectedIcon: string;
  onIconChange: (icon: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onIconChange }) => {
  const [open, setOpen] = useState(false);
  
  const selectedIconData = AVAILABLE_ICONS.find(icon => icon.name === selectedIcon) || AVAILABLE_ICONS[0];
  const SelectedIcon = selectedIconData.Icon;

  return (
    <div className="space-y-2">
      <Label>Icon</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <SelectedIcon className="h-4 w-4 mr-2" />
            {selectedIconData.label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-background">
          <div className="grid grid-cols-4 gap-2">
            {AVAILABLE_ICONS.map(({ name, Icon, label }) => (
              <Button
                key={name}
                variant="ghost"
                className="h-16 flex flex-col items-center justify-center relative"
                onClick={() => {
                  onIconChange(name);
                  setOpen(false);
                }}
              >
                {selectedIcon === name && (
                  <Check className="h-3 w-3 absolute top-1 right-1 text-primary" />
                )}
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
