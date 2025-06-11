
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Briefcase, TrendingUp } from 'lucide-react';
import { useResourcePlanningData } from './resource-planning/hooks/useResourcePlanningData';

interface TeamMemberDetailInsightsProps {
  memberId: string;
}

export const TeamMemberDetailInsights: React.FC<TeamMemberDetailInsightsProps> = ({ memberId }) => {
  const { memberProfile, historicalData, activeProjects, isLoadingProjects } = useResourcePlanningData(memberId);
  
  const weeklyCapacity = memberProfile?.weekly_capacity || 40;
  
  // Calculate quick metrics
  const currentWeekUtilization = historicalData[0]?.hours 
    ? (historicalData[0].hours / weeklyCapacity) * 100 
    : 0;
  
  const fourWeekTotal = historicalData.slice(0, 4).reduce((sum, item) => sum + (item.hours || 0), 0);
  const fourWeekAverage = historicalData.length > 0 
    ? (fourWeekTotal / Math.min(4, historicalData.length)) / weeklyCapacity * 100
    : 0;
  
  if (!memberProfile) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse bg-gray-50">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Current Capacity */}
      <Card className="bg-blue-50 border border-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4 text-blue-700">
            <Clock className="h-5 w-5" />
            <h3 className="font-medium">Current Capacity</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-blue-700">{weeklyCapacity}h</div>
              <p className="text-sm text-blue-600">Weekly Capacity</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">This Week</span>
                <span className="font-medium">{Math.round(currentWeekUtilization)}% utilized</span>
              </div>
              <div className="h-2 bg-blue-100 rounded-full">
                <div 
                  className="h-2 bg-blue-600 rounded-full" 
                  style={{ width: `${Math.min(100, currentWeekUtilization)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Current Projects */}
      <Card className="bg-green-50 border border-green-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4 text-green-700">
            <Briefcase className="h-5 w-5" />
            <h3 className="font-medium">Current Projects</h3>
          </div>
          
          <div className="space-y-3">
            {isLoadingProjects ? (
              <div className="space-y-3">
                <div className="h-12 bg-white/50 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-white/50 rounded-lg animate-pulse"></div>
              </div>
            ) : activeProjects.length > 0 ? (
              activeProjects.slice(0, 2).map((project: any) => (
                <div key={project.id} className="bg-white p-3 rounded-lg border border-green-100">
                  <div className="font-medium">{project.name}</div>
                  <div className="text-sm text-gray-500">
                    {project.status || 'In Progress'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No active projects
              </div>
            )}
            
            {activeProjects.length > 2 && (
              <div className="text-sm text-green-600 text-center">
                +{activeProjects.length - 2} more projects
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Utilization Trends */}
      <Card className="bg-purple-50 border border-purple-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4 text-purple-700">
            <TrendingUp className="h-5 w-5" />
            <h3 className="font-medium">Utilization Trends</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-purple-700">
                {Math.round(fourWeekAverage)}%
              </div>
              <p className="text-sm text-purple-600">4-Week Average</p>
            </div>
            
            <div className="space-y-2">
              <div className="h-2 bg-purple-100 rounded-full">
                <div 
                  className="h-2 bg-purple-600 rounded-full" 
                  style={{ width: `${Math.min(100, fourWeekAverage)}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {Math.round(fourWeekTotal)} hours over past 4 weeks
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
