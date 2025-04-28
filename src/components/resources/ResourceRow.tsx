
import React from 'react';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResourceRowProps {
  resource: {
    id: string;
    name: string;
    role: string;
    allocations: Record<string, number>;
  };
  weeks: {
    startDate: Date;
    label: string;
    days: Date[];
  }[];
  projectId: string;
}

export const ResourceRow: React.FC<ResourceRowProps> = ({ resource, weeks, projectId }) => {
  const [allocations, setAllocations] = React.useState<Record<string, number>>(
    resource.allocations || {}
  );
  
  const handleAllocationChange = (weekKey: string, value: string) => {
    const numValue = Math.min(40, Math.max(0, Number(value) || 0));
    
    setAllocations(prev => ({
      ...prev,
      [weekKey]: numValue
    }));
  };
  
  // Calculate total hours for this resource
  const totalHours = Object.values(allocations).reduce((sum, hours) => sum + (hours || 0), 0);
  
  const getWeekKey = (startDate: Date) => {
    return startDate.toISOString().split('T')[0];
  };

  return (
    <tr className="bg-muted/5 hover:bg-muted/10">
      {/* Resource name and role cell */}
      <td className="sticky left-0 bg-muted/5 z-10 p-2 border-b">
        <div className="flex items-center pl-8">
          <div className="flex-1">
            <div className="font-medium">{resource.name}</div>
            <div className="text-xs text-muted-foreground">{resource.role}</div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
      
      {/* Empty cell for the "WEEK OF" column */}
      <td className="p-1 border-b"></td>
      
      {/* Week allocation input cells */}
      {weeks.map((week) => {
        const weekKey = getWeekKey(week.startDate);
        const hours = allocations[weekKey] || 0;
        
        return (
          <td key={weekKey} className="p-1 border-b text-center">
            <Input
              type="number"
              min="0"
              max="40"
              value={hours || ''}
              onChange={(e) => handleAllocationChange(weekKey, e.target.value)}
              className="w-16 h-8 text-center mx-auto"
            />
          </td>
        );
      })}
      
      {/* Total hours cell */}
      <td className="p-2 border-b text-center font-medium">
        {totalHours}h
      </td>
    </tr>
  );
};
