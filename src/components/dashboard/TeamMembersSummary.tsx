
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMember } from './types';
import { calculateMemberStats, calculateDepartmentStats, calculateLocationStats } from './teamSummary/utils/teamSummaryUtils';
import { Users, UserCheck, UserPlus, Building2, MapPin } from 'lucide-react';
import { DEPARTMENT_COLORS } from './teamSummary/constants/teamSummaryConstants';
import { getLocationEmoji, getTopLocations } from './teamSummary/utils/teamSummaryUtils';

interface TeamMembersSummaryProps {
  teamMembers: TeamMember[];
}

export const TeamMembersSummary: React.FC<TeamMembersSummaryProps> = ({
  teamMembers
}) => {
  // Calculate all statistics
  const stats = calculateMemberStats(teamMembers);
  const departmentStats = calculateDepartmentStats(stats.activeMembers);
  const locationStats = calculateLocationStats(stats.activeMembers);
  const topLocations = getTopLocations(locationStats, 3);

  return (
    <div className="mb-4 relative">
      {/* Enhanced card with Team Member Insights Highlight design */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-2 border-brand-violet/20 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-violet/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10 p-4">
          {/* Three rounded square cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Members Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40 hover:bg-white/95 transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-brand-violet/20 rounded-lg">
                    <Users className="h-4 w-4 text-brand-violet" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Total Members</div>
                    <div className="text-xl font-bold text-gray-900">{stats.totalMembers}</div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="h-3 w-3 text-green-600" />
                      <span className="text-gray-700">Active</span>
                    </div>
                    <span className="font-medium text-gray-900">{stats.activeMembers.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <UserPlus className="h-3 w-3 text-orange-600" />
                      <span className="text-gray-700">Pending</span>
                    </div>
                    <span className="font-medium text-gray-900">{stats.preRegisteredMembers.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Departments Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40 hover:bg-white/95 transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-brand-violet/20 rounded-lg">
                    <Building2 className="h-4 w-4 text-brand-violet" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Departments</div>
                    <div className="text-xl font-bold text-gray-900">{Object.keys(departmentStats).length}</div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  {Object.entries(departmentStats)
                    .filter(([_, count]) => count > 0)
                    .slice(0, 2)
                    .map(([dept, count]) => (
                      <div key={dept} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${DEPARTMENT_COLORS[dept as keyof typeof DEPARTMENT_COLORS]} opacity-80`}></div>
                          <span className="text-gray-700">{dept}</span>
                        </div>
                        <span className="font-medium text-gray-900">{count}</span>
                      </div>
                    ))}
                  
                  {Object.keys(departmentStats).length === 0 && (
                    <div className="text-xs text-gray-500">No departments assigned</div>
                  )}
                </div>
              </div>
            </div>

            {/* Locations Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40 hover:bg-white/95 transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-brand-violet/20 rounded-lg">
                    <MapPin className="h-4 w-4 text-brand-violet" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Locations</div>
                    <div className="text-xl font-bold text-gray-900">{Object.keys(locationStats).length}</div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  {topLocations.length > 0 ? (
                    <>
                      {topLocations.slice(0, 2).map(([location, count]) => (
                        <div key={location} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{getLocationEmoji(location)}</span>
                            <span className="text-gray-700">
                              {location === 'Unknown' ? 'Not specified' : location}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{count}</span>
                        </div>
                      ))}
                      
                      {Object.keys(locationStats).length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{Object.keys(locationStats).length - 2} more
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-xs text-gray-500">No locations specified</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
