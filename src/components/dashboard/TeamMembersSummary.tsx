
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
    <div className="mb-6 relative">
      {/* Glass morphism background container */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500" />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
        
        {/* Top highlight gradient */}
        <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(120%_30%_at_50%_0%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_70%)]" />
        
        <div className="relative z-10 p-6">
          <h2 className="text-white text-xl font-semibold mb-6">Team Overview</h2>
          
          {/* Three rounded square cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Members Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/80">Total Members</div>
                    <div className="text-2xl font-bold text-white">{stats.totalMembers}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-300" />
                      <span className="text-white/90">Active</span>
                    </div>
                    <span className="font-medium text-white">{stats.activeMembers.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-orange-300" />
                      <span className="text-white/90">Pending</span>
                    </div>
                    <span className="font-medium text-white">{stats.preRegisteredMembers.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Departments Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/80">Departments</div>
                    <div className="text-2xl font-bold text-white">{Object.keys(departmentStats).length}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {Object.entries(departmentStats)
                    .filter(([_, count]) => count > 0)
                    .slice(0, 2)
                    .map(([dept, count]) => (
                      <div key={dept} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${DEPARTMENT_COLORS[dept as keyof typeof DEPARTMENT_COLORS]} opacity-80`}></div>
                          <span className="text-white/90">{dept}</span>
                        </div>
                        <span className="font-medium text-white">{count}</span>
                      </div>
                    ))}
                  
                  {Object.keys(departmentStats).length === 0 && (
                    <div className="text-sm text-white/70">No departments assigned</div>
                  )}
                </div>
              </div>
            </div>

            {/* Locations Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/80">Locations</div>
                    <div className="text-2xl font-bold text-white">{Object.keys(locationStats).length}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {topLocations.length > 0 ? (
                    <>
                      {topLocations.slice(0, 2).map(([location, count]) => (
                        <div key={location} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{getLocationEmoji(location)}</span>
                            <span className="text-white/90">
                              {location === 'Unknown' ? 'Not specified' : location}
                            </span>
                          </div>
                          <span className="font-medium text-white">{count}</span>
                        </div>
                      ))}
                      
                      {Object.keys(locationStats).length > 2 && (
                        <div className="text-sm text-white/70">
                          +{Object.keys(locationStats).length - 2} more
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-white/70">No locations specified</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
