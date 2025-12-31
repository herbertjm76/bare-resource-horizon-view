
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="w-full bg-gradient-to-r from-card-gradient-start to-card-gradient-end border-2 border-card-gradient-border rounded-lg shadow-sm mb-4">
      <CardContent className="p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Total Members Card */}
          <Card className="bg-card/95 backdrop-blur-sm rounded-lg border border-border/20 h-full">
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-theme-primary/10 rounded-lg">
                    <Users className="h-4 w-4 text-theme-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-600">Total Members</div>
                    <div className="text-lg sm:text-xl font-bold text-gray-900">{stats.totalMembers}</div>
                  </div>
                </div>
                
                <div className="space-y-1">
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
            </CardContent>
          </Card>

          {/* Departments Card */}
          <Card className="bg-card/95 backdrop-blur-sm rounded-lg border border-border/20 h-full">
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-theme-primary/10 rounded-lg">
                    <Building2 className="h-4 w-4 text-theme-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-600">Departments</div>
                    <div className="text-lg sm:text-xl font-bold text-gray-900">{Object.keys(departmentStats).length}</div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {Object.entries(departmentStats)
                    .filter(([_, count]) => count > 0)
                    .slice(0, 2)
                    .map(([dept, count]) => (
                      <div key={dept} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className={`w-2 h-2 rounded-full ${DEPARTMENT_COLORS[dept as keyof typeof DEPARTMENT_COLORS]} opacity-80 flex-shrink-0`}></div>
                          <span className="text-gray-700 truncate">{dept}</span>
                        </div>
                        <span className="font-medium text-gray-900 flex-shrink-0">{count}</span>
                      </div>
                    ))}
                  
                  {Object.keys(departmentStats).length === 0 && (
                    <div className="text-xs text-gray-500">No departments assigned</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Locations Card */}
          <Card className="bg-card/95 backdrop-blur-sm rounded-lg border border-border/20 h-full">
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-theme-primary/10 rounded-lg">
                    <MapPin className="h-4 w-4 text-theme-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-600">Locations</div>
                    <div className="text-lg sm:text-xl font-bold text-gray-900">{Object.keys(locationStats).length}</div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {topLocations.length > 0 ? (
                    <>
                      {topLocations.slice(0, 2).map(([location, count]) => (
                        <div key={location} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-sm flex-shrink-0">{getLocationEmoji(location)}</span>
                            <span className="text-gray-700 truncate">
                              {location === 'Unknown' ? 'Not specified' : location}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 flex-shrink-0">{count}</span>
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
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
