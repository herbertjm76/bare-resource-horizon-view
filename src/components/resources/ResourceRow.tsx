
import React from 'react';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface ResourceRowProps {
  resource: {
    id: string;
    name: string;
    role: string;
    allocations: Record<string, number>;
    isPending?: boolean;
  };
  weeks: {
    startDate: Date;
    label: string;
    days: Date[];
  }[];
  projectId: string;
  onAllocationChange: (resourceId: string, weekKey: string, hours: number) => void;
  onDeleteResource?: (resourceId: string) => void;
}

export const ResourceRow: React.FC<ResourceRowProps> = ({ 
  resource, 
  weeks, 
  projectId,
  onAllocationChange,
  onDeleteResource
}) => {
  const [allocations, setAllocations] = React.useState<Record<string, number>>(
    resource.allocations || {}
  );
  
  const handleAllocationChange = (weekKey: string, value: string) => {
    const numValue = Math.min(40, Math.max(0, Number(value) || 0));
    
    setAllocations(prev => ({
      ...prev,
      [weekKey]: numValue
    }));
    
    // Notify parent component to update project totals
    onAllocationChange(resource.id, weekKey, numValue);
  };
  
  const handleDeleteResource = () => {
    if (onDeleteResource) {
      onDeleteResource(resource.id);
      toast.success(`${resource.name} removed from project`);
    }
  };
  
  const getWeekKey = (startDate: Date) => {
    return startDate.toISOString().split('T')[0];
  };

  return (
    <tr className="bg-muted/10 hover:bg-muted/20">
      {/* Resource name and role cell */}
      <td className="sticky left-0 bg-muted/10 hover:bg-muted/20 z-10 p-2 border-b">
        <div className="flex items-center pl-8">
          <div className="flex-1">
            <div className="font-medium flex items-center gap-2">
              {resource.name}
              {resource.isPending && (
                <Badge variant="pending" className="text-xs">Pending</Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">{resource.role}</div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={handleDeleteResource}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
      
      {/* Week allocation input cells */}
      {weeks.map((week) => {
        const weekKey = getWeekKey(week.startDate);
        const hours = allocations[weekKey] || 0;
        
        return (
          <td key={weekKey} className="p-0 border-b text-center w-12 relative">
            <div className="allocation-input-container">
              <Input
                type="number"
                min="0"
                max="40"
                step="0.5"
                value={hours.toString()}
                onChange={(e) => handleAllocationChange(weekKey, e.target.value)}
                className="w-12 h-8 text-center mx-auto px-0 text-xs rounded-sm border-muted focus:border-brand-violet-light"
                style={{ 
                  appearance: 'textfield',
                  backgroundColor: hours > 0 ? 'rgba(155, 135, 245, 0.1)' : 'transparent'
                }}
              />
              {hours > 0 && (
                <span className="absolute right-1 top-0.5 text-xs font-medium text-brand-violet-light">
                  h
                </span>
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
};
