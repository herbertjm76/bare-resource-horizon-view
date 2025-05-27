
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Donut } from './Donut';

interface AnalyticsSectionProps {
  mockData: {
    projectsByStatus: { name: string; value: number; }[];
    projectsByStage: { name: string; value: number; }[];
    projectsByRegion: { name: string; value: number; }[];
    projectInvoicesThisMonth: { name: string; value: number; }[];
  };
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ mockData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Card className="bg-white/40 backdrop-blur-sm border border-white/30 shadow-lg hover:bg-white/50 transition-all duration-300">
        <CardContent className="p-4">
          <Donut 
            data={mockData.projectsByStatus} 
            title="Project Status" 
            colors={['#6F4BF6', '#5669F7', '#E64FC4']}
            height={200}
          />
        </CardContent>
      </Card>

      <Card className="bg-white/40 backdrop-blur-sm border border-white/30 shadow-lg hover:bg-white/50 transition-all duration-300">
        <CardContent className="p-4">
          <Donut 
            data={mockData.projectsByStage} 
            title="Project Stages"
            colors={['#6F4BF6', '#5669F7', '#E64FC4']}
            height={200}
          />
        </CardContent>
      </Card>

      <Card className="bg-white/40 backdrop-blur-sm border border-white/30 shadow-lg hover:bg-white/50 transition-all duration-300">
        <CardContent className="p-4">
          <Donut 
            data={mockData.projectsByRegion} 
            title="Regional Split"
            colors={['#6F4BF6', '#5669F7', '#E64FC4']}
            height={200}
          />
        </CardContent>
      </Card>

      <Card className="bg-white/40 backdrop-blur-sm border border-white/30 shadow-lg hover:bg-white/50 transition-all duration-300">
        <CardContent className="p-4">
          <Donut 
            data={mockData.projectInvoicesThisMonth} 
            title="Project Invoices This Month"
            colors={['#22C55E', '#F59E0B', '#EF4444']}
            height={200}
          />
        </CardContent>
      </Card>
    </div>
  );
};
