
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
      {/* Glass morphism background container */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(45deg, #895CF7 0%, #5669F7 55%, #E64FC4 100%)' }} />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
        
        {/* Top highlight gradient */}
        <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(120%_30%_at_50%_0%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_70%)]" />
        
        <div className="relative z-10 p-4">
          {/* Three rounded square cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Members Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Total Members</div>
                    <div className="text-xl font-bold text-white">{stats.totalMembers}</div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="h-3 w-3 text-green-300" />
                      <span className="text-white/90">Active</span>
                    </div>
                    <span className="font-medium text-white">{stats.activeMembers.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <UserPlus className="h-3 w-3 text-orange-300" />
                      <span className="text-white/90">Pending</span>
                    </div>
                    <span className="font-medium text-white">{stats.preRegisteredMembers.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Departments Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Departments</div>
                    <div className="text-xl font-bold text-white">{Object.keys(departmentStats).length}</div>
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
                          <span className="text-white/90">{dept}</span>
                        </div>
                        <span className="font-medium text-white">{count}</span>
                      </div>
                    ))}
                  
                  {Object.keys(departmentStats).length === 0 && (
                    <div className="text-xs text-white/70">No departments assigned</div>
                  )}
                </div>
              </div>
            </div>

            {/* Locations Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Locations</div>
                    <div className="text-xl font-bold text-white">{Object.keys(locationStats).length}</div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  {topLocations.length > 0 ? (
                    <>
                      {topLocations.slice(0, 2).map(([location, count]) => (
                        <div key={location} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{getLocationEmoji(location)}</span>
                            <span className="text-white/90">
                              {location === 'Unknown' ? 'Not specified' : location}
                            </span>
                          </div>
                          <span className="font-medium text-white">{count}</span>
                        </div>
                      ))}
                      
                      {Object.keys(locationStats).length > 2 && (
                        <div className="text-xs text-white/70">
                          +{Object.keys(locationStats).length - 2} more
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-xs text-white/70">No locations specified</div>
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
