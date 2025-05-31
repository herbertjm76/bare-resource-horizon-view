
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Expand, Shrink } from 'lucide-react';

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
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg border shadow-sm">
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {projectCount} Projects
        </Badge>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          {periodToShow} Weeks View
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExpandAll}
          className="text-xs"
        >
          <Expand className="h-3 w-3 mr-1" />
          Expand All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onCollapseAll}
          className="text-xs"
        >
          <Shrink className="h-3 w-3 mr-1" />
          Collapse All
        </Button>
      </div>
    </div>
  );
};
