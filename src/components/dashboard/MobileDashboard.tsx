
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, TrendingUp, Clock, Target, AlertTriangle, DollarSign } from 'lucide-react';
import { EnhancedInsights } from './EnhancedInsights';
import { ResourcePlanningChat } from './ResourcePlanningChat';
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
  return (
    <div className="space-y-6 p-4">
      {/* CEO Priority 1: Business Health Overview */}
      <Card className="bg-gradient-to-br from-brand-violet/10 to-blue-50 border-brand-violet/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-brand-violet flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Business Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-violet">{utilizationTrends.days7}%</p>
              <p className="text-sm text-gray-600">Team Utilization</p>
              <Badge variant={utilizationTrends.days7 > 85 ? "destructive" : utilizationTrends.days7 > 70 ? "default" : "secondary"} className="text-xs mt-1">
                {utilizationTrends.days7 > 85 ? "At Capacity" : utilizationTrends.days7 > 70 ? "Healthy" : "Available"}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-violet">2,340h</p>
              <p className="text-sm text-gray-600">Available Capacity</p>
              <Badge variant="outline" className="text-xs mt-1">Next 12 weeks</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CEO Priority 2: Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-5 w-5 text-brand-violet/60" />
            </div>
            <p className="text-xl font-bold text-brand-violet">{activeProjects}</p>
            <p className="text-sm text-gray-600">Active Projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-brand-violet/60" />
            </div>
            <p className="text-xl font-bold text-brand-violet">{activeResources}</p>
            <p className="text-sm text-gray-600">Team Members</p>
          </CardContent>
        </Card>
      </div>

      {/* CEO Priority 3: Utilization Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Utilization Trends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Gauge 
              value={utilizationTrends.days7} 
              max={100} 
              title="Current (7 days)"
              size="lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-800">{utilizationTrends.days30}%</p>
              <p className="text-xs text-gray-600">30 Days</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-800">{utilizationTrends.days90}%</p>
              <p className="text-xs text-gray-600">90 Days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CEO Priority 4: Smart Insights */}
      <EnhancedInsights 
        teamMembers={teamMembers}
        activeProjects={activeProjects}
        utilizationRate={utilizationTrends.days7}
        utilizationTrends={utilizationTrends}
        staffMembers={staffData}
      />

      {/* CEO Priority 5: AI Planning Assistant */}
      <ResourcePlanningChat 
        teamSize={teamMembers.length}
        activeProjects={activeProjects}
        utilizationRate={utilizationTrends.days7}
      />
    </div>
  );
};
