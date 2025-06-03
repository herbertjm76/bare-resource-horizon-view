
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Expand, Shrink, BarChart3, Clock } from 'lucide-react';

interface GridControlsProps {
  projectCount: number;
  periodToShow: number;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export const GridControls: React.FC<GridControlsProps> = ({
  projectCount,
  periodToShow,
  onExpandAll,
  onCollapseAll
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <BarChart3 className="h-4 w-4 mr-2" />
          {projectCount} Projects
        </Badge>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Clock className="h-4 w-4 mr-2" />
          {periodToShow} Weeks View
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExpandAll}
          className="text-sm"
        >
          <Expand className="h-4 w-4 mr-2" />
          Expand All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onCollapseAll}
          className="text-sm"
        >
          <Shrink className="h-4 w-4 mr-2" />
          Collapse All
        </Button>
      </div>
    </div>
  );
};
