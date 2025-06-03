
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
    <div className="flex flex-wrap items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200/60 shadow-lg px-4 py-2 text-sm font-semibold">
          <BarChart3 className="h-4 w-4 mr-2" />
          {projectCount} Projects
        </Badge>
        <Badge variant="outline" className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200/60 shadow-lg px-4 py-2 text-sm font-semibold">
          <Clock className="h-4 w-4 mr-2" />
          {periodToShow} Weeks View
        </Badge>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onExpandAll}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-indigo-200 text-indigo-700 shadow-md transition-all duration-200 font-medium"
        >
          <Expand className="h-4 w-4 mr-2" />
          Expand All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onCollapseAll}
          className="bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border-gray-200 text-gray-700 shadow-md transition-all duration-200 font-medium"
        >
          <Shrink className="h-4 w-4 mr-2" />
          Collapse All
        </Button>
      </div>
    </div>
  );
};
