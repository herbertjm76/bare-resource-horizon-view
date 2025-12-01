
import React from 'react';
import { Users, BarChart3, Clock, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TeamWorkloadHeaderProps {
  totalMembers?: number;
  totalCapacity?: number;
  timeRange?: string;
  utilizationRate?: number;
}

export const TeamWorkloadHeader: React.FC<TeamWorkloadHeaderProps> = ({
  totalMembers = 0,
  totalCapacity = 0,
  timeRange = "12 weeks",
  utilizationRate = 0
}) => {
  return (
    <div className="space-y-6 mb-6">
      {/* Main Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-theme-primary" />
            Team Workload
          </h1>
          <p className="text-muted-foreground text-lg">
            Capacity planning and utilization overview for strategic decision making
          </p>
        </div>
        
        {/* Quick Stats Cards */}
        <div className="flex flex-wrap items-center gap-3">
          <Card className="px-4 py-2 bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 border-brand-violet/20">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-theme-primary" />
              <div className="text-sm">
                <span className="font-semibold text-theme-primary">{totalMembers}</span>
                <span className="text-muted-foreground ml-1">Resources</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <div className="text-sm">
                <span className="font-semibold text-emerald-600">{utilizationRate}%</span>
                <span className="text-muted-foreground ml-1">Utilization</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div className="text-sm">
                <span className="font-semibold text-blue-600">{timeRange}</span>
                <span className="text-muted-foreground ml-1">View</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
