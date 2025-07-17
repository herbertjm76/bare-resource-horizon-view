
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Donut } from './Donut';
import { useResourceAllocationData } from './hooks/useResourceAllocationData';

interface AnalyticsSectionProps {
  mockData: {
    projectsByStage: { name: string; value: number; color?: string; }[];
    projectsByLocation: { name: string; value: number; color?: string; }[];
    projectsByPM: { name: string; value: number; }[];
  };
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ mockData }) => {
  // Get resource allocation data
  const resourceAllocationData = useResourceAllocationData();
  
  // Validate chart data arrays
  const hasResourceData = resourceAllocationData?.length > 0 && !resourceAllocationData.every(item => item.name === 'No Data Available');
  const hasStageData = mockData.projectsByStage?.length > 0;
  const hasLocationData = mockData.projectsByLocation?.length > 0;
  const hasPMData = mockData.projectsByPM?.length > 0;
  
  const EmptyState = ({ title }: { title: string }) => (
    <div className="flex items-center justify-center h-[140px] text-gray-500 text-sm">
      <div className="text-center">
        <div className="w-8 h-8 rounded-full bg-gray-100 mx-auto mb-2 flex items-center justify-center">
          <span className="text-gray-400 text-xs">📊</span>
        </div>
        <p>No {title.toLowerCase()} data</p>
      </div>
    </div>
  );
  
  // Extract colors for location chart from the data itself
  const locationColors = hasLocationData 
    ? mockData.projectsByLocation.map(item => item.color || '#6F4BF6')
    : ['#059669', '#0891B2', '#7C3AED'];

  // Extract colors for stage chart from the data itself
  const stageColors = hasStageData
    ? mockData.projectsByStage.map(item => item.color || '#6F4BF6')
    : ['#6F4BF6', '#5669F7', '#E64FC4', '#8B5CF6'];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Resource Allocation Distribution Chart */}
      <Card className="h-72 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800">Resource Allocation</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {hasResourceData ? (
            <Donut 
              data={resourceAllocationData} 
              title="" 
              colors={resourceAllocationData.map(item => item.color)}
              height={140}
            />
          ) : (
            <EmptyState title="Resource Allocation" />
          )}
        </CardContent>
      </Card>

      {/* Project Stages Chart */}
      <Card className="h-72 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800">Project Stages</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {hasStageData ? (
            <Donut 
              data={mockData.projectsByStage} 
              title=""
              colors={stageColors}
              height={140}
            />
          ) : (
            <EmptyState title="Project Stages" />
          )}
        </CardContent>
      </Card>

      {/* Project Locations Chart */}
      <Card className="h-72 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800">Project Locations</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {hasLocationData ? (
            <Donut 
              data={mockData.projectsByLocation} 
              title=""
              colors={locationColors}
              height={140}
            />
          ) : (
            <EmptyState title="Project Locations" />
          )}
        </CardContent>
      </Card>

      {/* Projects by PM Chart */}
      <Card className="h-72 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800">Projects by PM</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {hasPMData ? (
            <Donut 
              data={mockData.projectsByPM} 
              title=""
              colors={['#22C55E', '#F59E0B', '#EF4444']}
              height={140}
            />
          ) : (
            <EmptyState title="Projects by PM" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
