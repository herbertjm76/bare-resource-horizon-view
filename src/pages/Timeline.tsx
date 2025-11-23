import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { GanttChartSquare, Calendar, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Timeline: React.FC = () => {
  return (
    <StandardLayout>
      <StandardizedPageHeader
        title="Timeline"
        description="Visual Gantt view for project schedules"
        icon={GanttChartSquare}
      />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card className="p-12 text-center bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-dashed border-indigo-200">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <GanttChartSquare className="h-24 w-24 text-indigo-400 animate-pulse" />
              <Sparkles className="h-8 w-8 text-purple-400 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Timeline View Coming Soon
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We're building a beautiful visual Gantt chart to help you visualize project timelines, 
            dependencies, and resource allocation across multiple projects at once.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <Calendar className="h-8 w-8 text-indigo-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Project Timelines</h3>
              <p className="text-sm text-gray-600">
                Visualize start dates, end dates, and milestones
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <GanttChartSquare className="h-8 w-8 text-indigo-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Dependencies</h3>
              <p className="text-sm text-gray-600">
                Track task dependencies and critical paths
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <Sparkles className="h-8 w-8 text-indigo-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Drag & Drop</h3>
              <p className="text-sm text-gray-600">
                Easily adjust timelines with intuitive controls
              </p>
            </div>
          </div>
        </Card>
      </div>
    </StandardLayout>
  );
};

export default Timeline;
