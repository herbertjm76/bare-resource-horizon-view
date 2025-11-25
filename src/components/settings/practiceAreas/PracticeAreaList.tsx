
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Edit, Trash2, ArrowRightLeft, Circle, Square, Triangle, Hexagon, Diamond, Star, Pentagon, Octagon,
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
import { PracticeArea } from "@/context/officeSettings/types";

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

interface PracticeAreaListProps {
  practiceAreas: PracticeArea[];
  editMode: boolean;
  selectedPracticeAreas: string[];
  onSelectPracticeArea: (practiceAreaId: string) => void;
  onEdit: (practiceArea: PracticeArea) => void;
  onDelete: (practiceArea: PracticeArea) => void;
  onConvertToDepartment: (practiceArea: PracticeArea) => void;
}

export const PracticeAreaList: React.FC<PracticeAreaListProps> = ({
  practiceAreas,
  editMode,
  selectedPracticeAreas,
  onSelectPracticeArea,
  onEdit,
  onDelete,
  onConvertToDepartment
}) => {
  if (practiceAreas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No practice areas defined yet. Add your first practice area to categorize projects by industry or type.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {practiceAreas.map((practiceArea) => {
        const IconComponent = ICON_MAP[practiceArea.icon || 'target'] || Target;
        
        return (
          <Card key={practiceArea.id} className="p-3 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {editMode && (
                  <input
                    type="checkbox"
                    checked={selectedPracticeAreas.includes(practiceArea.id)}
                    onChange={() => onSelectPracticeArea(practiceArea.id)}
                    className="rounded flex-shrink-0"
                  />
                )}
                <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="font-medium text-sm truncate">{practiceArea.name}</span>
              </div>
              {editMode && (
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(practiceArea)}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onConvertToDepartment(practiceArea)}
                    title="Convert to Department"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete(practiceArea)}
                    title="Delete"
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