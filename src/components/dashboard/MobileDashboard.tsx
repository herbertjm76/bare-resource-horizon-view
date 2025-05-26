
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, TrendingUp, Clock, Target, AlertTriangle } from 'lucide-react';
import { EnhancedInsights } from './EnhancedInsights';
import { ResourcePlanningChat } from './ResourcePlanningChat';
import { SummaryDashboard } from './SummaryDashboard';
import { Gauge } from './Gauge';

interface MobileDashboardProps {
  teamMembers: any[];
  activeProjects: number;
  activeResources: number;
  utilizationTrends: {
    days7: number;
    days30: number;
    days90: number;
  };
  staffData: any[];
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  teamMembers,
  activeProjects,
  activeResources,
  utilizationTrends,
  staffData
}) => {
  const summaryMetrics = [
    {
      title: 'Team Utilization',
      value: `${utilizationTrends.days7}%`,
      subtitle: 'Current 7-day average',
      progress: utilizationTrends.days7,
      icon: <TrendingUp className="h-4 w-4" />,
      trend: 'up' as const,
      status: 'good' as const
    },
    {
      title: 'Available Capacity',
      value: '2,340h',
      subtitle: 'Next 12 weeks',
      icon: <Clock className="h-4 w-4" />,
      status: 'info' as const
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      subtitle: 'Currently in progress',
      icon: <Target className="h-4 w-4" />,
      status: 'good' as const
    },
    {
      title: 'Hiring Status',
      value: 'Monitor',
      subtitle: 'Based on capacity trends',
      icon: <AlertTriangle className="h-4 w-4" />,
      status: 'warning' as const
    }
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Key Metrics - Mobile Stacked */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-sm border border-gray-100 rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-3 opacity-30">
              <Users size={20} strokeWidth={1.5} className="text-brand-violet/30" />
            </div>
            <p className="text-2xl font-bold text-brand-violet mb-1">{activeResources}</p>
            <p className="text-xs text-gray-600">Active members</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border border-gray-100 rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-3 opacity-30">
              <Activity size={20} strokeWidth={1.5} className="text-brand-violet/30" />
            </div>
            <p className="text-2xl font-bold text-brand-violet mb-1">{activeProjects}</p>
            <p className="text-xs text-gray-600">Live projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Utilization - Large on Mobile */}
      <Card className="shadow-sm border border-gray-100 rounded-xl">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Current Utilization</h3>
          <div className="flex justify-center mb-6">
            <Gauge 
              value={utilizationTrends.days7} 
              max={100} 
              title="7 Days"
              size="lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex justify-center">
              <Gauge 
                value={utilizationTrends.days30} 
                max={100} 
                title="30 Days"
                size="sm"
              />
            </div>
            <div className="flex justify-center">
              <Gauge 
                value={utilizationTrends.days90} 
                max={100} 
                title="90 Days"
                size="sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Insights */}
      <EnhancedInsights 
        teamMembers={teamMembers}
        activeProjects={activeProjects}
        utilizationRate={utilizationTrends.days7}
        utilizationTrends={utilizationTrends}
        staffMembers={staffData}
      />

      {/* Strategic Overview */}
      <SummaryDashboard 
        title="Strategic Overview"
        metrics={summaryMetrics}
      />

      {/* Resource Planning Chat */}
      <ResourcePlanningChat 
        teamSize={teamMembers.length}
        activeProjects={activeProjects}
        utilizationRate={utilizationTrends.days7}
      />
    </div>
  );
};
