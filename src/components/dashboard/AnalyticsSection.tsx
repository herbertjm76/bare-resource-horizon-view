
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Donut } from './Donut';

interface AnalyticsSectionProps {
  mockData: {
    projectsByStatus: { name: string; value: number; }[];
    projectsByStage: { name: string; value: number; }[];
    projectsByRegion: { name: string; value: number; }[];
    projectsByPM: { name: string; value: number; }[];
  };
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ mockData }) => {
  // Validate chart data arrays
  const hasStatusData = mockData.projectsByStatus?.length > 0;
  const hasStageData = mockData.projectsByStage?.length > 0;
  const hasRegionData = mockData.projectsByRegion?.length > 0;
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
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Project Status Chart */}
      <Card className="h-72 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800">Project Status</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {hasStatusData ? (
            <Donut 
              data={mockData.projectsByStatus} 
              title="" 
              colors={['#10B981', '#3B82F6', '#F59E0B']}
              height={140}
            />
          ) : (
            <EmptyState title="Project Status" />
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
              colors={['#6F4BF6', '#5669F7', '#E64FC4', '#8B5CF6']}
              height={140}
            />
          ) : (
            <EmptyState title="Project Stages" />
          )}
        </CardContent>
      </Card>

      {/* Regional Distribution Chart */}
      <Card className="h-72 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800">Regional Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {hasRegionData ? (
            <Donut 
              data={mockData.projectsByRegion} 
              title=""
              colors={['#059669', '#0891B2', '#7C3AED']}
              height={140}
            />
          ) : (
            <EmptyState title="Regional Distribution" />
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
