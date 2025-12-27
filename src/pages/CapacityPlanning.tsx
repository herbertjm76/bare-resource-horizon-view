import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { TrendingUp, BarChart3, Sparkles, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

const CapacityPlanning: React.FC = () => {
  return (
    <StandardLayout>
      <StandardizedPageHeader
        title="Capacity Planning"
        description="Future weeks heatmap and forecasting"
        icon={TrendingUp}
      />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card className="p-12 text-center bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-dashed border-emerald-200">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <TrendingUp className="h-24 w-24 text-emerald-400 animate-pulse" />
              <Sparkles className="h-8 w-8 text-teal-400 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Capacity Planning Coming Soon
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Plan ahead with powerful capacity forecasting tools. Visualize team availability, 
            identify resource constraints, and optimize allocation across future weeks.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-4 bg-card rounded-lg shadow-sm">
              <BarChart3 className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Heatmap View</h3>
              <p className="text-sm text-muted-foreground">
                Color-coded capacity visualization across weeks
              </p>
            </div>
            
            <div className="p-4 bg-card rounded-lg shadow-sm">
              <Calendar className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Future Planning</h3>
              <p className="text-sm text-muted-foreground">
                Project resource needs weeks or months ahead
              </p>
            </div>
            
            <div className="p-4 bg-card rounded-lg shadow-sm">
              <TrendingUp className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Smart Insights</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered recommendations for optimal allocation
              </p>
            </div>
          </div>
        </Card>
      </div>
    </StandardLayout>
  );
};

export default CapacityPlanning;
