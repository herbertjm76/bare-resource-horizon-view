
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, Layers, TrendingUp } from 'lucide-react';

interface ModernGridHeaderProps {
  projectCount: number;
  totalProjects: number;
  periodToShow: number;
  expandedCount: number;
}

export const ModernGridHeader: React.FC<ModernGridHeaderProps> = ({
  projectCount,
  totalProjects,
  periodToShow,
  expandedCount
}) => {
  const getPeriodLabel = (period: number) => {
    switch (period) {
      case 1: return '1 Week';
      case 4: return '1 Month';
      case 8: return '2 Months';
      case 12: return '3 Months';
      case 16: return '4 Months';
      default: return `${period} Weeks`;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Layers className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{projectCount}</p>
              {totalProjects !== projectCount && (
                <p className="text-xs text-gray-500">of {totalProjects} total</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Expanded View</p>
              <p className="text-2xl font-bold text-gray-900">{expandedCount}</p>
              <p className="text-xs text-gray-500">projects detailed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Time Period</p>
              <p className="text-2xl font-bold text-gray-900">{getPeriodLabel(periodToShow)}</p>
              <p className="text-xs text-gray-500">viewing scope</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Utilization</p>
              <p className="text-2xl font-bold text-gray-900">—</p>
              <p className="text-xs text-gray-500">coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
