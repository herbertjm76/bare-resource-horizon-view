
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Edit, Trash2, Circle, Square, Triangle, Hexagon, Diamond, Star, Pentagon, Octagon,
  Flag, Bookmark, Tag, Pin, MapPin, Hash, AtSign, Percent,
  Dot, Disc, Box, Package, Boxes, Layers, Grid, Layout,
  Shapes, Sparkles, Zap, Flame, Sun, Moon, Cloud, Droplet,
  Leaf, Flower, TreePine, Mountain, Waves, Wind, Feather, Palmtree,
  Heart, Smile, Anchor, Compass, Globe, Map, Navigation, Clock,
  Bell, Megaphone, Radio, Volume2, Music, Mic, Headphones, Speaker,
  Eye, Target, Focus, Crosshair, Scan, Radar, Activity, TrendingUp,
  BarChart, PieChart, LineChart, TrendingDown, GitBranch, GitCommit, GitMerge, Share2,
  Plus, Minus, Equal, Divide, Asterisk, Check, X, ChevronRight
} from "lucide-react";
import { Department } from "@/context/officeSettings/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'circle': Circle,
  'square': Square,
  'triangle': Triangle,
  'hexagon': Hexagon,
  'diamond': Diamond,
  'star': Star,
  'pentagon': Pentagon,
  'octagon': Octagon,
  'flag': Flag,
  'bookmark': Bookmark,
  'tag': Tag,
  'pin': Pin,
  'map-pin': MapPin,
  'hash': Hash,
  'at-sign': AtSign,
  'percent': Percent,
  'dot': Dot,
  'disc': Disc,
  'box': Box,
  'package': Package,
  'boxes': Boxes,
  'layers': Layers,
  'grid': Grid,
  'layout': Layout,
  'shapes': Shapes,
  'sparkles': Sparkles,
  'zap': Zap,
  'flame': Flame,
  'sun': Sun,
  'moon': Moon,
  'cloud': Cloud,
  'droplet': Droplet,
  'leaf': Leaf,
  'flower': Flower,
  'tree-pine': TreePine,
  'mountain': Mountain,
  'waves': Waves,
  'wind': Wind,
  'feather': Feather,
  'palmtree': Palmtree,
  'heart': Heart,
  'smile': Smile,
  'anchor': Anchor,
  'compass': Compass,
  'globe': Globe,
  'map': Map,
  'navigation': Navigation,
  'clock': Clock,
  'bell': Bell,
  'megaphone': Megaphone,
  'radio': Radio,
  'volume': Volume2,
  'music': Music,
  'mic': Mic,
  'headphones': Headphones,
  'speaker': Speaker,
  'eye': Eye,
  'target': Target,
  'focus': Focus,
  'crosshair': Crosshair,
  'scan': Scan,
  'radar': Radar,
  'activity': Activity,
  'trending-up': TrendingUp,
  'bar-chart': BarChart,
  'pie-chart': PieChart,
  'line-chart': LineChart,
  'trending-down': TrendingDown,
  'git-branch': GitBranch,
  'git-commit': GitCommit,
  'git-merge': GitMerge,
  'share': Share2,
  'plus': Plus,
  'minus': Minus,
  'equal': Equal,
  'divide': Divide,
  'asterisk': Asterisk,
  'check': Check,
  'x': X,
  'chevron': ChevronRight,
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
        const IconComponent = ICON_MAP[department.icon || 'circle'] || Circle;
        
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
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">{department.name}</div>
                  {department.sector && (
                    <div className="text-xs text-muted-foreground truncate">{department.sector}</div>
                  )}
                </div>
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
