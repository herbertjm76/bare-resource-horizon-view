import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Briefcase, Building, Users, Wrench, Heart, GraduationCap, 
  Landmark, ShoppingBag, Truck, Leaf, Coffee, Palette,
  Check, Building2, Hammer, Package, Microscope, Stethoscope,
  Cpu, Plane, Ship, Train, Factory, Store, Home, Warehouse,
  DollarSign, PieChart, TrendingUp, Target, Award, Shield,
  Zap, Lightbulb, Rocket, Star, Music, Film, BookOpen, Newspaper
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { name: 'briefcase', Icon: Briefcase },
  { name: 'building', Icon: Building },
  { name: 'building-2', Icon: Building2 },
  { name: 'users', Icon: Users },
  { name: 'wrench', Icon: Wrench },
  { name: 'hammer', Icon: Hammer },
  { name: 'heart', Icon: Heart },
  { name: 'stethoscope', Icon: Stethoscope },
  { name: 'graduation-cap', Icon: GraduationCap },
  { name: 'landmark', Icon: Landmark },
  { name: 'shopping-bag', Icon: ShoppingBag },
  { name: 'store', Icon: Store },
  { name: 'truck', Icon: Truck },
  { name: 'plane', Icon: Plane },
  { name: 'ship', Icon: Ship },
  { name: 'train', Icon: Train },
  { name: 'leaf', Icon: Leaf },
  { name: 'coffee', Icon: Coffee },
  { name: 'palette', Icon: Palette },
  { name: 'package', Icon: Package },
  { name: 'microscope', Icon: Microscope },
  { name: 'cpu', Icon: Cpu },
  { name: 'factory', Icon: Factory },
  { name: 'warehouse', Icon: Warehouse },
  { name: 'home', Icon: Home },
  { name: 'dollar-sign', Icon: DollarSign },
  { name: 'pie-chart', Icon: PieChart },
  { name: 'trending-up', Icon: TrendingUp },
  { name: 'target', Icon: Target },
  { name: 'award', Icon: Award },
  { name: 'shield', Icon: Shield },
  { name: 'zap', Icon: Zap },
  { name: 'lightbulb', Icon: Lightbulb },
  { name: 'rocket', Icon: Rocket },
  { name: 'star', Icon: Star },
  { name: 'music', Icon: Music },
  { name: 'film', Icon: Film },
  { name: 'book-open', Icon: BookOpen },
  { name: 'newspaper', Icon: Newspaper },
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
            Select Icon
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-background p-4">
          <div className="grid grid-cols-8 gap-1">
            {AVAILABLE_ICONS.map(({ name, Icon }) => (
              <Button
                key={name}
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 relative hover:bg-accent"
                onClick={() => {
                  onIconChange(name);
                  setOpen(false);
                }}
              >
                {selectedIcon === name && (
                  <Check className="h-3 w-3 absolute -top-1 -right-1 text-primary bg-background rounded-full" />
                )}
                <Icon className="h-5 w-5" />
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
