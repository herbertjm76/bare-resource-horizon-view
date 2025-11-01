import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Circle, Square, Triangle, Hexagon, Diamond, Star, Pentagon, Octagon,
  Flag, Bookmark, Tag, Pin, MapPin, Hash, AtSign, Percent,
  Dot, Disc, Box, Package, Boxes, Layers, Grid, Layout,
  Shapes, Sparkles, Zap, Flame, Sun, Moon, Cloud, Droplet,
  Leaf, Flower, TreePine, Mountain, Waves, Wind, Feather, Palmtree,
  Heart, Smile, Anchor, Compass, Globe, Map, Navigation, Clock,
  Bell, Megaphone, Radio, Volume2, Music, Mic, Headphones, Speaker,
  Eye, Target, Focus, Crosshair, Scan, Radar, Activity, TrendingUp,
  BarChart, PieChart, LineChart, TrendingDown, GitBranch, GitCommit, GitMerge, Share2,
  Plus, Minus, Equal, Divide, Asterisk, Check, X, ChevronRight
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { name: 'circle', Icon: Circle },
  { name: 'square', Icon: Square },
  { name: 'triangle', Icon: Triangle },
  { name: 'hexagon', Icon: Hexagon },
  { name: 'diamond', Icon: Diamond },
  { name: 'star', Icon: Star },
  { name: 'pentagon', Icon: Pentagon },
  { name: 'octagon', Icon: Octagon },
  { name: 'flag', Icon: Flag },
  { name: 'bookmark', Icon: Bookmark },
  { name: 'tag', Icon: Tag },
  { name: 'pin', Icon: Pin },
  { name: 'map-pin', Icon: MapPin },
  { name: 'hash', Icon: Hash },
  { name: 'at-sign', Icon: AtSign },
  { name: 'percent', Icon: Percent },
  { name: 'dot', Icon: Dot },
  { name: 'disc', Icon: Disc },
  { name: 'box', Icon: Box },
  { name: 'package', Icon: Package },
  { name: 'boxes', Icon: Boxes },
  { name: 'layers', Icon: Layers },
  { name: 'grid', Icon: Grid },
  { name: 'layout', Icon: Layout },
  { name: 'shapes', Icon: Shapes },
  { name: 'sparkles', Icon: Sparkles },
  { name: 'zap', Icon: Zap },
  { name: 'flame', Icon: Flame },
  { name: 'sun', Icon: Sun },
  { name: 'moon', Icon: Moon },
  { name: 'cloud', Icon: Cloud },
  { name: 'droplet', Icon: Droplet },
  { name: 'leaf', Icon: Leaf },
  { name: 'flower', Icon: Flower },
  { name: 'tree-pine', Icon: TreePine },
  { name: 'mountain', Icon: Mountain },
  { name: 'waves', Icon: Waves },
  { name: 'wind', Icon: Wind },
  { name: 'feather', Icon: Feather },
  { name: 'palmtree', Icon: Palmtree },
  { name: 'heart', Icon: Heart },
  { name: 'smile', Icon: Smile },
  { name: 'anchor', Icon: Anchor },
  { name: 'compass', Icon: Compass },
  { name: 'globe', Icon: Globe },
  { name: 'map', Icon: Map },
  { name: 'navigation', Icon: Navigation },
  { name: 'clock', Icon: Clock },
  { name: 'bell', Icon: Bell },
  { name: 'megaphone', Icon: Megaphone },
  { name: 'radio', Icon: Radio },
  { name: 'volume', Icon: Volume2 },
  { name: 'music', Icon: Music },
  { name: 'mic', Icon: Mic },
  { name: 'headphones', Icon: Headphones },
  { name: 'speaker', Icon: Speaker },
  { name: 'eye', Icon: Eye },
  { name: 'target', Icon: Target },
  { name: 'focus', Icon: Focus },
  { name: 'crosshair', Icon: Crosshair },
  { name: 'scan', Icon: Scan },
  { name: 'radar', Icon: Radar },
  { name: 'activity', Icon: Activity },
  { name: 'trending-up', Icon: TrendingUp },
  { name: 'bar-chart', Icon: BarChart },
  { name: 'pie-chart', Icon: PieChart },
  { name: 'line-chart', Icon: LineChart },
  { name: 'trending-down', Icon: TrendingDown },
  { name: 'git-branch', Icon: GitBranch },
  { name: 'git-commit', Icon: GitCommit },
  { name: 'git-merge', Icon: GitMerge },
  { name: 'share', Icon: Share2 },
  { name: 'plus', Icon: Plus },
  { name: 'minus', Icon: Minus },
  { name: 'equal', Icon: Equal },
  { name: 'divide', Icon: Divide },
  { name: 'asterisk', Icon: Asterisk },
  { name: 'check', Icon: Check },
  { name: 'x', Icon: X },
  { name: 'chevron', Icon: ChevronRight },
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
