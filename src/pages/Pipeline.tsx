import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { Layers, Workflow, Sparkles, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Pipeline: React.FC = () => {
  return (
    <StandardLayout>
      <StandardizedPageHeader
        title="Pipeline"
        description="Project stages visualization and workflow"
        icon={Layers}
      />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card className="p-12 text-center bg-gradient-to-br from-violet-50 to-blue-50 border-2 border-dashed border-violet-200">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Layers className="h-24 w-24 text-violet-400 animate-pulse" />
              <Sparkles className="h-8 w-8 text-blue-400 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pipeline View Coming Soon
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Track projects through their lifecycle with a visual pipeline. See all project stages at a glance, 
            monitor progress, and identify bottlenecks in your workflow.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <Workflow className="h-8 w-8 text-violet-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Stage Tracking</h3>
              <p className="text-sm text-gray-600">
                Monitor projects across all lifecycle stages
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <Layers className="h-8 w-8 text-violet-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Kanban View</h3>
              <p className="text-sm text-gray-600">
                Drag and drop projects between stages
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <CheckCircle className="h-8 w-8 text-violet-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Progress Metrics</h3>
              <p className="text-sm text-gray-600">
                Track completion rates and stage durations
              </p>
            </div>
          </div>
        </Card>
      </div>
    </StandardLayout>
  );
};

export default Pipeline;
