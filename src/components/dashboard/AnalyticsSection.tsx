
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
  // Check if chart data arrays have any entries
  const hasStatusData = mockData.projectsByStatus && mockData.projectsByStatus.length > 0;
  const hasStageData = mockData.projectsByStage && mockData.projectsByStage.length > 0;
  const hasRegionData = mockData.projectsByRegion && mockData.projectsByRegion.length > 0;
  const hasPMData = mockData.projectsByPM && mockData.projectsByPM.length > 0;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <Card className="h-64">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Project Status</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {hasStatusData ? (
            <Donut 
              data={mockData.projectsByStatus} 
              title="" 
              colors={['#6F4BF6', '#5669F7', '#E64FC4']}
              height={140}
            />
          ) : (
            <div className="flex items-center justify-center h-[140px] text-gray-500 text-sm">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="h-64">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Project Stages</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {hasStageData ? (
            <Donut 
              data={mockData.projectsByStage} 
              title=""
              colors={['#6F4BF6', '#5669F7', '#E64FC4']}
              height={140}
            />
          ) : (
            <div className="flex items-center justify-center h-[140px] text-gray-500 text-sm">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="h-64">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Regional Split</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {hasRegionData ? (
            <Donut 
              data={mockData.projectsByRegion} 
              title=""
              colors={['#6F4BF6', '#5669F7', '#E64FC4']}
              height={140}
            />
          ) : (
            <div className="flex items-center justify-center h-[140px] text-gray-500 text-sm">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="h-64">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Projects by PM</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {hasPMData ? (
            <Donut 
              data={mockData.projectsByPM} 
              title=""
              colors={['#22C55E', '#F59E0B', '#EF4444']}
              height={140}
            />
          ) : (
            <div className="flex items-center justify-center h-[140px] text-gray-500 text-sm">
              No data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
