
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, TrendingUp, Calendar } from 'lucide-react';
import { TeamMember } from '@/components/dashboard/types';

interface TeamMemberInsightsExpandedProps {
  teamMembers: TeamMember[];
}

export const TeamMemberInsightsExpanded: React.FC<TeamMemberInsightsExpandedProps> = ({
  teamMembers
}) => {
  // Calculate team-wide statistics
  const totalMembers = teamMembers.length;
  const totalCapacity = teamMembers.reduce((sum, member) => 
    sum + (member.weekly_capacity || 40), 0
  );
  
  // Mock data for demonstration - in a real app, this would come from actual allocations
  const totalAllocatedHours = Math.floor(totalCapacity * 0.75); // 75% utilization
  const utilizationRate = Math.round((totalAllocatedHours / totalCapacity) * 100);
  
  const activeProjects = [
    { name: 'Project Alpha', status: 'Active', progress: 60, dueDate: 'June 15, 2025' },
    { name: 'Project Beta', status: 'Planning', progress: 25, dueDate: 'July 30, 2025' },
    { name: 'Project Gamma', status: 'Review', progress: 95, dueDate: 'June 8, 2025' }
  ];

  const projectHistory = [
    { name: 'Project Delta', month: 'March 2025', hours: 127 },
    { name: 'Project Echo', month: 'January 2025', hours: 89 },
    { name: 'Project Foxtrot', month: 'December 2024', hours: 156 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Planning': return 'bg-green-100 text-green-800 border-green-200';
      case 'Review': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-orange-600';
    if (progress >= 60) return 'bg-blue-600';
    return 'bg-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-primary">Team Insights Overview</h2>
          <p className="text-gray-600">Comprehensive view of team capacity, projects, and performance</p>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-[#eef4ff] to-[#fbf5ff] border-[2px] border-[#d8d4ff] rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Team Summary Card */}
            <Card className="bg-white border-2 border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-violet" />
                    <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Team Summary</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Total Members</p>
                      <p className="text-xl font-bold text-gray-900">{totalMembers}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Total Capacity</p>
                      <p className="text-lg font-semibold text-gray-900">{totalCapacity}h/week</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Current Utilization</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-brand-violet h-1.5 rounded-full" 
                            style={{ width: `${utilizationRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{utilizationRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Capacity Card */}
            <Card className="bg-white border-2 border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand-violet" />
                    <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Team Capacity</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">This Week</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-xs font-medium">{Math.floor(totalCapacity * 0.75)}h</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">This Month</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-xs font-medium">{Math.floor(totalCapacity * 3.4)}h</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">This Quarter</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                        <span className="text-xs font-medium">{Math.floor(totalCapacity * 11.7)}h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Projects Card */}
            <Card className="bg-white border-2 border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-brand-violet" />
                    <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Active Projects</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {activeProjects.map((project, index) => (
                      <div key={index} className={`p-2 rounded-lg border ${
                        project.status === 'Active' ? 'bg-blue-50 border-blue-200' :
                        project.status === 'Planning' ? 'bg-green-50 border-green-200' :
                        'bg-orange-50 border-orange-200'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-medium text-gray-900">{project.name}</h4>
                          <Badge variant="outline" className={`text-xs py-0 px-1 ${getStatusColor(project.status)}`}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">Due: {project.dueDate}</p>
                        <div className="mt-1">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1">
                              <div 
                                className={`h-1 rounded-full ${getProgressColor(project.progress)}`}
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{project.progress}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project History Card */}
            <Card className="bg-white border-2 border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-brand-violet" />
                    <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Recent History</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {projectHistory.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg">
                        <div className="min-w-0">
                          <h4 className="text-xs font-medium text-gray-900 truncate">{project.name}</h4>
                          <p className="text-xs text-gray-600">{project.month}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-gray-900">{project.hours}h</p>
                        </div>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-900">Total Hours</p>
                        <p className="text-sm font-bold text-gray-900">
                          {projectHistory.reduce((sum, p) => sum + p.hours, 0)}h
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};
