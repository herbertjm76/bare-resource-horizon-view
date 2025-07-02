
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Expand, Shrink, Info } from 'lucide-react';

interface ModernGridControlsProps {
  projectCount: number;
  expandedCount: number;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export const ModernGridControls: React.FC<ModernGridControlsProps> = ({
  projectCount,
  expandedCount,
  onExpandAll,
  onCollapseAll
}) => {
  const allExpanded = expandedCount === projectCount && projectCount > 0;
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Info className="h-4 w-4" />
              <span>
                {expandedCount > 0 
                  ? `${expandedCount} of ${projectCount} projects expanded`
                  : 'All projects collapsed'
                }
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={allExpanded ? onCollapseAll : onExpandAll}
              disabled={projectCount === 0}
              className="flex items-center space-x-2"
            >
              {allExpanded ? (
                <>
                  <Shrink className="h-4 w-4" />
                  <span>Collapse All</span>
                </>
              ) : (
                <>
                  <Expand className="h-4 w-4" />
                  <span>Expand All</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
