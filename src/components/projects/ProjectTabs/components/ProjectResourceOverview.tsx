
import React from 'react';
import { format, addWeeks, subWeeks } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StandardizedBadge } from '@/components/ui/standardized-badge';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue } from '@/utils/allocationDisplay';

interface ProjectResourceOverviewProps {
  projectId: string;
  selectedWeek: Date;
  onWeekChange: (week: Date) => void;
  resourceAllocations: any[];
  isLoading: boolean;
}

export const ProjectResourceOverview: React.FC<ProjectResourceOverviewProps> = ({
  projectId,
  selectedWeek,
  onWeekChange,
  resourceAllocations,
  isLoading
}) => {
  const { displayPreference, workWeekHours } = useAppSettings();
  // Function to handle moving to previous week
  const handlePreviousWeek = () => {
    onWeekChange(subWeeks(selectedWeek, 1));
  };

  // Function to handle moving to next week
  const handleNextWeek = () => {
    onWeekChange(addWeeks(selectedWeek, 1));
  };

  // Format the week label
  const weekStart = format(selectedWeek, 'MMM dd, yyyy');
  const weekLabel = `Week of ${weekStart}`;

  // Calculate total hours for the week
  const totalHours = resourceAllocations.reduce((total, allocation) => {
    return total + (allocation.hours || 0);
  }, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Resource Allocations</CardTitle>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreviousWeek}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Previous week</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm">{weekLabel}</span>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextWeek}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Next week</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : resourceAllocations.length > 0 ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Total hours: <span className="font-medium text-foreground">{totalHours}</span>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="py-2 px-3 text-left font-medium">Resource</th>
                    <th className="py-2 px-3 text-right font-medium">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {resourceAllocations.map((allocation) => {
                    // Determine resource name based on resource type
                    let resourceName = "Unknown";
                    if (allocation.profiles) {
                      resourceName = `${allocation.profiles.first_name || ''} ${allocation.profiles.last_name || ''}`.trim();
                      if (!resourceName) {
                        // Fallback for pre-registered resources
                        resourceName = allocation.resource_type === 'pre_registered' ? 'Pending invite' : 'Unknown';
                      }
                    }

                    return (
                      <tr key={allocation.id} className="border-t">
                        <td className="py-2 px-3">
                          <div>
                            <div>{resourceName}</div>
                            <div className="text-xs text-muted-foreground">
                              {allocation.profiles?.job_title || 'Team member'}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right font-medium">
                          <StandardizedBadge variant="metric" size="sm">
                            {formatAllocationValue(allocation.hours, workWeekHours, displayPreference)}
                          </StandardizedBadge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/30 border-t">
                    <td className="py-2 px-3 font-medium">Total</td>
                    <td className="py-2 px-3 text-right font-medium">
                      <StandardizedBadge variant="metric" size="sm">
                        {formatAllocationValue(totalHours, workWeekHours, displayPreference)}
                      </StandardizedBadge>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="text-xs text-center text-muted-foreground">
              <a href="/weekly-overview" className="underline hover:text-primary">
                View full resource allocation
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No resource allocations for this week</p>
            <p className="text-xs mt-1 text-muted-foreground">
              Visit the <a href="/weekly-overview" className="underline hover:text-primary">weekly overview</a> to add resources
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
