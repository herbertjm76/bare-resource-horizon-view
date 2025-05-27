
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, DollarSign } from 'lucide-react';
import { EnhancedInsights } from './EnhancedInsights';
import { ResourcePlanningChat } from './ResourcePlanningChat';
import { HolidayCard } from './HolidayCard';

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
  mockData: any;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  teamMembers,
  activeProjects,
  activeResources,
  utilizationTrends,
  staffData,
  mockData
}) => {
  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 40%, #cbd5e1 100%)'
    }}>
      {/* Glass morphism background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-brand-violet/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl" />
      </div>

      <div className="space-y-6 p-4 relative z-10">
        {/* CEO Priority 1: Business Health Overview */}
        <Card className="bg-white/30 backdrop-blur-md border border-white/20 shadow-xl">
          <CardHeader className="pb-4 bg-white/10 backdrop-blur-sm border-b border-white/20">
            <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-brand-violet" />
              Business Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                <p className="text-2xl font-bold text-brand-violet">{utilizationTrends.days7}%</p>
                <p className="text-sm text-gray-700">Team Utilization</p>
                <Badge variant={utilizationTrends.days7 > 85 ? "destructive" : utilizationTrends.days7 > 70 ? "default" : "secondary"} className="text-xs mt-1 bg-white/30 border-white/40">
                  {utilizationTrends.days7 > 85 ? "At Capacity" : utilizationTrends.days7 > 70 ? "Healthy" : "Available"}
                </Badge>
              </div>
              <div className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                <p className="text-2xl font-bold text-brand-violet">2,340h</p>
                <p className="text-sm text-gray-700">Available Capacity</p>
                <Badge variant="outline" className="text-xs mt-1 bg-white/30 border-white/40 text-gray-700">Next 12 weeks</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CEO Priority 2: Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/30 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/40 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Activity className="h-5 w-5 text-brand-violet/60" />
              </div>
              <p className="text-xl font-bold text-brand-violet">{activeProjects}</p>
              <p className="text-sm text-gray-700">Active Projects</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/30 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/40 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-brand-violet/60" />
              </div>
              <p className="text-xl font-bold text-brand-violet">{activeResources}</p>
              <p className="text-sm text-gray-700">Team Members</p>
            </CardContent>
          </Card>
        </div>

        {/* CEO Priority 3: Upcoming Holidays */}
        <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-lg shadow-xl">
          <HolidayCard />
        </div>

        {/* CEO Priority 4: Smart Insights */}
        <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-lg shadow-xl">
          <EnhancedInsights 
            teamMembers={teamMembers}
            activeProjects={activeProjects}
            utilizationRate={utilizationTrends.days7}
            utilizationTrends={utilizationTrends}
            staffMembers={staffData}
          />
        </div>

        {/* CEO Priority 5: AI Planning Assistant */}
        <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-lg shadow-xl">
          <ResourcePlanningChat 
            teamSize={teamMembers.length}
            activeProjects={activeProjects}
            utilizationRate={utilizationTrends.days7}
          />
        </div>
      </div>
    </div>
  );
};
